import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

import firebaseConfig from "./firebase-config";
class Firebase {
    constructor() {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        // app.analytics();
        this.auth = firebase.auth();
        this.db = firebase.database();
    }

    async register(name, email, password) {
        const newUser = await this.auth.createUserWithEmailAndPassword(email, password);
        return await newUser.user.updateProfile({displayName: name});
    }

    async login(email, password) {
        return await this.auth.signInWithEmailAndPassword(email, password);
    }

    async logout() {
        await this.auth.signOut();
    }

    async resetPassword(email) {
        await this.auth.sendPasswordResetEmail(email);
    }
}

const _firebase = new Firebase();

export default _firebase;