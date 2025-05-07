import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import {
  listOutline,
  personOutline,
  logOutOutline,
  homeOutline,
} from 'ionicons/icons';

import { Redirect, Route } from 'react-router-dom';
import TaskList from './TaskList';
import Profile from './Profile';
import Home from './Home';

const Menu: React.FC = () => {
  const menuItems = [
    { name: 'Home', url: '/CrimpTask/app/home', icon: homeOutline },
    { name: 'Task List', url: '/CrimpTask/app/task-list', icon: listOutline },
    { name: 'Profile / Logout', url: '/CrimpTask/app/profile', icon: personOutline },
  ];

  return (
    <IonPage>
      <IonSplitPane when="md" contentId="main">
        {/* Side Menu */}
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {menuItems.map((item, index) => (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem routerLink={item.url} routerDirection="forward">
                  <IonIcon icon={item.icon} slot="start" />
                  {item.name}
                </IonItem>
              </IonMenuToggle>
            ))}
            {/* Logout button (optional) */}
            <IonButton
              routerLink="/CrimpTask"
              routerDirection="back"
              expand="full"
              color="danger"
            >
              <IonIcon icon={logOutOutline} slot="start" />
              Logout
            </IonButton>
          </IonContent>
        </IonMenu>

        {/* Main content */}
        <IonRouterOutlet id="main">
        <Route exact path="/CrimpTask/app/home" component={Home} />
          <Route exact path="/CrimpTask/app/task-list" component={TaskList} />
          <Route exact path="/CrimpTask/app/profile" component={Profile} />
          <Route exact path="/CrimpTask/app">
            <Redirect to="/CrimpTask/app/home" />
          </Route>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default Menu;
