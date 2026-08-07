import { Backdrop, Button } from '@mui/material';
import { RiCloseFill } from 'react-icons/ri';
import { useState } from 'react';

export default function Popup({ children, ...props }) {

    const closePopup = () => {
        props.setState(prev=>({
            ...prev,
            state: false
        }));
    }

    return (
        <>
            <Backdrop
            open={props.state}
            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}
            onClick={closePopup} />

            {props.state &&
            <div
            className="d-flex justify-content-center align-items-center h-90 position-absolute">
                <div
                style={{
                    zIndex: 99999,
                    position: 'fixed'
                }}
                className="border-darken rounded-2 m-4 p-4 bg-light text-dark shadow-box overflow-auto d-flex flex-column fs-4 w-90">
                    <section className='d-flex justify-content-between'>
                        <span>
                            {props.header}
                        </span>
                        <Button
                        variant='contained'
                        color='error'
                        className='fs-4'
                        onClick={closePopup}>
                            <RiCloseFill/>
                        </Button>
                    </section>
                    <hr />
                    {children}
                    <section className='d-flex justify-content-between'>
                        {props.footer}
                    </section>
                </div>
            </div>
            }
        </>
    )
}