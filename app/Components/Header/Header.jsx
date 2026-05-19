// app/Components/Header/Header.jsx
import { Avatar, SpeedDial, SpeedDialIcon, SpeedDialAction, Backdrop, ScopedCssBaseline } from '@mui/material';
import { RiShoppingCart2Fill, RiMenuFill, RiCloseFill, RiHomeFill, RiAdminFill, RiTableView } from 'react-icons/ri';
import { useState } from 'react';
import { Link } from 'react-router'; 

function stringToColor(string, n) {
    if (!string) return '#000000';
    let hash = 0;
    for (let i=0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    n = (n == undefined || n == 0) ? 1 : n;
    for (let i=0; i < 3; i++) {
        const value = (hash >> (i * 8 / n)) & 0xff;
        color += value.toString(16).slice(-2);
    }
    return color;
}

function stringAvatar(name) {
    if (!name) return { children: '' };
    let fullName = name.split(' ');
    // Pega a primeira letra do primeiro nome [0][0]
    let firstNameChar = fullName[0] && fullName[0][0] ? fullName[0][0].toUpperCase() : '';
    // Pega a primeira letra do segundo nome se existir [1][0]
    let secondNameChar = fullName[1] && fullName[1][0] ? fullName[1][0].toUpperCase() : '';

    return {
        sx: {
            background: `linear-gradient(${stringToColor(name, 2)}, ${stringToColor(name, 4)})`,
        },
        children: `${firstNameChar}${secondNameChar}`,
    };
}


const actions = [
    { icon: <RiHomeFill />, name: 'Home', link: '/' },
    { icon: <RiShoppingCart2Fill />, name: 'Cantina', link: '/buy' },
    { icon: <RiAdminFill />, name: 'Admin', link: '/adm' },
    { icon: <RiTableView />, name: 'Pedidos', link: '/orders'},
    { icon: <Avatar {...stringAvatar('João Paulo')} />, name: 'Perfil', link: '/profile' },,
]

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <ScopedCssBaseline>
            <div className='d-flex justify-content-center gap-2 mb-2 p-2 border-darken-b'>
                <Backdrop
                open={open}
                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}
                onClick={() => setOpen(false)}
                />
                
                <SpeedDial
                ariaLabel='headerMenu'
                direction='down'
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                sx={{ position: 'fixed', top: 10, left: 16, zIndex: 1000 }}
                FabProps={{ onClick: () => setOpen(!open) }}
                icon={
                    <SpeedDialIcon
                    className='text-center d-flex justify-content-center align-items-center fs-2'
                    icon={<RiMenuFill/>}
                    openIcon={<RiCloseFill/>}/>
                }>
                    {actions.map((action) => (
                        <SpeedDialAction
                        key={action.name}
                        icon={
                            <Link to={action.link} className="text-light d-flex align-items-center justify-content-center w-100 h-100 text-decoration-none">
                                {action.icon}
                            </Link>
                        }
                        tooltipTitle={action.name}
                        tooltipOpen={true}
                        tooltipPlacement="right"
                        className='text-center d-flex justify-content-center align-items-center fs-4 bg-primary text-light'
                        onClick={() => setOpen(false)}/>
                    ))}

                </SpeedDial>

                <h1 className='space-grotesk fw-bold'>
                    CantinaTec
                </h1>
            </div>
        </ScopedCssBaseline>
    )
}
