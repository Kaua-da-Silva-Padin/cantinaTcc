import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { FaArrowsRotate } from "react-icons/fa6";
import { RiArrowDownSLine } from "react-icons/ri";
import { useRef, useState } from "react";
import { paymentMessage } from "./paymentMessage";
import "./OrdersList.css";

function convertTime(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getTotalItems(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((total, item) => total + (Number(item.qty) || 0), 0);
}

function formatCurrency(value) {
  return Number(value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function ArchiveGroup({
  groupId,
  title,
  orders,
  canceled = false,
  selectedOrderId,
  expanded,
  onToggle,
  onSelectOrder,
}) {
  return (
    <Accordion
      className="orders-archive-group"
      expanded={expanded}
      onChange={onToggle}
      disableGutters
      elevation={0}
    >
      <AccordionSummary
        expandIcon={<RiArrowDownSLine aria-hidden="true" />}
        aria-controls={`${groupId}-content`}
        id={`${groupId}-header`}
      >
        <span className="orders-archive-title">{title}</span>
        <span className="orders-archive-count">{orders.length}</span>
      </AccordionSummary>
      <AccordionDetails id={`${groupId}-content`}>
        {orders.length > 0 ? (
          <div className="orders-archive-items">
            {orders.map((order) => {
              const isSelected = selectedOrderId === order.id;
              return (
                <button
                  type="button"
                  key={order.id}
                  className={`orders-archive-item ${canceled ? "is-canceled" : ""} ${isSelected ? "is-selected" : ""}`}
                  onClick={() => onSelectOrder(order, true)}
                  aria-label={`Pedido ${order.id}, ${order.user_name || "cliente desconhecido"}, ${formatCurrency(order.total_price)}${canceled ? `, motivo: ${order.cancellation_msg || "não informado"}` : ""}`}
                  aria-pressed={isSelected}
                >
                  <span className="orders-archive-number">#{order.id}</span>
                  <strong className="orders-archive-customer">{order.user_name || "—"}</strong>
                  <span className="orders-archive-total">{formatCurrency(order.total_price)}</span>
                  {canceled && (
                    <span className="orders-archive-cancel-reason">
                      {order.cancellation_msg || "Motivo não informado"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="orders-archive-empty">Nenhum pedido nesta seção.</p>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default function OrdersList({
  orders,
  loading,
  error,
  selectedOrderId,
  searchText,
  onSearchTextChange,
  onSelectOrder,
  finishedOrders,
  closedOrders,
  canceledOrders,
  onRefresh,
  refreshDisabled,
  refreshLoading,
  refreshIndicator,
  hasNewOrders,
}) {
  const [expandedArchives, setExpandedArchives] = useState({});
  const [expandedTableHeight, setExpandedTableHeight] = useState(null);
  const ordersTableRef = useRef(null);
  const toggleArchive = (group) => (_event, expanded) => {
    if (group === "canceled") {
      setExpandedTableHeight(
        expanded ? ordersTableRef.current?.getBoundingClientRect().height ?? null : null
      );
    }
    setExpandedArchives((previous) => ({ ...previous, [group]: expanded }));
  };
  const isLastArchiveExpanded = Boolean(expandedArchives.canceled);

  return (
    <section
      className={`orders-list-panel ${isLastArchiveExpanded ? "has-expanded-last-archive" : ""}`}
      aria-label="Lista de pedidos"
    >
      <div className="orders-list-toolbar">
        <h1>Pedidos</h1>
        <TextField
          className="orders-search"
          size="small"
          value={searchText}
          onChange={(event) => onSearchTextChange(event.target.value)}
          placeholder="Ex: #8 ou ##9"
          inputProps={{ "aria-label": "Pesquisar por pedido ou cliente" }}
        />
        <Tooltip title={refreshLoading ? "Buscando pedidos..." : "Atualizar pedidos"}>
          <span className="orders-refresh-wrap">
            <IconButton
              className={`orders-refresh-button ${refreshIndicator ? `has-refresh-${refreshIndicator}` : ""}`}
              aria-label={`Atualizar pedidos. ${hasNewOrders === null ? "Estado de novos pedidos indisponível." : hasNewOrders ? "Há pedidos novos." : "Nenhum pedido novo."}`}
              onClick={onRefresh}
              disabled={refreshDisabled}
            >
              {refreshLoading
                ? <CircularProgress size={19} color="inherit" />
                : <FaArrowsRotate aria-hidden="true" />}
              {!refreshLoading && hasNewOrders && (
                <span
                  className="orders-new-orders-indicator has-new-orders"
                  aria-hidden="true"
                />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </div>

      <TableContainer
        ref={ordersTableRef}
        className="orders-table-container"
        style={isLastArchiveExpanded && expandedTableHeight !== null
          ? { "--orders-table-height": `${expandedTableHeight}px` }
          : undefined}
      >
        <Table size="small" stickyHeader aria-label="Pedidos em andamento">
          <TableHead>
            <TableRow>
              <TableCell>IDP</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Entrada</TableCell>
              <TableCell>Itens</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Pagamento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Carregando pedidos...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} align="center" className="orders-list-error">
                  {error}
                </TableCell>
              </TableRow>
            ) : orders.length > 0 ? (
              orders.map((order) => {
                const [paymentLabel, paymentColor] = paymentMessage(order.progress?.payment);
                return (
                  <TableRow
                    key={order.id}
                    className={`orders-row ${selectedOrderId === order.id ? "is-selected" : ""}`}
                    hover
                    onClick={() => onSelectOrder(order)}
                    aria-selected={selectedOrderId === order.id}
                  >
                    <TableCell align="center">#{order.id}</TableCell>
                    <TableCell align="center">{order.user_name || "—"}</TableCell>
                    <TableCell align="center">{order.bought_at ? convertTime(order.bought_at) : "—"}</TableCell>
                    <TableCell align="center">{getTotalItems(order.items)}</TableCell>
                    <TableCell align="center">
                      {Number(order.total_price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                    <TableCell align="center" sx={{ color: paymentColor, fontWeight: 700 }}>
                      {paymentLabel}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {searchText.trim() ? "Nenhum pedido encontrado." : "Nenhum pedido em andamento."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="orders-archives" aria-label="Histórico de pedidos">
        <ArchiveGroup
          groupId="orders-finished"
          title="Pedidos Finalizados"
          orders={finishedOrders}
          selectedOrderId={selectedOrderId}
          expanded={Boolean(expandedArchives.finished)}
          onToggle={toggleArchive("finished")}
          onSelectOrder={onSelectOrder}
        />
        <ArchiveGroup
          groupId="orders-closed"
          title="Pedidos Fechados"
          orders={closedOrders}
          selectedOrderId={selectedOrderId}
          expanded={Boolean(expandedArchives.closed)}
          onToggle={toggleArchive("closed")}
          onSelectOrder={onSelectOrder}
        />
        <ArchiveGroup
          groupId="orders-canceled"
          title="Pedidos Cancelados"
          orders={canceledOrders}
          canceled
          selectedOrderId={selectedOrderId}
          expanded={Boolean(expandedArchives.canceled)}
          onToggle={toggleArchive("canceled")}
          onSelectOrder={onSelectOrder}
        />
      </div>
    </section>
  );
}
