import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Inicializa Firebase (asegúrate de tener las credenciales correctas)
const firebaseConfig = {
    apiKey: "AIzaSyAgYh5r-FxyOOfVtCmytdstmNYOYSwQOK8",
    authDomain: "myevents-6ae75.firebaseapp.com",
    projectId: "myevents-6ae75",
    storageBucket: "myevents-6ae75.appspot.com",
    messagingSenderId: "964232367480",
    appId: "1:964232367480:web:f2dc0ff3c067d1fc72cc8d"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function verifyEmailToken(token: any) {
    const usersRef = collection(db, 'guests'); // Reemplaza 'guests' con el nombre de la colección correspondiente
    const q = query(usersRef, where('token', '==', token));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        // Token encontrado, actualiza el usuario para confirmar su correo electrónico
        querySnapshot.forEach(async (docSnapshot) => {
            const userRef = doc(db, 'guests', docSnapshot.id); // Obtén la referencia del documento
            await updateDoc(userRef, {
                emailVerified: true, // Actualiza el estado de verificación de correo electrónico
            });
        });
        return true; // Token es válido y se ha confirmado el correo electrónico
    } else {
        return false; // Token no es válido
    }
}
