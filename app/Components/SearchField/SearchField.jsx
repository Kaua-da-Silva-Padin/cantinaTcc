import { TextField, IconButton, Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';

export default function SearchField({ setSearch, products }) {
  const [productNames, setProductNames] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (products) {
      setProductNames(products.map(item => ({ label: item.name })));
    }
  }, [products]);
  
  const triggerSearch = () => {
    setSearch(inputValue);
  };

  return (
    <div className='d-flex justify-content-center'>
      <div className='d-flex w-90 align-items-center'>
        <Autocomplete
          options={productNames}
          className='m-2 w-100'
          // Track input changes cleanly through state.
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          // Handle Enter keypress safely
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              triggerSearch();
            }
          }}
          // Fix: Must pass params to TextField
          renderInput={(params) => (
            <TextField
              {...params}
              label='Pesquisar...'
              variant='standard'
              color='inherit'
              className='m-2 rounded w-100 searchField'
            />
          )}
        />
        <IconButton
          size='large'
          color='inherit'
          className='bg-darken p-2 rounded-2 m-2'
          onClick={triggerSearch}
        >
          <RiSearchLine className='fs-2' />
        </IconButton>
      </div>
    </div>
  );
}