import { ImageList, ImageListItem, ImageListItemBar, IconButton, useMediaQuery } from '@mui/material';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { FaCartPlus } from 'react-icons/fa6';

export default function FoodTable({ filterTxt, filterTab, cartPrice, setCartPrice }) {
    // Implementar o banco de dados mais tarde no projeto, puxa as informações e dá um Array.push(info) nessa lista de objetos.
    const products = [
        {
            name: 'Coca Cola',
            kind: 'bebidas',
            stock: 1,
            price: 6
        },
        {name: 'Poty', kind: 'bebidas', stock: 0, price: 6},
        {name: 'Coxinha', kind: 'salgados', stock: 1, price: 6},
        {name: 'Mini Pizza', kind: 'salgados', stock: 0, price: 7}
    ]

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
            rowHeight={250}
            className={`rounded mx-2 overflow-auto ${!isMobile && 'p-2'}`}
            sx={{
                height: isMobile && '60dvh',
                background: filteredFoods.length != 0 && 'rgba(255,100,0,.4)'
            }}>
                {filteredFoods.map(item=>(
                    // Item da lista de imagens que muda de estilo automaticamente se perceber que o estoque do item é 0.
                    <ImageListItem
                    key={item.title}
                    className={`bg-orange rounded ${item.stock == 0 && 'unavailable-food'}`}
                    title={item.title}
                    >
                        {/*Componente do cloudinary que aceita imagens em um formato "dinâmico" que muda dependendo do navegador que acessa o site, send a prioridade AVIF para navegadores suportados.*/}
                        <AdvancedImage
                        cldImg={item.img}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}/>
                        {/*Barra inferior de cada card. a propriedade sx (seria basicamente um style) desse elemento afeta o css interno do MUI, por isso parece tão estranho.*/}
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
                            className='text-light bg-success rounded p-2 m-2'
                            style={{
                                transition: 'all 1s ease-out'
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
                ))}

            </ImageList>
        </div>
    )
}