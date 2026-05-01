import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

function OrderElement({}) {
    return 
}

export default function OrdersList() {
    return (
    <>
        <Box 
        className="bg-dark text-light rounded-2 p-2 mx-2">
            <Stack spacing={2}>
                <OrderElement />
            </Stack>
        </Box>
    </>);
}