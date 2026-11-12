export function paymentMessage(payment) {
  if (payment === "waiting") return ["Não Pago", "#ff0000"];
  if (payment === "paid") return ["Pago", "#36a900"];
  if (payment === "local") return ["Pagamento no Local", "#ff751f"];
  return ["—", "#111111"];
}
