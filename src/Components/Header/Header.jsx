import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useState } from 'react';
import { RiShoppingCart2Fill, RiMoneyDollarBoxFill } from 'react-icons/ri';
import { Link } from 'react-router-dom'

// This profile Color creation script was taken from the MUI official website from its Avatar component page on MUI Material.
function stringToColor(string) {
    let hash = 0;
    /* eslint-disable no-bitwise */
    for (let i=0; i < string.length;i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (let i=0; i < 3;i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += value.toString(16).slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    let fullName = name.split(' ');
    let firstName = fullName[0][0];
    let secondName = fullName.length > 1 ? fullName[1][0] : '';

    return {
        sx: {
        bgcolor: stringToColor(name),
        },
        children: `${firstName}${secondName}`,
    };
}
// The MUI Avatar script ends here and is used later.

export default function Header({ cartPrice }) {
    const [anchorEl, setAnchorEl] = useState(null);
    
    const handleMenu = (e)=> setAnchorEl(e.currentTarget);
    const handleClose = ()=> setAnchorEl(null);
    const formatPrice = (price)=> {
        return price.toFixed(2).replace('.', ',')
    }

    return(
        <div
        className='d-flex justify-content-between m-2'>
            <div
            className='d-flex align-items-center'>
                <Link
                to='/profile'>
                    <IconButton
                    className='border-darken m-2 rounded'
                    size="large"
                    color="inherit">
                        <Avatar
                        {...stringAvatar('Paulo Victor')}
                        title='Paulo Victor'/>
                    </IconButton>
                </Link>
                <h1
                className='space-grotesk'>
                    Paulo
                </h1>
            </div>
            
            <IconButton
            className='border-darken m-2 rounded'
            size="large"
            onClick={handleMenu}
            color="inherit"
            >
                <RiShoppingCart2Fill
                className='fs-1'/>
            </IconButton>
            <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            keepMounted
            color='inherit'>
                <p
                className='fw-bold text-secondary mx-2'>
                    <RiMoneyDollarBoxFill
                    className='me-2 fs-4'/>
                    R$ {formatPrice(cartPrice)}
                </p>
                <Link
                to='/cart'
                className='text-dark text-decoration-none'>
                    <MenuItem
                    className='fw-bold'>
                        <RiShoppingCart2Fill
                        className='me-2 fs-4'/>
                        Carrinho
                    </MenuItem>
                </Link>
            </Menu>
            {/* <IconButton
            size='large'
            color='inherit'
            className='m-2 border-darken rounded'>
                <RiShoppingCart2Fill
                className='fs-1'/>
            </IconButton> */}
        </div>
    )
}