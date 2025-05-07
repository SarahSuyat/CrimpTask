import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  IonTextarea,
  IonItem,
  IonLabel,
  IonModal,
  IonToast,
  IonCard,
  IonCardContent,
  IonSpinner,
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';


const TaskDetailPage: React.FC = () => {
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [showWarning, setShowWarning] = useState(false);
  const [isLate, setIsLate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [taskFinished, setTaskFinished] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [timeConsumed, setTimeConsumed] = useState(0);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let interval: any;

    if (timerStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 121) setShowWarning(true);
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeLeft <= 0 && timerStarted) {
      clearInterval(interval);
      setIsLate(true);
      setTaskFinished(true);
      setTimeConsumed(600);
    }

    return () => clearInterval(interval);
  }, [timerStarted, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinishTask = () => {
    setTaskFinished(true);
    setTimerStarted(false);
    setTimeConsumed(600 - timeLeft);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let mediaUrl: string | null = null;

    if (uploadFile) {
      const fileExt = uploadFile.name.split('.').pop();
      const filePath = `evidence/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(filePath, uploadFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setSubmitting(false);
        return;
      }

      const { data: fileData } = supabase.storage
        .from('submissions')
        .getPublicUrl(filePath);
      mediaUrl = fileData?.publicUrl || null;
    }

    const user = await supabase.auth.getUser();
    const studentName = user.data?.user?.email || 'Unknown';

    const { error } = await supabase.from('submissions').insert([
      {
        student_name: studentName,
        task_name: 'Sample Task',
        status: isLate ? 'Late' : 'Submitted',
        time_taken: formatTime(timeConsumed),
        media_url: mediaUrl,
        comment,
      },
    ]);

    if (error) {
      console.error('Submit error:', error);
      setSubmitting(false);
      return;
    }

    const content = `📋 Task Report\nStatus: ${isLate ? 'Late' : 'On Time'}\nSubmitted: Yes\nTime Consumed: ${formatTime(timeConsumed)}`;
    setReportContent(content);
    setShowModal(true);
    setSubmitting(false);
  };

  const handleDownloadReport = () => {
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'task-report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>📝 Task Title: Sample Task</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonText><strong>Instructions:</strong> Complete the task within the allotted time.</IonText>
            <br />
            <IonText color="medium">👨‍🏫 Instructor Notes: Read all questions carefully before answering.</IonText>
          </IonCardContent>
        </IonCard>

        {!timerStarted && !taskFinished && (
          <IonButton expand="block" onClick={() => setTimerStarted(true)}>
            ▶️ Start Task
          </IonButton>
        )}

        {timerStarted && (
          <>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <IonText color={timeLeft <= 120 ? 'danger' : 'primary'}>
                🕒 Time Remaining: <strong>{formatTime(timeLeft)}</strong>
              </IonText>
            </div>
            <IonButton expand="block" color="warning" className="ion-margin-top" onClick={handleFinishTask}>
              ✅ Finish Task
            </IonButton>
          </>
        )}

        {taskFinished && (
          <>
            <IonCard className="ion-margin-top">
              <IonCardContent>
                <IonText>
                  ⏱ <strong>Time Consumed:</strong> {formatTime(timeConsumed)}
                </IonText>
                <IonItem>
                  <IonLabel position="stacked">📤 Upload Evidence (Image/Video/File)</IonLabel>
                  <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">💬 Comment (Optional)</IonLabel>
                  <IonTextarea
                    rows={3}
                    placeholder="Add any remarks..."
                    value={comment}
                    onIonChange={(e) => setComment(e.detail.value!)}
                  />
                </IonItem>
                <IonButton
                  expand="block"
                  color="success"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? <IonSpinner name="dots" /> : '📩 Submit Task'}
                </IonButton>
              </IonCardContent>
            </IonCard>

            {isLate && (
              <IonText color="danger">❌ Task submitted late.</IonText>
            )}
          </>
        )}

        {reportContent && (
          <IonCard className="ion-margin-top">
            <IonCardContent>
              <IonText><pre>{reportContent}</pre></IonText>
              <IonButton expand="block" color="medium" onClick={handleDownloadReport}>
                📥 Download Task Report
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <IonToast
          isOpen={showWarning}
          onDidDismiss={() => setShowWarning(false)}
          message="⚠️ 2 minutes left!"
          duration={3000}
          color="warning"
        />

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonContent className="ion-padding">
            <IonText>
              <h2>✅ Task Submitted!</h2>
              <p>{isLate ? 'Note: Your submission was late.' : 'You submitted on time.'}</p>
              <p>⏱ Time Taken: {formatTime(timeConsumed)}</p>
            </IonText>
            <IonButton expand="block" onClick={() => setShowModal(false)}>
              Close
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default TaskDetailPage;
