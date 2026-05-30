import { AdvancedImage } from '@cloudinary/react';
import { Slider, TextField, IconButton } from '@mui/material';
import { useState } from 'react';
import { RiShoppingCart2Fill, RiCloseFill } from 'react-icons/ri';
import { FaHotdog, FaCartPlus } from 'react-icons/fa6';

export default function Popup({ product, setProductPopup, setItemAlert, cartPrice, setCartPrice }) {
    const [value, setValue] = useState(1);

    const handleSliderChange = (e, newValue) => setValue(newValue);

    const handleInputChange = (e) => {
        let inputVal = e.target.value;
        setValue(inputVal <= 10 && inputVal >= 1 ? inputVal : 1);
    };

    const formatPrice = (price)=> {
        return price.toFixed(2).replace('.', ',');
    }

    const capitalize = (txt)=> {
        let firstLetter = txt.slice(-1).toUpperCase();
        let restLetters = txt.slice(1);
        return firstLetter + restLetters;
    }

    const closePopup = ()=> {
        setProductPopup({
            'state': false,
            'product': product
        });
    }

    const buyProduct = ()=> {
        setItemAlert({
            state: true,
            message: `${value} ${product.title} adicionado ao carrinho!`,
            img: product.img
        });
        setCartPrice(cartPrice+=product.price * value);
        closePopup();
    }

    return(
        <div
        style={{height:'30dvh'}}
        className="d-flex justify-content-center align-items-center">
            <div
            style={{
                zIndex: 99999,
                position: 'fixed'
            }}
            className="border-darken rounded-2 w-75 h-90 bg-light text-dark shadow-box">

                <div className='bg-new-orange p-2 px-3 mt-2'>
                    <h1 className='d-flex justify-content-between'>
                        {product.title}

                        <IconButton
                        className='text-light bg-darken rounded p-2 mx-1'
                        style={{transition: 'all 200ms ease-out'}}
                        sx={{
                            ':active ': {
                                scale: .9
                            }
                        }}
                        title='Fechar Janela'
                        onClick={closePopup}>
                            <RiCloseFill className='fs-1'/>
                        </IconButton>
                    </h1>
                    <h6 style={{opacity: '50%'}}>
                        {capitalize(product.kind)}
                    </h6>
                </div>
                <div className="d-flex justify-content-center">
                    <AdvancedImage
                    cldImg={product.img}
                    loading='lazy'
                    width={400}/>
                </div>

                <h2 className='p-3 px-4 bg-new-orange'>
                    <RiShoppingCart2Fill
                    className='me-2'/>
                    Comprar <b className='text-success'>{value}</b> {product.title} por <b className='text-success'>{formatPrice(product.price * value)}R$</b>
                </h2>
                <div
                className='p-4 d-flex gap-4 my-4'>
                    <Slider
                    min={1}
                    max={10}
                    color='warning'
                    value={value}
                    valueLabelDisplay={true}
                    onChange={handleSliderChange}/>
                    <TextField
                    type='number'
                    value={value}
                    variant='standard'
                    color='inherit'
                    onChange={handleInputChange}
                    aria-labelledby="input-slider"
                    inputProps={{
                        min: 1,
                        max: 10
                    }}
                    />
                </div>
                <div 
                className='d-flex justify-content-around align-items-center bg-new-orange p-2'>
                    <IconButton
                    className='text-light bg-success rounded p-2 mx-1 px-4'
                    style={{transition: 'all 200ms ease-out'}}
                    sx={{
                        ':active ': {
                            scale: .9
                        }
                    }}
                    title={`Adicionar ${product.title} ao carrinho`}
                    onClick={buyProduct}>
                        <FaCartPlus className='fs-1'/>
                    </IconButton>
                    <IconButton
                    className='text-light bg-danger rounded p-2 mx-1 px-4'
                    style={{transition: 'all 200ms ease-out'}}
                    sx={{
                        ':active ': {
                            scale: .9
                        }
                    }}
                    title='Cancelar Compra'
                    onClick={closePopup}>
                        <RiCloseFill className='fs-1'/>
                    </IconButton>
                </div>
                
            </div>
        </div>
    )
}