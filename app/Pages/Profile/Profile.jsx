import { useEffect, useState } from 'react';
import { loadLoggedInUser } from '../Login/Login';
import { stringAvatar } from '../../Components/Header/Header';
import { Avatar, Button, Checkbox, FormControlLabel } from '@mui/material';
import { RiLogoutBoxRFill, RiUserUnfollowFill } from 'react-icons/ri';
import { useNavigate } from 'react-router';
import Popup from '../../Components/Popup/Popup';
import supabase from '../../supabaseClient';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [shouldDelete, setShouldDelete] = useState(false);
    const [popup, setPopup] = useState({
        state: false,
        header: '',
        type: '',
        message: ''
    });

    useEffect(() => {
        const cachedUser = loadLoggedInUser();
        if (cachedUser) setUser(cachedUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        window.dispatchEvent(new Event('userLoggedIn'));
        navigate('/login');
    };

    const handleConfirmAction = async () => {
        if (!user) return;

        let error;

        if (shouldDelete) {
            const result = await supabase
                .from('users')
                .delete()
                .eq('name', user.name);
            error = result.error;
        } else {
            const result = await supabase
                .from('users')
                .update({ active: false })
                .eq('name', user.name);
            error = result.error;
        }

        if (error) {
            setPopup({
                state: true,
                header: 'Erro',
                type: 'error',
                message: `Erro ao processar a ação: ${error.message}`
            });
            return;
        }

        setPopup(prev => ({ ...prev, state: false }));
        handleLogout();
    };

    const openDeleteConfirmation = () => {
        setPopup({
            state: true,
            header: 'Confirmar Ação na Conta',
            type: 'confirm',
            message: ''
        });
    };

    return (
        <>
            <Popup
                state={popup.state}
                setState={setPopup}
                header={popup.header}
            >
                {popup.type === 'confirm' && (
                    <div className="d-flex flex-column gap-3 p-2">
                        <p className="m-0">
                            {shouldDelete
                                ? 'Sua conta será permanentemente excluída do banco de dados.'
                                : 'Sua conta será desativada e você não poderá realizar o login.'}
                        </p>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={shouldDelete}
                                    onChange={(e) => setShouldDelete(e.target.checked)}
                                    color="error"
                                />
                            }
                            label="Desejo excluir a conta do banco de dados"
                        />

                        <div className="d-flex justify-content-end gap-2 mt-2">
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => setPopup(prev => ({ ...prev, state: false }))}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleConfirmAction}
                            >
                                {shouldDelete ? 'Excluir' : 'Desativar'}
                            </Button>
                        </div>
                    </div>
                )}

                {popup.type === 'error' && (
                    <p className="p-2 m-0 text-danger">{popup.message}</p>
                )}
            </Popup>

            {user ? (
                <div className='d-flex justify-content-center align-items-center flex-column'>
                    <div className='bg-new-orange rounded-2 p-2 m-2'>
                        <Avatar {...stringAvatar(user.name || 'User')} />
                    </div>
                    <h2>
                        Bem-vindo, {user.name}!
                    </h2>
                    <div className='m-2 p-2 d-flex justify-content-center align-items-center gap-2 rounded-2 border-darken shadow w-90 flex-wrap'>
                        <Button
                            variant="contained"
                            color="warning"
                            className="fs-6"
                            onClick={handleLogout}
                        >
                            <RiLogoutBoxRFill className="me-2" />
                            Sair
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            className="fs-6"
                            onClick={openDeleteConfirmation}
                        >
                            <RiUserUnfollowFill className="me-2" />
                            Deletar Conta
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-center mt-4 fs-5">
                    Nenhum usuário conectado.
                </p>
            )}
        </>
    );
}