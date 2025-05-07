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
} from "@ionic/react";

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);

  const doLogin = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
  
    if (!email || !password) {
      setShowToast(true);
      return;
    }
  
    const foundUser = storedUsers.find(
      (user: any) => user.email === email && user.password === password
    );
  
    if (foundUser) {
      // Optional: store session
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
  
      // Redirect based on user type
      if (foundUser.userType === "admin") {
        navigation.push("/CrimpTask/admin", "forward", "replace");
      } else {
        navigation.push("/CrimpTask/app", "forward", "replace");
      }
    } else {
      alert("Invalid credentials!");
    }
  };
  

  const goToRegister = () => {
    navigation.push('/register'); //  Navigate to Register
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

        <IonButton expand="full" onClick={doLogin}>Login</IonButton>
        <IonToast
          isOpen={showToast}
          message="Please enter both email and password"
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />

            <IonButton onClick={() => goToRegister()} expand="full">
                Don't have an account? Register
            </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
