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
  IonTitle,
  IonToolbar,
  IonText,
} from "@ionic/react";

import {
  peopleOutline,
  documentTextOutline,
  cloudUploadOutline,
} from "ionicons/icons";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

const DashboardHome: React.FC = () => {
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [pendingSubmissions, setPendingSubmissions] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      // Total Students
      const { count: studentCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");

      // Total Tasks
      const { count: taskCount } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true });

      // Pending Submissions (example assumes is_submitted = false means pending)
      const { count: pendingCount } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("is_submitted", false);

      setTotalStudents(studentCount ?? 0);
      setTotalTasks(taskCount ?? 0);
      setPendingSubmissions(pendingCount ?? 0);
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
              <IonCol size="12" size-md="6" size-lg="4" key={index}>
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
