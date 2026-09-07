import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from 'react';
import { styled, lighten, darken } from '@mui/system';

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: "#000000",
    backgroundColor: lighten("#ff850a", 0.85),
    ...theme.applyStyles('dark', {
        backgroundColor: darken("#ff850a", 0.8),
    }),
}));

const GroupItems = styled('ul')({
    padding: 0,
});

export default function RenderGroup({ produtos, productSearchName, setProductSearchName }) {
    // const [autoComplete, setAutoComplete] = useState("");
    const options = produtos.map(option => {
        const firstLetter = option.name[0].toUpperCase();

        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
        };
    });

    return (
        <Autocomplete
            options={options.sort((a, b) => a.firstLetter.localeCompare(b.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.name}
            value={productSearchName ? productSearchName : null}
            onChange={(event, newValue) => setProductSearchName(newValue)}
            sx={{ width: 300 }}
            renderInput={(params, option) => <TextField {...params} label="With categories"/>}
            renderGroup={(params) => (
                <li key={params.key}>
                    <GroupHeader>{params.group}</GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                </li>
            )}
        />
    );
}
