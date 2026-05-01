import { Tabs, Tab } from '@mui/material';
import { RiDrinksFill } from 'react-icons/ri';
import { FaAsterisk } from 'react-icons/fa6'
import { GiChipsBag, GiHotDog, GiChocolateBar, GiIceCreamScoop } from 'react-icons/gi'
import { useState } from 'react';


export default function FilterTabs({ setFilterTab, selectedFilterTab }) {
    // Cada valor do filtro e seu ícone.
    const filters = [
        [<FaAsterisk className='fs-4'/>,'Todos'],
        [<GiHotDog className='fs-4'/>,'Salgados'],
        [<GiChipsBag className='fs-4'/>,'Salgadinhos'],
        [<RiDrinksFill className='fs-4'/>,'Bebidas'],
        [<GiChocolateBar className='fs-4'/>,'Doces'],
        [<GiIceCreamScoop className='fs-4'/>,'Sorvetes'],
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

    /* console.log(JSON.stringify(clickedTab))
    This line was causing this error:
        FilterTabs.jsx?t=1777597768403:46 Uncaught TypeError: Converting circular structure to JSON
        --> starting at object with constructor 'HTMLButtonElement'
        |     property '__reactFiber$238xefxvewc' -> object with constructor 'FiberNode'
        --- property 'stateNode' closes the circle
        at JSON.stringify (<anonymous>)
        at FilterTabs (FilterTabs.jsx?t=1777597768403:46:20)
    */

    return(
        <div
        className="d-flex justify-content-center m-4 ml-2">
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
                minHeight: '48px', // Define a altura mínima do container das Tabs
            }}
            >
                {filters.map(([icon, filter], i)=>(
                    <Tab
                    label={filter}
                    icon={icon}
                    iconPosition='start'
                    key={i}
                    value={filter.toLowerCase()}
                    className='rounded-5 mx-1 border-darken'
                    sx={{
                        backgroundColor: '#ffffff',
                        transition: 'background-color 0.3s',
                        padding: '.5em 2.5em .5em 2.5em',
                        minHeight: '3.5em', // Define a altura mínima de cada Tab individualmente
                        height: '3.5em',    // Força a altura desejada
                    }}
                    />
                ))}
            </Tabs>
        </div>
    )
}