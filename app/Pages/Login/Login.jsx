import { RiCloseFill, RiDoorOpenFill, RiEyeFill, RiEyeCloseFill, RiLockPasswordFill, RiUserFill, RiCheckFill } from 'react-icons/ri';
import { TextField, Button, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Popup from '../../Components/Popup/Popup';
import supabase from '../../supabaseClient';

export async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); 
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

const AUTH_CACHE_KEY = 'loggedInUser';
const LOCKOUT_CACHE_KEY = 'loginLockoutInfo';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 90 * 60 * 1000; // 1.5 hours in milliseconds

export const loadLoggedInUser = () => {
    try {
        const raw = localStorage.getItem(AUTH_CACHE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        console.error('Erro ao ler cache de login:', err);
        return null;
    }
};

const cacheLoggedInUser = (user) => {
    try {
        const cachedEntry = {
            id: user.id,
            name: user.name,
            type: user.type,
            loggedInAt: new Date().toISOString()
        };
        localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cachedEntry));
        window.dispatchEvent(new Event('userLoggedIn'));
        return cachedEntry;
    } catch (err) {
        console.error('Erro ao salvar cache de login:', err);
        return null;
    }
};

export const logoutUser = () => {
    try {
        localStorage.removeItem(AUTH_CACHE_KEY);
        window.dispatchEvent(new Event('userLoggedIn'));
    } catch (err) {
        console.error('Erro ao remover cache de login:', err);
    }
};

// Lockout tracking helpers
const getLockoutInfo = () => {
    try {
        const data = localStorage.getItem(LOCKOUT_CACHE_KEY);
        return data ? JSON.parse(data) : { attempts: 0, lockoutUntil: null };
    } catch (err) {
        console.error('Erro ao ler dados de bloqueio:', err);
        return { attempts: 0, lockoutUntil: null };
    }
};

const saveLockoutInfo = (attempts, lockoutUntil) => {
    try {
        localStorage.setItem(LOCKOUT_CACHE_KEY, JSON.stringify({ attempts, lockoutUntil }));
    } catch (err) {
        console.error('Erro ao salvar dados de bloqueio:', err);
    }
};

const resetLockoutInfo = () => {
    try {
        localStorage.removeItem(LOCKOUT_CACHE_KEY);
    } catch (err) {
        console.error('Erro ao limpar bloqueio:', err);
    }
};

export default function Login() {
    const [passwordShowing, setPasswordShowing] = useState(false);
    const [rmShowing, setRmShowing] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("user");
    const [rm, setRM] = useState("");
    const [user, setUser] = useState(null);
    const [popup, setPopup] = useState({
        content: null,
        header: '',
        state: false
    });
    const navigate = useNavigate();

    useEffect(() => {
        const cachedUser = loadLoggedInUser();
        setUser(cachedUser);
        if (cachedUser) {
            setPopup({
                content: (
                    <div>
                        <p className='fw-bold mb-1'>Você já está conectado como {cachedUser.name}!</p>
                        <p className='mb-0 text-secondary'>
                            Redirecionando para o perfil...
                        </p>
                    </div>
                ),
                header: (
                    <h2 className='text-info'>
                        <RiCheckFill className='me-2'/>
                        Sessão Ativa
                    </h2>
                ),
                state: true
            });

            const timer = setTimeout(() => {
                navigate('/profile');
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [navigate]);

    const handleActivateAccount = async (authenticatedUser) => {
        const { error } = await supabase
            .from('users')
            .update({ active: true })
            .eq('id', authenticatedUser.id);

        if (error) {
            console.error('Erro ao ativar conta:', error.message);
            setPopup({
                content: 'Não foi possível ativar a conta no momento. Tente novamente.',
                header: (
                    <h2 className='text-danger'>
                        <RiCloseFill className='me-2'/>
                        Erro na Ativação
                    </h2>
                ),
                state: true
            });
            return;
        }

        resetLockoutInfo();
        cacheLoggedInUser({ ...authenticatedUser, active: true });

        setPopup({
            content: (
                <div>
                    <p className='fw-bold mb-1'>Conta ativada com sucesso!</p>
                    <p className='mb-0 text-secondary'>
                        Bem-vindo(a), {authenticatedUser.name}. Redirecionando...
                    </p>
                </div>
            ),
            header: (
                <h2 className='text-success'>
                    <RiCheckFill className='me-2'/>
                    Sucesso
                </h2>
            ),
            state: true
        });

        setTimeout(() => navigate('/profile'), 2000);
    };

    const loginUser = async () => {
        // Check if user is currently locked out
        const lockoutInfo = getLockoutInfo();
        const now = Date.now();

        if (lockoutInfo.lockoutUntil && now < lockoutInfo.lockoutUntil) {
            const remainingMinutes = Math.ceil((lockoutInfo.lockoutUntil - now) / (60 * 1000));
            setPopup({
                content: `Você excedeu o limite de tentativas. Tente novamente em ${remainingMinutes} minuto(s).`,
                header: (
                    <h2 className='text-danger'>
                        <RiCloseFill className='me-2'/>
                        Acesso Bloqueado
                    </h2>
                ),
                state: true
            });
            return { success: false };
        }

        const hashedPassword = await sha256(password);

        let query = supabase
            .from('users')
            .select()
            .eq('type', userType)
            .eq('name', username)
            .eq('password', hashedPassword);

        if (userType === 'user') {
            const hashedRM = await sha256(rm);
            query = query.eq('rm', hashedRM);
        }

        const { data, error } = await query;

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

        // Handle invalid credentials & increment failure counter
        if (!data || data.length === 0) {
            const currentAttempts = (lockoutInfo.lockoutUntil && now >= lockoutInfo.lockoutUntil) ? 0 : lockoutInfo.attempts;
            const updatedAttempts = currentAttempts + 1;

            if (updatedAttempts >= MAX_ATTEMPTS) {
                const lockoutUntil = now + LOCKOUT_DURATION_MS;
                saveLockoutInfo(updatedAttempts, lockoutUntil);

                setPopup({
                    content: 'Você errou as credenciais 5 vezes. O login foi bloqueado por 1 hora e meia.',
                    header: (
                        <h2 className='text-danger'>
                            <RiCloseFill className='me-2'/>
                            Acesso Bloqueado
                        </h2>
                    ),
                    state: true
                });
            } else {
                saveLockoutInfo(updatedAttempts, null);
                const remaining = MAX_ATTEMPTS - updatedAttempts;

                setPopup({
                    content: `Usuário, RM ou senha incorretos. Tentativas restantes: ${remaining}`,
                    header: (
                        <h2 className='text-danger'>
                            <RiCloseFill className='me-2'/>
                            Falha no Login
                        </h2>
                    ),
                    state: true
                });
            }
            return { success: false };
        }

        const authenticatedUser = data[0];

        if (userType === 'admin' && authenticatedUser.type !== 'admin') {
            setPopup({
                content: 'Acesso negado. Esta conta não possui privilégios de administrador.',
                header: (
                    <h2 className='text-danger'>
                        <RiCloseFill className='me-2'/>
                        Acesso Negado
                    </h2>
                ),
                state: true
            });
            return { success: false };
        }

        if (!authenticatedUser.active) {
            setPopup({
                content: (
                    <div>
                        <p className='mb-3'>Sua conta está inativa. Deseja ativá-la agora e acessar o perfil?</p>
                        <div className='d-flex justify-content-end gap-2'>
                            <Button 
                                variant='outlined' 
                                color='inherit'
                                onClick={() => setPopup(prev => ({ ...prev, state: false }))}
                            >
                                Agora não
                            </Button>
                            <Button 
                                variant='contained' 
                                color='primary'
                                onClick={() => handleActivateAccount(authenticatedUser)}
                            >
                                Ativar e Entrar
                            </Button>
                        </div>
                    </div>
                ),
                header: (
                    <h2 className='text-warning'>
                        Conta Inativa
                    </h2>
                ),
                state: true
            });
            return { success: false };
        }

        // Clear failed login attempts upon successful login
        resetLockoutInfo();
        cacheLoggedInUser(authenticatedUser);

        setPopup({
            content: (
                <div>
                    <p className='fw-bold mb-1'>Bem-vindo(a), {authenticatedUser.name}!</p>
                    <p className='mb-0 text-secondary'>
                        Tipo: {authenticatedUser.type}
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

        return { success: true, user: authenticatedUser };
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await loginUser();
    };

    const handleUserTypeChange = e => {
        setRM('');
        setUserType(e.target.value);
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <Popup
                state={popup.state}
                setState={setPopup}
                header={popup.header}
            >
                {popup.content}
            </Popup>
            {!user && (
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
                                    style={{borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}}
                                >
                                    <label htmlFor="username" className='fs-5 mx-2 fw-bold'>
                                        <RiUserFill className='me-2'/>
                                        Nome de Usuário
                                    </label>
                                </li>
                                <li className='list-group-item d-flex align-items-center mb-3'>
                                    <TextField
                                        onChange={(e) => setUsername(e.target.value)}
                                        value={username}
                                        name='username'
                                        id='username'
                                        required
                                        className='ms-2 my-2'
                                        label='Nome de usuário'
                                        fullWidth
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
                                <li className='list-group-item d-flex align-items-center'>
                                    <TextField
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        name='password'
                                        id='password'
                                        type={!passwordShowing ? 'password' : 'text'}
                                        className='ms-2 my-2'
                                        label='Senha'
                                        required
                                        fullWidth
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
                                    setRM('');
                                }}
                            >
                                <RiCloseFill className='me-2'/>
                                Limpar
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}