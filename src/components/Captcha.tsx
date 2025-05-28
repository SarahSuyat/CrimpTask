import React, { useState, useEffect } from 'react';
import { IonItem, IonLabel, IonInput, IonText } from '@ionic/react';

interface CaptchaProps {
  onValidated: (isValid: boolean) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onValidated }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [feedback, setFeedback] = useState('');

  const generateNewProblem = () => {
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
    setAnswer('');
    setIsValid(false);
    setFeedback('');
    onValidated(false);
  };

  useEffect(() => {
    generateNewProblem();
  }, []);

  const handleAnswerChange = (e: any) => {
    const value = e.detail.value;
    setAnswer(value);
    
    const correctAnswer = num1 + num2;
    const isValidAnswer = parseInt(value) === correctAnswer;
    setIsValid(isValidAnswer);
    onValidated(isValidAnswer);
    
    if (value) {
      setFeedback(isValidAnswer ? 'Correct!' : 'Wrong, try again');
    } else {
      setFeedback('');
    }
  };

  return (
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
      }}>
        Solve: {num1} + {num2} = ?
      </IonLabel>
      <IonInput
        value={answer}
        onIonChange={handleAnswerChange}
        placeholder="Enter answer"
        type="number"
        style={{ 
          '--padding-start': '0',
          '--color': 'black'
        }}
      />
      {feedback && (
        <IonText color={isValid ? 'success' : 'danger'} style={{ 
          display: 'block',
          marginTop: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          {feedback}
        </IonText>
      )}
    </IonItem>
  );
};

export default Captcha; 