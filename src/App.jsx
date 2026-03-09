import SearchField from "./Components/SearchField/SearchField"
import Header from "./Components/Header/Header"
import FilterTabs from "./Components/FilterTabs/FilterTabs"
import FoodTable from "./Components/FoodTable/FoodTable"

export default function App() {

  return(
    <>
      <Header/>
      <SearchField/>
      <FilterTabs/>
      <hr className="mx-4"/>
      <FoodTable/>
    </>
  )
}