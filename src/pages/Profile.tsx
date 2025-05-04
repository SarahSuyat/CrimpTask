// src/pages/Profile.tsx
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonMenuButton,
    IonButtons,
    IonItem,
    IonLabel,
    IonButton,
    useIonRouter
  } from '@ionic/react';
  
  const Profile: React.FC = () => {
    const router = useIonRouter();
  
    const handleLogout = () => {
      // Clear session if stored, then redirect
      // Example: localStorage.removeItem("user");
      router.push("/CrimpTask", "back", "replace");
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonLabel>
              <h2>Student Name</h2>
              <p>student@example.com</p>
            </IonLabel>
          </IonItem>
  
          <IonButton expand="full" color="danger" onClick={handleLogout}>
            Logout
          </IonButton>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Profile;
  