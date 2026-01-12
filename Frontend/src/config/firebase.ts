import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBzKsdEJ3K0PnbsF5zJiq7d4UwYB-4g8lM",
    authDomain: "health-agent-62071.firebaseapp.com",
    projectId: "health-agent-62071",
    storageBucket: "health-agent-62071.firebasestorage.app",
    messagingSenderId: "144126616448",
    appId: "1:144126616448:web:830c4d6f899e5b3d6c1765",
    measurementId: "G-JWVEXJV1TH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { auth, db, analytics };
export default app;
