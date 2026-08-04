import * as React from 'react';
import { Box, SwipeableDrawer, Button, List, Divider, ListItem, ListItemButton, ListItemText } from '@mui/material';
import FoodList from '../FoodList/FoodList';
import { FaCartShopping } from 'react-icons/fa6';
import ProductBadge from '../ProductBadge/ProductBadge';

export default function SwipeableTemporaryDrawer({ page, productPopup, cartProducts, setCartProducts, setCartPrice, cartPrice }) {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const [allLenCart, setAllLenCart] = React.useState(0);

    const toggleDrawer = (anchor, open) => (event) => {
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300 }}
            role="presentation"
            onClick={toggleDrawer(anchor, true)}
        >
            <FoodList
            cartProducts={cartProducts}
            setCartProducts={setCartProducts}
            setCartPrice={setCartPrice} 
            cartPrice={cartPrice} />
        </Box>
    );

    const getAllLenCart = ()=> {
        let newValue = 0;
        cartProducts.forEach(product => {
            newValue += product.quantity;
        })
        setAllLenCart(newValue);
    }

    React.useEffect(()=>{
        getAllLenCart();
    },[cartProducts])

    return (
        <div style={page === '/buy' ? { visibility: 'visible', position: 'absolute', right: '28px', top: '15px' } : { visibility: "hidden" }}>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <ProductBadge
                    productQuantity={allLenCart}>
                        <Button
                        onClick={toggleDrawer(anchor, true)}
                        variant="contained"
                        sx={{
                            borderRadius: '20px',
                            textTransform: 'none',
                            padding: '1em 0em'
                        }}>
                            <FaCartShopping
                            className='fs-4'/>
                        </Button>
                    </ProductBadge>
                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                        PaperProps={{
                            sx: {
                            width: 300,
                            },
                        }}
                    >

                        {list(anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
        </div>
    );
}
