import { Link } from 'react-router';

//Um componente que será adicionado na página de ADM.  

export default function BlockAdm(props) {
    return (
        <Link to={props.link}>
            <div className="blockAdm" id={props.id}>
                {props.title}
            </div >
        </Link>
    )
}