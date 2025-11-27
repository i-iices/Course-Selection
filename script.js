// Course data for each track
const courseData = {
  software: [
    { id: 'sw101', name: 'การเขียนโปรแกรมพื้นฐาน', credits: 3, description: 'เรียนรู้พื้นฐานการเขียนโปรแกรมด้วยภาษา Python' },
    { id: 'sw201', name: 'โครงสร้างข้อมูลและอัลกอริทึม', credits: 3, description: 'ศึกษาโครงสร้างข้อมูลและเทคนิคการออกแบบอัลกอริทึม' },
    { id: 'sw301', name: 'การพัฒนาซอฟต์แวร์', credits: 3, description: 'เรียนรู้กระบวนการพัฒนาซอฟต์แวร์อย่างเป็นระบบ' },
    { id: 'sw401', name: 'ฐานข้อมูล', credits: 3, description: 'ออกแบบและจัดการฐานข้อมูลเชิงสัมพันธ์' },
    { id: 'sw501', name: 'วิศวกรรมความต้องการ', credits: 3, description: 'การรวบรวมและวิเคราะห์ความต้องการของระบบ' },
    { id: 'sw601', name: 'การทดสอบซอฟต์แวร์', credits: 3, description: 'เทคนิคและเครื่องมือในการทดสอบซอฟต์แวร์' },
    { id: 'sw701', name: 'โครงงานวิศวกรรมซอฟต์แวร์', credits: 3, description: 'ทำโครงงานพัฒนาซอฟต์แวร์ขนาดใหญ่' }
  ],
  data: [
    { id: 'ds101', name: 'คณิตศาสตร์สำหรับวิทยาศาสตร์ข้อมูล', credits: 3, description: 'พื้นฐานคณิตศาสตร์ที่จำเป็นสำหรับวิทยาศาสตร์ข้อมูล' },
    { id: 'ds201', name: 'สถิติและการวิเคราะห์ข้อมูล', credits: 3, description: 'หลักการทางสถิติและการวิเคราะห์ข้อมูลเบื้องต้น' },
    { id: 'ds301', name: 'การเรียนรู้ของเครื่อง', credits: 3, description: 'อัลกอริทึมและเทคนิคการเรียนรู้ของเครื่อง' },
    { id: 'ds401', name: 'การประมวลผลข้อมูลขนาดใหญ่', credits: 3, description: 'เครื่องมือและเทคนิคการประมวลผลข้อมูลขนาดใหญ่' },
    { id: 'ds501', name: 'การแสดงภาพข้อมูล', credits: 3, description: 'เทคนิคการแสดงภาพข้อมูลเพื่อการสื่อสารที่มีประสิทธิภาพ' },
    { id: 'ds601', name: 'การทำเหมืองข้อมูล', credits: 3, description: 'เทคนิคการค้นหารูปแบบและความรู้จากข้อมูล' },
    { id: 'ds701', name: 'โครงงานวิทยาศาสตร์ข้อมูล', credits: 3, description: 'ทำโครงงานวิเคราะห์ข้อมูลจริง' }
  ],
  network: [
    { id: 'nt101', name: 'พื้นฐานเครือข่ายคอมพิวเตอร์', credits: 3, description: 'เรียนรู้สถาปัตยกรรมและโปรโตคอลเครือข่าย' },
    { id: 'nt201', name: 'การบริหารเครือข่าย', credits: 3, description: 'การติดตั้งและบริหารจัดการเครือข่ายคอมพิวเตอร์' },
    { id: 'nt301', name: 'ความปลอดภัยของข้อมูล', credits: 3, description: 'หลักการและเทคนิคการรักษาความปลอดภัยข้อมูล' },
    { id: 'nt401', name: 'การโจมตีและการป้องกันระบบ', credits: 3, description: 'ศึกษารูปแบบการโจมตีและเทคนิคการป้องกัน' },
    { id: 'nt501', name: 'นิติวิทยาศาสตร์ดิจิทัล', credits: 3, description: 'การสืบสวนและเก็บหลักฐานทางดิจิทัล' },
    { id: 'nt601', name: 'เครือข่ายไร้สายและเคลื่อนที่', credits: 3, description: 'เทคโนโลยีและความปลอดภัยของเครือข่ายไร้สาย' },
    { id: 'nt701', name: 'โครงงานความปลอดภัยเครือข่าย', credits: 3, description: 'ทำโครงงานด้านความปลอดภัยเครือข่าย' }
  ]
};

// Global variables
let selectedCourses = [];
let studentInfo = {};

// DOM elements
const studentInfoForm = document.getElementById('studentInfoForm');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const submitBtn = document.getElementById('submitBtn');
const newRegistrationBtn = document.getElementById('newRegistrationBtn');
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const successMessage = document.getElementById('successMessage');
const progressBar = document.getElementById('progress-bar');
const courseList = document.getElementById('course-list');
const selectedCoursesList = document.getElementById('selected-courses-list');
const totalCreditsEl = document.getElementById('total-credits');
const totalCoursesEl = document.getElementById('total-courses');
const displayTrack = document.getElementById('display-track');
const langButtons = document.querySelectorAll('.lang-btn');

// Language data
const translations = {
  th: {
    form_title: "ข้อมูลนักศึกษา",
    form_subtitle: "กรอกข้อมูลนักศึกษาก่อนเลือกวิชา",
    first_name: "ชื่อ",
    first_name_placeholder: "กรุณากรอกชื่อ",
    first_name_error: "กรุณากรอกชื่อ",
    last_name: "นามสกุล",
    last_name_placeholder: "กรุณากรอกนามสกุล",
    last_name_error: "กรุณากรอกนามสกุล",
    email: "อีเมล",
    email_placeholder: "กรุณากรอกอีเมล",
    email_error: "กรุณากรอกอีเมลที่ถูกต้อง",
    student_id: "รหัสนักศึกษา",
    student_id_placeholder: "กรุณากรอกรหัสนักศึกษา",
    student_id_error: "กรุณากรอกรหัสนักศึกษา",
    track_label: "เลือกสาขาวิชา",
    select_track: "เลือกสาขาวิชา",
    track_software: "วิศวกรรมซอฟต์แวร์",
    track_data: "วิทยาศาสตร์ข้อมูล",
    track_network: "เครือข่ายและความปลอดภัย",
    track_error: "กรุณาเลือกสาขาวิชา",
    year_label: "ชั้นปี",
    select_year: "เลือกชั้นปี",
    year1: "ปี 1",
    year2: "ปี 2",
    year3: "ปี 3",
    year4: "ปี 4",
    year_error: "กรุณาเลือกชั้นปี",
    term_label: "ภาคเรียน",
    select_term: "เลือกภาคเรียน",
    term1: "ภาคเรียนที่ 1",
    term2: "ภาคเรียนที่ 2",
    term3: "ภาคเรียนที่ 3",
    term_error: "กรุณาเลือกภาคเรียน",
    next_btn: "ถัดไป - เลือกวิชา",
    course_selection_title: "เลือกวิชาเรียน",
    course_selection_subtitle: "เลือกวิชาที่ต้องการลงทะเบียนในภาคเรียนนี้",
    selected_track: "สาขาวิชา:",
    course_selection_guide: "คำแนะนำ: สามารถเลือกได้สูงสุด 7 วิชา หรือไม่เกิน 21 หน่วยกิต",
    selected_courses: "วิชาที่เลือก:",
    total_credits: "หน่วยกิตรวม:",
    total_courses: "จำนวนวิชา:",
    back_btn: "ย้อนกลับ",
    submit_btn: "ยืนยันการลงทะเบียน",
    success_title: "ลงทะเบียนสำเร็จ!",
    success_message: "ระบบได้บันทึกข้อมูลการลงทะเบียนของคุณเรียบร้อยแล้ว",
    new_registration_btn: "ลงทะเบียนใหม่"
  },
  en: {
    form_title: "Student Information",
    form_subtitle: "Fill in your student information before selecting courses",
    first_name: "First Name",
    first_name_placeholder: "Enter your first name",
    first_name_error: "Please enter your first name",
    last_name: "Last Name",
    last_name_placeholder: "Enter your last name",
    last_name_error: "Please enter your last name",
    email: "Email",
    email_placeholder: "Enter your email",
    email_error: "Please enter a valid email",
    student_id: "Student ID",
    student_id_placeholder: "Enter your student ID",
    student_id_error: "Please enter your student ID",
    track_label: "Select Major",
    select_track: "Select Major",
    track_software: "Software Engineering",
    track_data: "Data Science",
    track_network: "Network and Security",
    track_error: "Please select a major",
    year_label: "Year Level",
    select_year: "Select Year Level",
    year1: "Year 1",
    year2: "Year 2",
    year3: "Year 3",
    year4: "Year 4",
    year_error: "Please select year level",
    term_label: "Term",
    select_term: "Select Term",
    term1: "Term 1",
    term2: "Term 2",
    term3: "Term 3",
    term_error: "Please select term",
    next_btn: "Next - Select Courses",
    course_selection_title: "Course Selection",
    course_selection_subtitle: "Select courses you want to register for this term",
    selected_track: "Major:",
    course_selection_guide: "Note: You can select up to 7 courses or 21 credits maximum",
    selected_courses: "Selected Courses:",
    total_credits: "Total Credits:",
    total_courses: "Total Courses:",
    back_btn: "Back",
    submit_btn: "Confirm Registration",
    success_title: "Registration Successful!",
    success_message: "Your course registration has been successfully recorded",
    new_registration_btn: "New Registration"
  }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('ระบบเลือกวิชาเริ่มทำงานแล้ว');
  
  // Set up language switcher
  langButtons.forEach(button => {
    button.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      switchLanguage(lang);
    });
  });

  // Set up form navigation
  studentInfoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateStudentInfo()) {
      goToPage2();
    }
  });

  backBtn.addEventListener('click', goToPage1);
  submitBtn.addEventListener('click', submitRegistration);
  newRegistrationBtn.addEventListener('click', resetForm);

  // Initialize with Thai language
  switchLanguage('th');
});

// Language switching function
function switchLanguage(lang) {
  currentLanguage = lang;
  
  // Update active language button
  langButtons.forEach(button => {
    if (button.getAttribute('data-lang') === lang) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });
  
  // Update placeholders for inputs
  document.querySelectorAll('input[placeholder], select option').forEach(element => {
    const placeholderText = element.getAttribute('placeholder');
    if (placeholderText && translations[lang][placeholderText]) {
      element.setAttribute('placeholder', translations[lang][placeholderText]);
    }
  });
  
  // Update course list if we're on page 2
  if (page2.classList.contains('active')) {
    generateCourseList();
    updateSelectedCoursesList();
  }
}

// Validate student information form
function validateStudentInfo() {
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

// Navigate to page 2 (course selection)
function goToPage2() {
  // Save student info
  studentInfo = {
    firstName: document.getElementById('fname').value,
    lastName: document.getElementById('lname').value,
    email: document.getElementById('email').value,
    studentId: document.getElementById('studentId').value,
    track: document.getElementById('track').value,
    year: document.getElementById('year').value,
    term: document.getElementById('term').value
  };
  
  // Update display track
  const trackSelect = document.getElementById('track');
  const selectedOption = trackSelect.options[trackSelect.selectedIndex];
  displayTrack.textContent = selectedOption.textContent;
  
  // Generate course list based on selected track
  generateCourseList();
  
  // Update progress bar
  progressBar.style.width = '100%';
  
  // Switch to page 2
  page1.classList.remove('active');
  page2.classList.add('active');
  successMessage.style.display = 'none';
}

// Navigate back to page 1 (student info)
function goToPage1() {
  // Update progress bar
  progressBar.style.width = '50%';
  
  // Switch to page 1
  page2.classList.remove('active');
  page1.classList.add('active');
}

// Generate course list based on selected track
function generateCourseList() {
  const track = studentInfo.track;
  const courses = courseData[track] || [];
  
  courseList.innerHTML = '';
  
  if (courses.length === 0) {
    courseList.innerHTML = '<div class="text-center text-muted">ไม่มีวิชาในสาขานี้</div>';
    return;
  }
  
  courses.forEach(course => {
    const isSelected = selectedCourses.some(c => c.id === course.id);
    
    const courseCard = document.createElement('div');
    courseCard.className = `course-card ${isSelected ? 'selected' : ''}`;
    courseCard.setAttribute('data-course-id', course.id);
    
    courseCard.innerHTML = `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="course-${course.id}" 
               ${isSelected ? 'checked' : ''}>
        <label class="form-check-label w-100" for="course-${course.id}">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h6 class="mb-1">${course.name}</h6>
              <div class="course-description">${course.description}</div>
            </div>
            <div class="course-credits">${course.credits} หน่วยกิต</div>
          </div>
        </label>
      </div>
    `;
    
    courseCard.addEventListener('click', function(e) {
      // Don't toggle if clicking directly on the checkbox (let the default behavior handle it)
      if (e.target.type !== 'checkbox') {
        const checkbox = this.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
      }
      
      toggleCourseSelection(course);
    });
    
    courseList.appendChild(courseCard);
  });
}

// Toggle course selection
function toggleCourseSelection(course) {
  const index = selectedCourses.findIndex(c => c.id === course.id);
  
  if (index === -1) {
    // Check if we've reached the maximum
    if (selectedCourses.length >= 7) {
      alert(currentLanguage === 'th' 
        ? 'คุณเลือกวิชาได้สูงสุด 7 วิชาเท่านั้น' 
        : 'You can select up to 7 courses only');
      return;
    }
    
    // Add course to selection
    selectedCourses.push(course);
  } else {
    // Remove course from selection
    selectedCourses.splice(index, 1);
  }
  
  // Update UI
  updateSelectedCoursesList();
  generateCourseList(); // Regenerate to update selected state
}

// Update the selected courses list
function updateSelectedCoursesList() {
  selectedCoursesList.innerHTML = '';
  
  let totalCredits = 0;
  
  if (selectedCourses.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = currentLanguage === 'th' ? 'ยังไม่มีวิชาที่เลือก' : 'No courses selected';
    emptyItem.className = 'text-muted';
    selectedCoursesList.appendChild(emptyItem);
  } else {
    selectedCourses.forEach(course => {
      const listItem = document.createElement('li');
      listItem.className = 'mb-1';
      listItem.innerHTML = `<span class="fw-semibold">${course.name}</span> <span class="text-muted">(${course.credits} หน่วยกิต)</span>`;
      selectedCoursesList.appendChild(listItem);
      
      totalCredits += course.credits;
    });
  }
  
  // Update totals
  totalCreditsEl.textContent = totalCredits;
  totalCoursesEl.textContent = selectedCourses.length;
}

// Submit the registration
function submitRegistration() {
  if (selectedCourses.length === 0) {
    alert(currentLanguage === 'th' 
      ? 'กรุณาเลือกอย่างน้อย 1 วิชา' 
      : 'Please select at least 1 course');
    return;
  }
  
  // In a real application, you would send data to a server here
  console.log('Student Info:', studentInfo);
  console.log('Selected Courses:', selectedCourses);
  
  // Show success message
  page2.classList.remove('active');
  successMessage.style.display = 'block';
}

// Reset the form for a new registration
function resetForm() {
  // Reset form fields
  studentInfoForm.reset();
  
  // Reset selected courses
  selectedCourses = [];
  
  // Reset progress bar
  progressBar.style.width = '50%';
  
  // Go back to page 1
  successMessage.style.display = 'none';
  page1.classList.add('active');
}
