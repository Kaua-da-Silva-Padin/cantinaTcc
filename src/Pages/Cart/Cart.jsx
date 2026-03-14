import FoodList from "../../Components/FoodList/FoodList"
import Header from '../../Components/Header/Header';

export default function Cart() {
    return(
        <>
            <Header
            cartPrice={0}/>
            <FoodList/>
        </>
    )
}