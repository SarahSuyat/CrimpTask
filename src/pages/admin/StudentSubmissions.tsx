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
} from "@ionic/react";
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

        // Fetch submissions with user_id and task_id
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

        // Get unique IDs for related data
        const taskIds = [...new Set(submissionsData.map(s => s.task_id))];
        const userIds = [...new Set(submissionsData.map(s => s.user_id))];

        // Fetch related data in parallel
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

        // Create lookup maps
        const tasksMap = new Map(tasksResponse.data?.map(task => [task.id, task]) || []);
        const usersMap = new Map(usersResponse.data?.map(user => [user.id, user]) || []);

        // Format the data
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Student Submissions</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonText color="primary">
              <h2>Submissions Table</h2>
            </IonText>
            
            {loading && <IonText>Loading submissions...</IonText>}
            {error && <IonText color="danger">{error}</IonText>}

            {!loading && !error && (
              <IonGrid>
                <IonRow className="ion-text-bold">
                  <IonCol>Student</IonCol>
                  <IonCol>Task</IonCol>
                  <IonCol>Status</IonCol>
                  <IonCol>Submitted At</IonCol>
                  <IonCol>Time Taken</IonCol>
                  <IonCol>Media</IonCol>
                  <IonCol>Evaluated</IonCol>
                </IonRow>

                {submissions.length === 0 ? (
                  <IonRow>
                    <IonCol>No submissions found</IonCol>
                  </IonRow>
                ) : (
                  submissions.map((sub) => (
                    <IonRow key={sub.id}>
                      <IonCol>
                        {sub.user.username || sub.user.email || "Unknown"}
                      </IonCol>
                      <IonCol>
                        {sub.task.title || `Task #${sub.task.id}`}
                      </IonCol>
                      <IonCol
                        color={
                          sub.status === "Completed"
                            ? "success"
                            : sub.status === "Submitted"
                            ? "primary"
                            : sub.status === "Late"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {sub.status}
                      </IonCol>
                      <IonCol>
                        {new Date(sub.submitted_at).toLocaleString()}
                      </IonCol>
                      <IonCol>{sub.time_taken || "-"}</IonCol>
                      <IonCol>
                        {sub.media_url ? (
                          <a
                            href={sub.media_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        ) : (
                          "-"
                        )}
                      </IonCol>
                      <IonCol>
                        {sub.evaluated ? "✅" : "⏳"}
                      </IonCol>
                    </IonRow>
                  ))
                )}
              </IonGrid>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default StudentSubmissions;