import { ImageList, ImageListItem, ListSubheader, useMediaQuery, } from '@mui/material';
import { FaCartShopping } from 'react-icons/fa6';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';

export default function FoodList({ foodData }) {

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dntfculcp'
        }
    })

    // Função copiada do FoodTable Linha. 32
    const formatName = (name)=> {
        return name.trim().toLowerCase().replaceAll(' ', '')
    }



    foodData = [
        {
            title: 'Coxinha',
            stock: 1,
            price: 6,
            kind: 'salgados',
        },
        {
            title: 'Monster Energético',
            stock: 1,
            price: 6,
            kind: 'bebidas',

        },
        {
            title: 'Pringles de Creme e Cebola',
            stock: 1,
            price: 6,
            kind: 'salgados',

        }
    ];

    const formatPrice = (price) => {
        return price.toFixed(2).replace('.', ',')
    }

    const capitalize = (txt) => {
        const firstLetter = txt[0].toUpperCase();
        txt = txt.slice(1, -1);
        const finalTxt = firstLetter + txt;
        return finalTxt
    }

    return (
        <>
            {foodData.map((item, i) => (
                <div
                    className='d-flex rounded p-2'
                    style={{
                        background: 'rgba(255,100,0,.6)' 
                    }}
                    key={item.title}>
                    <ImageListItem
                        className='bg-orange rounded'
                        // style={{height: '10%'}}
                        title={item.title}>
                        <AdvancedImage
                                cldImg={cld.image(formatName(item.title))} // Busca a imagem do cloudnary 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}/>
                    </ImageListItem>
                    <div className="d-flex flex-column">
                        <h2
                            className='px-2 fw-bold'>
                            {item.title}
                        </h2>
                        <h4
                            className='px-2'>
                            R$ {formatPrice(item.price)}
                        </h4>
                        <h6
                            className='px-2 space-grotesk fw-bold'>
                            {capitalize(item.kind)}
                        </h6>
                    </div>
                </div>
            ))}
        </>
    )
}