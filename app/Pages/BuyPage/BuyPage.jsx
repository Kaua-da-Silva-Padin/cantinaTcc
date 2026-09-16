import SearchField from "../../Components/SearchField/SearchField"
import FilterTabs from "../../Components/FilterTabs/FilterTabs"
import FoodTable from "../../Components/FoodTable/FoodTable"
import { useState, useEffect } from "react"
import { useLoaderData, useNavigate } from "react-router"
import supabase from "../../supabaseClient"
import { loadLoggedInUser } from '../Login/Login'

export async function loader() {
  const { data, error } = await supabase.from('products').select('*');

  if (error) {
    console.error(`Erro ao buscar dados do Supabase na BuyPage: ${error.message}`);
    return [];
  }
  return data;
}

export default function BuyPage() {
  const navigate = useNavigate();
  const products = useLoaderData();

  // 1. Initialize user synchronously from storage
  const [user, setUser] = useState(() => loadLoggedInUser());

  // 2. State for search and filter
  const [searchTxt, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('todos');

  // 3. Cart state
  const [cartPrice, setCartPrice] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);

  return (
    <>
      {user ? (
        <div>
          <SearchField
            setSearch={setSearch}
            products={products}
          />

          <FilterTabs
            selectedFilterTab={filterTab.trim().toLowerCase()}
            setFilterTab={setFilterTab}
          />

          <FoodTable
            products={products}
            filterTab={filterTab.trim().toLowerCase()}
            filterTxt={searchTxt.trim().toLowerCase()}
            setCartPrice={setCartPrice}
            cartPrice={parseFloat(cartPrice)}
            cartProducts={cartProducts}
            setCartProducts={setCartProducts}
            user={user}
          />
        </div>
      ) : (
        <div className="text-center my-4">
          <h4 className="text-danger mb-3">
            Você <b>precisa</b> estar logado para fazer seu pedido!
          </h4>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Ir para o Login
          </button>
        </div>
      )}
    </>
  );
}