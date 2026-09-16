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
  const [sideBarOn, setSideBarOn] = useState(false);
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
      if (error) throw error;
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setProdutos([]);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    setSideBarOn(window.innerWidth > 900);
  }, []);

  return (
    <>
      <div className={`groupAdmGeneral ${sideBarOn ? 'sideBarOn' : 'sideBarOff'} `}>

        <div id="subGroupAdmGeneralOne">
          <AdmSideBar tools={toolsAdmPageBar} />
        </div>

        <main id="subGroupAdmGeneralTwo">

          <div id="admPageNavBar">
            <button aria-label={sideBarOn ? "Fechar menu" : "Abrir menu"} onClick={() => setSideBarOn(current => !current)}>
              <img src={sideBarOn ? '/imgs/closeicon.png' : '/imgs/more.png'} alt="" />
            </button>
            <div className="admPageStatus">
              <span>7 de Agosto de 2026 08:39</span>
              <span>Versão: X</span>
              <span className="systemStatus">Status do Sistema: Ativo</span>
              <b>Funcionário</b>
              <img src="/imgs/user.png" alt="" />
            </div>
          </div>

          <div className="admQuickButton admOrdersButton" style={{ backgroundColor: "#fff2b3", border: "0.17em solid #ffc400" }}>
            <Link to="/orders">
              <span style={{ color: "#ffc400" }}>FILA<br />VIRTUAL</span>
            </Link>
          </div>

          {blocks.map((item, i) => {
            return (
              <AdmQuickButton title={item.title} action={item.action} setDialog={setDialog} key={i} backgroundColor={item.backgroundColor} primaryColor={item.primaryColor} produtos={produtos} />
            )
          })}
          <section className="admContent">
            <WeeklySales />
          </section>

          <div className={`admDialogScreen ${dialog !== "none" ? "isOpen" : ""}`}>
            <AdmDialog dialog={dialog} setDialog={setDialog} produtos={produtos} setProdutos={setProdutos} fetchAll={fetchAll}/>
          </div>
          {produtos === undefined && (
            <div className="admLoading" role="status" aria-live="polite">
              <div className="admLoadingSpinner" />
              <span>Carregando...</span>
            </div>
          )}
        </main>
      </div>
    </>
  )
}