import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { RiArrowDownSLine, RiCloseLine } from 'react-icons/ri';

export default function RenderGroup({ produtos, productSearchName, setProductSearchName }) {
    const options = produtos ?? [];

    return (
        <Autocomplete
            className="admProductAutocomplete"
            options={options}
            getOptionLabel={(option) => option.name}
            value={productSearchName ? productSearchName : null}
            onChange={(event, newValue) => setProductSearchName(newValue)}
            fullWidth
            clearOnEscape
            openOnFocus
            popupIcon={<RiArrowDownSLine aria-hidden="true" />}
            clearIcon={<RiCloseLine aria-hidden="true" />}
            noOptionsText="Nenhum produto encontrado"
            renderOption={(props, option) => (
                <li {...props} key={option.id ?? option.name}>
                    <span className="admProductOptionName">{option.name}</span>
                    {option.kind && <small>{option.kind}</small>}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Selecione um produto"
                    inputProps={{ ...params.inputProps, 'aria-label': 'Produto para editar' }}
                />
            )}
        />
    );
}
