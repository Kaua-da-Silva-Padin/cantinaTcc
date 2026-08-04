import { Backdrop } from '@mui/material';
import { useState } from 'react';

export default function Popup({ children, ...props }) {
    const [popup, setPopup] = useState(true);

    const closePopup = () => setPopup(false);

    return (
        <>
            <Backdrop
            open={popup}
            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}
            onClick={closePopup} />

            {popup &&
                <div
                className="d-flex justify-content-center align-items-center h-90">
                <div
                style={{
                    zIndex: 99999,
                    position: 'fixed'
                }}
                className="border-darken rounded-2 m-4 p-4 bg-light text-dark shadow-box overflow-auto d-flex flex-column fs-4">
                    {children}
                </div>
            </div>
            }
        </>
    )
}