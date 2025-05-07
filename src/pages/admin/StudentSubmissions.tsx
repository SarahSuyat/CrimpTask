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
  student_name: string;
  task_name: string;
  status: "Submitted" | "Not Submitted" | "Late";
  time_taken: string;
  media_url?: string;
}

const StudentSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data, error } = await supabase.from("submissions").select("*").order("id", { ascending: true });
      if (error) console.error("Error fetching submissions:", error);
      else setSubmissions(data || []);
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
                  <IonCol>{sub.student_name}</IonCol>
                  <IonCol>{sub.task_name}</IonCol>
                  <IonCol color={
                    sub.status === "Submitted"
                      ? "success"
                      : sub.status === "Late"
                      ? "warning"
                      : "danger"
                  }>
                    {sub.status}
                  </IonCol>
                  <IonCol>{sub.time_taken}</IonCol>
                  <IonCol>
                    {sub.media_url ? (
                      <a href={sub.media_url} target="_blank" rel="noopener noreferrer">
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
