import { Link } from 'react-router';

//Um componente que será adicionado na página de ADM.

export default function AdmQuickButton(props) {
    return (
    <div onClick={() => alert(props.valor)} className="admQuickButton" id={props.id} style={{backgroundColor: `${props.backgroundColor}`, border: `0.17em solid ${props.primaryColor}`}}>
            <Link to={props.link}>
                <span style={{width: "100%", overflow: "wrap", color: `${props.primaryColor}`, fontSize: "1em", fontWeight: "700"}}>{props.title}</span>
            </Link>
        </div>
    )
}