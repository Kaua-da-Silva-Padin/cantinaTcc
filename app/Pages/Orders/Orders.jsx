import { useCallback, useEffect, useRef, useState } from "react";
import {
  Avatar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { Link } from "react-router";
import AdminRouteGuard from "../../Components/AdminRouteGuard/AdminRouteGuard";
import AdmSideBar from "../../Components/AdmSideBar/AdmSideBar";
import OrdersList from "../../Components/OrdersList/OrdersList";
import OrderInfo from "../../Components/OrdersInfo/OrdersInfo";
import { stringAvatar } from "../../Components/MenuPageLinks/MenuPageLinks";
import packageJson from "../../../package.json";
import supabase from "../../supabaseClient";
import "../../../index.css";
import "./Orders.css";

const REFRESH_COOLDOWN_MS = 7000;
const REFRESH_LOCKOUT_MS = 40000;
const MAX_FAILED_REFRESHES = 5;

const adminLinks = [
  { text: "Estoque", link: "/stock" },
  { text: "Finanças", link: "/finance" },
  { text: "Estatísticas", link: "/statistics" },
  { text: "Funcionários", link: "/employees" },
  { text: "Configurações", link: "/settings" },
];

const ordersNavigationGroups = {
  speedDial: [
    { text: "Home", link: "/home" },
    { text: "Cantina", link: "/buy" },
    { text: "Administrar", link: "/adm" },
    { text: "Pedidos", link: "/orders" },
    { text: "Estoque", link: "/stock" },
    { text: "Login", link: "/login" },
    { text: "Registrar", link: "/" },
    { text: "Perfil", link: "/profile" },
  ],
  admin: adminLinks,
};

function getErrorCode(error) {
  return error?.code ?? error?.message ?? "UNKNOWN";
}

function OrdersContent() {
  const [orders, setOrders] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [initialError, setInitialError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [refreshIndicator, setRefreshIndicator] = useState(null);
  const [refreshErrorCode, setRefreshErrorCode] = useState("");
  const [failedRefreshes, setFailedRefreshes] = useState(0);
  const [pendingOrderAction, setPendingOrderAction] = useState(false);
  const [orderActionError, setOrderActionError] = useState("");
  const [sideBarOn, setSideBarOn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const cooldownTimer = useRef(null);
  const indicatorTimer = useRef(null);
  const lockoutTimer = useRef(null);
  const failedRefreshesRef = useRef(0);

  const loggedInUser = typeof sessionStorage !== "undefined"
    ? sessionStorage.getItem("loggedInUser")
    : null;
  let parsedUser = null;
  try {
    parsedUser = loggedInUser ? JSON.parse(loggedInUser) : null;
  } catch {
    parsedUser = null;
  }
  const loggedInUserName = parsedUser?.name ?? parsedUser?.nome ?? loggedInUser ?? "Funcionário";

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("bought_at", { ascending: true })
      .order("id", { ascending: true });

    if (error) throw error;

    const visibleOrders = (data ?? []).filter((order) => (
      ["in progress", "ready"].includes(order.progress?.preparation)
    ));
    setOrders(visibleOrders);
    setInitialError("");
  }, []);

  useEffect(() => {
    let active = true;
    const loadInitialOrders = async () => {
      try {
        await fetchOrders();
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        if (active) {
          setOrders([]);
          setInitialError(`Não foi possível carregar os pedidos. Erro: ${getErrorCode(error)}`);
        }
      }
    };

    loadInitialOrders();
    return () => { active = false; };
  }, [fetchOrders]);

  useEffect(() => {
    const clock = window.setInterval(() => setCurrentTime(new Date()), 1000);
    setSideBarOn(false);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setActiveSearch(searchText.trim()), 1000);
    return () => window.clearTimeout(timer);
  }, [searchText]);

  useEffect(() => () => {
    window.clearTimeout(cooldownTimer.current);
    window.clearTimeout(indicatorTimer.current);
    window.clearTimeout(lockoutTimer.current);
  }, []);

  const handleRefresh = async () => {
    if (isRefreshing || isCoolingDown || isLockedOut) return;

    setIsRefreshing(true);
    setRefreshIndicator(null);
    setRefreshErrorCode("");

    let succeeded = false;
    let errorCode = "";
    try {
      await fetchOrders();
      succeeded = true;
      failedRefreshesRef.current = 0;
      setFailedRefreshes(0);
    } catch (error) {
      console.error("Erro ao atualizar pedidos:", error);
      errorCode = getErrorCode(error);
      setRefreshErrorCode(errorCode);
      setRefreshIndicator("error");
      const attempts = failedRefreshesRef.current + 1;
      failedRefreshesRef.current = attempts;
      setFailedRefreshes(attempts);
    } finally {
      setIsRefreshing(false);
      if (succeeded) {
        setRefreshIndicator("success");
        setIsCoolingDown(true);
        window.clearTimeout(indicatorTimer.current);
        indicatorTimer.current = window.setTimeout(() => setRefreshIndicator(null), REFRESH_COOLDOWN_MS);
        window.clearTimeout(cooldownTimer.current);
        cooldownTimer.current = window.setTimeout(() => setIsCoolingDown(false), REFRESH_COOLDOWN_MS);
      } else if (failedRefreshesRef.current >= MAX_FAILED_REFRESHES) {
        setIsLockedOut(true);
        window.clearTimeout(lockoutTimer.current);
        lockoutTimer.current = window.setTimeout(() => {
          failedRefreshesRef.current = 0;
          setFailedRefreshes(0);
          setIsLockedOut(false);
        }, REFRESH_LOCKOUT_MS);
      } else {
        setIsCoolingDown(true);
        window.clearTimeout(cooldownTimer.current);
        cooldownTimer.current = window.setTimeout(() => setIsCoolingDown(false), REFRESH_COOLDOWN_MS);
      }
    }

    if (errorCode) setRefreshErrorCode(errorCode);
  };

  const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);
  const visibleOrders = (orders ?? []).filter((order) => {
    if (!activeSearch) return true;
    if (activeSearch.startsWith("##")) {
      const customerId = order.user_id
        ?? order.client_id
        ?? order.customer_id
        ?? order.user?.id
        ?? order.customer?.id;
      return String(customerId ?? "") === activeSearch.slice(2);
    }
    if (activeSearch.startsWith("#")) {
      return String(order.id) === activeSearch.slice(1);
    }
    return false;
  });

  const handleSelectOrder = (order) => {
    setSelectedOrderId(order.id);
    setOrderInfo(order);
  };

  const runOrderAction = async (action, parameters) => {
    if (!orderInfo || pendingOrderAction) return false;

    setPendingOrderAction(true);
    setOrderActionError("");
    const actionOrderId = orderInfo.id;
    try {
      const { error } = await supabase.rpc(action, parameters);
      if (error) throw error;

      if (action === "cancel_sale") {
        setOrderInfo(null);
        setSelectedOrderId(null);
      } else {
        const preparation = parameters.ac_finalidade === "Fechar" ? "ready" : "received";
        setOrderInfo((currentOrder) => currentOrder?.id === actionOrderId
          ? {
            ...currentOrder,
            progress: { ...currentOrder.progress, preparation },
          }
          : currentOrder);
      }

      try {
        await fetchOrders();
      } catch (error) {
        console.error("A ação foi concluída, mas não foi possível atualizar a lista:", error);
        setOrderActionError(
          `A ação foi concluída, mas não foi possível atualizar a lista. Erro: ${getErrorCode(error)}`
        );
      }

      return true;
    } catch (error) {
      console.error(`Erro ao executar ${action}:`, error);
      setOrderActionError(`Não foi possível concluir a ação. Erro: ${getErrorCode(error)}`);
      return false;
    } finally {
      setPendingOrderAction(false);
    }
  };

  const handleCancelOrder = (cancellationMessage) => runOrderAction("cancel_sale", {
    prd_sale_id: orderInfo.id,
    prd_cancellation_msg: cancellationMessage,
  });

  const handleUpdateProgress = (finalidade) => runOrderAction("update_sale_progress", {
    ac_sale_id: orderInfo.id,
    ac_finalidade: finalidade,
  });

  return (
    <div className={`orders-admin-shell ${sideBarOn ? "sideBarOn" : "sideBarOff"}`}>
      <aside className="orders-sidebar">
        <AdmSideBar tools={adminLinks} navigationGroups={ordersNavigationGroups} />
      </aside>
      <main className="orders-main">
        <header className="orders-navbar">
          <button
            type="button"
            aria-label={sideBarOn ? "Fechar menu" : "Abrir menu"}
            onClick={() => setSideBarOn((current) => !current)}
          >
            <img src={sideBarOn ? "/imgs/closeicon.png" : "/imgs/more.png"} alt="" />
          </button>
          <div className="orders-navbar-status">
            <span>
              {`${currentTime.getDate()} de ${capitalize(currentTime.toLocaleDateString("pt-BR", { month: "long" }))} de ${currentTime.getFullYear()} ${currentTime.toLocaleTimeString("pt-BR")}`}
            </span>
            <span>Versão: {packageJson.version}</span>
            <span className="orders-system-status">Status do Sistema: Ativo</span>
            <Link to="/profile" className="orders-user-link">
              <b>{loggedInUserName}</b>
              <Avatar {...stringAvatar(loggedInUserName || "User")} />
            </Link>
          </div>
        </header>

        <section className="orders-workspace" aria-label="Pedidos">
          <OrdersList
            orders={visibleOrders}
            loading={orders === null}
            error={initialError}
            selectedOrderId={selectedOrderId}
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onSelectOrder={handleSelectOrder}
            onRefresh={handleRefresh}
            refreshDisabled={isRefreshing || isCoolingDown || isLockedOut}
            refreshLoading={isRefreshing}
            refreshIndicator={refreshIndicator}
            failedRefreshes={failedRefreshes}
          />
          <OrderInfo
            order={orderInfo}
            actionLoading={pendingOrderAction}
            onCancelOrder={handleCancelOrder}
            onUpdateProgress={handleUpdateProgress}
          />
        </section>
      </main>

      <Dialog
        open={Boolean(refreshErrorCode)}
        onClose={() => setRefreshErrorCode("")}
        aria-labelledby="orders-refresh-error-title"
      >
        <DialogTitle id="orders-refresh-error-title">Erro!</DialogTitle>
        <DialogContent>
          Não foi possível procurar novos pedidos.
          <br />
          <b>Erro: {refreshErrorCode}</b>
          <br />
          CONTATE O TI O MAIS RÁPIDO POSSÍVEL!
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRefreshErrorCode("")}
            variant="contained"
            sx={{ backgroundColor: "black", color: "white", "&:hover": { backgroundColor: "#333" } }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(orderActionError)}
        onClose={() => setOrderActionError("")}
        aria-labelledby="orders-action-error-title"
      >
        <DialogTitle id="orders-action-error-title">Erro ao atualizar pedido</DialogTitle>
        <DialogContent>{orderActionError}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOrderActionError("")}
            variant="contained"
            sx={{ backgroundColor: "black", color: "white", "&:hover": { backgroundColor: "#333" } }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {orders === null && (
        <div className="orders-loading-overlay" role="status" aria-live="polite">
          <CircularProgress aria-label="Carregando pedidos" />
          <span>Carregando pedidos...</span>
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  return (
    <AdminRouteGuard>
      <OrdersContent />
    </AdminRouteGuard>
  );
}
