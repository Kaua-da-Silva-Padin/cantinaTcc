import { ImageList, ImageListItem, ListSubheader, useMediaQuery, } from '@mui/material';
import { FaCartShopping } from 'react-icons/fa6'

export default function FoodList() {

    const foodData = [
        {
            title: 'item1',
            stock: 1,
            price: 6,
            kind: 'salgados',

        },
        {
            title: 'item2',
            stock: 1,
            price: 6,
            kind: 'salgados',

        },
        {
            title: 'item3',
            stock: 1,
            price: 6,
            kind: 'salgados',

        }
    ];

    const formatPrice = (price)=> {
        return price.toFixed(2).replace('.',',')
    }

    const capitalize = (txt)=> {
        const firstLetter = txt[0].toUpperCase();
        txt = txt.slice(1,-1);
        const finalTxt = firstLetter+txt;
        return finalTxt
    }

    // Checks if the device being used is mobile or not
    const isMobile = useMediaQuery("(max-width:768px)");

    return(
        <>
            <div className="d-flex justify-content-center">
                <ImageList
                cols={1}
                rowHeight={100}
                className={`rounded w-100 mx-2 overflow-auto ${!isMobile && 'p-2'}`}
                sx={{
                    height: isMobile && '60dvh',
                }}>
                    <ImageListItem
                    key="Subheader">
                        <ListSubheader
                        component="div"
                        className='rounded border-darken-b fs-2 p-2 space-grotesk fw-bold'>
                            <FaCartShopping
                            className='me-2'/>
                            Carrinho
                        </ListSubheader>
                    </ImageListItem>
                    {foodData.map(item=>(
                        <div
                        className='d-flex rounded p-2'
                        style={{
                            background: 'rgba(255,100,0,.6)'
                        }}
                        key={item.title}>
                            <ImageListItem
                            className='bg-orange rounded'
                            title={item.title}>
                                {/* <AdvancedImage
                                cldImg={item.img}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                }}/> */}
                                <img src="https://res-console.cloudinary.com/dntfculcp/thumbnails/v1/image/upload/v1773052313/Y294aW5oYQ==/drilldown" alt=""
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                }} />
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
                </ImageList>
            </div>
        </>
    )
}