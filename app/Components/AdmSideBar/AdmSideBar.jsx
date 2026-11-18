import { NavLink } from 'react-router';

export default function AdmSideBar(props){
    const tools = props.tools;
    const closeSidebar = props.onClose;
    const renderLinks = (links) => links.map((item) => (
      <NavLink to={item.link} key={item.link} end={item.link === "/"}>
        <span>{item.text}</span>
      </NavLink>
    ));

    return(
         <div id="admPageSideBar">
            <div id="admPageSideBarHeader">
              <b>ADMIN</b>
              {closeSidebar && (
                <button type="button" className="admPageSideBarClose" onClick={closeSidebar} aria-label="Fechar menu">X</button>
              )}
            </div>

            {props.navigationGroups ? (
              <nav className="admPageSideBarNavigation" aria-label="Navegação administrativa">
                <div className="admPageSideBarSpeedDialGroup">
                  <div className="admPageSideBarLinks">
                    {renderLinks(props.navigationGroups.speedDial)}
                  </div>
                </div>
                <div className="admPageSideBarLinks admPageSideBarAdminLinks">
                  {renderLinks(props.navigationGroups.admin)}
                </div>
              </nav>
            ) : (
              <nav className="admPageSideBarLinks" aria-label="Navegação administrativa">
                {renderLinks(tools)}
              </nav>
            )}

            <div id="admPageSideBarNotifications">
              <h5>Notificações</h5>
              <div className="admPageNotificationItem">
                <div className="admNotificationsTexts">
                  <span>Nenhuma notificação nova.</span>
                </div>
              </div>
            </div>
          </div>
    )
}