// app/Components/Header/Header.jsx
import { ScopedCssBaseline } from '@mui/material';
import { Link } from 'react-router';

export default function Header(props) {

    return (
        <ScopedCssBaseline>
            <div 
                className='d-flex justify-content-center gap-2 mb-2 p-2 border-darken-b' 
                style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}
            >
                
                <div>
                    <h1 className='space-grotesk fw-bold'>
                        <Link to='/home' className='text-decoration-none text-dark'>
                            <img
                                src="/imgs/coxinhaFormada.png"
                                alt="Imagem de uma Coxinha Formada" 
                                width={80}
                                className='me-2'
                            />
                            CantinaTec
                        </Link>
                    </h1>
                </div>
            </div>
        </ScopedCssBaseline>
    );
}