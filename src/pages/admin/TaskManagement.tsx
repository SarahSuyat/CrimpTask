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
  IonModal,
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
    difficulty: "",
    dueDate: "",
    timeLimit: "",
    allowSubmission: true,
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);

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
    const existing = taskList.find((t) => t.id === formData.id);
    if (existing) {
      setTaskList(
        taskList.map((t) => (t.id === formData.id ? { ...formData } : t))
      );
    } else {
      setTaskList([...taskList, { ...formData, id: Date.now() }]);
    }

    setFormData({
      id: Date.now(),
      title: "",
      description: "",
      difficulty: "",
      dueDate: "",
      timeLimit: "",
      allowSubmission: true,
    });
  };

  const handleDelete = (id: number) => {
    setTaskList(taskList.filter((task) => task.id !== id));
  };

  const handleEdit = (task: Task) => {
    setFormData(task);
  };

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Management</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Form to Create or Edit Task */}
        <IonCard>
          <IonCardContent>
            <IonText color="primary">
              <h2>{taskList.find((t) => t.id === formData.id) ? "Edit Task" : "Create New Task"}</h2>
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
                    <IonLabel>Attach File</IonLabel>
                    <input
                      type="file"
                      accept="image/*,video/*,application/pdf"
                      onChange={handleAttachment}
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12" className="ion-text-end">
                  <IonButton onClick={handleAddTask}>
                    {taskList.find((t) => t.id === formData.id) ? "Update Task" : "Create Task"}
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Existing Task List */}
        <IonCard>
          <IonCardContent>
            <IonText color="primary">
              <h2>Existing Tasks</h2>
            </IonText>
            <IonList>
              {taskList.map((task) => (
                <IonItem key={task.id} button onClick={() => handleView(task)}>
                  <IonLabel>
                    <h2>{task.title}</h2>
                    <p>{task.description}</p>
                  </IonLabel>
                  <IonButton slot="end" size="small" color="warning" onClick={(e) => { e.stopPropagation(); handleEdit(task); }}>
                    Edit
                  </IonButton>
                  <IonButton slot="end" size="small" color="danger" onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}>
                    Delete
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Modal to View Task Details */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Task Details</IonTitle>
              <IonButton slot="end" onClick={() => setShowModal(false)}>Close</IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {selectedTask && (
              <div>
                <h2>{selectedTask.title}</h2>
                <p><strong>Description:</strong> {selectedTask.description}</p>
                <p><strong>Difficulty:</strong> {selectedTask.difficulty}</p>
                <p><strong>Due Date:</strong> {selectedTask.dueDate}</p>
                <p><strong>Time Limit:</strong> {selectedTask.timeLimit} minutes</p>
                <p><strong>Allow Submission:</strong> {selectedTask.allowSubmission ? "Yes" : "No"}</p>
                {selectedTask.attachment && <p><strong>Attachment:</strong> {selectedTask.attachment.name}</p>}
              </div>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default TaskManagement;
