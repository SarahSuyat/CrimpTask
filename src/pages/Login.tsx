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
  IonIcon,
} from "@ionic/react";
import { supabase } from "../utils/supabaseClient";
import { logoGoogle } from 'ionicons/icons';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCooldownActive && cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            setIsCooldownActive(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCooldownActive, cooldownTime]);

  const doLogin = async () => {
    if (isCooldownActive) {
      setToastMessage(`Please wait ${cooldownTime} seconds before trying again`);
      setShowToast(true);
      return;
    }

    if (!email || !password) {
      setToastMessage("Please enter both email and password");
      setShowToast(true);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setLoginAttempts((prev) => {
          const newAttempts = prev + 1;
          if (newAttempts >= 3) {
            setIsCooldownActive(true);
            setCooldownTime(30);
            setToastMessage("Too many failed attempts. Please wait 30 seconds.");
            setShowToast(true);

            // Log the incident
            logIncident('failed_login_attempts', 'Multiple failed login attempts detected');
          }
          return newAttempts;
        });
        throw new Error("Login failed: " + authError.message);
      }

      // Reset attempts on successful login
      setLoginAttempts(0);

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_type")
        .eq("user_email", email)
        .single();

      if (userError || !userData) throw new Error("User record not found.");

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

  const logIncident = async (type: string, description: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .insert([
          {
            email,
            incident_type: type,
            status: 'pending',
            description,
            ip_address: await getIPAddress(),
            user_agent: navigator.userAgent
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging incident:', error);
    }
  };

  const getIPAddress = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return 'unknown';
    }
  };

  const handleGoogleLogin = async () => {
    if (isCooldownActive) {
      setToastMessage(`Please wait ${cooldownTime} seconds before trying again`);
      setShowToast(true);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:8100/CrimpTask/auth-callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        setLoginAttempts((prev) => {
          const newAttempts = prev + 1;
          if (newAttempts >= 3) {
            setIsCooldownActive(true);
            setCooldownTime(30);
            setToastMessage("Too many failed attempts. Please wait 30 seconds.");
            setShowToast(true);

            // Log the incident
            logIncident('failed_google_login', 'Multiple failed Google login attempts detected');
          }
          return newAttempts;
        });
        throw error;
      }
    } catch (err) {
      setAlertMessage(err instanceof Error ? err.message : "Failed to sign in with Google");
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

          <div style={{
            textAlign: 'center',
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#fff5f8',
            borderRadius: '5px',
            color: '#e83e8c',
            fontSize: '0.9rem'
          }}>
            {isCooldownActive ? (
              `Please wait ${cooldownTime} seconds before trying again`
            ) : (
              `Login attempts remaining: ${3 - loginAttempts}`
            )}
          </div>

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
              disabled={isCooldownActive}
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
              disabled={isCooldownActive}
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
            disabled={isCooldownActive}
          >
            Login
          </IonButton>

          <IonButton 
            expand="full" 
            fill="outline" 
            onClick={handleGoogleLogin}
            style={{ 
              '--color': '#e83e8c',
              '--border-color': '#e83e8c',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}
            disabled={isCooldownActive}
          >
            <span style={{ marginRight: '8px' }}>SIGN IN WITH</span>
            <IonIcon 
              icon={logoGoogle} 
              style={{ 
                color: '#4285F4',
                fontSize: '1.2em',
                verticalAlign: 'middle'
              }} 
            />
          </IonButton>

          <IonButton 
            onClick={goToRegister} 
            expand="full"
            fill="outline"
            style={{ 
              '--color': '#e83e8c',
              '--border-color': '#e83e8c'
            }}
            disabled={isCooldownActive}
          >
            Don't have an account? Register
          </IonButton>

          <IonToast isOpen={showToast} message={toastMessage} duration={2000} onDidDismiss={() => setShowToast(false)} />
          <IonAlert isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} header="Error" message={alertMessage} buttons={["OK"]} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
