import { IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { RiUserFill, RiShoppingCart2Fill } from 'react-icons/ri';

export default function Header() {
    const [anchorEl, setAnchorEl] = useState(null);
    
    const handleMenu = (e)=> setAnchorEl(e.currentTarget);
    const handleClose = ()=> setAnchorEl(null);

    return(
        <div
        className='d-flex justify-content-between m-2'>
            <div
            className='d-flex align-items-center'>
                <IconButton
                className='border-darken m-2 rounded'
                size="large"
                onClick={handleMenu}
                color="inherit"
                >
                    <RiUserFill
                    className='fs-1'/>
                </IconButton>
                <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                keepMounted
                color='inherit'>
                    <MenuItem>
                        Profile
                    </MenuItem>
                </Menu>
                <h1
                className='space-grotesk'>
                    Paulo
                </h1>
            </div>
            
            <IconButton
            size='large'
            color='inherit'
            className='m-2 border-darken rounded'>
                <RiShoppingCart2Fill
                className='fs-1'/>
            </IconButton>
        </div>
    )
}