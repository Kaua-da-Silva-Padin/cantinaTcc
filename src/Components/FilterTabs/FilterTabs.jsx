import { Tabs, Tab } from '@mui/material';
import { RiDrinksFill } from 'react-icons/ri';
import { FaAsterisk } from 'react-icons/fa6'
import { GiChipsBag, GiHotDog, GiChocolateBar, GiIceCreamScoop } from 'react-icons/gi'

export default function FilterTabs({ setFilterTab, selectedFilterTab }) {
    // Cada valor do filtro e seu ícone.
    const filters = [
        [<FaAsterisk className='fs-1'/>,'Todos'],
        [<GiHotDog className='fs-1'/>,'Salgados'],
        [<GiChipsBag className='fs-1'/>,'Salgadinhos'],
        [<RiDrinksFill className='fs-1'/>,'Bebidas'],
        [<GiChocolateBar className='fs-1'/>,'Doces'],
        [<GiIceCreamScoop className='fs-1'/>,'Sorvetes'],
    ]

    return(
        <div
        className="d-flex justify-content-center mb-4">
            <Tabs
            value={selectedFilterTab}
            onChange={(e,newValue)=>setFilterTab(newValue)}
            variant='scrollable'
            scrollButtons='auto'
            className='rounded py-1 w-100 mx-2'>
                {filters.map(([icon, filter], i)=>(
                    <Tab
                    label={filter}
                    icon={icon}
                    key={i}
                    value={filter.toLowerCase()}
                    className='rounded mx-1 w-50 border-darken'/>
                ))}
            </Tabs>
        </div>
    )
}