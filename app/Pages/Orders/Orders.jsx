import OrdersList from "../../Components/OrdersList/OrdersList";
import OrderInfo from "../../Components/OrdersInfo/OrdersInfo";
import { useState, useCallback, useEffect } from "react";
import "../../Pages/Orders/Orders.css";
import supabase from "../../supabaseClient";

function newOrder(orderData) {
  // This function will append an order to the end of the list when a new order appears.
  //     - Upon the NewOrderEvent() webhook - Or something like that
}

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [actualOrder, setActualOrder] = useState(0);
  const [orderInfo, setOrderInfo] = useState();

  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("sales").select("*"); //O dado retornado é um array de objetos
      if (error) throw error;
      console.log(data)
      setOrders(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  let _orders = [
  {
    id: 1,
    entrance: "09:10",
    customer: {
      name: "João Pedro",
      id: "26905",
    },
    items: [
      { id: 5, quantity: 1 },
      { id: 10, quantity: 2 },
      { id: 40, quantity: 1 },
    ],
    price: 10,
  },
  {
    id: 2,
    entrance: "09:15",
    customer: {
      name: "Maria Silva",
      id: "26906",
    },
    items: [
      { id: 2, quantity: 1 },
      { id: 15, quantity: 1 },
    ],
    price: 24.50,
  },
  {
    id: 3,
    entrance: "09:22",
    customer: {
      name: "Carlos Eduardo",
      id: "26907",
    },
    items: [
      { id: 8, quantity: 3 },
    ],
    price: 18.00,
  },
  {
    id: 4,
    entrance: "09:30",
    customer: {
      name: "Ana Beatris",
      id: "26908",
    },
    items: [
      { id: 1, quantity: 1 },
      { id: 12, quantity: 2 },
      { id: 30, quantity: 1 },
    ],
    price: 42.00,
  },
  {
    id: 5,
    entrance: "09:45",
    customer: {
      name: "Lucas Santos",
      id: "26909",
    },
    items: [
      { id: 5, quantity: 2 },
    ],
    price: 15.00,
  },
  {
    id: 6,
    entrance: "10:02",
    customer: {
      name: "Fernanda Lima",
      id: "26910",
    },
    items: [
      { id: 3, quantity: 1 },
      { id: 20, quantity: 1 },
      { id: 22, quantity: 1 },
      { id: 40, quantity: 2 },
    ],
    price: 58.90,
  },
  {
    id: 7,
    entrance: "10:15",
    customer: {
      name: "Gabriel Costa",
      id: "26911",
    },
    items: [
      { id: 10, quantity: 1 },
    ],
    price: 8.50,
  },
  {
    id: 8,
    entrance: "10:20",
    customer: {
      name: "Juliana Oliveira",
      id: "26912",
    },
    items: [
      { id: 7, quantity: 2 },
      { id: 14, quantity: 1 },
    ],
    price: 31.00,
  },
  {
    id: 9,
    entrance: "10:35",
    customer: {
      name: "Rodrigo Alves",
      id: "26913",
    },
    items: [
      { id: 4, quantity: 1 },
      { id: 18, quantity: 3 },
    ],
    price: 27.50,
  },
  {
    id: 10,
    entrance: "10:42",
    customer: {
      name: "Camila Rocha",
      id: "26914",
    },
    items: [
      { id: 9, quantity: 1 },
      { id: 11, quantity: 1 },
      { id: 25, quantity: 1 },
    ],
    price: 36.00,
  },
  {
    id: 11,
    entrance: "11:00",
    customer: {
      name: "Mateus Ferreira",
      id: "26915",
    },
    items: [
      { id: 16, quantity: 2 },
    ],
    price: 19.90,
  },
];
  // setOrders([...orders, exampleOrder]);
  return (
    <>
      <div className="orders-container">
          <OrdersList orders={orders} setActualOrder={setActualOrder} setOrderInfo={setOrderInfo}/>
          <OrderInfo order={orderInfo} /> {/* The first order of the list. */}
      </div>
    </>
  );
}

/*
IDEAS:
    - Try with <Table> element structure instead of <Stack>
        It has the sticky title feature, and probably better to align.
*/
