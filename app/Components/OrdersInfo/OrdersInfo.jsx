import TableContainer from '@mui/material/TableContainer';
import Table from "@mui/material/Table";
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import Button from '@mui/material/Button';
// Make it a table!!!
function FirstRow({ customerName, customerId, orderId }) {
    const classes="data-display fs-3";
    const style={
        display: "grid",
        gridTemplateRows: "1fr 1fr",
        gridTemplateColumns: "1fr 3fr"
    };

    return (
        <div className="first-row">
            <TableContainer className="data-display">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Código</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className="fs-3">{customerName}</TableCell>
                            <TableCell className="fs-3">{customerId}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="data-display fs-2 d-flex justify-content-center align-items-center">
                #{orderId}
            </div>
        </div>
    )
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
                        {order.items.map((item) =>
                            <TableRow>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>[]</TableCell>
                                <TableCell>[]</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>[]</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 3fr"
        }}>
            <div className="data-display d-flex justify-content-center align-items-center fs-2">
                R$ {order.price}
            </div>
            <div className="d-flex justify-content-center align-items-center fs-2">
                <Button variant="containted" className="fs-2 p-3 fw-bold" sx={{
                    bgcolor: "pink",
                    color: "black",
                    width: "90%"
                }}>Finalizar</Button>
            </div>
        </div>
    </div>
    </>);
}