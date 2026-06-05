import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import FoodList from '../FoodList/FoodList';
import { FaCartShopping } from 'react-icons/fa6';

export default function SwipeableTemporaryDrawer({ page, productPopup, cartProducts, setCartProducts }) {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, true)}
        >
            <FoodList cartProducts={cartProducts} />
        </Box>
    );

    return (
        <div style={page === '/buy' ? { visibility: 'visible', position: 'absolute', right: '16px', top: '25px' } : { visibility: "hidden" }}>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button
                        onClick={toggleDrawer(anchor, true)}
                        variant="contained"
                        sx={{
                            borderRadius: '20px',
                            textTransform: 'none',
                            padding: '1em 0em'
                        }}
                    >
                        <FaCartShopping />
                    </Button>
                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                    >

                        {list(anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
        </div>
    );
}
