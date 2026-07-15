import { useLocation } from 'react-router';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { useMediaQuery } from '@mui/material';

export default function SuccessPurchase() {
    const location = useLocation();

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

    const isMobile = useMediaQuery('(max-width: 768px)');

    const cartProducts = location.state?.cartProducts || undefined;

    const getTotalPrice = ()=> {
        let totalPrice = 0;
        cartProducts.map((product)=>{
            totalPrice += product.price * product.quantity;
        });
        return totalPrice;
    }

    return(
        cartProducts ?
        <div
        className="d-flex align-items-center flex-column m-4">
            <h1 className='text-center'>
                Compra realizada com sucesso!
            </h1>
            <ul
            className='list-group gap-2 m-3 overflow-auto'
            style={{
                width: '95dvw',
                height: isMobile ? '62dvh' : '65dvh'
            }}>
                {cartProducts.map((product, i)=>(
                    <li
                    key={i}
                    className='list-group-item bg-new-orange rounded-2 border-darken d-flex flex-row align-items-center p-2'>
                        <AdvancedImage
                        cldImg={cld.image(formatName(product.title))}
                        style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'contain',
                            flexShrink: 0,
                        }}
                        className='me-4 rounded-2 bg-light' />
                        <details>
                            <summary className='fs-2 fw-bold'>
                                {`${product.quantity}x ${product.title}`}
                            </summary>
                            <h5>
                                Unidade: R$ {formatPrice(product.price)}
                                <br />
                                Total: R$ {formatPrice(product.price * product.quantity)}
                            </h5>
                        </details>
                    </li>
                ))}
            </ul>
            <h2 className='text-success text-center fw-bold my-3'>
                Total: R$ {formatPrice(getTotalPrice())}
            </h2>
            <h1 className='text-center'>
                Muito obrigado pela compra!
            </h1>
        </div>
        :
        <div
        className="d-flex align-items-center flex-column m-4">
            <h1 className='text-center'>
                Nenhum produto encontrado no carrinho!
            </h1>
        </div>
    )
}