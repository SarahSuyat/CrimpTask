import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonIcon,
} from "@ionic/react";
import { timeOutline, documentTextOutline, checkmarkCircleOutline, alertCircleOutline, closeCircleOutline } from 'ionicons/icons';
import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

interface Submission {
  id: number;
  status: "Submitted" | "Not Submitted" | "Late" | "Completed";
  time_taken: string;
  media_url?: string;
  submitted_at: string;
  evaluated: boolean;
  evaluation_notes?: string;
  user_id: string;
  task_id: number;
  user: {
    username?: string;
    email?: string;
  };
  task: {
    id: number;
    title: string;
    description?: string;
  };
}

const StudentSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: submissionsData, error: submissionsError } = await supabase
          .from("submissions")
          .select("*, user_id, task_id")
          .order("submitted_at", { ascending: false });

        if (submissionsError) {
          throw submissionsError;
        }

        if (!submissionsData || submissionsData.length === 0) {
          setSubmissions([]);
          return;
        }

        const taskIds = [...new Set(submissionsData.map(s => s.task_id))];
        const userIds = [...new Set(submissionsData.map(s => s.user_id))];

        const [tasksResponse, usersResponse] = await Promise.all([
          supabase
            .from("tasks")
            .select("id, title, description")
            .in("id", taskIds),
          supabase
            .from("users")
            .select("id, username, user_email")
            .in("id", userIds)
        ]);

        if (tasksResponse.error) throw tasksResponse.error;
        if (usersResponse.error) throw usersResponse.error;

        const tasksMap = new Map(tasksResponse.data?.map(task => [task.id, task]) || []);
        const usersMap = new Map(usersResponse.data?.map(user => [user.id, user]) || []);

        const formattedSubmissions = submissionsData.map(sub => ({
          ...sub,
          task: tasksMap.get(sub.task_id) || { id: sub.task_id, title: 'Unknown Task' },
          user: usersMap.get(sub.user_id) || { username: 'Unknown User' }
        }));

        setSubmissions(formattedSubmissions);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Submitted":
        return "primary";
      case "Late":
        return "warning";
      default:
        return "danger";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return checkmarkCircleOutline;
      case "Submitted":
        return documentTextOutline;
      case "Late":
        return alertCircleOutline;
      default:
        return closeCircleOutline;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Student Submissions</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard style={{ marginBottom: '24px' }}>
          <IonCardContent>
            <IonText color="primary">
              <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Submissions</h2>
            </IonText>
            
            {loading && <IonText>Loading submissions...</IonText>}
            {error && <IonText color="danger">{error}</IonText>}

            {!loading && !error && (
              <IonList style={{ padding: '0' }}>
                {submissions.length === 0 ? (
                  <IonItem>
                    <IonLabel>No submissions found</IonLabel>
                  </IonItem>
                ) : (
                  submissions.map((sub) => (
                    <IonItem key={sub.id} style={{ 
                      '--padding-start': '0',
                      '--inner-padding-end': '0',
                      marginBottom: '16px',
                      '--background': 'transparent'
                    }}>
                      <IonLabel style={{ paddingLeft: '12px' }}>
                        <h2 style={{ marginBottom: '8px', fontWeight: '500' }}>
                          {sub.user.username || sub.user.email || "Unknown"}
                        </h2>
                        <p style={{ marginBottom: '8px', color: '#666' }}>
                          {sub.task.title || `Task #${sub.task.id}`}
                        </p>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <IonChip color={getStatusColor(sub.status)}>
                            <IonIcon icon={getStatusIcon(sub.status)} />
                            <IonLabel>{sub.status}</IonLabel>
                          </IonChip>
                          <IonChip color="medium">
                            <IonIcon icon={timeOutline} />
                            <IonLabel>{sub.time_taken || "-"}</IonLabel>
                          </IonChip>
                          {sub.media_url && (
                            <IonChip color="primary" onClick={() => window.open(sub.media_url, '_blank')}>
                              <IonLabel>View Media</IonLabel>
                            </IonChip>
                          )}
                          <span style={{ fontSize: '0.8rem', color: '#666' }}>
                            {new Date(sub.submitted_at).toLocaleString()}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#666' }}>
                            {sub.evaluated ? "✅ Evaluated" : "⏳ Pending"}
                          </span>
                        </div>
                      </IonLabel>
                    </IonItem>
                  ))
                )}
              </IonList>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default StudentSubmissions;