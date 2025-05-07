import React from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

// Simple feedback data
const feedbackData = [
  { student: 'Juan Dela Cruz', task: 'Task 1', grade: 'A', feedback: 'Excellent work!', dateEvaluated: '2025-05-05' },
  { student: 'Maria Santos', task: 'Task 2', grade: 'B', feedback: 'Good effort, needs improvement.', dateEvaluated: '2025-05-06' },
  { student: 'Pedro Reyes', task: 'Task 3', grade: 'A+', feedback: 'Outstanding performance!', dateEvaluated: '2025-05-07' },
];

const FeedbackReports: React.FC = () => {

  // Download CSV function without external libraries
  const downloadCSV = () => {
    const csvRows = [];
    
    // Add headers
    csvRows.push(['Student', 'Task', 'Grade', 'Feedback', 'Date Evaluated'].join(','));

    // Add data rows
    feedbackData.forEach(entry => {
      const row = [
        entry.student,
        entry.task,
        entry.grade,
        entry.feedback,
        entry.dateEvaluated,
      ].join(',');
      csvRows.push(row);
    });

    // Create CSV string
    const csvString = csvRows.join('\n');
    
    // Create a Blob and download as CSV
    const blob = new Blob([csvString], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'feedback_report.csv';
    link.click();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Feedback & Reports</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Feedback & Grades</h2>

        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Task</th>
              <th>Grade</th>
              <th>Feedback</th>
              <th>Date Evaluated</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.student}</td>
                <td>{entry.task}</td>
                <td>{entry.grade}</td>
                <td>{entry.feedback}</td>
                <td>{entry.dateEvaluated}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Button to Download CSV */}
        <IonButton expand="full" color="secondary" onClick={downloadCSV}>
          Download CSV
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default FeedbackReports;
