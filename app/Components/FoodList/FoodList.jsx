import { ImageList, ImageListItem, ListSubheader, useMediaQuery, } from '@mui/material';
import { FaCartShopping } from 'react-icons/fa6';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';

// cartPrice, setCartPrice
export default function FoodList({ cartProducts }) {
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

    if (!cartProducts || cartProducts.length === 0) {
        return (
            <div className="p-4 text-center">
                <FaCartShopping size={48} style={{ opacity: 0.2 }} />
                <p className="mt-2 text-muted">Seu carrinho está vazio</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column gap-2 p-2">
            {cartProducts.map((item, i) => (
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
                        <div className='fw-bold text-success'>
                            R$ {formatPrice(item.price * item.quantity)}
                        </div>
                    </div>
                </div>
            ))}
            <div className="mt-3 p-2 border-top">
                <div className="d-flex justify-content-between fw-bold fs-6">
                    <span>Total:</span>
                    <span>R$ {formatPrice(cartProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0))}</span>
                </div>
            </div>
        </div>
    )
}