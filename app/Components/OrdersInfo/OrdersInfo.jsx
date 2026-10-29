import TableContainer from '@mui/material/TableContainer';
import Table from "@mui/material/Table";
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import Button from '@mui/material/Button';
// Make it a table!!!
function FirstRow({ order }) {
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
                            <TableCell className="fs-3">{order?.user_name}</TableCell>
                            <TableCell className="fs-3">{"id"}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="data-display fs-2 d-flex justify-content-center align-items-center">
                #{order?.id}
            </div>
        </div>
    )
}

export default function OrderInfo({ order }){
    const orderInfo = (
    <div className="order-info bg-dark text-light p-2">
        <FirstRow 
            order={order ? order : undefined}
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
                        {order ? order?.items.map((item) =>
                            <TableRow>
                                <TableCell>{"not yet"}</TableCell>
                                <TableCell>{item?.product_name}</TableCell>
                                <TableCell>{item?.price_unit}</TableCell>
                                <TableCell>{item?.qty}</TableCell>
                                <TableCell>{item?.price_total}</TableCell>
                            </TableRow>
                        ) : <TableRow> <TableCell> Hi</TableCell> </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 3fr"
        }}>
            <div className="data-display d-flex justify-content-center align-items-center fs-2">
                R$ {order?.total_price}
            </div>
            <div className="d-flex justify-content-center align-items-center fs-2">
                <Button variant="containted" className="fs-2 p-3 fw-bold" sx={{
                    bgcolor: "pink",
                    color: "black",
                    width: "90%"
                }}>Finalizar</Button>
            </div>
        </div>
    </div>)
    const noOrderInfo = (<div className="order-info bg-dark text-light p-2">
        <h2> Selecione um pedido! </h2>
    </div>)
    return (order ? orderInfo : noOrderInfo);
}