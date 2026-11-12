import {
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

export default function OrdersList({
  orders,
  loading,
  error,
  selectedOrderId,
  searchText,
  onSearchTextChange,
  onSelectOrder,
  onRefresh,
  refreshDisabled,
  refreshLoading,
  refreshIndicator,
  failedRefreshes,
}) {
  return (
    <section className="orders-list-panel" aria-label="Lista de pedidos">
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
              className="orders-refresh-button"
              aria-label="Atualizar pedidos"
              onClick={onRefresh}
              disabled={refreshDisabled}
            >
              {refreshLoading
                ? <CircularProgress size={19} color="inherit" />
                : <FaArrowsRotate aria-hidden="true" />}
              {!refreshLoading && refreshIndicator && (
                <span
                  className={`orders-refresh-indicator ${refreshIndicator === "error" ? "is-error" : "is-success"}`}
                  aria-label={refreshIndicator === "error"
                    ? `Falha na atualização. ${failedRefreshes} tentativas`
                    : "Atualização concluída"}
                />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </div>

      <TableContainer className="orders-table-container">
        <Table size="small" stickyHeader aria-label="Pedidos em andamento ou prontos">
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
                  {searchText.trim() ? "Nenhum pedido encontrado." : "Nenhum pedido em andamento ou pronto."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}
