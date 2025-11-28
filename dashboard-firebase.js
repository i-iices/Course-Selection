// // Firebase Dashboard Manager
// class FirebaseDashboard {
//     constructor() {
//         this.db = firebase.firestore();
//         this.registrations = [];
//         this.filteredRegistrations = [];
//         this.trackChart = null;
//         this.isRealTime = true;
//         this.realTimeListener = null;
//         this.init();
//     }

//     async init() {
//         try {
//             console.log('🚀 Initializing Firebase Dashboard...');
            
//             // โหลดข้อมูลเริ่มต้น
//             await this.loadData();
            
//             // ติดตามการเปลี่ยนแปลงแบบ real-time
//             this.setupRealTimeListener();
            
//             // อัพเดท UI
//             this.updateUI();
            
//             // ตั้งค่า Event Listeners
//             this.setupEventListeners();
            
//             console.log('✅ Dashboard initialized successfully');
//         } catch (error) {
//             console.error('❌ Dashboard initialization failed:', error);
//             this.showError('ไม่สามารถโหลดข้อมูลได้: ' + error.message);
//         }
//     }

//     setupEventListeners() {
//         // Refresh button
//         document.getElementById('refresh-btn').addEventListener('click', () => {
//             this.loadData();
//         });

//         // Search and filter
//         document.getElementById('search-input').addEventListener('input', (e) => {
//             this.filterStudents();
//         });

//         document.getElementById('track-filter').addEventListener('change', () => {
//             this.filterStudents();
//         });

//         document.getElementById('year-filter').addEventListener('change', () => {
//             this.filterStudents();
//         });

//         // Real-time toggle
//         document.getElementById('real-time-toggle').addEventListener('change', (e) => {
//             this.toggleRealTime(e.target.checked);
//         });

//         // Export buttons
//         document.getElementById('export-json-btn').addEventListener('click', () => {
//             this.exportToJSON();
//         });

//         document.getElementById('export-csv-btn').addEventListener('click', () => {
//             this.exportToCSV();
//         });

//         document.getElementById('print-btn').addEventListener('click', () => {
//             this.printData();
//         });
//     }

//     async loadData() {
//         try {
//             this.showLoading(true);
            
//             const snapshot = await this.db.collection('registrations')
//                 .where('status', '==', 'active')
//                 .orderBy('registrationDate', 'desc')
//                 .get();
            
//             this.registrations = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));
            
//             this.filteredRegistrations = [...this.registrations];
            
//             console.log('📊 Loaded', this.registrations.length, 'registrations');
//             this.showLoading(false);
//         } catch (error) {
//             console.error('Error loading data:', error);
//             this.showLoading(false);
//             this.showError('ไม่สามารถโหลดข้อมูลได้: ' + error.message);
//         }
//     }

//     setupRealTimeListener() {
//         if (this.realTimeListener) {
//             this.realTimeListener(); // ยกเลิก listener เดิม
//         }

//         this.realTimeListener = this.db.collection('registrations')
//             .where('status', '==', 'active')
//             .orderBy('registrationDate', 'desc')
//             .onSnapshot(snapshot => {
//                 if (!this.isRealTime) return;
                
//                 console.log('🔄 Real-time update received');
//                 this.registrations = snapshot.docs.map(doc => ({
//                     id: doc.id,
//                     ...doc.data()
//                 }));
                
//                 // กรองข้อมูลใหม่เมื่อมีอัพเดท
//                 this.filterStudents();
//                 this.updateUI();
//             }, error => {
//                 console.error('Real-time listener error:', error);
//                 this.showError('การเชื่อมต่อ Real-time ผิดพลาด: ' + error.message);
//             });
//     }

//     toggleRealTime(enabled) {
//         this.isRealTime = enabled;
//         if (enabled) {
//             this.setupRealTimeListener();
//             this.showNotification('เปิดใช้งาน Real-time แล้ว', 'success');
//         } else {
//             if (this.realTimeListener) {
//                 this.realTimeListener();
//                 this.realTimeListener = null;
//             }
//             this.showNotification('ปิดใช้งาน Real-time แล้ว', 'warning');
//         }
//     }

//     filterStudents() {
//         const searchTerm = document.getElementById('search-input').value.toLowerCase();
//         const trackValue = document.getElementById('track-filter').value;
//         const yearValue = document.getElementById('year-filter').value;
        
//         this.filteredRegistrations = this.registrations.filter(student => {
//             // กรองด้วยคำค้นหา
//             const matchesSearch = !searchTerm || 
//                 student.studentId?.toLowerCase().includes(searchTerm) ||
//                 student.firstName?.toLowerCase().includes(searchTerm) ||
//                 student.lastName?.toLowerCase().includes(searchTerm) ||
//                 student.email?.toLowerCase().includes(searchTerm);

//             // กรองด้วยสาขาวิชา
//             const matchesTrack = !trackValue || student.track === trackValue;

//             // กรองด้วยชั้นปี
//             const matchesYear = !yearValue || student.year?.toString() === yearValue;

//             return matchesSearch && matchesTrack && matchesYear;
//         });

//         this.updateUI();
//     }

//     updateUI() {
//         this.updateStatistics();
//         this.renderStudentsTable();
//         this.renderTrackChart();
//         this.renderPopularCourses();
//         this.renderRecentRegistrations();
//     }

//     updateStatistics() {
//         const totalStudents = this.filteredRegistrations.length;
//         const totalCourses = this.filteredRegistrations.reduce((sum, student) => 
//             sum + (student.courses ? student.courses.length : 0), 0
//         );

//         const trackCounts = {
//             software: this.filteredRegistrations.filter(s => s.track === 'software').length,
//             data: this.filteredRegistrations.filter(s => s.track === 'data').length,
//             network: this.filteredRegistrations.filter(s => s.track === 'network').length
//         };

//         // อัพเดท UI
//         document.getElementById('total-students').textContent = totalStudents.toLocaleString();
//         document.getElementById('total-courses').textContent = totalCourses.toLocaleString();
//         document.getElementById('software-count').textContent = trackCounts.software.toLocaleString();
//         document.getElementById('data-science-count').textContent = trackCounts.data.toLocaleString();
//         document.getElementById('table-count').textContent = totalStudents + ' รายการ';
//     }

//     renderStudentsTable() {
//         const tbody = document.getElementById('students-tbody');
        
//         if (this.filteredRegistrations.length === 0) {
//             tbody.innerHTML = `
//                 <tr>
//                     <td colspan="7" class="text-center text-muted py-5">
//                         <div class="empty-state">
//                             <i class="fas fa-search fa-2x mb-3"></i>
//                             <h5>ไม่พบข้อมูลนักศึกษา</h5>
//                             <p class="text-muted">ลองเปลี่ยนคำค้นหาหรือตัวกรองดูนะคะ</p>
//                         </div>
//                     </td>
//                 </tr>
//             `;
//             return;
//         }

//         tbody.innerHTML = this.filteredRegistrations.map((student) => `
//             <tr>
//                 <td><strong>${student.studentId || 'ไม่มีข้อมูล'}</strong></td>
//                 <td>
//                     <div class="d-flex align-items-center">
//                         <div class="avatar-placeholder bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px;">
//                             <i class="fas fa-user text-muted"></i>
//                         </div>
//                         <div>
//                             <div>${student.firstName} ${student.lastName}</div>
//                             <small class="text-muted">${student.email || 'ไม่มีอีเมล'}</small>
//                         </div>
//                     </div>
//                 </td>
//                 <td>
//                     <span class="badge ${this.getTrackBadgeClass(student.track)}">
//                         ${this.getTrackName(student.track)}
//                     </span>
//                 </td>
//                 <td>
//                     <span class="badge bg-light text-dark">ปี ${student.year}</span>
//                 </td>
//                 <td>
//                     <span class="badge bg-success">
//                         ${student.courses ? student.courses.length : 0} วิชา
//                     </span>
//                 </td>
//                 <td>
//                     <small>${this.formatDate(student.registrationDate)}</small>
//                 </td>
//                 <td>
//                     <div class="btn-group">
//                         <button class="btn btn-sm btn-outline-primary btn-action" 
//                                 onclick="firebaseDashboard.viewStudentDetails('${student.id}')"
//                                 title="ดูรายละเอียด">
//                             <i class="fas fa-eye"></i>
//                         </button>
//                         <button class="btn btn-sm btn-outline-danger btn-action" 
//                                 onclick="firebaseDashboard.deleteStudent('${student.id}')"
//                                 title="ลบข้อมูล">
//                             <i class="fas fa-trash"></i>
//                         </button>
//                     </div>
//                 </td>
//             </tr>
//         `).join('');
//     }

//     renderTrackChart() {
//         const ctx = document.getElementById('trackChart');
//         if (!ctx) return;

//         const trackCounts = {
//             software: this.filteredRegistrations.filter(s => s.track === 'software').length,
//             data: this.filteredRegistrations.filter(s => s.track === 'data').length,
//             network: this.filteredRegistrations.filter(s => s.track === 'network').length
//         };

//         // ทำลาย chart เดิมถ้ามี
//         if (this.trackChart) {
//             this.trackChart.destroy();
//         }

//         // ถ้าไม่มีข้อมูลให้แสดงข้อความแทน
//         if (this.filteredRegistrations.length === 0) {
//             ctx.innerHTML = `
//                 <div class="text-center text-muted py-4">
//                     <i class="fas fa-chart-pie fa-2x mb-2"></i>
//                     <p>ไม่มีข้อมูลสำหรับแสดงแผนภูมิ</p>
//                 </div>
//             `;
//             return;
//         }

//         this.trackChart = new Chart(ctx, {
//             type: 'doughnut',
//             data: {
//                 labels: ['วิศวกรรมซอฟต์แวร์', 'วิทยาศาสตร์ข้อมูล', 'เครือข่ายและความปลอดภัย'],
//                 datasets: [{
//                     data: [trackCounts.software, trackCounts.data, trackCounts.network],
//                     backgroundColor: ['#4361ee', '#4895ef', '#f72585'],
//                     borderWidth: 2,
//                     borderColor: '#fff',
//                     hoverOffset: 8
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: {
//                         position: 'bottom',
//                         labels: {
//                             padding: 20,
//                             usePointStyle: true,
//                             font: {
//                                 size: 11
//                             }
//                         }
//                     },
//                     tooltip: {
//                         callbacks: {
//                             label: function(context) {
//                                 const label = context.label || '';
//                                 const value = context.raw || 0;
//                                 const total = context.dataset.data.reduce((a, b) => a + b, 0);
//                                 const percentage = Math.round((value / total) * 100);
//                                 return `${label}: ${value} คน (${percentage}%)`;
//                             }
//                         }
//                     }
//                 },
//                 cutout: '60%'
//             }
//         });
//     }

//     renderPopularCourses() {
//         const container = document.getElementById('popular-courses');
//         if (!container) return;

//         const courseCounts = {};
//         this.filteredRegistrations.forEach(student => {
//             if (student.courses) {
//                 student.courses.forEach(course => {
//                     courseCounts[course.name] = (courseCounts[course.name] || 0) + 1;
//                 });
//             }
//         });

//         const popularCourses = Object.entries(courseCounts)
//             .sort((a, b) => b[1] - a[1])
//             .slice(0, 5);

//         if (popularCourses.length === 0) {
//             container.innerHTML = `
//                 <div class="empty-state py-3">
//                     <i class="fas fa-book-open fa-lg mb-2"></i>
//                     <p class="text-muted mb-0">ยังไม่มีข้อมูลวิชาที่ลงทะเบียน</p>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = popularCourses.map(([courseName, count], index) => `
//             <div class="recent-item">
//                 <div class="d-flex justify-content-between align-items-center">
//                     <div class="d-flex align-items-center">
//                         <span class="badge ${this.getRankBadgeClass(index)} me-2">${index + 1}</span>
//                         <div class="course-name text-truncate" style="max-width: 180px;" title="${courseName}">
//                             ${courseName}
//                         </div>
//                     </div>
//                     <span class="badge bg-success">${count}</span>
//                 </div>
//             </div>
//         `).join('');
//     }

//     renderRecentRegistrations() {
//         const container = document.getElementById('recent-registrations');
//         if (!container) return;

//         const recent = this.filteredRegistrations.slice(0, 3);

//         if (recent.length === 0) {
//             container.innerHTML = `
//                 <div class="empty-state py-3">
//                     <i class="fas fa-clock fa-lg mb-2"></i>
//                     <p class="text-muted mb-0">ยังไม่มีข้อมูลการลงทะเบียน</p>
//                 </div>
//             `;
//             return;
//         }

//         container.innerHTML = recent.map(student => `
//             <div class="recent-item">
//                 <div class="d-flex justify-content-between align-items-center">
//                     <div>
//                         <div class="fw-semibold">${student.firstName} ${student.lastName}</div>
//                         <small class="text-muted">${this.formatTimeAgo(student.registrationDate)}</small>
//                     </div>
//                     <span class="badge ${this.getTrackBadgeClass(student.track)}">
//                         ${this.getTrackShortName(student.track)}
//                     </span>
//                 </div>
//             </div>
//         `).join('');
//     }

//     async viewStudentDetails(docId) {
//         try {
//             const doc = await this.db.collection('registrations').doc(docId).get();
//             const student = doc.data();
            
//             const modalBody = document.getElementById('student-details');
//             modalBody.innerHTML = this.createStudentDetailsHTML(student);
            
//             new bootstrap.Modal(document.getElementById('studentModal')).show();
//         } catch (error) {
//             console.error('Error loading student details:', error);
//             this.showError('ไม่สามารถโหลดข้อมูลนักศึกษาได้: ' + error.message);
//         }
//     }

//     createStudentDetailsHTML(student) {
//         const totalCredits = student.courses ? 
//             student.courses.reduce((sum, course) => sum + course.credits, 0) : 0;
        
//         const coursesHTML = student.courses ? student.courses.map(course => `
//             <div class="course-badge">
//                 <strong>${course.name}</strong>
//                 <br>
//                 <small class="text-muted">${course.credits} หน่วยกิต</small>
//             </div>
//         `).join('') : '<p class="text-muted">ไม่มีวิชาที่ลงทะเบียน</p>';

//         return `
//             <div class="row">
//                 <div class="col-md-6">
//                     <div class="student-detail-item">
//                         <h6><i class="fas fa-id-card me-2"></i>ข้อมูลส่วนตัว</h6>
//                         <p><strong>รหัสนักศึกษา:</strong> ${student.studentId || 'ไม่มีข้อมูล'}</p>
//                         <p><strong>ชื่อ-นามสกุล:</strong> ${student.firstName} ${student.lastName}</p>
//                         <p><strong>อีเมล:</strong> ${student.email || 'ไม่มีข้อมูล'}</p>
//                     </div>
//                 </div>
//                 <div class="col-md-6">
//                     <div class="student-detail-item">
//                         <h6><i class="fas fa-graduation-cap me-2"></i>ข้อมูลการศึกษา</h6>
//                         <p><strong>สาขาวิชา:</strong> <span class="badge ${this.getTrackBadgeClass(student.track)}">${this.getTrackName(student.track)}</span></p>
//                         <p><strong>ชั้นปี:</strong> ปี ${student.year}</p>
//                         <p><strong>ภาคเรียน:</strong> ภาคเรียนที่ ${student.term}</p>
//                         <p><strong>วันที่ลงทะเบียน:</strong> ${this.formatDate(student.registrationDate)}</p>
//                     </div>
//                 </div>
//             </div>
//             <div class="student-detail-item">
//                 <h6><i class="fas fa-book me-2"></i>วิชาที่ลงทะเบียน (${student.courses ? student.courses.length : 0} วิชา)</h6>
//                 <div class="courses-grid">
//                     ${coursesHTML}
//                 </div>
//             </div>
//             <div class="student-detail-item">
//                 <h6><i class="fas fa-calculator me-2"></i>หน่วยกิตรวม</h6>
//                 <p class="fw-bold text-primary fs-3 text-center">
//                     ${totalCredits} หน่วยกิต
//                 </p>
//             </div>
//         `;
//     }

//     async deleteStudent(docId) {
//         if (!confirm('⚠️ คุณแน่ใจว่าต้องการลบข้อมูลนักศึกษาคนนี้?')) {
//             return;
//         }

//         try {
//             await this.db.collection('registrations').doc(docId).update({
//                 status: 'deleted',
//                 deletedAt: firebase.firestore.FieldValue.serverTimestamp()
//             });
            
//             this.showNotification('ลบข้อมูลนักศึกษาเรียบร้อยแล้ว', 'success');
//             console.log('✅ Student deleted successfully');
//         } catch (error) {
//             console.error('Error deleting student:', error);
//             this.showError('เกิดข้อผิดพลาดในการลบข้อมูล: ' + error.message);
//         }
//     }

//     // Export Functions
//     exportToJSON() {
//         const data = {
//             exportDate: new Date().toISOString(),
//             totalStudents: this.filteredRegistrations.length,
//             registrations: this.filteredRegistrations
//         };
        
//         const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `student-registrations-${new Date().toISOString().split('T')[0]}.json`;
//         a.click();
//         URL.revokeObjectURL(url);
        
//         this.showNotification('ส่งออกข้อมูล JSON เรียบร้อยแล้ว', 'success');
//     }

//     exportToCSV() {
//         const headers = ['รหัสนักศึกษา', 'ชื่อ', 'นามสกุล', 'อีเมล', 'สาขาวิชา', 'ชั้นปี', 'ภาคเรียน', 'จำนวนวิชา', 'หน่วยกิตรวม', 'วันที่ลงทะเบียน'];
        
//         const csvData = this.filteredRegistrations.map(student => {
//             const totalCredits = student.courses ? 
//                 student.courses.reduce((sum, course) => sum + course.credits, 0) : 0;
            
//             return [
//                 student.studentId || '',
//                 student.firstName,
//                 student.lastName,
//                 student.email || '',
//                 this.getTrackName(student.track),
//                 student.year,
//                 student.term,
//                 student.courses ? student.courses.length : 0,
//                 totalCredits,
//                 this.formatDate(student.registrationDate)
//             ];
//         });

//         const csvContent = [headers, ...csvData]
//             .map(row => row.map(field => `"${field}"`).join(','))
//             .join('\n');

//         const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `student-registrations-${new Date().toISOString().split('T')[0]}.csv`;
//         a.click();
//         URL.revokeObjectURL(url);
        
//         this.showNotification('ส่งออกข้อมูล CSV เรียบร้อยแล้ว', 'success');
//     }

//     printData() {
//         window.print();
//     }

//     // Helper Functions
//     getTrackName(track) {
//         const tracks = {
//             software: 'วิศวกรรมซอฟต์แวร์',
//             data: 'วิทยาศาสตร์ข้อมูล',
//             network: 'เครือข่ายและความปลอดภัย'
//         };
//         return tracks[track] || track;
//     }

//     getTrackShortName(track) {
//         const tracks = {
//             software: 'SE',
//             data: 'DS',
//             network: 'NS'
//         };
//         return tracks[track] || track;
//     }

//     getTrackBadgeClass(track) {
//         const classes = {
//             software: 'badge-software',
//             data: 'badge-data',
//             network: 'badge-network'
//         };
//         return classes[track] || 'bg-secondary';
//     }

//     getRankBadgeClass(rank) {
//         const classes = ['bg-danger', 'bg-warning', 'bg-info', 'bg-primary', 'bg-secondary'];
//         return classes[rank] || 'bg-secondary';
//     }

//     formatDate(timestamp) {
//         if (!timestamp) return 'ไม่มีข้อมูล';
//         const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//         return date.toLocaleDateString('th-TH', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     }

//     formatTimeAgo(timestamp) {
//         if (!timestamp) return '';
//         const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//         const now = new Date();
//         const diffMs = now - date;
//         const diffMins = Math.floor(diffMs / 60000);
//         const diffHours = Math.floor(diffMs / 3600000);
//         const diffDays = Math.floor(diffMs / 86400000);

//         if (diffMins < 1) return 'เมื่อสักครู่';
//         if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
//         if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
//         if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
//         return this.formatDate(timestamp);
//     }

//     showLoading(show) {
//         const tbody = document.getElementById('students-tbody');
//         if (show) {
//             tbody.innerHTML = `
//                 <tr>
//                     <td colspan="7" class="text-center py-5">
//                         <div class="loading-spinner mb-2"></div>
//                         <p class="text-muted mb-0">กำลังโหลดข้อมูล...</p>
//                     </td>
//                 </tr>
//             `;
//         }
//     }

//     showError(message) {
//         const alertDiv = document.createElement('div');
//         alertDiv.className = 'alert alert-danger alert-dismissible fade show';
//         alertDiv.innerHTML = `
//             <i class="fas fa-exclamation-triangle me-2"></i>
//             ${message}
//             <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
//         `;
//         document.querySelector('.container-fluid').prepend(alertDiv);
        
//         setTimeout(() => {
//             if (alertDiv.parentElement) {
//                 alertDiv.remove();
//             }
//         }, 5000);
//     }

//     showNotification(message, type = 'info') {
//         const alertDiv = document.createElement('div');
//         alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
//         alertDiv.innerHTML = `
//             <i class="fas fa-${this.getNotificationIcon(type)} me-2"></i>
//             ${message}
//             <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
//         `;
//         document.querySelector('.container-fluid').prepend(alertDiv);
        
//         setTimeout(() => {
//             if (alertDiv.parentElement) {
//                 alertDiv.remove();
//             }
//         }, 3000);
//     }

//     getNotificationIcon(type) {
//         const icons = {
//             success: 'check-circle',
//             error: 'exclamation-triangle',
//             warning: 'exclamation-triangle',
//             info: 'info-circle'
//         };
//         return icons[type] || 'info-circle';
//     }
// }

// // เริ่มต้น Dashboard เมื่อโหลดเสร็จ
// let firebaseDashboard;
// document.addEventListener('DOMContentLoaded', function() {
//     // ตรวจสอบว่า Firebase พร้อม
//     if (typeof firebase !== 'undefined' && firebase.apps.length > 0 && window.firebaseInitialized) {
//         firebaseDashboard = new FirebaseDashboard();
//         window.firebaseDashboard = firebaseDashboard;
//     } else {
//         console.error('Firebase not initialized');
//         document.getElementById('students-tbody').innerHTML = `
//             <tr>
//                 <td colspan="7" class="text-center text-danger py-4">
//                     <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
//                     <h5>ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้</h5>
//                     <p class="text-muted">กรุณาตรวจสอบการตั้งค่า Firebase</p>
//                     <button class="btn btn-primary mt-2" onclick="location.reload()">
//                         โหลดใหม่
//                     </button>
//                 </td>
//             </tr>
//         `;
//     }
// });
