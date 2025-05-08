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
  const [timeLeft, setTimeLeft] = useState(0); // Will be set from task data
  const [showWarning, setShowWarning] = useState(false);
  const [isLate, setIsLate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [taskFinished, setTaskFinished] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [timeConsumed, setTimeConsumed] = useState(0);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [taskData, setTaskData] = useState<any>(null);
  const [isMarkedDone, setIsMarkedDone] = useState(false);

  // Get task ID from URL
  const taskId = window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchTaskData = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) {
        console.error('Error fetching task:', error);
      } else {
        setTaskData(data);
        // Convert time_limit from minutes to seconds
        setTimeLeft(parseInt(data.time_limit) * 60);
      }
    };

    fetchTaskData();
  }, [taskId]);

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
      setTimeConsumed(taskData ? parseInt(taskData.time_limit) * 60 : 0);
    }

    return () => clearInterval(interval);
  }, [timerStarted, timeLeft, taskData]);

  const formatInterval = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minutes ${secs} seconds`;
  };

  const handleFinishTask = () => {
    setTaskFinished(true);
    setTimerStarted(false);
    setTimeConsumed(taskData ? (parseInt(taskData.time_limit) * 60) - timeLeft : 0);
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
        console.error('Upload error:', uploadError.message);
        alert('❌ Upload failed: ' + uploadError.message);
        setSubmitting(false);
        return;
      }

      const { data: fileData } = supabase.storage
        .from('submissions')
        .getPublicUrl(filePath);

      mediaUrl = fileData?.publicUrl || null;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      alert('❌ User not authenticated.');
      setSubmitting(false);
      return;
    }

    const userId = userData.user.id;

    const { error: insertError } = await supabase.from('submissions').insert([
      {
        user_id: userId,
        task_id: taskId,
        status: isLate ? 'Late' : 'Submitted',
        time_taken: `${Math.floor(timeConsumed / 60)} minutes ${timeConsumed % 60} seconds`,
        media_url: mediaUrl,
        evaluation_notes: comment || null,
      },
    ]);

    if (insertError) {
      console.error('Insert error:', insertError.message);
      alert('❌ Submission failed: ' + insertError.message);
      setSubmitting(false);
      return;
    }

    const content = `📋 Task Report\nStatus: ${isLate ? 'Late' : 'On Time'}\nSubmitted: Yes\nTime Consumed: ${formatInterval(timeConsumed)}`;
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

  const handleMarkAsDone = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      alert('❌ User not authenticated.');
      return;
    }

    const userId = userData.user.id;

    const { error: updateError } = await supabase
      .from('submissions')
      .update({ status: 'Completed' })
      .eq('user_id', userId)
      .eq('task_id', taskId);

    if (updateError) {
      console.error('Update error:', updateError.message);
      alert('❌ Failed to mark task as done: ' + updateError.message);
    } else {
      setIsMarkedDone(true);
      alert('✅ Task marked as done successfully!');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>📝 Task Title: {taskData?.title || 'Loading...'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonText><strong>Instructions:</strong> {taskData?.description || 'Loading...'}</IonText>
            <br />
            <IonText color="medium">👨‍🏫 Time Limit: {taskData?.time_limit || 'Loading...'} minutes</IonText>
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
                🕒 Time Remaining: <strong>{formatInterval(timeLeft)}</strong>
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
                  ⏱ <strong>Time Consumed:</strong> {formatInterval(timeConsumed)}
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
              {!isMarkedDone && (
                <IonButton 
                  expand="block" 
                  color="success" 
                  className="ion-margin-top"
                  onClick={handleMarkAsDone}
                >
                  ✅ Mark Task as Done
                </IonButton>
              )}
              {isMarkedDone && (
                <IonText color="success" className="ion-text-center ion-margin-top">
                  <p>✅ Task marked as completed!</p>
                </IonText>
              )}
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
              <p>⏱ Time Taken: {formatInterval(timeConsumed)}</p>
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
