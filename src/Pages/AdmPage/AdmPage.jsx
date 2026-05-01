import Header from "../../Components/Header/Header"
import OrdersList from "../../Components/OrdersList/OrdersList"
import FoodTable from "../../Components/FoodTable/FoodTable"
import Footer from "../../Components/Footer/Footer"
import DBManage from "../../Components/DBManage/DBManage"
import { useState } from "react"

export default function AdmPage() {
  {/*Query do input de pesquisa.*/}
  const [searchTxt, setSearch] = useState('');

  {/*Filtro da barra selecionado atualmente.*/}
  const [filterTab, setFilterTab] = useState('todos');

  {/*Preço total do carrinho a ser somado ou mostrado.*/}
  const [cartPrice, setCartPrice] = useState(0);

  return(
    <>
      
      {/*Cabeçalho da págino com profile, username e carrinho de compras*/}
      <Header
      cartPrice={cartPrice}/>
      <OrdersList />
      <DBManage />
    </>
  )
}