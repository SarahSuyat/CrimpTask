import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const MyProgress: React.FC = () => {
  // Example task counts (replace with dynamic data later)
  const taskData = {
    completed: 12,
    pending: 5,
    late: 3,
  };

  const barData = [
    { name: 'Completed', value: taskData.completed },
    { name: 'Pending', value: taskData.pending },
    { name: 'Late', value: taskData.late },
  ];

  const pieData = [
    { name: 'Completed', value: taskData.completed },
    { name: 'Pending', value: taskData.pending },
    { name: 'Late', value: taskData.late },
  ];

  const COLORS = ['#2dd36f', '#ffc409', '#eb445a']; // green, yellow, red

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>📊 My Progress</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        {/* Bar Chart */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>📶 Task Overview (Bar)</IonCardTitle>
          </IonCardHeader>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3880ff">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </IonCard>

        {/* Pie Chart */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🎯 Task Distribution (Pie)</IonCardTitle>
          </IonCardHeader>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default MyProgress;
