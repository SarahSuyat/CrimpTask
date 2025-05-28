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
    { title: 'Pending', count: 0, icon: '⚠️', color: '#f59e0b' },
  ]);

  const fetchData = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error getting user:", userError);
      return;
    }

    const userId = user.id;

    // Fetch student name
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    } else {
      setStudentName(profile?.full_name || 'Student');
    }

    // Fetch total tasks assigned (from tasks table)
    const { count: totalTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true });

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      return;
    }

    // Fetch user's submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('status')
      .eq('user_id', userId);

    if (submissionsError) {
      console.error("Error fetching submissions:", submissionsError);
      return;
    }

    // Calculate statistics
    const assigned = totalTasks || 0;
    const completed = submissions?.filter(s => s.status === 'Completed').length || 0;
    const pending = assigned - completed;

    setSummaryData([
      { title: 'Tasks Assigned', count: assigned, icon: '📦', color: '#3b82f6' },
      { title: 'Tasks Completed', count: completed, icon: '✅', color: '#10b981' },
      { title: 'Pending', count: pending, icon: '⚠️', color: '#f59e0b' },
    ]);
  };

  useIonViewWillEnter(() => {
    fetchData();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2 style={{ fontWeight: 'bold', marginTop: '10px' }}>
          Welcome Student!
        </h2>

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
