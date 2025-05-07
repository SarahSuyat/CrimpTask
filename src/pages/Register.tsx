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
  IonRadio,
  IonRadioGroup,
  IonItemDivider,
} from "@ionic/react";
import { useState } from "react";

const Register: React.FC = () => {
  const navigation = useIonRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState(""); // admin or student
  const [showToast, setShowToast] = useState(false);

  const doRegister = () => {
    if (!username || !email || !password || !confirmPassword || !userType) {
      alert("Please fill in all fields and select user type.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const emailExists = existingUsers.some((user: any) => user.email === email);
    if (emailExists) {
      alert("Email is already registered. Redirecting to login...");
      navigation.push("/CrimpTask", "forward", "replace");
      return;
    }

    // Register user
    const newUser = { username, email, password, userType };
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    setShowToast(true);
    setTimeout(() => {
      navigation.push("/CrimpTask", "forward", "replace");
    }, 2000);
  };

  const navigateToLogin = () => {
    navigation.push("/CrimpTask");
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

        <IonButton onClick={navigateToLogin} expand="full" color="secondary">
          Already have an account? Login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
