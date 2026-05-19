import Header from "../../Components/Header/Header"
import OrdersList from "../../Components/OrdersList/OrdersList"
import FoodTable from "../../Components/FoodTable/FoodTable"
import Footer from "../../Components/Footer/Footer"
import { useState } from "react"

function newOrder(orderData) {
    // This function will append an order to the end of the list.
}

export default function RealTimeOrders() {
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
    ];
    
    return (
        <>
        <OrdersList orders={orders}/>
        </>

)
}

/*

TODO:
- [ ] OrdersList
    - [ ] Box title
    - [ ] Column Names
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
    - Try with <Table> instead of <Stack>
        It has the sticky title feature, and probably better to align.
*/
