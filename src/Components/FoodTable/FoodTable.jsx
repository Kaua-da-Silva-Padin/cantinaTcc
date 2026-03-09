import { ImageList, ImageListItem, ImageListItemBar, IconButton } from '@mui/material';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { FaCartPlus } from 'react-icons/fa6';

export default function FoodTable() {

    const products = [
        {
            name: 'Coca Cola',
            kind: 'bebidas',
            stock: 1,
            price: 6
        },
        {name: 'Poty', kind: 'bebidas', stock: 1, price: 6},
        {name: 'Coxinha', kind: 'salgados', stock: 1, price: 6},
        {name: 'Mini Pizza', kind: 'salgados', stock: 1, price: 6}
    ]

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dntfculcp'
        }
    })
    const imageData = [];

    const formatName = (name)=> {
        return name.toLowerCase().replaceAll(' ', '')
    }

    const formatPrice = (price)=> {
        return price.toFixed(2).replace('.', ',')
    }

    products.map(item=>{
        let foodName = item.name;
        let foodKind = item.kind;
        let foodPrice = item.price;
        let foodStock = item.stock;
        imageData.push({
            img: cld.image(formatName(foodName)),
            title: foodName,
            kind: foodKind,
            price: formatPrice(foodPrice),
            stock: foodStock
        });
    })

    return(
        <div
        className="d-flex justify-content-center align-items-center">
            <ImageList
            cols={3}
            rowHeight={400}
            sx={{
                width: '95%',
                height: '80vh',
                overflowY: 'auto',
            }}>
                {imageData.map(item=>(
                    <ImageListItem
                    key={item.title}
                    className='bg-orange rounded mx-1 m-2'
                    >
                        <AdvancedImage
                        cldImg={item.img}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }}/>
                        <ImageListItemBar
                        className='rounded bg-darken px-2'
                        title={item.title}
                        subtitle={`R$ ${item.price}`}
                        sx={{
                            "& .MuiImageListItemBar-subtitle": {
                                fontSize: "1.4rem",
                            },
                            "& .MuiImageListItemBar-title": {
                                fontSize: '2rem',
                                marginBottom: '4%'
                            }
                        }}
                        actionIcon={
                            <IconButton
                            className='text-light bg-success rounded p-2 m-2'>
                                <FaCartPlus className='fs-1'/>
                            </IconButton>
                        }/>
                    </ImageListItem>
                ))}

            </ImageList>
        </div>
    )
}