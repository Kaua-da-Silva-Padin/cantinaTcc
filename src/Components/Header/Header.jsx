import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useState } from 'react';
import { RiShoppingCart2Fill, RiMenuFill, RiHomeFill } from 'react-icons/ri';
import { Link } from 'react-router-dom'

// This profile Color creation script was taken from the MUI official website from its Avatar component page on MUI Material.
function stringToColor(string, n) {
    let hash = 0;
    /* eslint-disable no-bitwise */
    for (let i=0; i < string.length;i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    n == undefined || n == 0 ? n = 1 : '';

    for (let i=0; i < 3;i++) {
        const value = (hash >> (i * 8 / n)) & 0xff;
        color += value.toString(16).slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    let fullName = name.split(' ');
    let firstNameChar = fullName[0][0].toUpperCase();
    let secondNameChar = fullName.length > 1 ? fullName[1][0].toUpperCase() : '';

    return {
        sx: {
        background: `linear-gradient(${stringToColor(name, 2)}, ${stringToColor(name, 4)})`,
        },
        children: `${firstNameChar}${secondNameChar}`,
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
        className='d-flex justify-content-between mb-2 p-2'>
            <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit">
                <RiMenuFill
                className='text-dark fs-1'/>
            </IconButton>
            <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            keepMounted
            color='inherit'>
                <MenuItem>
                    <Link
                    to='/'
                    className='text-dark text-decoration-none'>
                        <IconButton
                        color='inherit'>
                            {/*Substituir este ícone pela logo do site*/}
                            <RiHomeFill
                            className='me-2 fs-1'/>
                            Home
                            {/* <img
                            src=""
                            alt="" /> */}
                        </IconButton>
                    </Link>
                </MenuItem>
                <MenuItem>
                    <Link
                    to='/profile'
                    className='text-dark text-decoration-none'>
                        <IconButton
                        color="inherit">
                            <Avatar
                            {...stringAvatar('João Pedro')}
                            title='Paulo Victor'
                            className='me-2'/>
                            João Pedro
                        </IconButton>
                    </Link>
                </MenuItem>
            </Menu>

            <h1
            className='space-grotesk fw-bold'>
                CantinaShop
            </h1>
            
            <div className="d-flex justify-content-center align-items-center">
                <h5
                className='space-grotesk'>
                    R$ {formatPrice(cartPrice)}
                </h5>
                <Link
                to='/cart'>
                    <IconButton
                    size="large"
                    color="inherit"
                    >
                        <RiShoppingCart2Fill
                        className='text-dark fs-1'/>
                    </IconButton>
                </Link>
            </div>
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