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

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState(""); // admin or student
  const [showToast, setShowToast] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

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

      // Sign up in Supabase authentication
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        throw new Error("Account creation failed: " + error.message);
      }

      // Hash password before storing in the database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert user data into 'users' table
      const { error: insertError } = await supabase.from("users").insert([
        {
          username,
          user_email: email,
          user_password: hashedPassword,
          user_type: userType,
        },
      ]);

      if (insertError) {
        throw new Error("Failed to save user data: " + insertError.message);
      }

      setShowToast(true);
    } catch (err) {
      if (err instanceof Error) {
        setAlertMessage(err.message);
      } else {
        setAlertMessage("An unknown error occurred.");
      }
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput
            value={username}
            onIonChange={(e) => setUsername(e.detail.value!)}
            placeholder="Enter username"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
            placeholder="Enter email"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
            placeholder="Enter password"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Confirm Password</IonLabel>
          <IonInput
            type="password"
            value={confirmPassword}
            onIonChange={(e) => setConfirmPassword(e.detail.value!)}
            placeholder="Confirm your password"
          />
        </IonItem>

        <IonItemDivider>
          <IonLabel>User Type</IonLabel>
        </IonItemDivider>
        <IonRadioGroup value={userType} onIonChange={(e) => setUserType(e.detail.value!)}>
          <IonItem>
            <IonLabel>Student</IonLabel>
            <IonRadio slot="start" value="student" />
          </IonItem>
          <IonItem>
            <IonLabel>Admin</IonLabel>
            <IonRadio slot="start" value="admin" />
          </IonItem>
        </IonRadioGroup>

        <IonButton onClick={doRegister} expand="full">Register</IonButton>

        <IonToast
          isOpen={showToast}
          message="Account Created Successfully!"
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />

        <IonButton routerLink="/CrimpTask" expand="full" fill="clear" shape='round'>
                    Already have an account? Login in
        </IonButton>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Error"
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
