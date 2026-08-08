import Header from "../../Components/Header/Header"
import FoodTable from "../../Components/FoodTable/FoodTable"
import DBManage from "../../Components/DBManage/DBManage"
import WeeklySales from "../../Components/WeeklySales/WeeklySales"
import BlockAdm from "../../Components/BlockAdm/BlockAdm"
import '/./index.css';
import { Link } from 'react-router';



import { useState } from "react"

export default function AdmPage() {
  {/*Query do input de pesquisa.*/ }
  const [searchTxt, setSearch] = useState('');

  {/*Filtro da barra selecionado atualmente.*/ }
  const [filterTab, setFilterTab] = useState('todos');

  {/*Preço total do carrinho a ser somado ou mostrado.*/ }
  const [cartPrice, setCartPrice] = useState(0);

  const blocks = [{ title: "Olá Funcionário", link: "/buy", id: "greetingsBlock" }, { title: "Gráfico", link: "/", id: "graphicBlock" }, { title: "Estatísticas", link: "/buy", id: "statisticBlock" }, { title: "Calendário", link: "/buy", id: "calendarBlock" }];

  const toolsAdmPageBar = [{ text: "Menu", link: "/adm" }, { text: "Pedidos", link: "/orders" }, { text: "Estoque", link: "/stock" }, { text: "Finanças", link: "/finance" }, { text: "Estatísticas", link: "/statistics" }, { text: "Funcionários", link: "/employees" }, { text: "Configurações", link: "/settings" }]
  return (
    <>

      <div id="groupAdmGeneral"> {/* Agrupamento geral de tudo que está na pagina adm */}

        <div id="admPageSideBar">

          <div id="admPageSideBarHeader">
            <b>ADMIN</b>
          </div>

          <div className="admPageSideBarTools">
            {toolsAdmPageBar.map((item, i) => {
              return (
                <Link to={item.link} key={i}> <span> {item.text}</span> </Link>
              )
            })}
          </div>

          <div id="admPageSideBarNotifications">
            <h5> Notificações </h5>
            <div className="admPageNotificationItem">
              <div className="admNotificationsTexts">
                <span>
                  <b> Notificação </b>
                </span>
                <span> Nova notificação que não tem nenhuma utilidade além de placeholder</span>
              </div>
              <span> ... </span>
            </div>
          </div>
        </div>
        {blocks.map((item, i) => {
          return (
            <BlockAdm title={item.title} link={item.link} id={item.id} key={i} />
          )
        })}
      </div>
      {/* <DBManage />
      <WeeklySales/> */}
    </>
  )
}