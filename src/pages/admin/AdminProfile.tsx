import React, { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, IonToast } from '@ionic/react';

const AdminProfile: React.FC = () => {
  const [username, setUsername] = useState('Admin');
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [showToast, setShowToast] = useState(false);

  const handleSaveProfile = () => {
    if (!username || !email || !password) {
      setShowToast(true);
      return;
    }

    // Here, you would typically send the updated data to the backend or save it in local storage.
    console.log('Profile updated:', { username, email, password });
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Username</IonLabel>
          <IonInput
            value={username}
            onIonChange={(e) => setUsername(e.detail.value!)}
            placeholder="Enter username"
          />
        </IonItem>

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

        {/* Save Profile Button */}
        <IonButton expand="full" onClick={handleSaveProfile}>
          Save Profile
        </IonButton>

        {/* Toast for success/failure */}
        <IonToast
          isOpen={showToast}
          message="Profile updated successfully!"
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminProfile;
