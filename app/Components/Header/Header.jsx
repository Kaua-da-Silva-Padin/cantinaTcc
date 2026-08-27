// app/Components/Header/Header.jsx
import { Avatar, SpeedDial, SpeedDialIcon, SpeedDialAction, Backdrop, ScopedCssBaseline } from '@mui/material';
import { RiShoppingCart2Fill, RiMenuFill, RiCloseFill, RiHomeFill, RiAdminFill, RiTableView, RiUserFill, RiUserAddFill } from 'react-icons/ri';
import { useState, useEffect } from 'react';
import { Link } from 'react-router'; 
import SwipeableTemporaryDrawer from "../SwipeableDrawer/SwipeableDrawer";
import { loadLoggedInUser } from '../../Pages/Login/Login';

function stringToColor(string, n) {
    if (!string) return '#000000';
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    n = (n === undefined || n === 0) ? 1 : n;
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8 / n)) & 0xff;
        color += value.toString(16).slice(-2);
    }
    return color;
}

export function stringAvatar(name) {
    if (!name) return { children: '' };
    let fullName = name.split(' ');
    let firstNameChar = fullName[0] && fullName[0][0] ? fullName[0][0].toUpperCase() : '';
    let secondNameChar = fullName[1] && fullName[1][0] ? fullName[1][0].toUpperCase() : '';

    return {
        sx: {
            background: `linear-gradient(${stringToColor(name, 2)}, ${stringToColor(name, 4)})`,
        },
        children: `${firstNameChar}${secondNameChar}`,
    };
}

export default function Header(props) {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);

    const checkUser = () => {
        const cachedUser = loadLoggedInUser();
        if (cachedUser) {
            setUser(cachedUser);
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        // Check user on initial load
        checkUser();

        // Listen for storage changes (handles multi-tab or custom login triggers)
        window.addEventListener('storage', checkUser);
        
        // Custom event listener if your login page triggers an update event manually
        window.addEventListener('userLoggedIn', checkUser);

        return () => {
            window.removeEventListener('storage', checkUser);
            window.removeEventListener('userLoggedIn', checkUser);
        };
    }, []);

    const actions = [
        { icon: <RiHomeFill />, name: 'Home', link: '/home' },
        { icon: <RiUserAddFill />, name: 'Registrar', link: '/' },
        { icon: <RiUserFill />, name: 'Login', link: '/login' },
        { icon: <RiShoppingCart2Fill />, name: 'Cantina', link: '/buy' },
        { icon: <RiAdminFill />, name: 'Admin', link: '/adm' },
        { icon: <RiTableView />, name: 'Pedidos', link: '/orders' },
        user ? { icon: <Avatar {...stringAvatar(user.name || 'User')} />, name: 'Perfil', link: '/profile' } : null
    ].filter(Boolean);

    return (
        <ScopedCssBaseline>
            <div 
                className='d-flex justify-content-center gap-2 mb-2 p-2 border-darken-b' 
                style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}
            >
                <Backdrop
                    open={open}
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}
                    onClick={() => setOpen(false)}
                />
                
                <SpeedDial
                    ariaLabel='headerMenu'
                    direction='down'
                    open={open}
                    onOpen={() => {}}
                    onClose={(e, reason) => {
                        if (reason === 'toggle') setOpen(false);
                    }}
                    sx={{ position: 'fixed', top: 10, left: 16, zIndex: 1000 }}
                    FabProps={{ onClick: () => setOpen(!open) }}
                    icon={
                        <SpeedDialIcon
                            className='text-center d-flex justify-content-center align-items-center fs-2'
                            icon={<RiMenuFill />}
                            openIcon={<RiCloseFill />}
                        />
                    }
                >
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
                            onClick={() => setOpen(false)}
                        />
                    ))}
                </SpeedDial>
                
                <div>
                    <h1 className='space-grotesk fw-bold'>
                        <Link to='/home' className='text-decoration-none text-dark'>
                            <img
                                src="/imgs/coxinhaFormada.png"
                                alt="Imagem de uma Coxinha Formada" 
                                width={80}
                                className='me-2'
                            />
                            CantinaTec
                        </Link>
                    </h1>
                </div>
            </div>
        </ScopedCssBaseline>
    );
}