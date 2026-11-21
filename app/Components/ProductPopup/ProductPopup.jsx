import { AdvancedImage } from '@cloudinary/react';
import { Slider, Backdrop } from '@mui/material';
import { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { FaCartPlus, FaPlus, FaMinus } from 'react-icons/fa6';
import './ProductPopup.css';

export default function ProductPopup({ productPopup, setProductPopup, setItemAlert, cartPrice, setCartPrice, cartProducts, setCartProducts }) {
    let [value, setValue] = useState(1);
    let product = productPopup.product;

    useEffect(() => {
        setValue(1);
    }, [product?.id]);

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
                    id: product.id,
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


    return (
        <div className="product-popup-shell">
            <Backdrop
                open={productPopup.state}
                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}
                onClick={closePopup} />

            <div className="product-purchase-card" role="dialog" aria-modal="true" aria-label={`Comprar ${product.title}`}>
                <div className="product-purchase-image">
                    <AdvancedImage cldImg={product.img} loading="lazy" />
                </div>

                <div className="product-purchase-details">
                    <div className="product-purchase-heading">
                        <h1>{product.title}</h1>
                        <span>R${formatPrice(product.price)}</span>
                    </div>

                    <div className="product-purchase-quantity">
                        <div className="product-purchase-message">
                            <span>Você está comprando</span>
                            <input
                                type="number"
                                value={value}
                                min="1"
                                max={product.stock}
                                onChange={handleInputChange}
                                aria-label="Quantidade"
                            />
                            <span>unidade(s) deste produto</span>
                        </div>
                        <div className="product-purchase-slider">
                            <button type="button" className="product-quantity-minus" title="Diminuir quantidade" onClick={handleSubBtn} disabled={value <= 1}>
                                <FaMinus aria-hidden="true" />
                            </button>
                            <Slider
                                min={1}
                                max={product.stock}
                                value={Number(value)}
                                onChange={handleSliderChange}
                                aria-label="Quantidade"
                                sx={{
                                    color: '#1686d9',
                                    '& .MuiSlider-thumb': { width: 17, height: 17 },
                                    '& .MuiSlider-rail': { backgroundColor: '#1686d9', opacity: 1 },
                                    '& .MuiSlider-track': { border: 0 }
                                }}
                            />
                            <button type="button" className="product-quantity-plus" title="Aumentar quantidade" onClick={handleAddBtn} disabled={value >= product.stock}>
                                <FaPlus aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className="product-purchase-actions">
                        <button type="button" className="product-purchase-cancel" title="Cancelar compra" onClick={closePopup} aria-label="Cancelar compra">
                            <RiCloseFill aria-hidden="true" />
                        </button>
                        <button type="button" className="product-purchase-confirm" title={`Adicionar ${product.title} ao carrinho`} onClick={addToCart} aria-label={`Adicionar ${product.title} ao carrinho`}>
                            <FaCartPlus aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
