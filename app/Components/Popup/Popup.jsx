import { Backdrop, Button } from '@mui/material';
import { RiCloseFill } from 'react-icons/ri';

export default function Popup({ children, ...props }) {

    const closePopup = () => {
        if (typeof props.setState === 'function') {
            props.setState((prev) => {
                if (typeof prev === 'object' && prev !== null && 'state' in prev) {
                    return { ...prev, state: false };
                }
                
                return false;
            });
        }
    };

    return (
        <>
            <Backdrop
                open={Boolean(props.state)}
                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1200 }}
                onClick={closePopup}
            />

            {Boolean(props.state) && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ zIndex: 1201, pointerEvents: 'none' }}
                >
                    <div
                        style={{ pointerEvents: 'auto', maxHeight: '90vh' }}
                        className="border-darken rounded-2 m-4 p-4 bg-light text-dark shadow-box overflow-auto d-flex flex-column fs-4 w-90"
                    >
                        <section className="d-flex justify-content-between align-items-center">
                            <span>
                                {props.header}
                            </span>
                            <Button
                                variant="contained"
                                color="error"
                                className="fs-4"
                                onClick={closePopup}
                            >
                                <RiCloseFill />
                            </Button>
                        </section>
                        <hr />
                        {children}
                        <section className="d-flex justify-content-between">
                            {props.footer}
                        </section>
                    </div>
                </div>
            )}
        </>
    );
}