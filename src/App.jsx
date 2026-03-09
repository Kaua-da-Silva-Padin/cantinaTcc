import SearchField from "./Components/SearchField/SearchField"
import Header from "./Components/Header/Header"
import FilterTabs from "./Components/FilterTabs/FilterTabs"
import FoodTable from "./Components/FoodTable/FoodTable"
import { useState } from "react"

export default function App() {
  const [searchTxt, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('todos');
  const [cartPrice, setCartPrice] = useState(0);

  return(
    <>
      <Header
      cartPrice={cartPrice}/>
      <SearchField
      setSearch={setSearch}/>
      <FilterTabs
      selectedFilterTab={filterTab.trim().toLowerCase()}
      setFilterTab={setFilterTab}/>
      <hr className="mx-4"/>
      <FoodTable
      filterTab={filterTab.trim().toLowerCase()}
      filterTxt={searchTxt.trim().toLowerCase()}
      setCartPrice={setCartPrice}
      cartPrice={parseFloat(cartPrice)}/>
    </>
  )
}