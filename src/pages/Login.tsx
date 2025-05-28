import React, { useState } from "react";
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

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const doLogin = async () => {
    if (!email || !password) {
      setToastMessage("Please enter both email and password");
      setShowToast(true);
      return;
    }

    try {
      // Sign in with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error("Login failed: " + authError.message);
      }

      // Retrieve the user from the 'users' table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_type")
        .eq("user_email", email)
        .single();

      if (userError || !userData) {
        throw new Error("User record not found.");
      }

      // Redirect based on user type
      if (userData.user_type === "admin") {
        navigation.push("/CrimpTask/admin", "forward", "replace");
      } else {
        navigation.push("/CrimpTask/app", "forward", "replace");
      }
    } catch (err) {
      setAlertMessage(err instanceof Error ? err.message : "Unknown error occurred.");
      setShowAlert(true);
    }
  };

  const goToRegister = () => {
    navigation.push("/register");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Login</IonTitle>
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
          }}>Welcome Back</h2>
          
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
            }}>Email</IonLabel>
            <IonInput
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              placeholder=" "
              type="email"
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
            }}>Password</IonLabel>
            <IonInput
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
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
            onClick={doLogin}
            style={{ 
              '--background': '#e83e8c',
              '--background-hover': '#d63384',
              marginBottom: '1rem'
            }}
          >
            Login
          </IonButton>

          <IonButton 
            onClick={goToRegister} 
            expand="full"
            fill="outline"
            style={{ 
              '--color': '#e83e8c',
              '--border-color': '#e83e8c'
            }}
          >
            Don't have an account? Register
          </IonButton>

          <IonToast
            isOpen={showToast}
            message={toastMessage}
            duration={2000}
            onDidDismiss={() => setShowToast(false)}
          />

          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header="Error"
            message={alertMessage}
            buttons={["OK"]}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
