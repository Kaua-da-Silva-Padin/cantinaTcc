import { RiCloseFill, RiDoorOpenFill, RiEyeFill, RiEyeCloseFill, RiLockPasswordFill, RiUserFill, RiCheckFill } from 'react-icons/ri';
import { TextField, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Popup from '../../Components/Popup/Popup';
import supabase from '../../supabaseClient';

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); 
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export default function Login() {
    const [passwordShowing, setPasswordShowing] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [popup, setPopup] = useState({
        'content': null,
        'header': '',
        'state': false
    });
    const navigate = useNavigate();

    const loginUser = async (username, password) => {
        if (!username.trim() || !password.trim()) {
            setPopup({
                content: 'Por favor preencha todos os campos antes de continuar.',
                header: (
                    <h2 className='text-danger'>
                        <RiCloseFill className='me-2'/>
                        Campos Vazios!
                    </h2>
                ),
                state: true
            });
            return { success: false };
        }

        const hashedPassword = await sha256(password);

        const { data, error } = await supabase
        .from('users')
        .select()
        .eq('name', username.trim())
        .eq('password', hashedPassword);

        if (error) {
            console.error("Erro no Supabase:", error.message);
            setPopup({
                content: 'Erro de conexão com o banco de dados.',
                header: (
                    <h2 className='text-danger'>
                        <RiCloseFill className='me-2'/>
                        Erro de Sistema
                    </h2>
                ),
                state: true
            });
            return { success: false };
        }

        if (!data || data.length === 0) {
            setPopup({
                content: 'Usuário ou senha incorretos.',
                header: (
                    <h2 className='text-danger'>
                        <RiCloseFill className='me-2'/>
                        Falha no Login
                    </h2>
                ),
                state: true
            });
            return { success: false };
        }

        const user = data[0];

        // Format and show user info in the popup content
        setPopup({
            content: (
                <div>
                    <p className='fw-bold mb-1'>Bem-vindo(a), {user.name}!</p>
                    <p className='mb-0 text-secondary'>
                        Tipo: {user.type}
                    </p>
                </div>
            ),
            header: (
                <h2 className='text-success'>
                    <RiCheckFill className='me-2'/>
                    Login Realizado!
                </h2>
            ),
            state: true
        });

        setTimeout(() => navigate('/profile'), 2000);

        return { success: true, user };
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await loginUser(username, password);
    };

    const handleUsernameChange = e => setUsername(e.target.value);
    const handlePasswordChange = e => setPassword(e.target.value);

    return (
        <div className="d-flex justify-content-center align-items-center">
            <Popup
            state={popup.state}
            setState={setPopup}
            header={popup.header}>
                {popup.content}
            </Popup>
            <div className="rounded-2 m-2 p-2 border-darken bg-light w-100">
                <form onSubmit={handleFormSubmit}>
                    <h2>
                        <RiUserFill className='me-2'/>
                        Login de Usuário
                    </h2>
                    <hr />
                    <div className='d-flex justify-content-center align-items-center'>
                        <ul className='list-group w-100'>
                            <li
                            className='list-group-item'
                            style={{borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}}>
                                <label htmlFor="username" className='fs-5 mx-2 fw-bold'>
                                    <RiUserFill className='me-2'/>
                                    Nome
                                </label>
                            </li>
                            <li className='list-group-item mb-3'>
                                <TextField
                                onChange={handleUsernameChange}
                                value={username}
                                type='text'
                                label='Nome'
                                id='username'
                                name='username'
                                className='m-2'
                                fullWidth/>
                            </li>
                            <li
                            className='list-group-item'
                            style={{borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}}>
                                <label htmlFor="password" className='fs-5 mx-2 fw-bold'>
                                    <RiLockPasswordFill className='me-2'/>
                                    Senha
                                </label>
                            </li>
                            <li className='list-group-item d-flex align-items-center mb-3'>
                                <TextField
                                onChange={handlePasswordChange}
                                value={password}
                                name='password'
                                id='password'
                                type={!passwordShowing ? 'password' : 'text'}
                                className='ms-2 my-2'
                                label='Senha'
                                fullWidth/>
                                <Button
                                variant='outlined'
                                className='py-2'
                                color='inherit'
                                onClick={() => setPasswordShowing(!passwordShowing)}>
                                    {
                                        !passwordShowing ?
                                        <RiEyeCloseFill className='text-secondary fs-2 text-center'/>
                                        :
                                        <RiEyeFill className='text-dark fs-2 text-center'/>
                                    }
                                </Button>
                            </li>
                        </ul>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <Button
                        type='submit'
                        variant='contained'
                        color='success'
                        className='fs-5'>
                            <RiDoorOpenFill className='me-2'/>
                            Login
                        </Button>
                        <Button
                        type='reset'
                        variant='contained'
                        color='error'
                        className='fs-5'
                        onClick={() => {
                                setUsername('');
                                setPassword('');
                            }}
                        >
                            <RiCloseFill className='me-2'/>
                            Limpar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}