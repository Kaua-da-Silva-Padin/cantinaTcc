import { AdvancedImage } from '@cloudinary/react';
import { Slider, TextField, IconButton, Backdrop } from '@mui/material';
import { useState } from 'react';
import { RiShoppingCart2Fill, RiCloseFill } from 'react-icons/ri';
import { FaHotdog, FaCartPlus, FaPlus, FaMinus } from 'react-icons/fa6';

export default function ProductPopup({ productPopup, setProductPopup, setItemAlert, cartPrice, setCartPrice, cartProducts, setCartProducts }) {
    let [value, setValue] = useState(1);
    let product = productPopup.product;

    const handleAddBtn = ()=> {
        value < product.stock && setValue(value+=1);
    }

    const handleSubBtn = ()=> {
        value != 1 && setValue(value-=1);
    }

    const handleSliderChange = (e, newValue) => setValue(newValue);

    const handleInputChange = (e) => {
        let inputVal = e.target.value.replace(/[^0-9]/g, '');
        const unwantedValues = ['e', 'E', '-', '+', '.', ','];

        unwantedValues.forEach(value => {
            if (inputVal.includes(value)) {
                e.preventDefault();
            }
        })

        setValue(inputVal <= product.stock && inputVal >= 1 ? inputVal : 1);
    };

    const formatPrice = (price) => {
        return price.toFixed(2).replace('.', ',');
    }

    const capitalize = (txt) => {
        let firstLetter = txt.slice(-1).toUpperCase();
        let restLetters = txt.slice(1);
        return firstLetter + restLetters;
    }

    const closePopup = () => {
        setProductPopup({
            'state': false,
            'product': product
        });
    }

    const addToCart = () => {
        setItemAlert({
            state: true,
            message: `${value} ${product.title} adicionado ao carrinho!`
        });

        setCartPrice(cartPrice + product.price * value);

        if (setCartProducts) {
            setCartProducts(prev => {
                const existing = prev.find(item => item.title === product.title);
                if (existing) {
                    return prev.map(item => 
                        item.title === product.title 
                        ? { ...item, quantity: item.quantity + value }
                        : item
                    );
                }
                return [...prev, { 
                    title: product.title, 
                    quantity: value, 
                    price: product.price, 
                    img: product.img,
                    stock: product.stock
                }];
            });
        }

        closePopup();
    }


    let remainingTxt = product.stock > 1 ? `${product.stock} produtos restantes` : `${product.stock} produto restante`;

    return (
        <div
            style={{ height: '40dvh' }}
            className="d-flex justify-content-center align-items-center">
            <Backdrop
                open={productPopup.state}
                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}
                onClick={closePopup} />

            <div
                style={{
                    zIndex: 99999,
                    position: 'fixed'
                }}
                className="border-darken rounded-2 w-75 h-90 bg-light text-dark shadow-box overflow-auto d-flex flex-column">

                <div className='bg-new-orange p-2 px-3 mt-2'>
                    <h1 className='d-flex justify-content-between'>
                        {product.title}

                        <IconButton
                            className='text-light bg-darken rounded'
                            style={{ transition: 'all 200ms ease-out', height: '42px', width: '42px' }}
                            sx={{
                                minWidth: '42px',
                                height: '42px',
                                ':active ': {
                                    scale: .9
                                }
                            }}
                            title='Fechar Janela'
                            onClick={closePopup}>
                            <RiCloseFill className='fs-1' />
                        </IconButton>
                    </h1>
                </div>
                <div className="py-2 d-flex flex-column justify-content-center grow" style={{ minHeight: 0 }}>
                    <AdvancedImage
                        cldImg={product.img}
                        loading='lazy'
                        className='w-100 h-100'
                        style={{ objectFit: 'contain' }} />
                </div>
                <div className="d-flex justify-content-end">
                    <p
                        style={{ width: 'fit-content' }}
                        className={`bg-new-orange m-2 fs-4 px-4 fw-bold text-center ${product.stock <= 5 ? 'text-danger' : product.stock <= 10 ? 'text-dark' : 'text-success'}`}>
                        {remainingTxt}
                    </p>
                </div>

                <h2 className='p-3 px-4 bg-new-orange'>
                    <RiShoppingCart2Fill
                    className='me-2' />
                    Comprar
                    <TextField
                    type='number'
                    value={value}
                    variant='standard'
                    color='success'
                    className='mx-2 p-1'
                    sx={{
                        '& input':
                        {
                            textAlign: 'center',
                            fontSize: '1.6em',
                            fontWeight: 'bold',
                            color: 'forestgreen'
                        }
                    }} 
                    onChange={handleInputChange}
                    aria-labelledby="input-slider"
                    inputProps={{
                        min: 1,
                        max: product.stock
                    }}/>
                    {product.title} por <b className='text-success'>{formatPrice(product.price * value)}R$</b>
                </h2>
                <div
                className='p-4 d-flex gap-4 my-4'>
                    <IconButton
                    className='text-danger rounded'
                    style={{ transition: 'all 200ms ease-out' }}
                    sx={{
                    minWidth: '42px',
                    height: '42px',
                        ':active ': {
                            scale: .9
                        }
                    }}
                    title='Fechar Janela'
                    onClick={handleSubBtn}>
                        <FaMinus className='fs-1' />
                    </IconButton>

                    <Slider
                    min={1}
                    max={product.stock}
                    color='warning'
                    value={value}
                    valueLabelDisplay={true}
                    onChange={handleSliderChange} />
                    
                    <IconButton
                    className='text-success rounded'
                    style={{ transition: 'all 200ms ease-out' }}
                    sx={{
                    minWidth: '42px',
                    height: '42px',
                        ':active ': {
                            scale: .9
                        }
                    }}
                    title='Fechar Janela'
                    onClick={handleAddBtn}>
                        <FaPlus className='fs-1' />
                    </IconButton>
                </div>
                <div
                className='d-flex align-items-center bg-new-orange p-2 gap-2'>
                    <IconButton
                        className='text-light bg-success rounded p-2 mx-4'
                        style={{ transition: 'all 200ms ease-out' }}
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            ':active ': {
                                scale: .9
                            }
                        }}
                        title={`Adicionar ${product.title} ao carrinho`}
                        onClick={addToCart}>
                        <FaCartPlus className='fs-1' />
                    </IconButton>

                    <IconButton
                        className='text-light bg-danger rounded p-2 mx-4'
                        style={{ transition: 'all 200ms ease-out' }}
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            ':active ': {
                                scale: .9
                            }
                        }}
                        title='Cancelar Compra'
                        onClick={closePopup}>
                        <RiCloseFill className='fs-1' />
                    </IconButton>
                </div>

            </div>
        </div>
    )
}