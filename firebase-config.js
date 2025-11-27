const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
let firebaseInitialized = false;

try {
    if (typeof firebase !== 'undefined') {
        // ตรวจสอบว่า Firebase ถูก initialize แล้วหรือยัง
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase initialized successfully');
        } else {
            firebase.app(); // ใช้ app ที่มีอยู่
        }
        firebaseInitialized = true;
    } else {
        console.error('❌ Firebase SDK not loaded');
    }
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, firebaseInitialized };
}
window.firebaseInitialized = firebaseInitialized;
