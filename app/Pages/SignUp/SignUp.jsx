import { RiUserAddFill, RiCloseFill, RiAddFill, RiEyeFill, RiEyeCloseFill, RiLockPasswordFill, RiUserFill, RiCheckFill } from 'react-icons/ri'
import { TextField, Select, MenuItem, Button } from '@mui/material';
import { useState } from 'react';
import Popup from '../../Components/Popup/Popup';
import supabase from '../../supabaseClient';

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); 
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export default function SignUp() {
    const [passwordShowing, setPasswordShowing] = useState(false);
    const [rmShowing, setRmShowing] = useState(false);
    const [userType, setUserType] = useState("user");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rm, setRM] = useState("");
    const [popup, setPopup] = useState({
        'content': '',
        'header': '',
        'state': false
    });

    const registerUser = async () => {
        const { data, error } = await supabase
            .from('users')
            .insert({
                name: username.trim(),
                password: await sha256(password.trim()),
                type: userType.trim(),
                rm: await sha256(rm.trim())
            });

        if (error) {
            console.error("Erro no Supabase:", error.message);
            setPopup({
                content: 'Falha ao registrar usuário no banco de dados!',
                header: (
                    <h2 className='text-danger'>
                        <RiCloseFill className='me-2'/>
                        Erro de Registro!
                    </h2>
                ),
                state: true
            });
            return false;
        }

        setPopup({
            content: 'Usuário registrado com sucesso!',
            header: (
                <h2 className='text-success'>
                    <RiCheckFill className='me-2'/>
                    Usuário Registrado!
                </h2>
            ),
            state: true
        });
        return true;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await registerUser();
    };

    const handleUserTypeChange = e => {
        setRM('');
        setUserType(e.target.value);
    };
    const handleUsernameChange = e => setUsername(e.target.value);
    const handlePasswordChange = e => setPassword(e.target.value);
    const handleRMChange = e => setRM(e.target.value);
    
    return (
        <div className="d-flex justify-content-center align-items-center">
            <Popup
                state={popup.state}
                setState={setPopup}
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
                                    onChange={handleUsernameChange}
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
                                    onChange={handlePasswordChange}
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
                                    {
                                        !passwordShowing ?
                                        <RiEyeCloseFill className='text-secondary fs-2 text-center'/>
                                        :
                                        <RiEyeFill className='text-dark fs-2 text-center'/>
                                    }
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
                                    <MenuItem value="admin">Administrador</MenuItem>
                                </Select>
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