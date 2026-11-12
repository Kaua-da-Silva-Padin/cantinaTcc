import { useState } from "react";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { paymentMessage } from "../OrdersList/paymentMessage";

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

function formatCurrency(value) {
  return Number(value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatTime(timestamp) {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function getCustomerId(order) {
  return order.user_id
    ?? order.client_id
    ?? order.customer_id
    ?? order.user?.id
    ?? order.customer?.id
    ?? "—";
}

function OrderHeader({ order, payment }) {
  const [paymentLabel, paymentColor] = paymentMessage(payment);
  const [isVerificationVisible, setVerificationVisible] = useState(true);

  return (
    <div className="order-info-header">
      <div className="order-info-summary">
        <div className="order-info-summary-field">
          <span>Nome</span>
          <strong>{order.user_name || "—"}</strong>
        </div>
        <div className="order-info-summary-field">
          <span>Entrada</span>
          <strong>{formatTime(order.bought_at)}</strong>
        </div>
        <div className="order-info-summary-field">
          <span>Cliente</span>
          <strong>{getCustomerId(order)}</strong>
        </div>
      </div>

      <div className="order-info-number" aria-label={`Pedido número ${order.id}`}>
        #{order.id}
      </div>

      <div className="order-info-payment">
        <div
          className="order-info-payment-label"
          style={{
            color: paymentColor,
            borderColor: paymentColor,
            backgroundColor: `color-mix(in srgb, ${paymentColor} 12%, white)`,
          }}
        >
          {paymentLabel}
        </div>
        <div
          className="order-info-verification"
          style={{
            color: paymentColor,
            borderColor: paymentColor,
            backgroundColor: `color-mix(in srgb, ${paymentColor} 24%, white)`,
          }}
        >
          <strong>
            {isVerificationVisible
              ? order.verification_code || "—"
              : "*****"}
          </strong>
          <IconButton
            size="small"
            aria-label={isVerificationVisible ? "Ocultar código de verificação" : "Mostrar código de verificação"}
            title={isVerificationVisible ? "Ocultar código" : "Mostrar código"}
            onClick={() => setVerificationVisible((visible) => !visible)}
          >
            {isVerificationVisible
              ? <RiEyeOffLine aria-hidden="true" />
              : <RiEyeLine aria-hidden="true" />}
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default function OrderInfo({ order }) {
  if (!order) {
    return (
      <section className="order-info order-info-empty" aria-label="Detalhes do pedido">
        <h2>Selecione um pedido</h2>
      </section>
    );
  }

  const items = parseItems(order.items);

  return (
    <section className="order-info" aria-label={`Detalhes do pedido número ${order.id}`}>
      <OrderHeader key={order.id} order={order} payment={order.progress?.payment} />

      <TableContainer className="order-info-items">
        <Table size="small" aria-label={`Itens do pedido ${order.id}`}>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Valor Un.</TableCell>
              <TableCell>Qtde</TableCell>
              <TableCell>Valor T.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? items.map((item, index) => (
              <TableRow key={`${item.product_name ?? item.id ?? "item"}-${index}`}>
                <TableCell align="center">{item.product_id ?? item.id ?? "—"}</TableCell>
                <TableCell align="center">{item.product_name || "—"}</TableCell>
                <TableCell align="center">{formatCurrency(item.price_unit)}</TableCell>
                <TableCell align="center">{item.qty ?? 0}</TableCell>
                <TableCell align="center">{formatCurrency(item.price_total)}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} align="center">Nenhum item encontrado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="order-info-footer">
        <div className="order-info-total">
          TOTAL: {formatCurrency(order.total_price)}
        </div>
      </div>
    </section>
  );
}
