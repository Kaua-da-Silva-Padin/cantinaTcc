import { Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { RiDrinksFill } from 'react-icons/ri';
import { FaHotdog, FaCandyCane, FaAsterisk, FaIceCream } from 'react-icons/fa6'
import { GiChipsBag } from 'react-icons/gi'

export default function FilterTabs({ setFilterTab, selectedFilterTab }) {
    // Cada valor do filtro e seu ícone.
    const filters = [
        [<FaAsterisk className='fs-1'/>,'Todos'],
        [<FaHotdog className='fs-1'/>,'Salgados'],
        [<GiChipsBag className='fs-1'/>,'Salgadinhos'],
        [<RiDrinksFill className='fs-1'/>,'Bebidas'],
        [<FaCandyCane className='fs-1'/>,'Doces'],
        [<FaIceCream className='fs-1'/>,'Sorvetes'],
    ]

    return(
        <div
        className="d-flex justify-content-center mb-4">
            <Tabs
            value={selectedFilterTab}
            onChange={(e,newValue)=>setFilterTab(newValue)}
            variant='scrollable'
            scrollButtons='auto'
            className='w-100 rounded rounded'>
                {filters.map(([icon, filter], i)=>(
                    <Tab
                    label={filter}
                    icon={icon}
                    key={i}
                    value={filter.toLowerCase()}
                    className='border-darken-b rounded mx-1 w-25'/>
                ))}
            </Tabs>
        </div>
    )
}