import { ImageList, ImageListItem, ImageListItemBar, ListSubheader, Skeleton, Tooltip, IconButton, useMediaQuery } from '@mui/material';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { FaCartPlus } from 'react-icons/fa6';
import { useState, useEffect } from "react";
import supabase from '../../supabaseClient';

export default function FoodTable({ filterTxt, filterTab, cartPrice, setCartPrice }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        async function getProducts() {
            setLoading(true);
            const {data, error} = await supabase.from('products').select('*');

            if (data) {
                setProducts(data);
            } else if (error) {
                console.error(`Error selecting from supabase!\n${error.message}`);
            }
            setLoading(false);
        }

        getProducts();
    },[])

    // Inicia a "conexão" com o Cloudinary, 'dntfculcp' é o nome do ambiente em que as imagens se encontram.
    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dntfculcp'
        }
    })
    const foodData = [];

    // Formata o nome do item para um nome minusculo e sem espaços (utilizado para acessar a imagem do cloudinary).
    const formatName = (name)=> {
        return name.trim().toLowerCase().replaceAll(' ', '')
    }
    // Utilizado para quando queremos apenas formatar o preço de um item para mostra-lo para o usuário e não fazer operações com ele.
    const formatPrice = (price)=> {
        return price.toFixed(2).replace('.', ',')
    }

    const buyItem = (img, title, kind, price, stock)=> {
        setCartPrice(cartPrice+price);
        
    };

    // Mapeia a lista de produtos e a coloca em uma nova lista porém agora com sua imagem, tirada do Cloudinary.
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

    // Filtragem usando os filtros da barra horizontal, se o valor for igual a todos então mostre todos os items, se não, então mostre uma nova lista apenas com os items em que a chave 'kind' do item são iguais ao valor do filtro (ex: filtro => salgados e item.kind => Salgados).
    let filteredFoods =
    filterTab === 'todos' ? foodData
    :
    foodData.filter(item => item.kind === filterTab);

    // Filtragem que procura por quaisquer items que possuam o texto da pesquisa em seu título e retorna uma nova lista.
    filteredFoods = filteredFoods.filter(item => item.title.toLowerCase().includes(filterTxt));

    return(
        <div
        className="d-flex justify-content-center">
            {/*If the device is mobile only show 2 cols for the table, otherwise show 4*/}
            <ImageList
            cols={isMobile ? 2 : 4}
            rowHeight={320}
            className={`rounded mx-2 overflow-auto p-1`}
            sx={{
                width: '95dvw',
                height: isMobile ? '62dvh' : '65dvh'
            }}>
                {
                loading
                ?
                [...Array(isMobile ? 4 : 8)].map((_, i)=>(
                    <Skeleton
                    key={i}
                    className='bg-darken'
                    variant='rounded'
                    animation='wave'
                    style={{flexWrap: 'wrap'}}
                    sx={{height: '100%', width: '100%'}}/>
                ))
                :
                filteredFoods.map(item=>(
                    // Item da lista de imagens que muda de estilo automaticamente se perceber que o estoque do item é 0.
                    <Tooltip
                    key={item.title}
                    title={item.stock === 0 ? "Item Indisponível" : item.title}
                    slotProps={{
                        tooltip: {
                            sx: {
                                fontSize: '1.4rem !important',
                                backgroundColor: '#333',
                            }
                        }
                    }}
                    >
                        <ImageListItem
                        className={`bg-new-orange rounded-4 ${item.stock == 0 && 'unavailable-food'}`}
                        >
                            {/*Componente do cloudinary que aceita imagens em um formato "dinâmico" que muda dependendo do navegador que acessa o site, send a prioridade AVIF para navegadores suportados.*/}
                            <AdvancedImage
                            cldImg={item.img}
                            loading='lazy'
                            style={{
                                width: '100%',
                                height: '90%',
                                objectFit: 'contain',
                            }}/>
                            {/*Barra inferior de cada card. a propriedade sx (seria basicamente um style) desse elemento afeta o css interno do MUI, por isso parece tão estranho.*/}
                            <ImageListItemBar
                            className={`bg-brown fw-bold rounded-4 p-1`}
                            title={item.title}
                            subtitle={`R$ ${formatPrice(item.price)}`}
                            sx={{
                                "& .MuiImageListItemBar-subtitle": {
                                    fontSize: "1rem",
                                    color: 'rgb(255, 255, 255)',
                                },
                                "& .MuiImageListItemBar-title": {
                                    fontSize: '1.4rem',
                                    marginBottom: '2%',
                                    color: 'rgb(255, 255, 255)'
                                }
                            }}
                            actionIcon={
                                // Botão no canto inferior direito de cada card, ao clicar faz a soma do total atual do carrinho + o preço do item e devolve esse novo valor para o app.jsx que devolve pro Header.jsx que mostra esse valor em seu botão de carrinho.
                                <IconButton
                                onClick={
                                    ()=>buyItem(
                                        item.img,
                                        item.title,
                                        item.kind,
                                        item.price,
                                        item.stock
                                    )
                                }
                                className='text-light bg-darken rounded-4 p-2 mx-1'
                                style={{
                                    transition: 'all 200ms ease-out'
                                }}
                                sx={{
                                    ':active ': {
                                        scale: .9
                                    }
                                }}
                                title={`Adicionar ${item.title} ao carrinho (${formatPrice(item.price)})`}>
                                    <FaCartPlus className='fs-1'/>
                                </IconButton>
                            }/>
                        </ImageListItem>
                    </Tooltip>
                ))
                }

            </ImageList>
        </div>
    )
}