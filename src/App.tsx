import { Redirect, Route, useHistory } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect } from 'react';
import { supabase } from './utils/supabaseClient';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

import Login from './pages/Login';
import Menu from './pages/Menu';
import Register from './pages/Register';
import TaskDetailPage from './pages/TaskDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';

setupIonicReact();

const App: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email;
        const { data: userData } = await supabase
          .from("users")
          .select("user_type")
          .eq("user_email", email)
          .single();

        if (userData?.user_type === "admin") {
          history.push("/CrimpTask/admin");
        } else {
          history.push("/CrimpTask/app");
        }
      }
    });
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/CrimpTask" component={Login} />
          <Route path="/CrimpTask/app" component={Menu} />
          <Route exact path="/register" component={Register} />
          <Route path="/task/:id" component={TaskDetailPage} exact />
          <Route path="/CrimpTask/admin" component={AdminDashboard} />
          <Redirect exact from="/" to="/CrimpTask" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
