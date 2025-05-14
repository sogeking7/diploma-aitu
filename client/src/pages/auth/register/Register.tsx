// src/pages/Register.tsx
import React, { useState } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonInput, IonButton, IonItem, IonLabel, IonLoading, IonText
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {useAuth} from "../../../contexts/AuthContext/AuthContext";

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register, loading } = useAuth();
    const history = useHistory();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await register({ name, email, password });
            history.replace('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to register');
            console.error(err);
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
                <IonLoading isOpen={loading} />
                {error && (
                    <IonText color="danger">
                        <p>{error}</p>
                    </IonText>
                )}

                <form onSubmit={handleSubmit}>
                    <IonItem>
                        <IonLabel position="floating">Name</IonLabel>
                        <IonInput
                            type="text"
                            value={name}
                            onIonChange={(e) => setName(e.detail.value!)}
                            required
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating">Email</IonLabel>
                        <IonInput
                            type="email"
                            value={email}
                            onIonChange={(e) => setEmail(e.detail.value!)}
                            required
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating">Password</IonLabel>
                        <IonInput
                            type="password"
                            value={password}
                            onIonChange={(e) => setPassword(e.detail.value!)}
                            required
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating">Confirm Password</IonLabel>
                        <IonInput
                            type="password"
                            value={confirmPassword}
                            onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                            required
                        />
                    </IonItem>

                    <IonButton expand="block" type="submit" className="ion-margin-top">
                        Register
                    </IonButton>
                </form>

                <IonButton
                    expand="block"
                    fill="clear"
                    routerLink="/login"
                    className="ion-margin-top"
                >
                    Already have an account? Login
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Register;
