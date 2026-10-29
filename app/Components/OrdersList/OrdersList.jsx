import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "../../Pages/Orders/Orders.css";
import supabase from "../../supabaseClient";
import { useState } from "react";

export default function OrdersList({ orders, setActualOrder, setOrderInfo }) {

  function convertTime(a) {
    const date = new Date(a);

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return time;
  }

  function paymentMessage(message){
    if (message == "waiting"){
      return ["Não Pago", "red"];
    }

    if (message == "paid"){
      return ["Pago", "green"];
    }

    if (message == "local"){
      return ["No Local", "#0073c0"];
    }
  }

  // Helper function to calculate total items for a specific order
  const getTotalItems = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.qty || 0), 0);
  };

  return (
    <>
      <TableContainer
        className="bg-dark rounded-2 p-2"
        sx={{
          maxHeight: "80dvh",
        }}
      >
        <Table>
          <TableBody
            sx={{
              overflow: "auto",
            }}
          >
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="bg-white ordersRow"
                  onClick={() => {
                    setActualOrder(order.id - 1);
                    setOrderInfo(orders.find((item) => item.id == order.id));
                  }}
                >
                  <TableCell align="center" className="fw-bold fs-6">
                    <span className="d-block text-muted small">ID</span>#
                    {order.id}
                  </TableCell>
                  <TableCell align="center" className="fw-bold fs-6">
                    <span className="d-block text-muted small">Entrada</span>
                    {order.bought_at ? convertTime(order.bought_at) : "00:00"}
                  </TableCell>
                  <TableCell align="center" className="fw-bold fs-6">
                    <span className="d-block text-muted small">Cliente</span>
                    {order.user_name ? order.user_name : "null"}
                  </TableCell>
                  <TableCell align="center" className="fw-bold fs-6">
                    <span className="d-block text-muted small">Itens</span>
                    {getTotalItems(order.items)}
                  </TableCell>
                  <TableCell align="center" className="fw-bold fs-6">
                    <span className="d-block text-muted small">Valor</span>
                    R$ {order.total_price}
                  </TableCell>
                  <TableCell align="center" className="fw-bold fs-6" sx={{color: order.progress?.payment ? paymentMessage(order.progress.payment)[1] : "inherit"}}>
                    <span className="d-block text-muted small">Pagamento</span>
                    {order.progress?.payment ? paymentMessage(order.progress.payment)[0] : "null"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" className="text-white">
                  Nenhum Pedido Ainda
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}