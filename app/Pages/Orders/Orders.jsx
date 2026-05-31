import OrdersList from "../../Components/OrdersList/OrdersList"
import OrderInfo from "../../Components/OrdersInfo/OrdersInfo"
import { useState } from "react"

import "../../Pages/Orders/Orders.css"

function newOrder(orderData) {
    // This function will append an order to the end of the list when a new order appears.
    //     - Upon the NewOrderEvent() webhook - Or something like that
}

export default function Orders() {
    const orders = [
        {
            id: 1,
            entrance: "09:10",
            customer: {
                name: "João Pedro",
                id: "26905"
            },
            products: [
                {"id": 5, "quantity": 1}, // O id já é o suficiente pois os dados dos produtos (preço e nome) estarão no banco de dados
                {"id": 10, "quantity": 2},
                {"id": 40, "quantity": 1}
            ],
            price: 10
        },
        {
            id: 2,
            entrance: "09:10",
            customer: {
                name: "João Pedro",
                id: "26905"
            },
            products: [
                {"id": 5, "quantity": 1}, // O id já é o suficiente pois os dados dos produtos (preço e nome) estarão no banco de dados
                {"id": 10, "quantity": 2},
                {"id": 40, "quantity": 1}
            ],
            price: 10
        },
        {
            id: 3,
            entrance: "09:10",
            customer: {
                name: "João Pedro",
                id: "26905"
            },
            products: [
                {"id": 5, "quantity": 1}, // O id já é o suficiente pois os dados dos produtos (preço e nome) estarão no banco de dados
                {"id": 10, "quantity": 2},
                {"id": 40, "quantity": 1}
            ],
            price: 10
        },
        {
            id: 4,
            entrance: "09:10",
            customer: {
                name: "João Pedro",
                id: "26905"
            },
            products: [
                {"id": 5, "quantity": 1}, // O id já é o suficiente pois os dados dos produtos (preço e nome) estarão no banco de dados
                {"id": 10, "quantity": 2},
                {"id": 40, "quantity": 1}
            ],
            price: 10
        },
        {
            id: 5,
            entrance: "09:10",
            customer: {
                name: "João Pedro",
                id: "26905"
            },
            products: [
                {"id": 5, "quantity": 1}, // O id já é o suficiente pois os dados dos produtos (preço e nome) estarão no banco de dados
                {"id": 10, "quantity": 2},
                {"id": 40, "quantity": 1}
            ],
            price: 10
        },
        {
            id: 6,
            entrance: "09:10",
            customer: {
                name: "João Pedro",
                id: "26905"
            },
            products: [
                {"id": 5, "quantity": 1}, // O id já é o suficiente pois os dados dos produtos (preço e nome) estarão no banco de dados
                {"id": 10, "quantity": 2},
                {"id": 40, "quantity": 1}
            ],
            price: 10
        },
        {
            id: 7,
            entrance: "09:10",
            customer: {
                name: "João Pedro",
                id: "26905"
            },
            products: [
                {"id": 5, "quantity": 1}, // O id já é o suficiente pois os dados dos produtos (preço e nome) estarão no banco de dados
                {"id": 10, "quantity": 2},
                {"id": 40, "quantity": 1}
            ],
            price: 10
        },
    ];
    return (
        <>
        <div className="orders-element">
        <OrdersList orders={orders}/>
        <OrderInfo order={orders[0]}/> {/* The first order of the list. */}
        </div>
        </>

)
}

/*

For issue 4:
https://github.com/Kaua-da-Silva-Padin/cantinaTcc/issues/4

TODO:
- [ ] OrdersList
    - [ ] Box title
    - [x] Column Names
    - [x] singleListItem

- [ ] OrderInfo
    - [ ] Box title 
    - [ ] Customer Info
        - [ ] Name, RM
    - [ ] Order ID
    - [ ] Products List
        - [ ] ProductsListItem
    - [ ] Finish Order
        - [ ] Total Price
        - [ ] Finish button

IDEAS:
    - Try with <Table> element structure instead of <Stack>
        It has the sticky title feature, and probably better to align.
*/
