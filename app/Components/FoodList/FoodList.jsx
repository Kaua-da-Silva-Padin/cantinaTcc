import { ImageList, ImageListItem, ListSubheader, useMediaQuery, IconButton } from '@mui/material';
import { FaCartShopping, FaTrash, FaMinus, FaPlus } from 'react-icons/fa6';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';

// cartPrice, setCartPrice
export default function FoodList({ cartProducts, setCartProducts, setCartPrice, cartPrice }) {
    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dntfculcp'
        }
    })

    const formatName = (name) => {
        return name.trim().toLowerCase().replaceAll(' ', '')
    };

    const formatPrice = (price) => {
        return price.toFixed(2).replace('.', ',')
    }

    const capitalize = (txt) => {
        if (!txt) return '';
        const firstLetter = txt[0].toUpperCase();
        const rest = txt.slice(1);
        return firstLetter + rest
    }

    const addToCart = (product) => {
        setCartPrice(cartPrice + product.price);

        if (setCartProducts) {
            setCartProducts(prev => prev.map(item => {
                if (item.title !== product.title) return item;
                if (item.quantity >= item.stock) return item;
                return { ...item, quantity: item.quantity + 1 };
            }));
        }

    }

    const removeFromCart = (product)=> {
        setCartPrice(cartPrice - product.price);

        if (setCartProducts) {
            setCartProducts(prev => prev
                .map(item => {
                    if (item.title !== product.title) return item;
                    // if already 0, keep as is (will be filtered out)
                    if (item.quantity <= 0) return { ...item, quantity: 0 };
                    return { ...item, quantity: item.quantity - 1 };
                })
                .filter(item => item.quantity > 0)
            );
        }
    }
    
    const clearCart = ()=> {
        setCartProducts([]);
        setCartPrice(0);
    };

    if (!cartProducts || cartProducts.length === 0) {
        return (
            <div className="p-4 text-center">
                <FaCartShopping size={48} style={{ opacity: 0.2 }} />
                <p className="mt-2 text-muted">Seu carrinho está vazio</p>
            </div>
        );
    }

    return (
        <div className="p-2">
            <div className='d-flex flex-column gap-2 overflow-auto' style={{height:'85dvh'}}>
                {cartProducts.map((item, i) => (
                    item.quantity > 0 &&
                    <div
                        className='d-flex rounded p-2 align-items-center'
                        style={{
                            background: 'rgba(255,100,0,.1)',
                            border: '1px solid rgba(255,100,0,.3)'
                        }}
                        key={`${item.title}-${i}`}>
                        <div style={{ width: '60px', height: '60px' }}>
                            <AdvancedImage
                                cldImg={cld.image(formatName(item.title))} 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                }} />
                        </div>
                        <div className="d-flex flex-column ms-3 flex-grow-1">
                            <h6 className='mb-0 fw-bold' style={{fontSize: '0.9rem'}}>
                                {item.title}
                            </h6>
                            <small className='text-muted'>
                                {item.quantity}x R$ {formatPrice(item.price)}
                            </small>
                            <div className='fw-bold text-success d-flex justify-content-between gap-2'>
                                R$ {formatPrice(item.price * item.quantity)}

                                <div className='d-flex align-items-center gap-2'>
                                    <IconButton
                                    className='text-light bg-success rounded p-2'
                                    style={{ transition: 'all 200ms ease-out' }}
                                    title={`Remover ${item.title} do carrinho`}
                                    onClick={()=>addToCart(item)}>
                                        <FaPlus className='fs-6' />
                                    </IconButton>

                                    <IconButton
                                    className='text-light bg-danger rounded p-2'
                                    style={{ transition: 'all 200ms ease-out' }}
                                    title={`Remover ${item.title} do carrinho`}
                                    onClick={()=>removeFromCart(item)}>
                                        <FaMinus className='fs-6' />
                                    </IconButton>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-3 p-2 border-top">
                <div className="d-flex justify-content-between fw-bold fs-6">
                    <span>Total:</span>
                    <span>R$ {formatPrice(cartProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0))}</span>
                </div>
                
                <div className="d-flex justify-content-between gap-2 mt-2">
                    <IconButton
                    className='text-light bg-success rounded p-2'
                    style={{ transition: 'all 200ms ease-out', width: '100%' }}
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        ':active ': {scale: .9}
                        }}
                    title='Comprar'>
                        <FaCartShopping className='fs-4' />
                    </IconButton>

                    <IconButton
                    className='text-light bg-danger rounded p-2'
                    style={{ transition: 'all 200ms ease-out', width: '100%' }}
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        ':active ': {scale: .9}
                        }}
                    title='Limpar Carrinho'
                    onClick={clearCart}>
                        <FaTrash className='fs-4' />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}