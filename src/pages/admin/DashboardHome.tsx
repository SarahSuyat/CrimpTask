import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import {
  peopleOutline,
  documentTextOutline,
  cloudUploadOutline,
} from "ionicons/icons";

const DashboardHome: React.FC = () => {
  // Updated stats without the "Completed & Evaluated" card
  const summaryStats = [
    {
      title: "Total Students",
      count: 120,
      icon: peopleOutline,
      color: "primary",
    },
    {
      title: "Total Tasks Created",
      count: 45,
      icon: documentTextOutline,
      color: "tertiary",
    },
    {
      title: "Pending Submissions",
      count: 18,
      icon: cloudUploadOutline,
      color: "warning",
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            {summaryStats.map((stat, index) => (
              <IonCol size="12" size-md="6" size-lg="4" key={index}>
                <IonCard color={stat.color}>
                  <IonCardContent className="ion-text-center">
                    <IonIcon icon={stat.icon} style={{ fontSize: "40px" }} />
                    <h2>{stat.count}</h2>
                    <p>{stat.title}</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default DashboardHome;
