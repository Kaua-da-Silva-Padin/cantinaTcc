import Grid from "@mui/material/Grid";

import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import './OrdersInfo.css'
import Table from "@mui/material/Table";

function FirstRow({ customerName, customerId, orderId }) {
    return (
        <div className="first-row">
            <div className="data-display">
                Nome: {customerName}
                <br/>
                Código: {customerId}
            </div>
    
            <div className="data-display">
                #{orderId}
            </div>
        </div>    
    );
}

export default function OrderInfo({ order }){

    return (
    <>
    <div className="order-info bg-dark text-light p-2">
        <FirstRow 
            customerName={order.customer.name}
            customerId={order.customer.id}
            orderId={order.id}
        />

        
        <div className="data-display">
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Valor un.</TableCell>
                            <TableCell>Qtde</TableCell>
                            <TableCell>Valor</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <div size={12} className="data-display">
            a
        </div>
    </div>


    </>);
}