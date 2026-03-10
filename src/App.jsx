import SearchField from "./Components/SearchField/SearchField"
import Header from "./Components/Header/Header"
import FilterTabs from "./Components/FilterTabs/FilterTabs"
import FoodTable from "./Components/FoodTable/FoodTable"
import { useState } from "react"

export default function App() {
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

      {/*Input de pesquisa e botão de pesquisa (Nota: botão ainda não funcional diferente do input)*/}
      <SearchField
      setSearch={setSearch}/>

      {/*Barra horizontal "scrolável" com filtros de comida.*/}
      <FilterTabs
      selectedFilterTab={filterTab.trim().toLowerCase()}
      setFilterTab={setFilterTab}/>
      <hr className="mx-4"/>

      {/*Tabela de comidas que muda a quantidade de colunas dependendo do dispositivo, PC = 4 colunas enquanto Mobile = 2 colunas.*/}
      <FoodTable
      filterTab={filterTab.trim().toLowerCase()}
      filterTxt={searchTxt.trim().toLowerCase()}
      setCartPrice={setCartPrice}
      cartPrice={parseFloat(cartPrice)}/>
    </>
  )
}