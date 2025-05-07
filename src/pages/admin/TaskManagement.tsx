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
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";


interface Task {
  id?: number;
  title: string;
  description: string;
  difficulty: string;
  due_date: string;
  time_limit: string;
  allow_submission: boolean;
}

const TaskManagement: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [formData, setFormData] = useState<Task>({
    title: "",
    description: "",
    difficulty: "",
    due_date: "",
    time_limit: "",
    allow_submission: true,
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  // Load tasks from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from("tasks").select("*").order("id", { ascending: false });
      if (error) console.error("Error fetching tasks:", error);
      else setTaskList(data || []);
    };

    fetchTasks();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggle = (e: CustomEvent) => {
    setFormData({ ...formData, allow_submission: e.detail.checked });
  };

  const handleAddOrUpdateTask = async () => {
    if (editingTaskId) {
      const { error } = await supabase.from("tasks").update(formData).eq("id", editingTaskId);
      if (error) return console.error("Update error:", error);
    } else {
      const { error } = await supabase.from("tasks").insert([formData]);
      if (error) return console.error("Insert error:", error);
    }

    setFormData({
      title: "",
      description: "",
      difficulty: "",
      due_date: "",
      time_limit: "",
      allow_submission: true,
    });
    setEditingTaskId(null);

    const { data, error: refetchError } = await supabase.from("tasks").select("*").order("id", { ascending: false });
    if (!refetchError) setTaskList(data || []);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) return console.error("Delete error:", error);
    setTaskList(taskList.filter((task) => task.id !== id));
  };

  const handleEdit = (task: Task) => {
    setFormData(task);
    setEditingTaskId(task.id || null);
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
        {/* Task Form */}
        <IonCard>
          <IonCardContent>
            <IonText color="primary">
              <h2>{editingTaskId ? "Edit Task" : "Create New Task"}</h2>
            </IonText>
            <IonGrid>
              <IonRow>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonLabel position="floating">Task Title</IonLabel>
                    <IonInput name="title" value={formData.title} onIonChange={handleInputChange} required />
                  </IonItem>
                </IonCol>

                <IonCol size="12">
                  <IonItem>
                    <IonLabel position="floating">Description</IonLabel>
                    <IonTextarea name="description" value={formData.description} onIonChange={handleInputChange} />
                  </IonItem>
                </IonCol>

                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonLabel position="floating">Difficulty</IonLabel>
                    <IonSelect name="difficulty" value={formData.difficulty} onIonChange={handleInputChange}>
                      <IonSelectOption value="Easy">Easy</IonSelectOption>
                      <IonSelectOption value="Medium">Medium</IonSelectOption>
                      <IonSelectOption value="Hard">Hard</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>

                <IonCol size="6">
                  <IonItem>
                    <IonLabel position="floating">Due Date</IonLabel>
                    <IonDatetime name="due_date" value={formData.due_date} onIonChange={handleInputChange} presentation="date" />
                  </IonItem>
                </IonCol>

                <IonCol size="6">
                  <IonItem>
                    <IonLabel position="floating">Time Limit (mins)</IonLabel>
                    <IonInput
                      name="time_limit"
                      value={formData.time_limit}
                      type="number"
                      onIonChange={handleInputChange}
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12">
                  <IonItem>
                    <IonLabel>Allow Submission</IonLabel>
                    <IonToggle checked={formData.allow_submission} onIonChange={handleToggle} />
                  </IonItem>
                </IonCol>

                <IonCol size="12" className="ion-text-end">
                  <IonButton onClick={handleAddOrUpdateTask}>
                    {editingTaskId ? "Update Task" : "Create Task"}
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Task List */}
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
                  <IonButton slot="end" size="small" color="danger" onClick={(e) => { e.stopPropagation(); handleDelete(task.id!); }}>
                    Delete
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Task Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Task Details</IonTitle>
              <IonButton slot="end" onClick={() => setShowModal(false)}>Close</IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {selectedTask && (
              <>
                <h2>{selectedTask.title}</h2>
                <p><strong>Description:</strong> {selectedTask.description}</p>
                <p><strong>Difficulty:</strong> {selectedTask.difficulty}</p>
                <p><strong>Due Date:</strong> {selectedTask.due_date}</p>
                <p><strong>Time Limit:</strong> {selectedTask.time_limit} minutes</p>
                <p><strong>Allow Submission:</strong> {selectedTask.allow_submission ? "Yes" : "No"}</p>
              </>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default TaskManagement;
