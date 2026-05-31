import Grid from "@mui/material/Grid";
import './OrdersInfo.css'
export default function OrderInfo({ order }){

    return (
    <>
    <Grid container spacing={2}
    className="bg-dark text-light rounded-2 p-2">
        <Grid size={8} className="data-display">
            <div>
                Nome: {order.customer.name}    
            </div>
            <div>
                Código: {order.customer.id}
            </div>
        </Grid>
        <Grid size={4}  className="data-display">
            #{order.id}
        </Grid>
        <Grid size={12} className="data-display">

        </Grid>
        <Grid size={12} className="data-display">

        </Grid>
    </Grid>
    </>);
}