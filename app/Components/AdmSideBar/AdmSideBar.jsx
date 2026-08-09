import { Link } from 'react-router';

export default function AdmSideBar(props){
    const tools = props.tools;
    return(
         <div id="admPageSideBar"> 
            <div id="admPageSideBarHeader">
              <b>ADMIN</b>
            </div>

            <div className="admPageSideBarLinks">
              {tools.map((item, i) => {
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
    )
}