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
  useIonViewWillEnter,
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';


const Home: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [summaryData, setSummaryData] = useState([
    { title: 'Tasks Assigned', count: 0, icon: '📦', color: '#3b82f6' },
    { title: 'Tasks Completed', count: 0, icon: '✅', color: '#10b981' },
    { title: 'Pending / Late', count: 0, icon: '⚠️', color: '#f59e0b' },
  ]);

  useIonViewWillEnter(async () => {
    const user = supabase.auth.getUser();
    const { data: sessionData } = await user;
    const userId = sessionData?.user?.id;

    if (!userId) return;

    // Fetch profile name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    setStudentName(profile?.full_name || 'Student');

    // Fetch submission data
    const { data: tasks } = await supabase
      .from('submissions')
      .select('status')
      .eq('user_id', userId);

    if (tasks) {
      const assigned = tasks.length;
      const completed = tasks.filter((t) => t.status === 'Submitted').length;
      const pending = tasks.filter((t) => t.status !== 'Submitted').length;

      setSummaryData([
        { title: 'Tasks Assigned', count: assigned, icon: '📦', color: '#3b82f6' },
        { title: 'Tasks Completed', count: completed, icon: '✅', color: '#10b981' },
        { title: 'Pending / Late', count: pending, icon: '⚠️', color: '#f59e0b' },
      ]);
    }
  });

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
