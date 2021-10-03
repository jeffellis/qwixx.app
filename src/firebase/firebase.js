import { initializeApp } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';

import firebaseConfig from "./firebase-config";
class Firebase {
    constructor() {
        // Initialize Firebase
        initializeApp(firebaseConfig);
        // app.analytics();
        this.auth = getAuth();
        this.db = getDatabase();
    }

    async register(email, password, additionalProfileData) {
        const newUser = await createUserWithEmailAndPassword(getAuth(), email, password);
        return await updateProfile(newUser.user, additionalProfileData);
    }

    async login(email, password) {
        const creds = await signInWithEmailAndPassword(getAuth(), email, password);
        return creds.user;
    }

    async logout() {
        return await this.auth.signOut();
    }

    async resetPassword(email) {
        return await getAuth().sendPasswordResetEmail(email);
    }

    getAuth() {
        return getAuth();
    }

    getUser() {
        return getAuth().currentUser;
    }
}

const _firebase = new Firebase();

export default _firebase;