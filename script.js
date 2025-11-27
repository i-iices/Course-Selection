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
            
            console.log('✅ Data saved to Firebase with ID:', docRef.id);
            resolve({ success: true, id: docRef.id });
        } catch (error) {
            console.error('❌ Error saving to Firebase:', error);
            reject(error);
        }
    });
}

// ตรวจสอบรหัสนักศึกษาซ้ำ
async function checkDuplicateStudent(studentId) {
    if (!firebaseInitialized) {
        return false; // ในโหมด demo ให้ผ่านตลอด
    }

    try {
        const db = firebase.firestore();
        const snapshot = await db.collection('registrations')
            .where('studentId', '==', studentId)
            .where('status', '==', 'active')
            .get();
        
        return !snapshot.empty;
    } catch (error) {
        console.error('Error checking duplicate:', error);
        return false;
    }
}

// Main Functions
function initializeLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function switchLanguage(lang) {
    currentLanguage = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

function initializeEventListeners() {
    studentInfoForm.addEventListener('submit', handleFormSubmit);
    document.getElementById('backBtn').addEventListener('click', goToPage1);
    document.getElementById('submitBtn').addEventListener('click', handleRegistration);
    document.getElementById('newRegistrationBtn').addEventListener('click', resetForm);
    document.getElementById('retryBtn').addEventListener('click', retryRegistration);

    const formInputs = studentInfoForm.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    if (await validateForm()) {
        studentData = {
            firstName: document.getElementById('fname').value.trim(),
            lastName: document.getElementById('lname').value.trim(),
            email: document.getElementById('email').value.trim(),
            studentId: document.getElementById('studentId').value.trim(),
            track: document.getElementById('track').value,
            year: document.getElementById('year').value,
            term: document.getElementById('term').value
        };
        
        const trackName = document.getElementById('track').options[document.getElementById('track').selectedIndex].text;
        displayTrack.textContent = trackName;
        generateCourseList(studentData.track);
        goToPage2();
    }
}

async function validateForm() {
    let isValid = true;
    
    // Reset error messages
    document.querySelectorAll('.field-error').forEach(error => {
        error.style.display = 'none';
    });

    // Validate first name
    const fname = document.getElementById('fname');
    if (!fname.value.trim()) {
        document.getElementById('fname-error').style.display = 'block';
        isValid = false;
    }

    // Validate last name
    const lname = document.getElementById('lname');
    if (!lname.value.trim()) {
        document.getElementById('lname-error').style.display = 'block';
        isValid = false;
    }

    // Validate email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
    }

    // Validate student ID
    const studentId = document.getElementById('studentId');
    if (!studentId.value.trim()) {
        document.getElementById('studentId-error').style.display = 'block';
        isValid = false;
    } else {
        // Check for duplicate student ID
        const isDuplicate = await checkDuplicateStudent(studentId.value.trim());
        if (isDuplicate) {
            const errorElement = document.getElementById('studentId-error');
            errorElement.textContent = currentLanguage === 'th' 
                ? 'รหัสนักศึกษานี้ได้ลงทะเบียนไว้แล้ว' 
                : 'This student ID is already registered';
            errorElement.style.display = 'block';
            isValid = false;
        }
    }

    // Validate track
    const track = document.getElementById('track');
    if (!track.value) {
        document.getElementById('track-error').style.display = 'block';
        isValid = false;
    }

    // Validate year
    const year = document.getElementById('year');
    if (!year.value) {
        document.getElementById('year-error').style.display = 'block';
        isValid = false;
    }

    // Validate term
    const term = document.getElementById('term');
    if (!term.value) {
        document.getElementById('term-error').style.display = 'block';
        isValid = false;
    }

    return isValid;
}

function validateField(e) {
    const field = e.target;
    const fieldId = field.id;
    const errorId = `${fieldId}-error`;
    
    if (validateFieldById(fieldId)) {
        clearFieldErrorById(fieldId, errorId);
    } else {
        showFieldError(fieldId, errorId);
    }
}

function validateFieldById(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    
    switch(fieldId) {
        case 'fname':
        case 'lname':
            return value.length >= 2;
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case 'studentId':
            return value.length >= 5;
        case 'track':
        case 'year':
        case 'term':
            return value !== '';
        default:
            return true;
    }
}

function showFieldError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    field.classList.add('error');
    error.style.display = 'block';
}

function clearFieldError(e) {
    const field = e.target;
    const fieldId = field.id;
    const errorId = `${fieldId}-error`;
    clearFieldErrorById(fieldId, errorId);
}

function clearFieldErrorById(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    field.classList.remove('error');
    error.style.display = 'none';
}

function generateCourseList(track) {
    const courses = courseData[track] || [];
    courseList.innerHTML = '';
    
    if (courses.length === 0) {
        courseList.innerHTML = '<p class="text-center text-muted">ไม่มีวิชาในสาขานี้</p>';
        return;
    }
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.setAttribute('data-course-id', course.id);
        
        const isSelected = selectedCourses.some(c => c.id === course.id);
        if (isSelected) {
            courseCard.classList.add('selected');
        }
        
        let prerequisiteText = '';
        if (course.prerequisite) {
            prerequisiteText = currentLanguage === 'th' 
                ? `วิชาบังคับก่อนเรียน: ${course.prerequisite}`
                : `Prerequisite: ${course.prerequisite}`;
        } else {
            prerequisiteText = currentLanguage === 'th' 
                ? 'ไม่มีวิชาบังคับก่อนเรียน'
                : 'No prerequisite';
        }
        
        courseCard.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="course-checkbox ${isSelected ? 'checked' : ''}">
                    <i class="fas fa-check" style="${isSelected ? 'display: block;' : 'display: none;'}"></i>
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="mb-0 course-code">${course.id}</h6>
                        <span class="badge bg-primary">${course.credits} หน่วยกิต</span>
                    </div>
                    <h6 class="mb-2">${course.name}</h6>
                    <p class="text-muted mb-0 small">
                        <i class="fas fa-info-circle me-1"></i>
                        ${prerequisiteText}
                    </p>
                </div>
            </div>
        `;
        
        courseCard.addEventListener('click', () => toggleCourseSelection(course));
        courseList.appendChild(courseCard);
    });
}

function toggleCourseSelection(course) {
    const courseCard = document.querySelector(`[data-course-id="${course.id}"]`);
    const checkbox = courseCard.querySelector('.course-checkbox');
    const checkIcon = courseCard.querySelector('.fa-check');
    
    const courseIndex = selectedCourses.findIndex(c => c.id === course.id);
    
    if (courseIndex === -1) {
        if (selectedCourses.length >= 7) {
            alert(currentLanguage === 'th' 
                ? 'คุณเลือกวิชาครบจำนวนสูงสุด (7 วิชา) แล้ว' 
                : 'You have reached the maximum number of courses (7)');
            return;
        }
        
        if (totalCredits + course.credits > 21) {
            alert(currentLanguage === 'th' 
                ? 'หน่วยกิตรวมเกินกำหนด (21 หน่วยกิต)' 
                : 'Total credits exceed the limit (21 credits)');
            return;
        }
        
        selectedCourses.push(course);
        courseCard.classList.add('selected');
        checkbox.classList.add('checked');
        checkIcon.style.display = 'block';
        totalCredits += course.credits;
    } else {
        selectedCourses.splice(courseIndex, 1);
        courseCard.classList.remove('selected');
        checkbox.classList.remove('checked');
        checkIcon.style.display = 'none';
        totalCredits -= course.credits;
    }
    
    updateSelectedCoursesList();
    updateSubmitButton();
}

function updateSelectedCoursesList() {
    selectedCoursesList.innerHTML = '';
    
    if (selectedCourses.length === 0) {
        selectedCoursesList.innerHTML = '<li class="text-muted">' + 
            (currentLanguage === 'th' ? 'ยังไม่ได้เลือกวิชา' : 'No courses selected') + 
            '</li>';
    } else {
        selectedCourses.forEach(course => {
            const listItem = document.createElement('li');
            listItem.className = 'selected-course-item';
            listItem.innerHTML = `
                <div>
                    <strong class="course-code">${course.id}</strong> - ${course.name}
                </div>
                <span class="course-badge">${course.credits} หน่วยกิต</span>
            `;
            selectedCoursesList.appendChild(listItem);
        });
    }
    
    totalCreditsEl.textContent = totalCredits;
    totalCoursesEl.textContent = selectedCourses.length;
}

function updateSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    if (selectedCourses.length > 0) {
        submitBtn.innerHTML = `
            <span data-i18n="submit_button">ยืนยันการลงทะเบียน</span>
            <small class="ms-2">(${selectedCourses.length} วิชา, ${totalCredits} หน่วยกิต)</small>
            <i class="fas fa-check ms-2"></i>
        `;
    } else {
        submitBtn.innerHTML = `
            <span data-i18n="submit_button">ยืนยันการลงทะเบียน</span>
            <i class="fas fa-check ms-2"></i>
        `;
    }
    
    const submitText = submitBtn.querySelector('[data-i18n="submit_button"]');
    if (submitText && translations[currentLanguage]) {
        submitText.textContent = translations[currentLanguage].submit_button;
    }
}

function goToPage2() {
    page1.classList.remove('active');
    page2.classList.add('active');
    progressBar.style.width = '100%';
    progressBar.setAttribute('aria-valuenow', '100');
}

function goToPage1() {
    page2.classList.remove('active');
    page1.classList.add('active');
    progressBar.style.width = '50%';
    progressBar.setAttribute('aria-valuenow', '50');
}

async function handleRegistration() {
    if (selectedCourses.length === 0) {
        alert(currentLanguage === 'th' 
            ? 'กรุณาเลือกอย่างน้อย 1 วิชา' 
            : 'Please select at least 1 course');
        return;
    }
    
    showLoading(true);
    
    try {
        const result = await saveToFirebase(studentData, selectedCourses);
        
        if (result.success) {
            showSuccessMessage();
            console.log('🎉 Registration successful! ID:', result.id);
        } else {
            throw new Error('Failed to save data');
        }
    } catch (error) {
        showErrorMessage(error.message || 'ไม่สามารถบันทึกข้อมูลได้');
        console.error('❌ Registration failed:', error);
    } finally {
        showLoading(false);
    }
}

function retryRegistration() {
    errorMessage.style.display = 'none';
    handleRegistration();
}

function showLoading(show) {
    if (show) {
        loadingOverlay.style.display = 'flex';
        const submitBtn = document.getElementById('submitBtn');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <i class="fas fa-spinner fa-spin me-2"></i>
            <span>${translations[currentLanguage].saving_data}</span>
        `;
        submitBtn.disabled = true;
        submitBtn.setAttribute('data-original-html', originalHTML);
    } else {
        loadingOverlay.style.display = 'none';
        const submitBtn = document.getElementById('submitBtn');
        const originalHTML = submitBtn.getAttribute('data-original-html');
        if (originalHTML) {
            submitBtn.innerHTML = originalHTML;
            submitBtn.removeAttribute('data-original-html');
        }
        submitBtn.disabled = false;
    }
}

function showSuccessMessage() {
    page2.classList.remove('active');
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

function showErrorMessage(errorDetails) {
    page2.classList.remove('active');
    successMessage.style.display = 'none';
    errorMessage.style.display = 'block';
    
    const errorDetailsEl = document.getElementById('error-details');
    if (errorDetailsEl) {
        errorDetailsEl.textContent = errorDetails;
    }
}

function resetForm() {
    studentInfoForm.reset();
    studentData = {};
    selectedCourses = [];
    totalCredits = 0;
    
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    page1.classList.add('active');
    progressBar.style.width = '50%';
    progressBar.setAttribute('aria-valuenow', '50');
    
    const errors = document.querySelectorAll('.field-error');
    errors.forEach(error => error.style.display = 'none');
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
    
    updateSubmitButton();
}
