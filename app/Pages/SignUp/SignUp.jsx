import { RiUserAddFill, RiCloseFill, RiAddFill, RiEyeFill, RiEyeCloseFill, RiLockPasswordFill, RiUserFill } from 'react-icons/ri';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Popup from '../../Components/Popup/Popup';
import supabase from '../../supabaseClient';
import { sha256, loadLoggedInUser } from '../Login/Login';

export default function SignUp() {
    const navigate = useNavigate();
    const [passwordShowing, setPasswordShowing] = useState(false);
    const [rmShowing, setRmShowing] = useState(false);
    const [userType, setUserType] = useState("user");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rm, setRM] = useState("");
    const [popup, setPopup] = useState({
        content: '',
        header: '',
        state: false
    });

    const currentUser = loadLoggedInUser();

    const registerUser = async () => {
        const trimmedUsername = username.trim();
        const hashedPassword = await sha256(password.trim());
        let error;

        if (userType === 'admin') {
            // Check frontend session state first
            if (currentUser?.type !== 'admin') {
                setPopup({
                    header: 'Acesso Negado',
                    content: 'Apenas administradores conectados podem cadastrar novos administradores.',
                    state: true
                });
                return;
            }

            // Call RPC function passing current admin's ID for DB-side validation
            const result = await supabase.rpc('register_admin_by_admin', {
                p_admin_id: currentUser.id,
                p_new_name: trimmedUsername,
                p_new_password_hash: hashedPassword
            });
            error = result.error;
        } else {
            // Standard student/user registration
            const hashedRM = rm.trim() ? await sha256(rm.trim()) : null;
            const result = await supabase
                .from('users')
                .insert({
                    name: trimmedUsername,
                    password: hashedPassword,
                    type: 'user',
                    rm: hashedRM
                });
            error = result.error;
        }

        if (error) {
            setPopup({
                header: 'Erro no Cadastro',
                content: `Não foi possível cadastrar o usuário: ${error.message}`,
                state: true
            });
            return;
        }

        setPopup({
            header: 'Sucesso',
            content: 'Usuário cadastrado com sucesso!',
            state: true
        });

        setTimeout(() => navigate('/login'), 2000);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await registerUser();
    };

    const handleUserTypeChange = e => {
        setRM('');
        setUserType(e.target.value);
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <Popup
                state={popup.state}
                setState={(state) => setPopup(prev => ({ ...prev, state }))}
                header={popup.header}
            >
                {popup.content}
            </Popup>
            <div className="rounded-2 m-2 p-2 border-darken bg-light w-100">
                <form onSubmit={handleFormSubmit}>
                    <h2>
                        <RiUserAddFill className='me-2'/>
                        Registrar Usuário
                    </h2>
                    <hr />
                    <div className='d-flex justify-content-center align-items-center'>
                        <ul className='list-group w-100'>
                            <li
                                className='list-group-item'
                                style={{borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}}
                            >
                                <label htmlFor="username" className='fs-5 mx-2 fw-bold'>
                                    <RiUserFill className='me-2'/>
                                    Nome
                                </label>
                            </li>
                            <li className='list-group-item mb-3'>
                                <TextField
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                    type='text'
                                    label='Nome'
                                    id='username'
                                    name='username'
                                    className='m-2'
                                    fullWidth
                                    required
                                />
                            </li>
                            <li
                                className='list-group-item'
                                style={{borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}}
                            >
                                <label htmlFor="password" className='fs-5 mx-2 fw-bold'>
                                    <RiLockPasswordFill className='me-2'/>
                                    Senha
                                </label>
                            </li>
                            <li className='list-group-item d-flex align-items-center mb-3'>
                                <TextField
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    name='password'
                                    id='password'
                                    type={!passwordShowing ? 'password' : 'text'}
                                    className='ms-2 my-2'
                                    label='Senha'
                                    fullWidth
                                    required
                                />
                                <Button
                                    variant='outlined'
                                    className='py-2'
                                    color='inherit'
                                    onClick={() => setPasswordShowing(!passwordShowing)}
                                >
                                    {!passwordShowing ? (
                                        <RiEyeCloseFill className='text-secondary fs-2 text-center'/>
                                    ) : (
                                        <RiEyeFill className='text-dark fs-2 text-center'/>
                                    )}
                                </Button>
                            </li>
                            <li
                                className='list-group-item'
                                style={{borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}}
                            >
                                <label htmlFor="typeUser" className='fs-5 mx-2 fw-bold'>
                                    Tipo de usuário
                                </label>
                            </li>
                            <li className='list-group-item'>
                                <Select
                                    value={userType}
                                    id="typeUser"
                                    name="typeUser"
                                    onChange={handleUserTypeChange}
                                    className='m-2'
                                    fullWidth
                                >
                                    <MenuItem value="user">Aluno</MenuItem>
                                    {currentUser?.type === 'admin' && (
                                        <MenuItem value="admin">Administrador</MenuItem>
                                    )}
                                </Select>
                            </li>
                            {userType === 'user' && (
                                <>
                                    <li
                                        className='list-group-item mt-3'
                                        style={{borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}}
                                    >
                                        <label htmlFor="rm" className='fs-5 mx-2 fw-bold'>
                                            <RiLockPasswordFill className='me-2'/>
                                            RM
                                        </label>
                                    </li>
                                    <li className='list-group-item d-flex align-items-center mb-3'>
                                        <TextField
                                            onChange={(e) => setRM(e.target.value)}
                                            value={rm}
                                            name='rm'
                                            id='rm'
                                            required
                                            type={!rmShowing ? 'password' : 'text'}
                                            className='ms-2 my-2'
                                            label='RM do aluno'
                                            fullWidth
                                        />
                                        <Button
                                            variant='outlined'
                                            className='py-2'
                                            color='inherit'
                                            onClick={() => setRmShowing(!rmShowing)}
                                        >
                                            {!rmShowing ? (
                                                <RiEyeCloseFill className='text-secondary fs-2 text-center'/>
                                            ) : (
                                                <RiEyeFill className='text-dark fs-2 text-center'/>
                                            )}
                                        </Button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <Button
                            type='submit'
                            variant='contained'
                            color='success'
                            className='fs-5'
                        >
                            <RiAddFill className='me-2'/>
                            Registrar
                        </Button>
                        <Button
                            type='reset'
                            variant='contained'
                            color='error'
                            className='fs-5'
                            onClick={() => {
                                setUsername('');
                                setPassword('');
                                setRM('');
                                setUserType('user');
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