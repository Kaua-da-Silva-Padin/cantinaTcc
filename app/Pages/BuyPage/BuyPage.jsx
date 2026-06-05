import SearchField from "../../Components/SearchField/SearchField"
import FilterTabs from "../../Components/FilterTabs/FilterTabs"
import FoodTable from "../../Components/FoodTable/FoodTable"
import { useState, useEffect } from "react"
import { useLoaderData } from "react-router"
import supabase from "../../supabaseClient"

export async function loader() {
  const { data, error } = await supabase.from('products').select('*');

  if (error) {
    console.error(`Erro ao buscar dados do Supabase na BuyPage: ${error.message}`);
    return [];
  }
  return data;
}

export default function BuyPage() {
  const products = useLoaderData();

  {/*Query do input de pesquisa.*/ }
  const [searchTxt, setSearch] = useState('');

  {/*Filtro da barra selecionado atualmente.*/ }
  const [filterTab, setFilterTab] = useState('todos');

  {/*Preço total do carrinho a ser somado ou mostrado.*/ }
  const [cartPrice, setCartPrice] = useState(0);

  const [cartProducts, setCartProducts] = useState([]);

  return (
    <>
      <SearchField
        setSearch={setSearch} />

      <FilterTabs
        selectedFilterTab={filterTab.trim().toLowerCase()}
        setFilterTab={setFilterTab} />

      <FoodTable
        products={products}
        filterTab={filterTab.trim().toLowerCase()}
        filterTxt={searchTxt.trim().toLowerCase()}
        setCartPrice={setCartPrice}
        cartPrice={parseFloat(cartPrice)}
        cartProducts={cartProducts}
        setCartProducts={setCartProducts}
      />
    </>
  )
}
