import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider'
import { bold } from '@cloudinary/url-gen/qualifiers/fontWeight';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function SingleOrder({ id, entrance, customerId, productsLength, price }) {
    
    const style = {
        background: "#ffffff",
        color: "#000000",
        fontWeight: "bold",
        fontSize: "1.5em",
        borderRadius: ".4em",
        justifyContent: "space-evenly",
    };
    
    const divider = (
        <Divider 
        orientation='vertical' 
        sx={{border: "1px solid darkgray"}} 
        flexItem />
    );
    
    // Will be replaced by Table
    return (
        <Stack
        className='py-2'
        direction="row"
        divider={divider}
        spacing={2}
        sx={style}
        >
        <span># {id}</span>
        <span>{entrance}</span>
        <span>{customerId}</span>
        <span>{productsLength}</span>
        <span>R$ {price}</span>
        </Stack>
    );
}

export default function OrdersList({ orders }) {
    return (
        <>
        <div 
        className="bg-dark text-light rounded-2 p-2 mx-2"
        style={{
            height: 600,
            width: 600
        }}
        >
        <TableHead>
            
        </TableHead>
        <Stack spacing={1}>
        { orders.map(orderData => 
            <SingleOrder 
            id={orderData.id}
            entrance={orderData.entrance}
            customerId={orderData.customer.id}
            productsLength={orderData.products.length} // Shows how many products are there
            price={orderData.price}
            />)
        }
        </Stack>
        </div>
        </>);
    }