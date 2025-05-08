import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  useIonViewWillEnter,
} from '@ionic/react';
import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';


interface Task {
  id: number;
  title: string;
  due_date: string;
  time_limit: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Late';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  allow_upload: boolean;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Error getting user:', userError);
      return;
    }

    const userId = user.id;

    // First get all tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      return;
    }

    // Then get all submissions for this user
    const { data: submissionsData, error: submissionsError } = await supabase
      .from('submissions')
      .select('task_id, status')
      .eq('user_id', userId);

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      return;
    }

    // Create a map of task_id to submission status
    const submissionMap = new Map(
      submissionsData?.map(sub => [sub.task_id, sub.status]) || []
    );

    // Combine task data with submission status
    const tasksWithStatus = tasksData?.map(task => ({
      ...task,
      status: submissionMap.get(task.id) || 'Not Started'
    })) || [];

    setTasks(tasksWithStatus);
  };

  useIonViewWillEnter(() => {
    fetchTasks();
  });

  const statusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'primary';
      case 'Not Started':
        return 'warning';
      case 'Late':
        return 'danger';
      default:
        return 'medium';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>📋 Task List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {tasks.map((task) => (
          <IonCard key={task.id}>
            <IonCardContent>
              <IonGrid>
                <IonRow className="ion-align-items-center ion-text-center">
                  <IonCol size="12" sizeMd="2">
                    📌 <strong>{task.title}</strong>
                  </IonCol>
                  <IonCol size="6" sizeMd="2">
                    📅 {task.due_date}
                  </IonCol>
                  <IonCol size="6" sizeMd="2">
                    ⏳ {task.time_limit}
                  </IonCol>
                  <IonCol size="6" sizeMd="2">
                    <IonBadge color={statusColor(task.status)}>{task.status}</IonBadge>
                  </IonCol>
                  <IonCol size="6" sizeMd="2">
                    📈 {task.difficulty}
                  </IonCol>
                  <IonCol size="12" sizeMd="2">
                    {task.status === 'Completed' ? (
                      <IonButton color="success" size="small" disabled>
                        ✅ Done
                      </IonButton>
                    ) : (
                      <IonButton color="primary" size="small" routerLink={`/task/${task.id}`}>
                        🧾 View Task
                      </IonButton>
                    )}
                    {task.allow_upload && task.status !== 'Completed' && (
                      <IonButton color="secondary" size="small" className="ion-margin-start">
                        📤 Upload
                      </IonButton>
                    )}
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default TaskList;
