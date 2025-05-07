import React from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText, IonGrid, IonRow, IonCol } from '@ionic/react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProgressAnalytics: React.FC = () => {
  // Data for the charts
  const chartData = {
    labels: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'], // Example Task names or dates
    datasets: [
      {
        label: 'Completion Rate',
        data: [85, 90, 75, 80, 95], // Example data
        borderColor: 'rgba(0, 123, 255, 1)',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        fill: true,
      },
      {
        label: 'Late Submissions',
        data: [2, 3, 1, 0, 4], // Example data
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: 'Average Time Spent (Minutes)',
        data: [25, 35, 30, 40, 28], // Example data
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  // Leaderboard data (Fastest Completion)
  const leaderboardData = [
    { rank: 1, student: 'Juan Dela Cruz', time: '10 mins' },
    { rank: 2, student: 'Maria Santos', time: '12 mins' },
    { rank: 3, student: 'Pedro Reyes', time: '15 mins' },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Progress & Analytics</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Graph Section */}
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText color="primary">
                <h2>Task Completion Overview</h2>
              </IonText>
              <Line data={chartData} />
            </IonCol>
          </IonRow>

          {/* Leaderboard Section */}
          <IonRow>
            <IonCol>
              <IonText color="secondary">
                <h2>Fastest Completion Leaderboard</h2>
              </IonText>
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry) => (
                    <tr key={entry.rank}>
                      <td>{entry.rank}</td>
                      <td>{entry.student}</td>
                      <td>{entry.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Button to return to the dashboard or analytics */}
        <IonButton expand="full" routerLink="/CrimpTask/admin">
          Back to Dashboard
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProgressAnalytics;
