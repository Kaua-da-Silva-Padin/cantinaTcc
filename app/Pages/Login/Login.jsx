import { RiCloseFill, RiDoorOpenFill, RiEyeFill, RiEyeCloseFill, RiLockPasswordFill, RiUserFill, RiCheckFill } from 'react-icons/ri';
import { TextField, Button, Select, MenuItem } from '@mui/material';
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
    const [rmShowing, setRmShowing] = useState(false);
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("user");
    const [rm, setRM] = useState("");
    const [popup, setPopup] = useState({
        'content': null,
        'header': '',
        'state': false
    });
    const navigate = useNavigate();

    const loginUser = async () => {
        const hashedPassword = await sha256(password);
        const hashedRM = await sha256(rm);

        const { data, error } = await supabase
        .from('users')
        .select()
        .eq('type', userType)
        .eq('rm', hashedRM)
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
        await loginUser();
    };

    const handleUserTypeChange = e => {
        setRM('');
        setUserType(e.target.value);
    };
    const handlePasswordChange = e => setPassword(e.target.value);
    const handleRMChange = e => setRM(e.target.value);

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
                                style={{borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}}
                            >
                                <label htmlFor="typeUser" className='fs-5 mx-2 fw-bold'>
                                    Tipo de usuário
                                </label>
                            </li>
                            <li className='list-group-item mb-3'>
                                <Select
                                    value={userType}
                                    id="typeUser"
                                    name="typeUser"
                                    onChange={handleUserTypeChange}
                                    className='m-2'
                                    fullWidth
                                >
                                    <MenuItem value="user">Aluno</MenuItem>
                                    <MenuItem value="admin">Administrador</MenuItem>
                                </Select>
                            </li>
                            <li
                            className='list-group-item'
                            style={{borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}}>
                                <label htmlFor="password" className='fs-5 mx-2 fw-bold'>
                                    <RiLockPasswordFill className='me-2'/>
                                    Senha
                                </label>
                            </li>
                            <li className='list-group-item d-flex align-items-center'>
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
                            {userType === 'user' &&
                            <>
                                <li
                                className='list-group-item mt-3'
                                style={{borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}}>
                                    <label htmlFor="rm" className='fs-5 mx-2 fw-bold'>
                                        <RiLockPasswordFill className='me-2'/>
                                        RM
                                    </label>
                                </li>
                                <li className='list-group-item d-flex align-items-center mb-3'>
                                    <TextField
                                    onChange={handleRMChange}
                                    name='rm'
                                    id='rm'
                                    required
                                    type={!rmShowing ? 'password' : 'text'}
                                    className='ms-2 my-2'
                                    label='RM do aluno'
                                    fullWidth/>
                                    <Button
                                    variant='outlined'
                                    className='py-2'
                                    color='inherit'
                                    onClick={() => setRmShowing(!rmShowing)}>
                                        {
                                            !rmShowing ?
                                            <RiEyeCloseFill className='text-secondary fs-2 text-center'/>
                                            :
                                            <RiEyeFill className='text-dark fs-2 text-center'/>
                                        }
                                    </Button>
                                </li>
                            </>
                            }
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