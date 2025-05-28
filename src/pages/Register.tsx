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
  IonToast,
  IonRadio,
  IonRadioGroup,
  IonItemDivider,
  IonAlert,
} from "@ionic/react";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import bcrypt from 'bcryptjs';
import Captcha from '../components/Captcha';

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState(""); // admin or student
  const [showToast, setShowToast] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const doRegister = async () => {
    try {
      if (!username || !email || !password || !confirmPassword || !userType) {
        setAlertMessage("Please fill in all fields.");
        setShowAlert(true);
        return;
      }

      if (password !== confirmPassword) {
        setAlertMessage("Passwords do not match.");
        setShowAlert(true);
        return;
      }

      if (!isCaptchaValid) {
        setAlertMessage("Please solve the captcha correctly.");
        setShowAlert(true);
        return;
      }

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw new Error("Account creation failed: " + error.message);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const { error: insertError } = await supabase.from("users").insert([
        {
          username,
          user_email: email,
          user_password: hashedPassword,
          user_type: userType,
        },
      ]);

      if (insertError) throw new Error("Failed to save user data: " + insertError.message);

      setShowToast(true);
    } catch (err) {
      setAlertMessage(err instanceof Error ? err.message : "An unknown error occurred.");
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Register</IonTitle>
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
          }}>Create Account</h2>

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
            }}>Username</IonLabel>
            <IonInput
              value={username}
              onIonChange={(e) => setUsername(e.detail.value!)}
              placeholder=" "
              style={{ 
                '--padding-start': '0',
                '--color': 'black'
              }}
            />
          </IonItem>

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
            marginBottom: '1rem',
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
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
              placeholder=" "
              style={{ 
                '--padding-start': '0',
                '--color': 'black'
              }}
            />
          </IonItem>

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
            }}>Confirm Password</IonLabel>
            <IonInput
              type="password"
              value={confirmPassword}
              onIonChange={(e) => setConfirmPassword(e.detail.value!)}
              placeholder=" "
              style={{ 
                '--padding-start': '0',
                '--color': 'black'
              }}
            />
          </IonItem>

          <IonItemDivider style={{ 
            '--background': 'transparent',
            marginBottom: '1rem'
          }}>
            <IonLabel style={{ color: '#e83e8c' }}>User Type</IonLabel>
          </IonItemDivider>

          <IonRadioGroup value={userType} onIonChange={(e) => setUserType(e.detail.value!)}>
            <IonItem style={{ 
              '--background': 'transparent',
              marginBottom: '0.5rem'
            }}>
              <IonLabel style={{ color: '#e83e8c' }}>Student</IonLabel>
              <IonRadio slot="start" value="student" style={{ '--color': '#e83e8c' }} />
            </IonItem>
            <IonItem style={{ 
              '--background': 'transparent',
              marginBottom: '2rem'
            }}>
              <IonLabel style={{ color: '#e83e8c' }}>Admin</IonLabel>
              <IonRadio slot="start" value="admin" style={{ '--color': '#e83e8c' }} />
            </IonItem>
          </IonRadioGroup>

          <Captcha onValidated={setIsCaptchaValid} />

          <IonButton 
            onClick={doRegister} 
            expand="full"
            style={{ 
              '--background': '#e83e8c',
              '--background-hover': '#d63384',
              marginBottom: '1rem'
            }}
          >
            Register
          </IonButton>

          <IonButton 
            routerLink="/CrimpTask" 
            expand="full"
            fill="outline"
            style={{ 
              '--color': '#e83e8c',
              '--border-color': '#e83e8c'
            }}
          >
            Already have an account? Login
          </IonButton>

          <IonToast isOpen={showToast} message="Account Created Successfully!" duration={2000} onDidDismiss={() => setShowToast(false)} />
          <IonAlert isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} header="Error" message={alertMessage} buttons={["OK"]} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
