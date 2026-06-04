import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider'
import { bold } from '@cloudinary/url-gen/qualifiers/fontWeight';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function OrdersList({ orders }) {
    const divider = (
        <Divider 
        orientation='vertical' 
        sx={{border: "1px solid darkgray"}} 
        flexItem />)

    return (
        <>
        <TableContainer 
        className="bg-dark rounded-2 p-2">
        <Table>
            <TableHead> 

                <TableRow className='bg-white' key="24">
                    
                    {['ID', 'Entrada', 'Cliente', 'Itens', 'Valor'].map(txt => 
                        <TableCell 
                        className='fw-bold fs-5' 
                        align='center'>
                            {txt}
                        </TableCell>
                    )}
                </TableRow>
            </TableHead>
            
            <TableBody>
                {orders.map((order) => 
                    <TableRow 
                    key={order.id}
                    className='bg-white'
                    divider={<Divider 
                    orientation='vertical' 
                    sx={{border: "1px solid darkgray"}} 
                    flexItem />}
                    >
                        <TableCell align='center' className='fw-bold fs-6'>#{order.id}</TableCell>
                        <TableCell align='center' className='fw-bold fs-6'>{order.entrance}</TableCell>
                        <TableCell align='center' className='fw-bold fs-6'>{order.customer.id}</TableCell>
                        <TableCell align='center' className='fw-bold fs-6'>{order.items.length}</TableCell>
                        <TableCell align='center' className='fw-bold fs-6'>R$ {order.price}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
        </TableContainer>
        {/*<Stack spacing={1}>
        { orders.map(orderData => 
            <SingleOrder 
            id={orderData.id}
            entrance={orderData.entrance}
            customerId={orderData.customer.id}
            productsLength={orderData.products.length} // Shows how many products are there
            price={orderData.price}
            />)
            }
            </Stack> */}
        </>);
    }