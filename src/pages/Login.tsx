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
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
            placeholder="Enter email"
            type="email"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
            placeholder="Enter password"
            type="password"
          />
        </IonItem>

        <IonButton expand="full" onClick={doLogin}>
          Login
        </IonButton>

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />

        <IonButton onClick={goToRegister} expand="full">
          Don't have an account? Register
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

export default Login;
