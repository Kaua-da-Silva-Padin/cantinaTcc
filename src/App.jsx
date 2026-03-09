import SearchField from "./Components/SearchField/SearchField"
import Header from "./Components/Header/Header"
import FilterTabs from "./Components/FilterTabs/FilterTabs"
import FoodTable from "./Components/FoodTable/FoodTable"
import { useState } from "react"

export default function App() {
  const [searchTxt, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('todos');

  return(
    <>
      <Header/>
      <SearchField
      setSearch={setSearch}/>
      <FilterTabs
      selectedFilterTab={filterTab}
      setFilterTab={setFilterTab}/>
      <hr className="mx-4"/>
      <FoodTable
      filterTab={filterTab}
      filterTxt={searchTxt}/>
    </>
  )
}