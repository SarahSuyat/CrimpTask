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

// Interface for the nested relations
interface Submission {
  id: number;
  status: "Submitted" | "Not Submitted" | "Late";
  time_taken: string;
  media_url?: string;
  user: {
    full_name?: string;
    username?: string;
  };
  task: {
    title?: string;
    name?: string;
  };
}

const StudentSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          id,
          status,
          time_taken,
          media_url,
          tasks (
            title
          ),
          user_id,
          profiles (
            full_name,
            username
          )
        `)
        .order("id", { ascending: true })
        .eq('submissions.evaluated', true) // Optionally check if submission is evaluated
        .leftJoin('profiles', 'submissions.user_id', 'profiles.user_id') // Join with profiles
        .leftJoin('tasks', 'submissions.task_id', 'tasks.id'); // Join with tasks

      if (error) {
        console.error("Error fetching submissions:", error.message);
        setSubmissions([]); // Reset on error
        return;
      }

      // Manually map relations due to lack of typing for nested data
      const formatted = (data as any[]).map((item) => ({
        id: item.id,
        status: item.status,
        time_taken: item.time_taken,
        media_url: item.media_url,
        user: item.profiles || {}, // Safely access profiles
        task: item.tasks || {}, // Safely access tasks
      }));

      setSubmissions(formatted);
    };

    fetchSubmissions();
  }, []); // Empty dependency array to fetch data only once

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
            <IonGrid>
              <IonRow className="ion-text-bold">
                <IonCol>Student</IonCol>
                <IonCol>Task</IonCol>
                <IonCol>Status</IonCol>
                <IonCol>Time Taken</IonCol>
                <IonCol>Media</IonCol>
              </IonRow>

              {submissions.map((sub) => (
                <IonRow key={sub.id}>
                  <IonCol>
                    {sub.user.full_name || sub.user.username || "Unknown"}
                  </IonCol>
                  <IonCol>{sub.task.title || "Untitled Task"}</IonCol>
                  <IonCol
                    color={
                      sub.status === "Submitted"
                        ? "success"
                        : sub.status === "Late"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {sub.status}
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
                </IonRow>
              ))}
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default StudentSubmissions;
