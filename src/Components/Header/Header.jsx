import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useState } from 'react';
import { RiShoppingCart2Fill, RiMoneyDollarBoxFill } from 'react-icons/ri';

function stringToColor(string) {
    let hash = 0;
    /* eslint-disable no-bitwise */
    for (let i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (let i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
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
                <IconButton
                className='border-darken m-2 rounded'
                size="large"
                color="inherit">
                    <Avatar
                    {...stringAvatar('Kauã Padin')}/>
                </IconButton>
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
                    R$ {formatPrice(parseFloat(cartPrice))}
                </p>
                <MenuItem
                className='fw-bold'>
                    <RiShoppingCart2Fill
                    className='me-2 fs-4'/>
                    Carrinho
                </MenuItem>
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