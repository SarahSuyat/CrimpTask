import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
} from '@ionic/react';

const Feedback: React.FC = () => {
  // Static feedback list — replace with Supabase fetch if needed
  const feedbackList = [
    {
      taskName: 'Wireframe Design',
      grade: 'A',
      comment: 'Excellent layout and user experience!',
      date: '2025-05-02',
    },
    {
      taskName: 'Login System Security',
      grade: 'B+',
      comment: 'Good security practices, consider adding 2FA.',
      date: '2025-05-01',
    },
    {
      taskName: 'Database Schema',
      grade: 'A-',
      comment: 'Well-structured schema with minor tweaks needed.',
      date: '2025-04-30',
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>💬 Feedback</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        {feedbackList.map((feedback, index) => (
          <IonCard key={index}>
            <IonCardHeader>
              <IonCardTitle>📝 {feedback.taskName}</IonCardTitle>
              <IonCardSubtitle>📅 {feedback.date}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem lines="none">
                <IonLabel>
                  <h2>🏅 Grade: {feedback.grade}</h2>
                  <p>💬 "{feedback.comment}"</p>
                </IonLabel>
              </IonItem>
            </IonCardContent>
          </IonCard>
        ))}

      </IonContent>
    </IonPage>
  );
};

export default Feedback;
