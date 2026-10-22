import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import "../../Pages/Orders/Orders.css";


export default function OrdersList({ orders, setActualOrder }) {
    return (
        <>
            <TableContainer className="bg-dark rounded-2 p-2">
                <Table>
                    
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow 
                            key={order.id} 
                            className='bg-white ordersRow'
                            onClick={() => setActualOrder(order.id - 1)}>
                                <TableCell align='center' className='fw-bold fs-6'>
                                    <span className="d-block text-muted small">ID</span>
                                    #{order.id}
                                </TableCell>
                                <TableCell align='center' className='fw-bold fs-6'>
                                    <span className="d-block text-muted small">Entrada</span>
                                    {order.entrance}
                                </TableCell>
                                <TableCell align='center' className='fw-bold fs-6'> 
                                    <span className="d-block text-muted small">Cliente</span>
                                    {order.customer.id}
                                </TableCell>
                                <TableCell align='center' className='fw-bold fs-6'>
                                    <span className="d-block text-muted small">Itens</span>
                                    {order.items.length}
                                </TableCell>
                                <TableCell align='center' className='fw-bold fs-6'>
                                    <span className="d-block text-muted small">Valor</span>
                                    R$ {order.price}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}