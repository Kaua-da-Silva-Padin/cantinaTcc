import { ImageList, ImageListItem, ImageListItemBar, IconButton, useMediaQuery } from '@mui/material';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { FaCartPlus } from 'react-icons/fa6';

export default function FoodTable({ filterTxt, filterTab, cartPrice, setCartPrice }) {

    const products = [
        {
            name: 'Coca Cola',
            kind: 'bebidas',
            stock: 1,
            price: 6
        },
        {name: 'Poty', kind: 'bebidas', stock: 1, price: 6},
        {name: 'Coxinha', kind: 'salgados', stock: 1, price: 6},
        {name: 'Mini Pizza', kind: 'salgados', stock: 1, price: 7}
    ]

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dntfculcp'
        }
    })
    const foodData = [];

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
        foodData.push({
            img: cld.image(formatName(foodName)),
            title: foodName,
            kind: foodKind,
            price: foodPrice,
            stock: foodStock
        });  
    })

    // Checks if the device being used is mobile or not
    const isMobile = useMediaQuery("(max-width:768px)");

    let filteredFoods =
    filterTab === 'todos' ? foodData
    :
    foodData.filter(item => item.kind === filterTab);

    filteredFoods = filteredFoods.filter(item => item.stock > 0);
    filteredFoods = filteredFoods.filter(item => item.title.toLowerCase().includes(filterTxt));

    return(
        <div
        className="d-flex justify-content-center align-items-center">
            {/*If the device is mobile only show 2 cols for the table, otherwise show 4*/}
            <ImageList
            cols={isMobile ? 2 : 4}
            rowHeight={250}
            sx={{
                marginRight: '2%',
                marginLeft: '2%',
                height: '60dvh',
                overflowY: 'auto',
            }}>
                {filteredFoods.map(item=>(
                    <ImageListItem
                    key={item.title}
                    className='bg-orange rounded'
                    >
                        <AdvancedImage
                        cldImg={item.img}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}/>
                        <ImageListItemBar
                        className='rounded bg-darken px-2'
                        title={item.title}
                        subtitle={`R$ ${formatPrice(item.price)}`}
                        sx={{
                            "& .MuiImageListItemBar-subtitle": {
                                fontSize: "1.2rem",
                            },
                            "& .MuiImageListItemBar-title": {
                                fontSize: '1.4rem',
                                marginBottom: '2%',
                                fontWeight: 'bold'
                            }
                        }}
                        actionIcon={
                            <IconButton
                            onClick={()=>setCartPrice(cartPrice+item.price)}
                            className='text-light bg-success rounded p-2 m-2'
                            title={`Adicionar ${item.title} ao carrinho (${formatPrice(item.price)})`}>
                                <FaCartPlus className='fs-1'/>
                            </IconButton>
                        }/>
                    </ImageListItem>
                ))}

            </ImageList>
        </div>
    )
}