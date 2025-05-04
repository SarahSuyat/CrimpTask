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
} from '@ionic/react';

const TaskList: React.FC = () => {
  // Sample tasks (replace with Supabase data later)
  const tasks = [
    {
      id: 1,
      title: 'Research Paper',
      dueDate: '2025-05-10',
      status: 'Pending',
      difficulty: 'Hard',
      type: 'Essay',
      allowUpload: true,
    },
    {
      id: 2,
      title: 'LAN Cable Crimping Task',
      dueDate: '2025-05-08',
      status: 'Completed',
      difficulty: 'Medium',
      type: 'Quiz',
      allowUpload: false,
    },
    {
      id: 3,
      title: 'Project Proposal',
      dueDate: '2025-05-12',
      status: 'Late',
      difficulty: 'Hard',
      type: 'Project',
      allowUpload: true,
    },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
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
          <IonTitle>Task List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {tasks.map((task) => (
          <IonCard key={task.id}>
            <IonCardContent>
              <IonGrid>
                <IonRow className="ion-align-items-center ion-text-center">
                  <IonCol size="12" sizeMd="2"><strong>📋 {task.title}</strong></IonCol>
                  <IonCol size="6" sizeMd="2">📅 {task.dueDate}</IonCol>
                  <IonCol size="6" sizeMd="2">
                    <IonBadge color={statusColor(task.status)}>{task.status}</IonBadge>
                  </IonCol>
                  <IonCol size="6" sizeMd="2">🔥 {task.difficulty}</IonCol>
                  <IonCol size="6" sizeMd="2">🔖 {task.type}</IonCol>
                  <IonCol size="12" sizeMd="2">
                    <IonButton color="primary" size="small" routerLink={`/task/${task.id}`}>
                      🧾 View Task
                    </IonButton>
                    {task.allowUpload && (
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
