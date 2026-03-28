import { TextField, IconButton } from '@mui/material';
import { RiSearchLine } from 'react-icons/ri';

export default function SearchField({ setSearch }) {

    const handleSearch = (e)=> {
        const input = e.currentTarget.previousSibling.querySelector('input');
        let inputVal = input.value;
        setSearch(inputVal);
    }

    const handleKeySearch = (e)=> {
        let key = e.key;
        let input = e.currentTarget.querySelector('input');

        if (key === 'Enter') {
            let searchTxt = input.value;
            setSearch(searchTxt)
        }
    }

    return(
        <div
        className='d-flex justify-content-center mb-3'>
            <TextField
            type='search'
            label='Pesquisar...'
            variant='standard'
            className='m-3 rounded w-75'
            onKeyDown={handleKeySearch}
            />
            <IconButton
            size='large'
            color='inherit'
            onClick={handleSearch}>
                <RiSearchLine
                className='fs-1'/>
            </IconButton>
        </div>
    )
}