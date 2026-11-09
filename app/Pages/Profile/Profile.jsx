import { useEffect, useState } from 'react';
import { Avatar, Button, Checkbox, FormControlLabel, LinearProgress, Pagination } from '@mui/material';
import { FaCheck, FaSpinner, FaXmark } from 'react-icons/fa6';
import { RiLogoutBoxRFill, RiUserUnfollowFill } from 'react-icons/ri';
import { useNavigate } from 'react-router';
import Popup from '../../Components/Popup/Popup';
import { stringAvatar } from '../../Components/MenuPageLinks/MenuPageLinks';
import { loadLoggedInUser } from '../Login/Login';
import supabase from '../../supabaseClient';
import './Profile.css';

const ORDERS_PER_PAGE = 10;

function getProgressText(progress) {
    if (typeof progress === 'string' || typeof progress === 'number') return String(progress);
    if (!progress || typeof progress !== 'object') return '';

    return getProgressText(
        progress.status ?? progress.state ?? progress.progress
        ?? progress.value ?? progress.name ?? progress.label
        ?? Object.values(progress)[0]
    );
}

function parseItems(items) {
    if (typeof items === 'string') {
        try {
            items = JSON.parse(items);
        } catch {
            return [];
        }
    }

    return Array.isArray(items) ? items : [];
}

function OrderCard({ order, number }) {
    const rawStatus = getProgressText(order.progress);
    const status = String(rawStatus ?? 'Aguardando').trim().toLowerCase();
    const canceled = status.includes('cancel');
    const paid = status === 'paid' || status === 'approved' || status === 'pago';
    const statusText = canceled
        ? 'Cancelado'
        : paid
            ? 'Pago'
            : ['waiting', 'pending', 'awaiting'].includes(status)
                ? 'Aguardando'
                : ['processing', 'in_progress'].includes(status)
                    ? 'Em andamento'
                    : rawStatus ?? 'Aguardando';
    const icon = paid
        ? <FaCheck aria-hidden="true" />
        : canceled
            ? <FaXmark aria-hidden="true" />
            : <FaSpinner className="profile-state-spinner" aria-hidden="true" />;
    const statusColor = paid ? 'success' : canceled ? 'error' : 'primary';
    const products = parseItems(order.items);
    const parsedDate = order.bought_at ? new Date(order.bought_at) : null;
    const orderDate = parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleString('pt-BR')
        : null;

    return (
        <article className="border-darken rounded-2 p-2">
            <h4 className="fs-5 mb-2">Pedido #{order.id ?? number}</h4>
            <p className="mb-1"><strong>Cliente:</strong> {order.user_name}</p>
            <p className="mb-1"><strong>Data:</strong> {orderDate ?? '—'}</p>
            <p className="mb-2">
                <strong>Valor total:</strong>{' '}
                {Number(order.total_price).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}
            </p>

            <div className="profile-order-progress mb-2">
                <div className="profile-order-progress-label">
                    <span>Andamento: {statusText}</span>
                    <span className={`profile-order-state-icon profile-order-state-${statusColor}`}>
                        {icon}
                    </span>
                </div>
                <LinearProgress
                    className={`profile-progress-bar profile-order-progress-bar profile-order-progress-${statusColor}`}
                    variant={paid || canceled ? 'determinate' : 'indeterminate'}
                    value={100}
                    color={statusColor}
                    aria-label={`Andamento do pedido: ${statusText}`}
                />
            </div>

            <details>
                <summary className="fw-semibold">Ver produtos ({products.length})</summary>
                <ul className="list-group list-group-flush overflow-auto mt-2 profile-product-list">
                    {products.map((product, index) => {
                        return (
                            <li
                                className="list-group-item px-2 py-1 d-flex justify-content-between gap-3"
                                key={`${product.product_name}-${index}`}
                            >
                                <span>
                                    {product.product_name} x{product.qty}
                                </span>
                                <strong className="text-nowrap text-end">
                                    {Number(product.price_unit).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                    <small className="d-block text-muted">
                                        Total: {Number(product.price_total).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </small>
                                </strong>
                            </li>
                        );
                    })}
                    {products.length === 0 && (
                        <li className="list-group-item px-2 py-1">Nenhum produto</li>
                    )}
                </ul>
            </details>
        </article>
    );
}

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [ordersPage, setOrdersPage] = useState(1);
    const [ordersCount, setOrdersCount] = useState(0);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState('');
    const [shouldDelete, setShouldDelete] = useState(false);
    const [popup, setPopup] = useState({ state: false, header: '', type: '', message: '' });

    useEffect(() => {
        const cachedUser = loadLoggedInUser();
        if (cachedUser) setUser(cachedUser);
    }, []);

    useEffect(() => {
        if (!user?.name) return undefined;
        let current = true;

        async function fetchOrders() {
            setOrdersLoading(true);
            setOrdersError('');
            const first = (ordersPage - 1) * ORDERS_PER_PAGE;
            const { data, count, error } = await supabase
                .from('sales')
                .select('*', { count: 'exact' })
                .eq('user_name', user.name)
                .range(first, first + ORDERS_PER_PAGE - 1);

            if (!current) return;
            if (error) {
                console.error('Erro ao buscar histórico de pedidos:', error.message);
                setOrders([]);
                setOrdersCount(0);
                setOrdersError('Não foi possível carregar seu histórico de pedidos.');
            } else {
                setOrders(data ?? []);
                setOrdersCount(count ?? 0);
            }
            setOrdersLoading(false);
        }

        fetchOrders();
        return () => { current = false; };
    }, [user?.name, ordersPage]);

    const handleLogout = () => {
        sessionStorage.removeItem('loggedInUser');
        window.dispatchEvent(new Event('userLoggedIn'));
        navigate('/login');
    };

    async function handleConfirmAction() {
        if (!user) return;
        const result = shouldDelete
            ? await supabase.from('users').delete().eq('name', user.name)
            : await supabase.from('users').update({ active: false }).eq('name', user.name);

        if (result.error) {
            setPopup({
                state: true,
                header: 'Erro',
                type: 'error',
                message: `Erro ao processar a ação: ${result.error.message}`
            });
            return;
        }
        setPopup(previous => ({ ...previous, state: false }));
        handleLogout();
    }

    return (
        <>
            <Popup state={popup.state} setState={setPopup} header={popup.header}>
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
                                    onChange={event => setShouldDelete(event.target.checked)}
                                    color="error"
                                />
                            }
                            label="Desejo excluir a conta do banco de dados"
                        />
                        <div className="d-flex justify-content-end gap-2 mt-2">
                            <Button variant="outlined" color="inherit" onClick={() => setPopup(previous => ({ ...previous, state: false }))}>
                                Cancelar
                            </Button>
                            <Button variant="contained" color="error" onClick={handleConfirmAction}>
                                {shouldDelete ? 'Excluir' : 'Desativar'}
                            </Button>
                        </div>
                    </div>
                )}
                {popup.type === 'error' && <p className="p-2 m-0 text-danger">{popup.message}</p>}
            </Popup>

            {user ? (
                <div className="profile-page d-flex align-items-center flex-column">
                    <header className="profile-sticky-header d-flex justify-content-center align-items-center flex-column">
                        <div className="profile-avatar bg-new-orange rounded-circle p-1 mt-2 mb-1">
                            <Avatar {...stringAvatar(user.name || 'Usuário')} />
                        </div>
                        <h2 className="profile-welcome mb-2 text-center">Bem-vindo, {user.name}!</h2>
                    </header>

                    <div className="profile-actions d-flex justify-content-center align-items-center gap-2 rounded-2 border-darken shadow flex-wrap">
                        <Button variant="contained" color="warning" className="fs-6" onClick={handleLogout}>
                            <RiLogoutBoxRFill className="me-2" /> Sair
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            className="fs-6"
                            onClick={() => setPopup({
                                state: true,
                                header: 'Confirmar Ação na Conta',
                                type: 'confirm',
                                message: ''
                            })}
                        >
                            <RiUserUnfollowFill className="me-2" /> Deletar Conta
                        </Button>
                    </div>

                    <section className={`profile-orders${ordersCount > ORDERS_PER_PAGE ? ' profile-orders-paginated' : ''}`}>
                        <h3 className="mb-3">Meu histórico de pedidos</h3>
                        {ordersLoading ? (
                            <div className="profile-orders-loading" role="status" aria-label="Carregando pedidos">
                                <span className="profile-progress-label">Carregando pedidos...</span>
                                <LinearProgress className="profile-progress-bar" aria-label="Progresso do carregamento dos pedidos" />
                            </div>
                        ) : ordersError ? (
                            <p className="text-danger" role="alert">{ordersError}</p>
                        ) : orders.length === 0 ? (
                            <p className="text-muted">Você ainda não fez nenhum pedido.</p>
                        ) : (
                            <>
                                <div className="d-flex flex-column gap-2">
                                    {orders.map((order, index) => (
                                        <OrderCard
                                            key={order.id ?? `${ordersPage}-${index}`}
                                            order={order}
                                            number={(ordersPage - 1) * ORDERS_PER_PAGE + index + 1}
                                        />
                                    ))}
                                </div>
                                {ordersCount > ORDERS_PER_PAGE && (
                                    <div className="profile-pagination-dock">
                                        <Pagination
                                            count={Math.ceil(ordersCount / ORDERS_PER_PAGE)}
                                            page={ordersPage}
                                            onChange={(_, page) => setOrdersPage(page)}
                                            color="primary"
                                            size="small"
                                            siblingCount={0}
                                            aria-label="Paginação do histórico de pedidos"
                                            getItemAriaLabel={(type, page, selected) => {
                                                if (type === 'page') return selected ? `Página ${page} atual` : `Ir para a página ${page}`;
                                                if (type === 'first') return 'Ir para a primeira página';
                                                if (type === 'last') return 'Ir para a última página';
                                                if (type === 'next') return 'Ir para a próxima página';
                                                return 'Ir para a página anterior';
                                            }}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>
            ) : (
                <p className="text-center mt-4 fs-5">Nenhum usuário conectado.</p>
            )}
        </>
    );
}
