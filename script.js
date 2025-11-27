// Course data by track
const courseData = {
    software: [
        { id: 'ITE220', name: 'Web Development II', credits: 4, prerequisite: 'ITE222' },
        { id: 'ITE343', name: 'Mobile Application Development', credits: 4, prerequisite: 'ITE222' },
        { id: 'ITE365', name: 'Software Quality', credits: 4 },
        { id: 'ITE367', name: 'Software Architecture and Modelling', credits: 4, prerequisite: 'ITE321' },
        { id: 'ITE368', name: 'Software Testing and Maintenance', credits: 4 }
    ],
    data: [
        { id: 'ITE351', name: 'Programming for Data Science', credits: 4, prerequisite: 'ITE224' },
        { id: 'ITE352', name: 'Artificial Intelligence and Machine Learning', credits: 4, prerequisite: 'ITE224' },
        { id: 'ITE353', name: 'Machine Learning Foundation', credits: 4, prerequisite: 'ITE224' },
        { id: 'ITE354', name: 'Business Intelligence and Decision Modeling', credits: 4, prerequisite: 'ITE224' },
        { id: 'ITE355', name: 'Data Warehousing and Data Mining', credits: 4, prerequisite: 'ITE224' }
    ],
    network: [
        { id: 'ITE201', name: 'IT Service Desk & Incident', credits: 4 },
        { id: 'ITE421', name: 'Information Assurance and Security II', credits: 4, prerequisite: 'ITE420' },
        { id: 'ITE451', name: 'AWS Cloud Foundation', credits: 4 },
        { id: 'ITE476', name: 'Network II', credits: 4, prerequisite: 'ITE475' },
        { id: 'ITE477', name: 'Window Server', credits: 4 }
    ]
};

// Language translations
const translations = {
    th: {
        form_title: "ข้อมูลนักศึกษา",
        form_subtitle: "กรอกข้อมูลนักศึกษาก่อนเลือกวิชา",
        first_name: "ชื่อ",
        last_name: "นามสกุล",
        email: "อีเมล",
        student_id: "รหัสนักศึกษา",
        track_label: "เลือกสาขาวิชา",
        year_label: "ชั้นปี",
        term_label: "ภาคเรียน",
        next_button: "ถัดไป - เลือกวิชา",
        course_selection: "เลือกวิชาเรียน",
        course_subtitle: "เลือกวิชาที่ต้องการลงทะเบียนในภาคเรียนนี้",
        selected_track: "สาขาวิชา:",
        guidance_title: "คำแนะนำ:",
        guidance_text: "สามารถเลือกได้สูงสุด 7 วิชา หรือไม่เกิน 21 หน่วยกิต",
        selected_courses: "วิชาที่เลือก:",
        total_credits: "หน่วยกิตรวม:",
        total_courses: "จำนวนวิชา:",
        back_button: "ย้อนกลับ",
        submit_button: "ยืนยันการลงทะเบียน",
        success_title: "ลงทะเบียนสำเร็จ!",
        success_message: "ระบบได้บันทึกข้อมูลการลงทะเบียนของคุณเรียบร้อยแล้ว",
        new_registration: "ลงทะเบียนใหม่",
        view_dashboard: "ดู Dashboard",
        error_title: "เกิดข้อผิดพลาด!",
        retry_button: "ลองอีกครั้ง",
        saving_data: "กำลังบันทึกข้อมูล...",
        please_wait: "กรุณารอสักครู่",
        prerequisite: "วิชาบังคับก่อนเรียน:",
        no_prerequisite: "ไม่มีวิชาบังคับก่อนเรียน"
    },
    en: {
        form_title: "Student Information",
        form_subtitle: "Fill in your student information before selecting courses",
        first_name: "First Name",
        last_name: "Last Name",
        email: "Email",
        student_id: "Student ID",
        track_label: "Select Track",
        year_label: "Year",
        term_label: "Term",
        next_button: "Next - Select Courses",
        course_selection: "Course Selection",
        course_subtitle: "Select courses you want to register for this term",
        selected_track: "Track:",
        guidance_title: "Guidance:",
        guidance_text: "You can select up to 7 courses or not more than 21 credits",
        selected_courses: "Selected Courses:",
        total_credits: "Total Credits:",
        total_courses: "Total Courses:",
        back_button: "Back",
        submit_button: "Confirm Registration",
        success_title: "Registration Successful!",
        success_message: "Your registration information has been saved successfully",
        new_registration: "New Registration",
        view_dashboard: "View Dashboard",
        error_title: "Error Occurred!",
        retry_button: "Try Again",
        saving_data: "Saving data...",
        please_wait: "Please wait...",
        prerequisite: "Prerequisite:",
        no_prerequisite: "No prerequisite"
    }
};

// Current application state
let currentLanguage = 'th';
let studentData = {};
let selectedCourses = [];
let totalCredits = 0;

// DOM elements
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const progressBar = document.getElementById('progress-bar');
const studentInfoForm = document.getElementById('studentInfoForm');
const courseList = document.getElementById('course-list');
const selectedCoursesList = document.getElementById('selected-courses-list');
const totalCreditsEl = document.getElementById('total-credits');
const totalCoursesEl = document.getElementById('total-courses');
const displayTrack = document.getElementById('display-track');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageSwitcher();
    initializeEventListeners();
    checkFirebaseConnection();
});

// ตรวจสอบการเชื่อมต่อ Firebase
function checkFirebaseConnection() {
    if (!firebaseInitialized) {
        console.warn('⚠️ Firebase is not initialized. Using demo mode.');
        showNotification('⚠️ ระบบกำลังทำงานในโหมดทดสอบ (Firebase ไม่ได้เชื่อมต่อ)', 'warning');
    }
}

// แสดงการแจ้งเตือน
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container').prepend(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// Firebase Functions
async function saveToFirebase(studentInfo, selectedCourses) {
    return new Promise(async (resolve, reject) => {
        if (!firebaseInitialized) {
            // ถ้า Firebase ไม่ได้เชื่อมต่อ ให้จำลองการบันทึกสำเร็จ
            setTimeout(() => {
                console.log('📝 Demo mode: Registration data would be saved to Firebase');
                console.log('Student Info:', studentInfo);
                console.log('Selected Courses:', selectedCourses);
                resolve({ success: true, id: 'demo-' + Date.now() });
            }, 2000);
            return;
        }

        try {
            const db = firebase.firestore();
            const docRef = await db.collection('registrations').add({
                firstName: studentInfo.firstName,
                lastName: studentInfo.lastName,
                email: studentInfo.email,
                studentId: studentInfo.studentId,
                track: studentInfo.track,
                year: parseInt(studentInfo.year),
                term: parseInt(studentInfo.term),
                courses: selectedCourses,
                totalCredits: selectedCourses.reduce((sum, course) => sum + course.credits, 0),
                registrationDate: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            });
            
            console.log('✅ Data saved to Firebase with ID:',
