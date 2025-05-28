import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonToast,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { format } from 'date-fns';

interface Incident {
  id: number;
  created_at: string;
  email: string;
  incident_type: string;
  status: string;
  description: string;
  ip_address: string;
  user_agent: string;
}

const IncidentReport: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const fetchIncidents = async () => {
    try {
      let query = supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (dateFilter) {
        const startDate = new Date(dateFilter);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateFilter);
        endDate.setHours(23, 59, 59, 999);
        query = query.gte('created_at', startDate.toISOString())
                     .lte('created_at', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      setIncidents(data || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      setToastMessage('Failed to fetch incidents');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [statusFilter, dateFilter]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchIncidents();
    event.detail.complete();
  };

  const updateIncidentStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setIncidents(incidents.map(incident => 
        incident.id === id ? { ...incident, status: newStatus } : incident
      ));

      setToastMessage('Status updated successfully');
      setShowToast(true);
    } catch (error) {
      console.error('Error updating status:', error);
      setToastMessage('Failed to update status');
      setShowToast(true);
    }
  };

  const filteredIncidents = incidents.filter(incident =>
    incident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Incident Reports</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div style={{ padding: '1rem' }}>
          <IonSearchbar
            value={searchTerm}
            onIonChange={e => setSearchTerm(e.detail.value!)}
            placeholder="Search incidents..."
            style={{ marginBottom: '1rem' }}
          />

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <IonSelect
              value={statusFilter}
              onIonChange={e => setStatusFilter(e.detail.value)}
              style={{ flex: 1 }}
            >
              <IonSelectOption value="all">All Status</IonSelectOption>
              <IonSelectOption value="pending">Pending</IonSelectOption>
              <IonSelectOption value="investigating">Investigating</IonSelectOption>
              <IonSelectOption value="resolved">Resolved</IonSelectOption>
            </IonSelect>

            <IonDatetime
              value={dateFilter}
              onIonChange={e => {
                const value = e.detail.value;
                if (typeof value === 'string') {
                  setDateFilter(value);
                }
              }}
              presentation="date"
              style={{ flex: 1 }}
            />
          </div>

          <IonList>
            {filteredIncidents.map(incident => (
              <IonItem key={incident.id}>
                <IonLabel>
                  <h2>{incident.email}</h2>
                  <p>{incident.description}</p>
                  <p>Type: {incident.incident_type}</p>
                  <p>IP: {incident.ip_address}</p>
                  <p>Time: {format(new Date(incident.created_at), 'PPpp')}</p>
                </IonLabel>
                <div slot="end">
                  <IonBadge
                    color={
                      incident.status === 'resolved' ? 'success' :
                      incident.status === 'investigating' ? 'warning' :
                      'danger'
                    }
                    style={{ marginBottom: '0.5rem' }}
                  >
                    {incident.status}
                  </IonBadge>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <IonButton
                      size="small"
                      onClick={() => updateIncidentStatus(incident.id, 'investigating')}
                      disabled={incident.status === 'investigating'}
                    >
                      Investigate
                    </IonButton>
                    <IonButton
                      size="small"
                      color="success"
                      onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                      disabled={incident.status === 'resolved'}
                    >
                      Resolve
                    </IonButton>
                  </div>
                </div>
              </IonItem>
            ))}
          </IonList>
        </div>

        <IonLoading isOpen={loading} message="Loading incidents..." />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default IncidentReport; 