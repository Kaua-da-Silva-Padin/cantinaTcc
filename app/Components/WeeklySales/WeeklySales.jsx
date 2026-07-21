import { useMediaQuery } from '@mui/material';

export default function WeeklySales() {

    const isMobile = useMediaQuery('(max-width: 768px)') ? 'true' : 'false';

    return(
        <div
        className="d-flex justify-content-center align-items-center">
            <iframe
            src={`https://os-programadores.appsmith.com/app/lucros-cantinatec/page1-6a580675980d29f395ca698f?embed=true&isMobile=${isMobile}`}
            style={{
                width: '100dvw',
                height: '83dvh'
            }}
            className="m-1 border-darken rounded-2"></iframe>
        </div>
    )
}