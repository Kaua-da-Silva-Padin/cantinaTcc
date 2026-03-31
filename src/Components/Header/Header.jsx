import {Avatar, SpeedDial, SpeedDialIcon, SpeedDialAction, Backdrop } from '@mui/material';
import { RiShoppingCart2Fill, RiMenuFill, RiCloseFill, RiHomeFill } from 'react-icons/ri';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

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


const actions = [
    { icon: <RiHomeFill />, name: 'Home', link: '/' },
    { icon: <RiShoppingCart2Fill />, name: 'Cantina', link: '/buy' },
    { icon: <Avatar {...stringAvatar('João Paulo')} />, name: 'Perfil', link: '/profile' },
]

export default function Header({ cartPrice }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // const formatPrice = (price)=> {
    //     return price.toFixed(2).replace('.', ',')
    // }

    const handleActionClick = (link) => {
        navigate(link);
        setOpen(false);
    }

    return(
        <div
        className='d-flex justify-content-center gap-2 mb-2 p-2 border-darken-b'>
            <Backdrop
            open={open}
            sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 999
            }}/>
            <SpeedDial
            ariaLabel='headerMenu'
            direction='down'
            open={open}
            onOpen={() => {}}
            onClose={() => {}}
            sx={{
                position:'fixed',
                top: 10,
                left: 16,
            }}
            FabProps={{
                onClick: () => setOpen(!open)
            }}
            icon={
                <SpeedDialIcon
                className='text-center d-flex justify-content-center align-items-center fs-2'
                icon={<RiMenuFill/>}
                openIcon={<RiCloseFill/>}/>
            }>
                {actions.map((action) => (
                    <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    onClick={() => handleActionClick(action.link)}
                    tooltipTitle={action.name}
                    tooltipOpen={true}
                    tooltipPlacement="right"
                    className='text-center d-flex justify-content-center align-items-center fs-4 bg-primary text-light'
                    />
                ))}
            </SpeedDial>

            <Link
            to='/'
            className='text-dark text-decoration-none'>
                <h1
                className='space-grotesk fw-bold'>
                    CantinaTec
                </h1>
            </Link>
            
            {/* <div className="d-flex justify-content-center align-items-center">
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
            </div> */}
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