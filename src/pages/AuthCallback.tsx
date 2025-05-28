import React, { useEffect } from 'react';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import { useIonRouter } from '@ionic/react';
import { supabase } from '../utils/supabaseClient';

const AuthCallback: React.FC = () => {
  const navigation = useIonRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session) throw new Error("No active session found");

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("user_type")
          .eq("user_email", session.user.email)
          .single();

        if (userError || !userData) {
          await supabase.auth.signOut();
          throw new Error("Account not found. Please register first.");
        }

        // Redirect based on user type
        if (userData.user_type === "admin") {
          navigation.push("/CrimpTask/admin", "forward", "replace");
        } else {
          navigation.push("/CrimpTask/app", "forward", "replace");
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        // Redirect back to login page
        navigation.push("/CrimpTask", "back", "replace");
      }
    };

    handleCallback();
  }, [navigation]);

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
          textAlign: 'center',
          color: '#e83e8c',
          fontSize: '1.2rem'
        }}>
          <IonSpinner name="crescent" style={{ width: '48px', height: '48px' }} />
          <p style={{ marginTop: '1rem' }}>Completing sign in...</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AuthCallback; 