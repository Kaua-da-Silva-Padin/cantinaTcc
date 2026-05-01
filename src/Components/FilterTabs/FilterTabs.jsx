import { Tabs, Tab } from '@mui/material';
import { RiDrinksFill } from 'react-icons/ri';
import { FaAsterisk } from 'react-icons/fa6'
import { GiChipsBag, GiHotDog, GiChocolateBar, GiIceCreamScoop } from 'react-icons/gi'
import { useState } from 'react';


export default function FilterTabs({ setFilterTab, selectedFilterTab }) {
    // Cada valor do filtro e seu ícone.
    const filters = [
        [<FaAsterisk className='fs-2'/>,'Todos'],
        [<GiHotDog className='fs-2'/>,'Salgados'],
        [<GiChipsBag className='fs-2'/>,'Salgadinhos'],
        [<RiDrinksFill className='fs-2'/>,'Bebidas'],
        [<GiChocolateBar className='fs-2'/>,'Doces'],
        [<GiIceCreamScoop className='fs-2'/>,'Sorvetes'],
    ]

    

    const [clickedTab, setClickedTab] = useState();
    

    function highlightElement(e) {
        setClickedTab(e);

        if (e.target.ariaSelected){
            e.target.style.backgroundColor = "#FF9D39";
        } else{
            e.target.style.backgroundColor = "#ffffff";
        }

        console.log("")
    }

    // console.log(JSON.stringify(clickedTab))

    return(
        <div
        className="d-flex justify-content-center m-4">
            <Tabs
            value={selectedFilterTab}
            onChange={(e, newValue)=>setFilterTab(newValue)}
            variant='scrollable'
            scrollButtons='auto'
            className='rounded py-1 w-100 mx-2'
            sx={{
                '& .Mui-selected': {
                    backgroundColor: '#FF9D39 !important',
                    color: '#fff !important',
                },
            }}
            >
                {filters.map(([icon, filter], i)=>(
                    <Tab
                    label={filter}
                    icon={icon}
                    iconPosition='start'
                    key={i}
                    value={filter.toLowerCase()}
                    className='rounded-5 mx-1 w-20 border-darken'
                    sx={{
                        backgroundColor: '#ffffff',
                        transition: 'background-color 0.3s',
                    }}
                    />
                ))}
            </Tabs>
        </div>
    )
}