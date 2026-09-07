import Header from "../../Components/Header/Header"
import useMediaQuery from '@mui/material/useMediaQuery';
import FoodTable from "../../Components/FoodTable/FoodTable"
import DBManage from "../../Components/DBManage/DBManage"
import WeeklySales from "../../Components/WeeklySales/WeeklySales"
import AdmQuickButton from "../../Components/AdmQuickButton/AdmQuickButton"
import AdmSideBar from "../../Components/AdmSideBar/AdmSideBar"
import AdmDialog from "../../Components/AdmDialog/AdmDialog"
import supabase from "../../supabaseClient";

import '/./index.css';
import { Link } from 'react-router';
import { useState, useEffect, useCallback } from "react";

export default function AdmPage() {
  const [dialog, setDialog] = useState("none");
  const [sideBarOn, setSideBarOn] = useState(true);
  const [produtos, setProdutos] = useState();

  const toolsAdmPageBar = [
    { text: "Menu", link: "/adm" },
    { text: "Pedidos", link: "/orders" },
    { text: "Estoque", link: "/stock" },
    { text: "Finanças", link: "/finance" },
    { text: "Estatísticas", link: "/statistics" },
    { text: "Funcionários", link: "/employees" },
    { text: "Configurações", link: "/settings" }
  ];
  const blocks = [
    { title: "ADICIONAR PRODUTO", action: "addDialog", backgroundColor: "#b0fcb7", primaryColor: "#08e600" },
    { title: "EDITAR PRODUTO", action: "editDialog", backgroundColor: "#b0f3ff", primaryColor: "#00aeff" },
    { title: "REMOVER PRODUTO", action: "removeDialog", backgroundColor: "#ffb5b5", primaryColor: "#ff0000" },
  ];

  const fetchAll = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('products').select('*'); //O dado retornado é um array de objetos
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <>
      <div className={`groupAdmGeneral ${sideBarOn ? 'sideBarOn' : 'sideBarOff'} `}> {/* Agrupamento geral de tudo que está na pagina adm */}

        <div id="subGroupAdmGeneralOne"> {/* O primeiro subgrupo, que separa a barra lateral dos outros blocos exteriores */}
          <AdmSideBar tools={toolsAdmPageBar} />
        </div>

        <div id="subGroupAdmGeneralTwo"> {/*O segundo subgrupo, que separa os blocos e a navbar da barra lateral */}

          <div id="admPageNavBar">
            <button onClick={() => sideBarOn ? setSideBarOn(false) : setSideBarOn(true)}> <img src={sideBarOn ? '/imgs/closeicon.png' : '/imgs/more.png'} /> </button>
            <span> <b> Funcionário </b><img src="\.\public\imgs\user.png" /> </span>
          </div>

          <div className="admQuickButton" style={{ backgroundColor: "#fff2b3", border: "0.17em solid #ffc400" }}>
            <Link to="/orders">
              <span style={{ width: "100%", overflow: "wrap", color: "#ffc400", fontSize: "1em", fontWeight: "700" }}> PEDIDOS </span>
            </Link>
          </div>

          {blocks.map((item, i) => {
            return (
              <AdmQuickButton title={item.title} action={item.action} setDialog={setDialog} key={i} backgroundColor={item.backgroundColor} primaryColor={item.primaryColor} produtos={produtos} />
            )
          })}
          <div className="admDialogScreen">
            <AdmDialog dialog={dialog} setDialog={setDialog} produtos={produtos} setProdutos={setProdutos} fetchAll={fetchAll}/>
          </div>
        </div>
      </div>
      {/* <DBManage />
      <WeeklySales/> */}
    </>
  )
}