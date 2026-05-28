import { TextField, MenuItem, Button, Tooltip, IconButton, Snackbar, Alert } from '@mui/material';
import supabase from '../../supabaseClient';
import { useState } from 'react';
import { RiSettings3Fill, RiCloseFill, RiSendPlaneFill } from 'react-icons/ri';
import { FaX } from 'react-icons/fa6';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';

function LblInput({ ...props }) {
    return(
        props.select
        ?
        <>
            <label
            htmlFor={props.id}>
                <h2>
                    {props.name}
                </h2>
            </label>
            <TextField
            {...props}
            select
            name={props.name}
            label={`Selecionar ${props.label}`}
            variant='filled'
            className='w-100 bg-light rounded-t-2 mb-3'
            defaultValue={props.values[0]}
            placeholder={props.placeholder}>
                {props.values.map((item, i)=>(
                    <MenuItem
                    key={i}
                    value={item}>
                        {item}
                    </MenuItem>
                ))}
            </TextField>
        </>
        :
        <>
            <label
            htmlFor={props.id}>
                <h2>
                    {props.name}
                </h2>
            </label>
            <TextField
            {...props}
            className='w-100 bg-light rounded-t-2 mb-3'
            name={props.name}
            label={props.label}
            variant='filled'
            placeholder={props.placeholder}/>
        </>
    )
}

export default function DBManage() {
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([
        {'name': 'Ação', 'id': 'action', 'type': 'text', 'select': true, 'values': ['Atualizar Produto', 'Inserir Novo Produto', 'Verificar Produto']},
        {'name': 'Dados', 'id': 'data', 'type': 'text', 'select': true, 'values': ['Estoque', 'Preço']},
        {'name': 'Produto', 'id': 'product', 'type': 'text'},
        {'name': 'Novo Valor', 'id': 'newValue', 'type': 'number'}
    ]);
    const [confDB, setConfDB] = useState(
        {'action': '', 'data': '', 'product': '', 'newValue': ''}
    );
    const [itemAlert, setItemAlert] = useState({
        'state': false,
        'message': '',
    });

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dntfculcp'
        }
    })
    const productData = [];
    
    const formatName = (name)=> {
        return name.trim().toLowerCase().replaceAll(' ', '')
    }

    const closeAlert = (e, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setItemAlert(prev => ({
            ...prev,
            state: false
        }));
    };
    
    const closeBtnAlert = (
        <IconButton
        aria-label="close"
        color="inherit"
        onClick={closeAlert}>
            <FaX className='text-danger'/>
        </IconButton>
    );

    async function insertProducts() {
        // setLoading(true);
        // const {data, error} = await supabase.from('products');
        
        // if (data) {
        //     setProducts(data);
        // } else if (error) {
        //     console.error(`Error selecting from supabase!\n${error.message}`);
        // }

        // setLoading(false);
    }

    async function updateProducts() {
        // setLoading(true);
        // const {data, error} = await supabase.from('products');
        
        // if (data) {
        //     setProducts(data);
        // } else if (error) {
        //     console.error(`Error selecting from supabase!\n${error.message}`);
        // }

        // setLoading(false);
    }

    async function selectProduct(product) {}

    const formatInput = (id)=> {
        let txt = document.getElementById(id).innerText;

        if (txt.length == '') {
            txt = document.getElementById(id).value;
        }

        return txt.trim().split(' ')[0].toLowerCase();
    }

    const handleDBManage = ()=> {
        try {
            let action = formatInput('action');
            let product = formatInput('product');
            console.log(product);
            

            switch (action) {
                case 'atualizar':
                    updateProducts();
                    break;
                case 'inserir':
                    insertProducts();
                    break;
                case 'verificar':
                    selectProduct(product);    
                    break;
                case '':
                    break;
            }

            setItemAlert({
                state: true,
                message: `Ação ${action} registrada!`
            });
        }
        catch (err) {
            console.error(`Something went wrong!\nERROR: ${err}`);
        }
    };

    return(
        <>
            <Snackbar
            open={itemAlert.state}
            message={itemAlert.message}
            autoHideDuration={6000}
            onClose={closeAlert}
            action={closeBtnAlert}
            sx={{ zIndex: 9999999 }}
            >
                <Alert
                onClose={closeAlert}
                severity="success"
                variant="filled"
                >
                    <h6
                    style={{ color: 'rgba(255,255,255,.6)' }}>
                        <i>
                            Aperte <kbd>esc</kbd> ou clique no x para fechar esta janela
                        </i>
                    </h6>
                    <div>
                        <h3>
                            {itemAlert.message}
                        </h3>
                    </div>
                </Alert>
            </Snackbar>
            <div
            className="d-flex justify-content-center">
                <div
                className='w-75 bg-new-orange p-4 m-2 rounded-2 d-flex flex-column'>
                    <h2>
                        <RiSettings3Fill
                        className='me-2'/>
                        <b>
                            Meus Produtos
                        </b>
                    </h2>
                    <hr />
                    <section className='mx-4'>
                        {options.map((option, i)=>(
                            <LblInput
                            key={i}
                            type={option.type}
                            label={option.name}
                            name={option.name}
                            id={option.id}
                            values={option.values}
                            select={option.select}/>
                        ))}
                    </section>
                    <hr />
                    <section
                    className='d-flex justify-content-center gap-2'>
                        <Button
                        variant='contained'
                        color='primary'
                        className='w-50 fs-5'
                        size='large'
                        onClick={handleDBManage}>
                            <RiSendPlaneFill 
                            className='me-2 fs-2' />
                            Submit
                        </Button>
                        <Button
                        variant='contained'
                        color='error'
                        className='w-50 fs-5'>
                            <RiCloseFill
                            className='me-2 fs-2' />
                            Limpar
                        </Button>
                    </section>
                </div>
            </div>

            {/* FIX LATER */}
            {/* <div
            className='m-2 p-2 rounded-2 bg-new-orange d-flex align-items-center'>
                <h3>
                    {selectedProduct.map((product, i)=>(
                        product.name
                    ))}
                </h3>
            </div> */}

        </>
    )
}