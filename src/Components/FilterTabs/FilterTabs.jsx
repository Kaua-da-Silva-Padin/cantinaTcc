import { Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { RiDrinksFill } from 'react-icons/ri';
import { FaHotdog, FaCandyCane, FaAsterisk } from 'react-icons/fa6'
import { GiChocolateBar } from 'react-icons/gi'

export default function FilterTabs() {
    const [value, setValue] = useState('todos');

    const filters = [
        [<FaAsterisk className='fs-1'/>,'Todos'],
        [<FaHotdog className='fs-1'/>,'Salgados'],
        [<RiDrinksFill className='fs-1'/>,'Bebidas'],
        [<FaCandyCane className='fs-1'/>,'Balas'],
        [<GiChocolateBar className='fs-1'/>,'Chocolates'],
    ]

    const handleFilterChange = (e, newValue)=> {
        setValue(newValue);
    }

    return(
        <div className="d-flex justify-content-center">
            <Tabs
            value={value}
            onChange={handleFilterChange}
            variant='scrollable'
            scrollButtons='auto'>
                {filters.map(([icon, filter], i)=>(
                    <Tab
                    label={filter}
                    icon={icon}
                    key={i}
                    value={filter.toLowerCase()}
                    className='border-darken-b rounded mx-1 '/>
                ))}
            </Tabs>
        </div>
    )
}