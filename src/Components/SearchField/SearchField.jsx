import { TextField, IconButton } from '@mui/material';
import { RiSearchLine } from 'react-icons/ri';

export default function SearchField({ setSearch }) {

    return(
        <div
        className='d-flex justify-content-center mb-3'>
            <TextField
            type='search'
            label='Pesquisar...'
            variant='standard'
            className='m-3 rounded w-75'
            onChange={e=>setSearch(e.target.value)}
            />
            <IconButton
            size='large'
            color='inherit'>
                <RiSearchLine
                className='fs-1'/>
            </IconButton>
        </div>
    )
}