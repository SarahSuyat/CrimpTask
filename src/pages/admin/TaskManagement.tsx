import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonDatetime,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  dueDate: string;
  timeLimit: string;
  allowSubmission: boolean;
  attachment?: File;
}

const TaskManagement: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [formData, setFormData] = useState<Task>({
    id: Date.now(),
    title: "",
    description: "",
    type: "",
    difficulty: "",
    dueDate: "",
    timeLimit: "",
    allowSubmission: true,
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggle = (e: CustomEvent) => {
    setFormData({ ...formData, allowSubmission: e.detail.checked });
  };

  const handleAttachment = (e: any) => {
    setFormData({ ...formData, attachment: e.target.files[0] });
  };

  const handleAddTask = () => {
    setTaskList([...taskList, { ...formData, id: Date.now() }]);
    setFormData({
      id: Date.now(),
      title: "",
      description: "",
      type: "",
      difficulty: "",
      dueDate: "",
      timeLimit: "",
      allowSubmission: true,
    });
  };

  const handleDelete = (id: number) => {
    setTaskList(taskList.filter((task) => task.id !== id));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Management</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonText color="primary">
              <h2>Create New Task</h2>
            </IonText>
            <IonGrid>
              <IonRow>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonLabel position="floating">Task Title</IonLabel>
                    <IonInput
                      name="title"
                      value={formData.title}
                      onIonChange={handleInputChange}
                      required
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonLabel position="floating">Task Type</IonLabel>
                    <IonInput
                      name="type"
                      value={formData.type}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12">
                  <IonItem>
                    <IonLabel position="floating">Task Description</IonLabel>
                    <IonTextarea
                      name="description"
                      value={formData.description}
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonLabel position="floating">Difficulty</IonLabel>
                    <IonSelect
                      name="difficulty"
                      value={formData.difficulty}
                      onIonChange={handleInputChange}
                    >
                      <IonSelectOption value="Easy">Easy</IonSelectOption>
                      <IonSelectOption value="Medium">Medium</IonSelectOption>
                      <IonSelectOption value="Hard">Hard</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>

                <IonCol size="6">
                  <IonItem>
                    <IonLabel position="floating">Due Date</IonLabel>
                    <IonDatetime
                      name="dueDate"
                      value={formData.dueDate}
                      onIonChange={handleInputChange}
                      presentation="date"
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="6">
                  <IonItem>
                    <IonLabel position="floating">Time Limit (mins)</IonLabel>
                    <IonInput
                      name="timeLimit"
                      value={formData.timeLimit}
                      type="number"
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12">
                  <IonItem>
                    <IonLabel>Allow Submission</IonLabel>
                    <IonToggle
                      checked={formData.allowSubmission}
                      onIonChange={handleToggle}
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12">
                  <IonItem>
                    <IonLabel>Attach Instructions / Reference Media</IonLabel>
                    <input
                      type="file"
                      accept="image/*,video/*,application/pdf"
                      onChange={handleAttachment}
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12" className="ion-text-end">
                  <IonButton onClick={handleAddTask}>Create Task</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* List of tasks */}
        <IonCard>
          <IonCardContent>
            <IonText color="primary">
              <h2>Existing Tasks</h2>
            </IonText>
            <IonList>
              {taskList.map((task) => (
                <IonItem key={task.id}>
                  <IonLabel>
                    <h2>{task.title}</h2>
                    <p>{task.description}</p>
                  </IonLabel>
                  <IonButton slot="end" fill="outline" size="small" color="primary">
                    View
                  </IonButton>
                  <IonButton slot="end" fill="outline" size="small" color="warning">
                    Edit
                  </IonButton>
                  <IonButton
                    slot="end"
                    fill="outline"
                    size="small"
                    color="danger"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default TaskManagement;
