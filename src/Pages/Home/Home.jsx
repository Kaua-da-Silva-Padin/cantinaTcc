import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer"
import { useMediaQuery, Tooltip, Box } from "@mui/material";

export default function Home() {

    const isMobile = useMediaQuery('(max-width: 768px)');

    return(
        <>
            <Header cartPrice={0}/>

            <main className="m-4 p-2">
                <section>
                    <h1 className="display-4 fw-bold pb-4">
                        A cantina online da sua escola!
                    </h1>
                    <div
                    className={`d-flex justify-content-around align-items-center ${isMobile ? 'flex-column gap-4' : ''}`}>
                        <h4 className="text-center p-2 mx-2">
                            Bem-vindo à CantinaTec, a sua cantina online! Aqui você pode explorar uma variedade de deliciosos pratos e bebidas, tudo ao alcance de um clique. Navegue pelo nosso cardápio, escolha suas opções favoritas e faça seu pedido de forma rápida e fácil. Aproveite a conveniência de ter suas refeições favoritas prontas para retirada. Bom apetite!
                        </h4>
                        <Tooltip
                        title='Foto da Etec Elias Nechar, escola onde o projeto foi desenvolvido.'
                        slotProps={{
                            tooltip: {
                                sx: {
                                    fontSize: '1.2rem !important',
                                    backgroundColor: '#333',
                                }
                            }
                        }}>
                            <img
                            src="https://bkpsitecpsnew.blob.core.windows.net/uploadsitecps/sites/1/2020/10/etec-elias-nechar.jpg"
                            alt="Etec Elias Nechar"
                            className="rounded-2 mx-2 border border-2 border-dark"
                            width='350dvw' />
                        </Tooltip>
                    </div>
                </section>

                <hr />

                <section>
                    <h3 className="display-5 fw-bold pb-4">
                        Faça seu pedido agora mesmo!
                    </h3>
                    
                    <div
                    className={`d-flex justify-content-around ${isMobile ? 'flex-column gap-4' : ''}`}>
                        <Box
                        className="bg-dark text-light rounded-2 p-2 mx-2 w-100 h-50"
                        sx={{
                            transition: '200ms ease-out all',
                            '&:hover': {
                                scale: 1.02,
                            }
                        }}>
                            <h2 className="text-center">
                                ❌ Sem o nosso site!
                            </h2>
                            <ul className="list-group">
                                <li
                                className="list-group-item list-group-item-danger fs-4">
                                    ❌ Filas longas e demoradas para fazer seu pedido!
                                </li>
                                <li
                                className="list-group-item list-group-item-danger fs-4">
                                    ❌ Dificuldade em escolher o que comer!
                                </li>
                                <li
                                className="list-group-item list-group-item-danger fs-4">
                                    ❌ Perder tempo de aula com pedidos e trabalho!
                                </li>
                            </ul>
                        </Box>
                        <Box
                        className="bg-dark text-light rounded-2 p-2 mx-2 w-100 h-50"
                        sx={{
                            transition: '200ms ease-out all',
                            '&:hover': {
                                scale: 1.02,
                            }
                        }}>
                            <h2 className="text-center">
                                ✔ Com o nosso site!
                            </h2>
                            <ul className="list-group">
                                <li
                                className="list-group-item list-group-item-success fs-4">
                                    ✔ Filas mais curtas e rápidas para fazer seu pedido!
                                </li>
                                <li
                                className="list-group-item list-group-item-success fs-4">
                                    ✔ Facilidade em escolher o que comer, com fotos e descrições de cada item!
                                </li>
                                <li
                                className="list-group-item list-group-item-success fs-4">
                                    ✔ Ganhar mais tempo de aula para aproveitar melhor seu dia!
                                </li>
                            </ul>
                        </Box>
                    </div>
                </section>
                
            </main>

            <Footer/>
        </>
    )
}