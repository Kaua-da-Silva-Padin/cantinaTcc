import { TextField, IconButton } from '@mui/material';
import { RiSearchLine } from 'react-icons/ri';

export default function SearchField() {

    return(
        <div
        className='d-flex justify-content-center mb-3'>
            <TextField
            type='search'
            label='Pesquisar...'
            variant='outlined'
            className='m-3'
            fullWidth
            />
            <IconButton
            size='large'
            color='inherit'
            className='me-3 my-3 border-darken rounded'>
                <RiSearchLine
                className='fs-1'/>
            </IconButton>
        </div>
    )
}