import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Link } from "react-router";
import { RiNotification3Line } from "react-icons/ri";
import supabase from "../../supabaseClient";
import "./AdminNotifications.css";

const JUSTIFICATION_OPTIONS = [
  "Não Pagou",
  "Não Compareceu",
  "Pagamento Recusado",
  "Não autorizado a retirar o pedido",
];
const REFRESH_INTERVAL_MS = 60000;

function isCanceled(order) {
  return order.progress?.preparation === "canceled";
}

function isWaitingForJustification(order) {
  return String(order.cancellation_msg ?? "").trim().toLowerCase() === "waiting";
}

function parseItems(items) {
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch (error) {
      console.error("Não foi possível interpretar os itens do pedido:", error);
      return [];
    }
  }
  return Array.isArray(items) ? items : [];
}

function formatTime(timestamp) {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatCurrency(value) {
  return Number(value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getErrorCode(error) {
  return error?.code ?? error?.message ?? "UNKNOWN";
}

export default function AdminNotifications() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [justificationOpen, setJustificationOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [drafts, setDrafts] = useState({});
  const [confirmation, setConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [feedback, setFeedback] = useState("");

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const [productsResult, salesResult] = await Promise.all([
        supabase.from("products").select("id, name, stock").order("name"),
        supabase.from("sales").select("*"),
      ]);
      if (productsResult.error) throw productsResult.error;
      if (salesResult.error) throw salesResult.error;

      setLowStockProducts((productsResult.data ?? []).filter(
        (product) => Number(product.stock) < 4
      ));
      setPendingOrders((salesResult.data ?? []).filter(
        (order) => isCanceled(order) && isWaitingForJustification(order)
      ));
    } catch (error) {
      console.error("Erro ao carregar notificações administrativas:", error);
      setLoadError(`Não foi possível carregar as notificações. Erro: ${getErrorCode(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const timer = window.setInterval(fetchNotifications, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [fetchNotifications]);

  const restockSearch = useMemo(
    () => lowStockProducts.map((product) => product.name).filter(Boolean).join(", "),
    [lowStockProducts]
  );
  const notificationCount = Number(lowStockProducts.length > 0) + Number(pendingOrders.length > 0);
  const changedDrafts = pendingOrders
    .map((order) => ({ order, draft: drafts[order.id] ?? {} }))
    .filter(({ draft }) => Boolean(draft.reason || draft.explanation?.trim()));
  const canSubmit = changedDrafts.length > 0;

  const updateDraft = (orderId, field, value) => {
    setDrafts((current) => {
      const nextDraft = { ...current[orderId], [field]: value };
      if (field === "explanation" && value.length > 0) nextDraft.reason = "";
      if (field === "reason" && value) nextDraft.explanation = "";
      return { ...current, [orderId]: nextDraft };
    });
    setSubmitError("");
  };

  const closeJustifications = () => {
    if (isSubmitting) return;
    setJustificationOpen(false);
    setConfirmation("");
    setSubmitError("");
    setDrafts({});
    setExpandedOrders({});
  };

  const sendJustifications = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");
    const savedOrderIds = new Set();
    try {
      for (const { order, draft } of changedDrafts) {
        const message = draft.reason || draft.explanation.trim();
        const { data, error } = await supabase
          .from("sales")
          .update({ cancellation_msg: message })
          .eq("id", order.id)
          .select("id")
          .maybeSingle();
        if (error) throw error;
        if (!data) throw new Error(`O pedido #${order.id} não foi atualizado.`);
        savedOrderIds.add(String(order.id));
      }

      setPendingOrders((orders) => orders.filter((order) => !savedOrderIds.has(String(order.id))));
      setJustificationOpen(false);
      setDrafts({});
      setExpandedOrders({});
      setFeedback("Justificativas enviadas com sucesso.");
      await fetchNotifications();
    } catch (error) {
      console.error("Erro ao enviar justificativas:", error);
      if (savedOrderIds.size > 0) {
        setPendingOrders((orders) => orders.filter((order) => !savedOrderIds.has(String(order.id))));
        setDrafts((current) => Object.fromEntries(
          Object.entries(current).filter(([id]) => !savedOrderIds.has(id))
        ));
      }
      setSubmitError(
        `Não foi possível enviar todas as justificativas.${savedOrderIds.size > 0
          ? ` ${savedOrderIds.size} já foram enviadas.`
          : ""} Erro: ${getErrorCode(error)}`
      );
    } finally {
      setIsSubmitting(false);
      setConfirmation("");
    }
  };

  const confirmAction = () => {
    if (confirmation === "send") {
      sendJustifications();
      return;
    }
    if (confirmation === "discard") {
      closeJustifications();
    }
  };

  return (
    <>
      <button
        type="button"
        className="admin-notifications-trigger"
        aria-label={`Notificações${notificationCount ? `, ${notificationCount} pendente(s)` : ""}`}
        title="Notificações"
        onClick={() => {
          setNotificationOpen(true);
          fetchNotifications();
        }}
      >
        <RiNotification3Line aria-hidden="true" />
        {notificationCount > 0 && (
          <span className="admin-notifications-count">{notificationCount}</span>
        )}
      </button>

      <Dialog
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="admin-notifications-title"
        className="admin-notifications-dialog"
      >
        <DialogTitle id="admin-notifications-title">Notificações</DialogTitle>
        <DialogContent className="admin-notifications-content">
          {isLoading && <div className="admin-notifications-loading"><CircularProgress size={24} /></div>}
          {loadError && (
            <div className="admin-notifications-error" role="alert">
              <span>{loadError}</span>
              <Button onClick={fetchNotifications}>Tentar novamente</Button>
            </div>
          )}
          {!isLoading && !loadError && (
            <>
              {lowStockProducts.length > 0 && (
                <section className="admin-notification-card">
                  <div>
                    <h3>Estoque baixo</h3>
                    <p>{lowStockProducts.map((product) => product.name).join(", ")}</p>
                  </div>
                  <Button
                    component={Link}
                    to={`/stock?search=${encodeURIComponent(restockSearch)}`}
                    onClick={() => setNotificationOpen(false)}
                    variant="contained"
                    className="admin-notification-action"
                  >
                    Repor
                  </Button>
                </section>
              )}

              {pendingOrders.length > 0 && (
                <section className="admin-notification-card">
                  <div>
                    <h3>Pedidos para justificar</h3>
                    <p>{pendingOrders.length} pedido(s) cancelado(s) aguardando justificativa.</p>
                  </div>
                  <Button
                    onClick={() => {
                      setNotificationOpen(false);
                      setJustificationOpen(true);
                    }}
                    variant="contained"
                    className="admin-notification-action"
                  >
                    Justificar
                  </Button>
                </section>
              )}
              {notificationCount === 0 && (
                <p className="admin-notification-empty">Nenhuma notificação pendente.</p>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={justificationOpen}
        onClose={closeJustifications}
        fullWidth
        maxWidth="md"
        aria-labelledby="admin-justifications-title"
        className="admin-justifications-dialog"
      >
        <DialogTitle id="admin-justifications-title">Justificar pedidos cancelados</DialogTitle>
        <DialogContent className="admin-justifications-content">
          {submitError && <p className="admin-justification-error" role="alert">{submitError}</p>}
          {pendingOrders.map((order) => {
            const draft = drafts[order.id] ?? {};
            const isExpanded = Boolean(expandedOrders[order.id]);
            const items = parseItems(order.items);
            return (
              <article className="admin-justification-item" key={order.id}>
                <header className="admin-justification-summary">
                  <strong className="admin-justification-id">Pedido #{order.id}</strong>
                  <span>{order.user_name || "Cliente desconhecido"}</span>
                  <time dateTime={order.bought_at || undefined}>{formatTime(order.bought_at)}</time>
                </header>

                <TextField
                  fullWidth
                  label="Justificativa"
                  placeholder="Descreva o motivo do cancelamento"
                  value={draft.explanation ?? ""}
                  onChange={(event) => updateDraft(order.id, "explanation", event.target.value)}
                  disabled={isSubmitting}
                  margin="dense"
                  multiline
                  minRows={2}
                />

                <FormControl className="admin-justification-options">
                  <RadioGroup
                    row
                    aria-label={`Motivo do cancelamento do pedido ${order.id}`}
                    value={draft.reason ?? ""}
                    onChange={(event) => updateDraft(order.id, "reason", event.target.value)}
                  >
                    {JUSTIFICATION_OPTIONS.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                        disabled={isSubmitting}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                <Button
                  onClick={() => setExpandedOrders((current) => ({
                    ...current,
                    [order.id]: !current[order.id],
                  }))}
                  className="admin-justification-expand"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? "Ver menos informações" : "Ver mais informações"}
                </Button>
                {isExpanded && (
                  <div className="admin-justification-details">
                    <p><b>Total:</b> {formatCurrency(order.total_price)}</p>
                    <p><b>Pagamento:</b> {order.progress?.payment || "—"}</p>
                    <div>
                      <b>Itens do pedido:</b>
                      {items.length ? (
                        <ul>
                          {items.map((item, index) => (
                            <li key={`${item.id ?? item.product_name ?? "item"}-${index}`}>
                              {item.product_name || item.name || "Produto"} — {item.qty ?? 0} un.
                              {" · "}{formatCurrency(item.price_total ?? item.price_unit)}
                            </li>
                          ))}
                        </ul>
                      ) : <p>Itens do pedido indisponíveis.</p>}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
          {pendingOrders.length === 0 && (
            <p className="admin-justification-empty">Não há pedidos aguardando justificativa.</p>
          )}
        </DialogContent>
        <DialogActions className="admin-justifications-actions">
          <Button
            variant="contained"
            className="admin-justification-send"
            disabled={!canSubmit || isSubmitting}
            onClick={() => setConfirmation("send")}
          >
            {isSubmitting ? <CircularProgress size={21} color="inherit" /> : "Enviar Justificações"}
          </Button>
          <Button
            variant="contained"
            className="admin-justification-cancel"
            disabled={isSubmitting}
            onClick={() => setConfirmation("discard")}
          >
            Não Enviar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(confirmation)}
        onClose={() => setConfirmation("")}
        aria-labelledby="admin-notification-confirm-title"
      >
        <DialogTitle id="admin-notification-confirm-title">Confirmar ação</DialogTitle>
        <DialogContent>
          {confirmation === "send"
            ? changedDrafts.length < pendingOrders.length
              ? `Ainda há ${pendingOrders.length - changedDrafts.length} pedidos para justificar. Deseja justificar apenas ${changedDrafts.length}?`
              : "Deseja realmente enviar as justificativas preenchidas?"
            : "Deseja realmente não enviar as justificativas?"}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={confirmAction}
            disabled={isSubmitting}
            className="admin-justification-send"
          >
            Sim
          </Button>
          <Button variant="contained" onClick={() => setConfirmation("")} disabled={isSubmitting}>
            Não
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(feedback)} onClose={() => setFeedback("")}>
        <DialogTitle>Sucesso</DialogTitle>
        <DialogContent>{feedback}</DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedback("")} variant="contained">OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
