import { Link } from 'react-router';
import useState from 'react'
//Um componente que será adicionado na página de ADM.

export default function AdmQuickButton({title, action, backgroundColor, primaryColor, setDialog, produtos}) {
    
    return (
    <button  onClick={produtos ? dialog : ""} className={produtos ? "admQuickButton" : "admQuickButton disabledQuickBtn"} style={{ cursor: `${produtos ? "pointer" : "not-allowed"}`, backgroundColor: `${backgroundColor}`, border: `0.17em solid ${primaryColor}`}}>
                <span style={{width: "100%", overflow: "wrap", color: `${primaryColor}`, fontSize: "1em", fontWeight: "700"}}>{title}</span>
        </button>
    )

    function dialog(){
        setDialog(action)
    }
}