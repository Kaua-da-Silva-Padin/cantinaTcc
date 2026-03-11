import FoodList from "../../Components/FoodList/FoodList"
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { RiArrowLeftFill } from 'react-icons/ri';

export default function Cart() {
    return(
        <>
            <Link
            to='/'>
                <IconButton
                className='text-light bg-danger rounded p-2 m-2'
                style={{
                    transition: 'all 1s ease-out'
                }}
                sx={{
                    ':active ': {
                        scale: .9
                    }
                }}>
                    <RiArrowLeftFill
                    className="me-1"/>
                    Voltar
                </IconButton>
            </Link>
            <FoodList/>
        </>
    )
}