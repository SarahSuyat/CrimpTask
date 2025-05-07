import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import React from "react";

interface Submission {
  id: number;
  studentName: string;
  taskName: string;
  status: "Submitted" | "Not Submitted" | "Late";
  timeTaken: string;
  mediaUrl?: string;
  grade?: string;
}

const submissions: Submission[] = [
  {
    id: 1,
    studentName: "Juan Dela Cruz",
    taskName: "Cable Crimping 101",
    status: "Submitted",
    timeTaken: "25 mins",
    mediaUrl: "https://via.placeholder.com/150",
    grade: "A",
  },
  {
    id: 2,
    studentName: "Maria Santos",
    taskName: "Cable Crimping 101",
    status: "Late",
    timeTaken: "40 mins",
    mediaUrl: "https://via.placeholder.com/150",
    grade: "B",
  },
  {
    id: 3,
    studentName: "Pedro Reyes",
    taskName: "Cable Crimping 101",
    status: "Not Submitted",
    timeTaken: "-",
  },
];

const StudentSubmissions: React.FC = () => {
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
                <IonCol>Grade</IonCol>
                <IonCol>Actions</IonCol>
              </IonRow>

              {submissions.map((sub) => (
                <IonRow key={sub.id}>
                  <IonCol>{sub.studentName}</IonCol>
                  <IonCol>{sub.taskName}</IonCol>
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
                  <IonCol>{sub.timeTaken}</IonCol>
                  <IonCol>
                    {sub.mediaUrl ? (
                      <a href={sub.mediaUrl} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </IonCol>
                  <IonCol>{sub.grade || "-"}</IonCol>
                  <IonCol>
                    <IonButton size="small" fill="outline" color="primary">
                      View
                    </IonButton>
                    <IonButton size="small" fill="outline" color="success">
                      Give Feedback
                    </IonButton>
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
