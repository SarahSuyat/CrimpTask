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
  IonButtons,
  IonMenuButton,
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
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Task Management</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Task Form with inline styles to prevent text overlap */}
        <IonCard style={{ marginBottom: '24px' }}>
          <IonCardContent>
            <IonText color="primary">
              <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>
                {editingTaskId ? "Edit Task" : "Create New Task"}
              </h2>
            </IonText>
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <IonItem style={{ 
                    '--padding-start': '0',
                    '--inner-padding-end': '0',
                    marginBottom: '20px'
                  }}>
                    <IonLabel 
                      position="floating" 
                      style={{ 
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}
                    >
                      Task Title
                    </IonLabel>
                    <IonInput
                      name="title"
                      value={formData.title}
                      onIonChange={handleInputChange}
                      style={{
                        '--padding-start': '12px',
                        '--padding-end': '12px',
                        '--padding-top': '12px',
                        '--padding-bottom': '12px',
                        marginTop: '8px'
                      }}
                      required
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12">
                  <IonItem style={{ 
                    '--padding-start': '0',
                    '--inner-padding-end': '0',
                    marginBottom: '20px'
                  }}>
                    <IonLabel 
                      position="floating" 
                      style={{ 
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}
                    >
                      Description
                    </IonLabel>
                    <IonTextarea
                      name="description"
                      value={formData.description}
                      onIonChange={handleInputChange}
                      rows={4}
                      autoGrow={true}
                      style={{
                        '--padding-start': '12px',
                        '--padding-end': '12px',
                        '--padding-top': '12px',
                        '--padding-bottom': '0px',
                        marginTop: '8px',
                        
                        
                        
                      }}
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12">
                  <IonItem style={{ 
                    '--padding-start': '0',
                    '--inner-padding-end': '0',
                    marginBottom: '20px'
                  }}>
                    <IonLabel 
                      position="floating" 
                      style={{ 
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}
                    >
                      Difficulty
                    </IonLabel>
                    <IonSelect
                      name="difficulty"
                      value={formData.difficulty}
                      onIonChange={handleInputChange}
                      interface="popover"
                      style={{
                        '--padding-start': '12px',
                        '--padding-end': '12px',
                        '--padding-top': '12px',
                        '--padding-bottom': '12px',
                        marginTop: '8px',
                        width: '100%'
                      }}
                    >
                      <IonSelectOption value="Easy">Easy</IonSelectOption>
                      <IonSelectOption value="Medium">Medium</IonSelectOption>
                      <IonSelectOption value="Hard">Hard</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>

                <IonCol size="12">
                  <IonItem style={{ 
                    '--padding-start': '0',
                    '--inner-padding-end': '0',
                    marginBottom: '20px'
                  }}>
                    <IonLabel 
                      position="floating" 
                      style={{ 
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}
                    >
                      Due Date
                    </IonLabel>
                    <IonDatetime
                      name="due_date"
                      value={formData.due_date}
                      onIonChange={handleInputChange}
                      presentation="date"
                      style={{
                        '--padding-start': '12px',
                        '--padding-end': '12px',
                        '--padding-top': '12px',
                        '--padding-bottom': '12px',
                        marginTop: '8px'
                      }}
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12">
                  <IonItem style={{ 
                    '--padding-start': '0',
                    '--inner-padding-end': '0',
                    marginBottom: '20px'
                  }}>
                    <IonLabel 
                      position="floating" 
                      style={{ 
                        marginBottom: '8px',
                        fontWeight: '500'
                      }}
                    >
                      Time Limit (minutes)
                    </IonLabel>
                    <IonInput
                      name="time_limit"
                      value={formData.time_limit}
                      type="number"
                      onIonChange={handleInputChange}
                      style={{
                        '--padding-start': '12px',
                        '--padding-end': '12px',
                        '--padding-top': '12px',
                        '--padding-bottom': '12px',
                        marginTop: '8px'
                      }}
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12">
                  <IonItem style={{ 
                    '--padding-start': '0',
                    '--inner-padding-end': '0',
                    marginBottom: '20px'
                  }}>
                    <IonLabel style={{ fontWeight: '500' }}>Allow Submission</IonLabel>
                    <IonToggle
                      checked={formData.allow_submission}
                      onIonChange={handleToggle}
                      style={{ marginLeft: '12px' }}
                    />
                  </IonItem>
                </IonCol>

                <IonCol size="12" style={{ marginTop: '16px' }}>
                  <IonButton
                    expand="block"
                    onClick={handleAddOrUpdateTask}
                    style={{ marginTop: '8px', padding: '12px' }}
                  >
                    {editingTaskId ? "Update Task" : "Create Task"}
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Task List with improved spacing */}
        <IonCard>
          <IonCardContent>
            <IonText color="primary">
              <h2 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>Existing Tasks</h2>
            </IonText>
            <IonList style={{ paddingTop: '0', paddingBottom: '0' }}>
              {taskList.map((task) => (
                <IonItem 
                  key={task.id}
                  button
                  onClick={() => handleView(task)}
                  style={{ 
                    '--padding-start': '12px',
                    '--inner-padding-end': '12px',
                    marginBottom: '12px'
                  }}
                >
                  <IonLabel style={{ paddingLeft: '12px' }}>
                    <h2 style={{ marginBottom: '8px' }}>{task.title}</h2>
                    <p style={{ marginBottom: '8px', color: '#666' }}>
                      {task.description.substring(0, 50)}{task.description.length > 50 ? "..." : ""}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.8rem', color: '#666' }}>
                      <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                      <span>Difficulty: {task.difficulty}</span>
                      <span>Time: {task.time_limit} mins</span>
                    </div>
                  </IonLabel>
                  <IonButtons slot="end" style={{ marginLeft: '16px' }}>
                    <IonButton
                      fill="clear"
                      color="warning"
                      onClick={(e) => { e.stopPropagation(); handleEdit(task); }}
                      style={{ marginRight: '8px' }}
                    >
                      Edit
                    </IonButton>
                    <IonButton
                      fill="clear"
                      color="danger"
                      onClick={(e) => { e.stopPropagation(); handleDelete(task.id!); }}
                    >
                      Delete
                    </IonButton>
                  </IonButtons>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Task Modal with improved spacing */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Task Details</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {selectedTask && (
              <div style={{ padding: '16px' }}>
                <h2 style={{ marginBottom: '16px' }}>{selectedTask.title}</h2>
                <p style={{ marginBottom: '12px' }}><strong>Description:</strong> {selectedTask.description}</p>
                <p style={{ marginBottom: '12px' }}><strong>Difficulty:</strong> {selectedTask.difficulty}</p>
                <p style={{ marginBottom: '12px' }}><strong>Due Date:</strong> {new Date(selectedTask.due_date).toLocaleDateString()}</p>
                <p style={{ marginBottom: '12px' }}><strong>Time Limit:</strong> {selectedTask.time_limit} minutes</p>
                <p><strong>Allow Submission:</strong> {selectedTask.allow_submission ? "Yes" : "No"}</p>
              </div>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default TaskManagement;