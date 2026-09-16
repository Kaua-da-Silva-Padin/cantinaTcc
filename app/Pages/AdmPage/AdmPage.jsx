import WeeklySales from "../../Components/WeeklySales/WeeklySales"
import AdmQuickButton from "../../Components/AdmQuickButton/AdmQuickButton"
import AdmSideBar from "../../Components/AdmSideBar/AdmSideBar"
import AdmDialog from "../../Components/AdmDialog/AdmDialog"
import supabase from "../../supabaseClient";
import packageJson from "../../../package.json";
import '/./index.css';
import { Link } from 'react-router';
import { useState, useEffect, useCallback } from "react";
import { Avatar } from '@mui/material';
import { stringAvatar } from '../../Components/MenuPageLinks/MenuPageLinks';

export default function AdmPage() {
  const [dialog, setDialog] = useState("none");
  const [sideBarOn, setSideBarOn] = useState(false);
  const [produtos, setProdutos] = useState();
  const [currentTime, setCurrentTime] = useState(new Date());

  const loggedInUser = typeof sessionStorage !== "undefined"
    ? sessionStorage.getItem("loggedInUser")
    : null;

  let loggedInUserName = loggedInUser;

  const parsedUser = JSON.parse(loggedInUser);

  loggedInUserName = parsedUser?.name ?? parsedUser?.nome ?? loggedInUser;

  const date = currentTime;
  const currentYear = date.getFullYear();
  const currentDay = date.getDate();
  const currentMonth = date.toLocaleDateString("pt-BR", { month: "long" });

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const capitalize = (str) => {
    const value = String(str);
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  const toolsAdmPageBar = [
    { text: "Menu", link: "/adm" },
    { text: "Home", link: "/home" },
    { text: "Reg. Usuário", link: "/" },
    { text: "Login", link: "/login" },
    { text: "Comprar", link: "/buy" },
    { text: "Perfil", link: "/profile" },
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
      {
      loggedInUser?.type === 'admin' ?
      <div className={`groupAdmGeneral ${sideBarOn ? 'sideBarOn' : 'sideBarOff'} `}>

        <div id="subGroupAdmGeneralOne">
          <AdmSideBar tools={toolsAdmPageBar} />
        </div>

        <main id="subGroupAdmGeneralTwo">

          <div id="admPageNavBar" className="gap-4">
            <button aria-label={sideBarOn ? "Fechar menu" : "Abrir menu"} onClick={() => setSideBarOn(current => !current)}>
              <img src={sideBarOn ? '/imgs/closeicon.png' : '/imgs/more.png'} alt="" />
            </button>
            <div className="admPageStatus">
              <span>
                {`${currentDay} de ${capitalize(currentMonth)} de ${currentYear} ${currentTime.toLocaleTimeString("pt-BR")}`}
              </span>
              <span>Versão: {packageJson.version}</span>
              <span className="systemStatus">Status do Sistema: Ativo</span>
              <Link to={'/profile'} className="text-decoration-none d-flex align-items-center gap-2 text-light fs-5">
                {/* <img src="/imgs/user.png" alt="" /> */}
                <b>
                  {loggedInUserName || "Funcionário"}
                </b>
                <Avatar {...stringAvatar(loggedInUserName || 'User')} />
              </Link>
            </div>
          </div>

          <div className="admQuickButton admOrdersButton m-2" style={{ backgroundColor: "#fff2b3", border: "0.17em solid #ffc400" }}>
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
      :
      <h4 className="text-center text-danger">
        A página de administração é reservada <b>apenas</b> para administradores!
      </h4>
      }
    </>
  )
}