import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  IonToast,
  IonAlert,
} from "@ionic/react";
import { supabase } from "../utils/supabaseClient";

const ResetPassword: React.FC = () => {
  const navigation = useIonRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const handleHashParams = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      
      // Check for error in URL
      const error = params.get('error');
      const errorDescription = params.get('error_description');
      
      if (error) {
        setAlertMessage(errorDescription || "Invalid or expired reset link. Please request a new password reset.");
        setShowAlert(true);
        setIsVerifying(false);
        return;
      }

      // Get the access token and refresh token from the URL
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        try {
          // Set the session with the tokens
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) throw sessionError;
          
          setIsVerifying(false);
        } catch (err) {
          setAlertMessage("Failed to verify reset link. Please request a new password reset.");
          setShowAlert(true);
          setIsVerifying(false);
        }
      } else {
        setAlertMessage("Invalid reset link. Please request a new password reset.");
        setShowAlert(true);
        setIsVerifying(false);
      }
    };

    handleHashParams();
  }, []);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setToastMessage("Please enter both password fields");
      setShowToast(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setToastMessage("Passwords do not match");
      setShowToast(true);
      return;
    }

    if (newPassword.length < 6) {
      setToastMessage("Password must be at least 6 characters long");
      setShowToast(true);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // Sign out the user after password reset
      await supabase.auth.signOut();
      
      // Use window.location for a hard redirect to the exact login route
      window.location.href = '/CrimpTask';
    } catch (err) {
      setAlertMessage(err instanceof Error ? err.message : "Failed to reset password");
      setShowAlert(true);
    }
  };

  if (isVerifying) {
    return (
      <IonPage>
        <IonContent className="ion-padding" style={{ 
          '--background': 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#e83e8c' }}>Verifying Reset Link...</h2>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Reset Password</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ 
        '--background': 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '90%',
          maxWidth: '400px',
          margin: 'auto',
          position: 'relative'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            color: '#e83e8c',
            marginBottom: '2rem',
            fontSize: '1.8rem',
            fontFamily: 'cursive',
            fontWeight: 'bold',
            fontStyle: 'italic'
          }}>Reset Your Password</h2>

          <IonItem style={{ 
            '--background': 'transparent', 
            marginBottom: '1rem',
            padding: '0.5rem 0',
            '--padding-start': '1rem',
            '--padding-end': '1rem'
          }}>
            <IonLabel position="floating" style={{ 
              color: '#e83e8c',
              marginBottom: '0.5rem',
              fontSize: '1rem'
            }}>New Password</IonLabel>
            <IonInput
              value={newPassword}
              onIonChange={(e) => setNewPassword(e.detail.value!)}
              placeholder=" "
              type="password"
              style={{ 
                '--padding-start': '0',
                '--color': 'black'
              }}
            />
          </IonItem>

          <IonItem style={{ 
            '--background': 'transparent', 
            marginBottom: '2rem',
            padding: '0.5rem 0',
            '--padding-start': '1rem',
            '--padding-end': '1rem'
          }}>
            <IonLabel position="floating" style={{ 
              color: '#e83e8c',
              marginBottom: '0.5rem',
              fontSize: '1rem'
            }}>Confirm Password</IonLabel>
            <IonInput
              value={confirmPassword}
              onIonChange={(e) => setConfirmPassword(e.detail.value!)}
              placeholder=" "
              type="password"
              style={{ 
                '--padding-start': '0',
                '--color': 'black'
              }}
            />
          </IonItem>

          <IonButton 
            expand="full" 
            onClick={handleResetPassword}
            style={{ 
              '--background': '#e83e8c',
              '--background-hover': '#d63384',
              marginBottom: '1rem'
            }}
          >
            Reset Password
          </IonButton>

          <IonButton 
            onClick={() => navigation.push("/CrimpTask/login")} 
            expand="full"
            fill="outline"
            style={{ 
              '--color': '#e83e8c',
              '--border-color': '#e83e8c'
            }}
          >
            Back to Login
          </IonButton>

          <IonToast 
            isOpen={showToast} 
            message={toastMessage} 
            duration={2000} 
            onDidDismiss={() => setShowToast(false)} 
          />
          <IonAlert 
            isOpen={showAlert} 
            onDidDismiss={() => {
              setShowAlert(false);
              if (alertMessage.includes("Invalid") || alertMessage.includes("expired")) {
                navigation.push("/CrimpTask/login");
              }
            }} 
            header="Error" 
            message={alertMessage} 
            buttons={["OK"]} 
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword; 