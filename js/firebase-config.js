// Firebase Configuration for MH Construction
// This is a placeholder configuration - replace with actual Firebase config

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrsSA768hB31f042L10ah4EoLOU3UjMJI",
  authDomain: "mhc-gc-website.firebaseapp.com",
  projectId: "mhc-gc-website",
  storageBucket: "mhc-gc-website.firebasestorage.app",
  messagingSenderId: "451386398124",
  appId: "1:451386398124:web:afdf8b24b454446af01609",
  measurementId: "G-D34NDETKE4"
};

// Initialize Firebase (only if Firebase SDK is loaded)
let db = null;
let auth = null;

function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            auth = firebase.auth();
            console.log('Firebase initialized successfully');
        } catch (error) {
            console.log('Firebase initialization skipped:', error.message);
        }
    } else {
        console.log('Firebase SDK not loaded - using localStorage fallback');
    }
}

// Fallback storage using localStorage
const fallbackStorage = {
    save: (collection, data) => {
        try {
            const existing = JSON.parse(localStorage.getItem(collection) || '[]');
            const newItem = { ...data, id: generateId(), timestamp: Date.now() };
            existing.push(newItem);
            localStorage.setItem(collection, JSON.stringify(existing));
            return Promise.resolve(newItem);
        } catch (error) {
            return Promise.reject(error);
        }
    },
    
    get: (collection) => {
        try {
            return Promise.resolve(JSON.parse(localStorage.getItem(collection) || '[]'));
        } catch (error) {
            return Promise.reject(error);
        }
    }
};

// Database operations with fallback
const dbOperations = {
    saveProject: async (projectData) => {
        if (db) {
            try {
                const docRef = await db.collection('projects').add({
                    ...projectData,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                return docRef.id;
            } catch (error) {
                console.error('Firebase save failed, using fallback:', error);
                return fallbackStorage.save('projects', projectData);
            }
        } else {
            return fallbackStorage.save('projects', projectData);
        }
    },
    
    saveLead: async (leadData) => {
        if (db) {
            try {
                const docRef = await db.collection('leads').add({
                    ...leadData,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                return docRef.id;
            } catch (error) {
                console.error('Firebase save failed, using fallback:', error);
                return fallbackStorage.save('leads', leadData);
            }
        } else {
            return fallbackStorage.save('leads', leadData);
        }
    },
    
    getProjects: async () => {
        if (db) {
            try {
                const snapshot = await db.collection('projects').orderBy('timestamp', 'desc').get();
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error('Firebase get failed, using fallback:', error);
                return fallbackStorage.get('projects');
            }
        } else {
            return fallbackStorage.get('projects');
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
});

// Make dbOperations available globally
window.dbOperations = dbOperations;