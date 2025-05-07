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
  } from "@ionic/react";
  
  import {
    homeOutline,
    listOutline,
    peopleOutline,
    personOutline,
    logOutOutline,
  } from "ionicons/icons";
  
  import { Redirect, Route } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import TaskManagement from "./TaskManagement";
import StudentSubmissions from "./StudentSubmissions";
import AdminProfile from "./AdminProfile";
  
 
  
  
  const AdminDashboard: React.FC = () => {
    const adminRoutes = [
      { name: "Dashboard Home", url: "/CrimpTask/admin/home", icon: homeOutline },
      { name: "Task Management", url: "/CrimpTask/admin/task-management", icon: listOutline },
      { name: "Student Submissions", url: "/CrimpTask/admin/student-submissions", icon: peopleOutline },
      { name: "Profile / Logout", url: "/CrimpTask/admin/profile", icon: personOutline },
    ];
  
    return (
      <IonPage>
        <IonSplitPane when="md" contentId="admin-main">
          <IonMenu contentId="admin-main">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Instructor Menu</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              {adminRoutes.map((item, index) => (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem routerLink={item.url} routerDirection="forward">
                    <IonIcon icon={item.icon} slot="start" />
                    {item.name}
                  </IonItem>
                </IonMenuToggle>
              ))}
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
  
          <IonRouterOutlet id="admin-main">
            <Route exact path="/CrimpTask/admin/home" component={DashboardHome} />
            <Route exact path="/CrimpTask/admin/task-management" component={TaskManagement} />
            <Route exact path="/CrimpTask/admin/student-submissions" component={StudentSubmissions} />
            <Route exact path="/CrimpTask/admin/profile" component={AdminProfile} />
            <Route exact path="/CrimpTask/admin">
              <Redirect to="/CrimpTask/admin/home" />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonPage>
    );
  };
  
  export default AdminDashboard;
  