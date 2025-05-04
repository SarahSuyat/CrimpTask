import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';

const Home: React.FC = () => {
  const studentName = 'Bro'; // Replace with dynamic name from session or storage

  const summaryData = [
    {
      title: 'Tasks Assigned',
      count: 12,
      icon: '📦',
      color: '#3b82f6', // blue
    },
    {
      title: 'Tasks Completed',
      count: 8,
      icon: '✅',
      color: '#10b981', // green
    },
    {
      title: 'Pending / Late',
      count: 4,
      icon: '⚠️',
      color: '#f59e0b', // yellow
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        {/* Welcome Message */}
        <h2 style={{ fontWeight: 'bold', marginTop: '10px' }}>
          Welcome, {studentName}!
        </h2>

        {/* Summary Cards */}
        <IonGrid>
          <IonRow>
            {summaryData.map((card, index) => (
              <IonCol size="12" sizeMd="4" key={index}>
                <IonCard
                  style={{
                    backgroundColor: card.color,
                    color: '#fff',
                    borderRadius: '1rem',
                  }}
                >
                  <IonCardHeader>
                    <IonCardTitle style={{ fontSize: '1.5rem' }}>
                      {card.icon} {card.title}
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {card.count}
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

export default Home;
