import { TextField, MenuItem, Button, Tooltip } from '@mui/material';
import supabase from '../../supabaseClient';
import { useState } from 'react';
import { RiSettings3Fill, RiCloseFill, RiSendPlaneFill } from 'react-icons/ri';

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
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([
        {'name': 'Ação', 'id': 'type', 'type': 'text', 'select': true, 'values': ['Atualizar Produto', 'Inserir Novo Produto', 'Verificar Produto']},
        {'name': 'Dados', 'id': 'data', 'type': 'text', 'select': true, 'values': ['Estoque', 'Preço']},
        {'name': 'Produto', 'id': 'product', 'type': 'text'},
        {'name': 'Novo Valor', 'id': 'newValue', 'type': 'number'}
    ]);
    const [confDB, setConfDB] = useState(
        {'action': '', 'data': '', 'product': '', 'newValue': ''}
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

    return(
        <>
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
                            select={option.select}>

                            </LblInput>
                        ))}
                    </section>
                    <hr />
                    <section
                    className='d-flex justify-content-center gap-2'>
                        <Button
                        variant='contained'
                        color='primary'
                        className='w-50 fs-5'
                        size='large'>
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
        </>
    )
}