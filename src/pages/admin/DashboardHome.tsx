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
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import {
  peopleOutline,
  documentTextOutline,
  cloudUploadOutline,
  warningOutline,
} from "ionicons/icons";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

const DashboardHome: React.FC = () => {
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [pendingSubmissions, setPendingSubmissions] = useState<number>(0);
  const [pendingIncidents, setPendingIncidents] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      // ✅ Fix: use "user_type" instead of "role"
      const { count: studentCount, error: studentError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("user_type", "student");

      if (studentError) console.error("Error fetching students:", studentError);
      setTotalStudents(studentCount ?? 0);

      const { count: taskCount, error: taskError } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true });

      if (taskError) console.error("Error fetching tasks:", taskError);
      setTotalTasks(taskCount ?? 0);

      const { count: pendingCount, error: submissionError } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("is_submitted", false);

      if (submissionError) console.error("Error fetching submissions:", submissionError);
      setPendingSubmissions(pendingCount ?? 0);

      const { count: incidentCount, error: incidentError } = await supabase
        .from("incidents")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (incidentError) console.error("Error fetching incidents:", incidentError);
      setPendingIncidents(incidentCount ?? 0);
    };

    fetchStats();
  }, []);

  const summaryStats = [
    {
      title: "Total Students",
      count: totalStudents,
      icon: peopleOutline,
      color: "primary",
    },
    {
      title: "Total Tasks Created",
      count: totalTasks,
      icon: documentTextOutline,
      color: "tertiary",
    },
    {
      title: "Pending Submissions",
      count: pendingSubmissions,
      icon: cloudUploadOutline,
      color: "warning",
    },
    {
      title: "Pending Incidents",
      count: pendingIncidents,
      icon: warningOutline,
      color: "danger",
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
              <IonCol size="12" size-md="6" size-lg="3" key={index}>
                <IonCard color={stat.color}>
                  <IonCardContent className="ion-text-center">
                    <IonIcon icon={stat.icon} style={{ fontSize: "40px" }} />
                    <h2>{stat.count}</h2>
                    <IonText>{stat.title}</IonText>
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