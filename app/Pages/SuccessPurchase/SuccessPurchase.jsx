import { useLocation } from 'react-router';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { useMediaQuery } from '@mui/material';
import { FaClock, FaCartShopping } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { sha256 } from '../Login/Login';

export default function SuccessPurchase() {
    const location = useLocation();
    const [rndCode, setRndCode] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(10 * 60);

    useEffect(() => {
        if (secondsLeft <= 0) return;

        const timerId = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [secondsLeft]);

    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const displayMins = String(mins).padStart(2, '0');
    const displaySecs = String(secs).padStart(2, '0');

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

    const qrCodeTxt = JSON.stringify(cartProducts);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    const setCode = ()=> {
        let x = [];
        for (let i=0;i < 6;i++) {
            let rndNum = Math.round(Math.random());

            if (rndNum === 0) {
                x.push(Math.floor(Math.random() * 9));
            } else {
                let rndNumAlphabet = Math.floor(Math.random() * alphabet.length);
                let rndCaseNum = Math.round(Math.random());

                let rndLetter = alphabet[rndNumAlphabet];
                rndLetter = rndCaseNum === 0 ? rndLetter.toLowerCase() : rndLetter.toUpperCase();

                x.push(rndLetter);
            }

            console.log(x);

            setRndCode(x.join(''));
        }
    }

    useEffect(setCode, [])

    return(
        secondsLeft <= 0 ? 
        <div className="d-flex align-items-center flex-column m-4">
            <h1 className="text-center">
            Limite de tempo para pagar excedido!
            </h1>
            <h2>Sua compra foi cancelada!</h2>
        </div>
        : cartProducts && cartProducts.length > 0 ? 
        <div className="d-flex align-items-center flex-column m-4">
            <h1 className="text-center">Compra realizada com sucesso!</h1>
            
            <div className="rounded-2 m-2 p-2 border-darken">
            <h2>
                Pagar <b className="text-success">R${getTotalPrice()}</b> para Marcos da cantina
            </h2>
            <hr />
            <div className="d-flex justify-content-center align-items-center">
                <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${sha256(qrCodeTxt)}&size=300x300&charset-source=UTF-8`}
                alt="QR Code" />
            </div>
            <hr />
            <h2 className='text-center'>
                Código da compra:
                <br />
                <b>
                    {rndCode}
                </b>
            </h2>
            <hr />
            <h1 className={`text-center ${displayMins <= 5 ? 'text-danger' : 'text-success'}`}>
                <FaClock className="me-2" />
                {displayMins}:{displaySecs}
            </h1>
            </div>

            <h1 className="w-100 m-2 border-darken p-2 rounded-2">
                <FaCartShopping className='me-2'/>
                Sua Compra:
            </h1>
            
            <ul
            className="list-group gap-2 m-3 overflow-auto"
            style={{
                width: '95dvw',
                height: isMobile ? '62dvh' : '65dvh',
            }}
            >
            {cartProducts.map((product, i) => (
                <li
                key={i}
                className="list-group-item bg-new-orange rounded-2 border-darken d-flex flex-row align-items-center p-2"
                >
                <AdvancedImage
                    cldImg={cld.image(formatName(product.title))}
                    style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'contain',
                    flexShrink: 0,
                    }}
                    className="me-4 rounded-2 bg-light"
                />
                <details>
                    <summary className="fs-2 fw-bold">
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

            <h2 className="text-success text-center fw-bold my-3">
            Total: R$ {formatPrice(getTotalPrice())}
            </h2>
            <h1 className="text-center">Muito obrigado pela compra!</h1>
        </div>
        : 
        <div className="d-flex align-items-center flex-column m-4">
            <h1 className="text-center">
            Nenhum produto encontrado no carrinho!
            </h1>
        </div>
    )
}