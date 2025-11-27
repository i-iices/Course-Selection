// Firebase Dashboard Manager
class FirebaseDashboard {
    constructor() {
        this.db = firebase.firestore();
        this.registrations = [];
        this.trackChart = null;
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Firebase Dashboard...');
            
            // โหลดข้อมูลเริ่มต้น
            await this.loadData();
            
            // ติดตามการเปลี่ยนแปลงแบบ real-time
            this.setupRealTimeListener();
            
            // อัพเดท UI
            this.updateUI();
            
            console.log('✅ Dashboard initialized successfully');
        } catch (error) {
            console.error('❌ Dashboard initialization failed:', error);
            this.showError('ไม่สามารถโหลดข้อมูลได้: ' + error.message);
        }
    }

    async loadData() {
        try {
            const snapshot = await this.db.collection('registrations')
                .where('status', '==', 'active')
                .orderBy('registrationDate', 'desc')
                .get();
            
            this.registrations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log('📊 Loaded', this.registrations.length, 'registrations');
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    setupRealTimeListener() {
        this.db.collection('registrations')
            .where('status', '==', 'active')
            .orderBy('registrationDate', 'desc')
            .onSnapshot(snapshot => {
                console.log('🔄 Real-time update received');
                this.registrations = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                this.updateUI();
            }, error => {
                console.error('Real-time listener error:', error);
            });
    }

    updateUI() {
        this.updateStatistics();
        this.renderStudentsTable();
        this.renderTrackChart();
        this.renderPopularCourses();
        this.renderRecentRegistrations();
    }

    updateStatistics() {
        const totalStudents = this.registrations.length;
        const totalCourses = this.registrations.reduce((sum, student) => 
            sum + (student.courses ? student.courses.length : 0), 0
        );

        const trackCounts = {
            software: this.registrations.filter(s => s.track === 'software').length,
            data: this.registrations.filter(s => s.track === 'data').length,
            network: this.registrations.filter(s => s.track === 'network').length
        };

        // อัพเดท UI
        document.getElementById('total-students').textContent = totalStudents.toLocaleString();
        document.getElementById('total-courses').textContent = totalCourses.toLocaleString();
        document.getElementById('software-count').textContent = trackCounts.software.toLocaleString();
        document.getElementById('data-science-count').textContent = trackCounts.data.toLocaleString();
        document.getElementById('table-count').textContent = totalStudents + ' รายการ';
    }

    renderStudentsTable() {
        const tbody = document.getElementById('students-tbody');
        
        if (this.registrations.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">
                        📝 ยังไม่มีข้อมูลการลงทะเบียน
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.registrations.map((student) => `
            <tr>
                <td><strong>${student.studentId || 'ไม่มีข้อมูล'}</strong></td>
                <td>${student.firstName} ${student.lastName}</td>
                <td>
                    <span class="badge ${this.getTrackBadgeClass(student.track)}">
                        ${this.getTrackName(student.track)}
                    </span>
                </td>
                <td>ปี ${student.year}</td>
                <td>
                    <span class="badge bg-success">${student.courses ? student.courses.length : 0} วิชา</span>
                </td>
                <td>${this.formatDate(student.registrationDate)}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary btn-action" 
                                onclick="firebaseDashboard.viewStudentDetails('${student.id}')"
                                title="ดูรายละเอียด">
                            👁️
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-action" 
                                onclick="firebaseDashboard.deleteStudent('${student.id}')"
                                title="ลบข้อมูล">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderTrackChart() {
        const ctx = document.getElementById('trackChart');
        if (!ctx) return;

        const trackCounts = {
            software: this.registrations.filter(s => s.track === 'software').length,
            data: this.registrations.filter(s => s.track === 'data').length,
            network: this.registrations.filter(s => s.track === 'network').length
        };

        // ทำลาย chart เดิมถ้ามี
        if (this.trackChart) {
            this.trackChart.destroy();
        }

        this.trackChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['วิศวกรรมซอฟต์แวร์', 'วิทยาศาสตร์ข้อมูล', 'เครือข่ายและความปลอดภัย'],
                datasets: [{
                    data: [trackCounts.software, trackCounts.data, trackCounts.network],
                    backgroundColor: ['#0d6efd', '#198754', '#ffc107'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    renderPopularCourses() {
        const container = document.getElementById('popular-courses');
        if (!container) return;

        const courseCounts = {};
        this.registrations.forEach(student => {
            if (student.courses) {
                student.courses.forEach(course => {
                    courseCounts[course.name] = (courseCounts[course.name] || 0) + 1;
                });
            }
        });

        const popularCourses = Object.entries(courseCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        if (popularCourses.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">ยังไม่มีข้อมูลวิชาที่ลงทะเบียน</p>';
            return;
        }

        container.innerHTML = popularCourses.map(([courseName, count], index) => `
            <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                <div class="d-flex align-items-center">
                    <span class="badge bg-primary me-2">${index + 1}</span>
                    <span class="text-truncate" title="${courseName}">${courseName}</span>
                </div>
                <span class="badge bg-success">${count} คน</span>
            </div>
        `).join('');
    }

    renderRecentRegistrations() {
        const container = document.getElementById('recent-registrations');
        if (!container) return;

        const recent = this.registrations.slice(0, 3);

        if (recent.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">ยังไม่มีข้อมูล</p>';
            return;
        }

        container.innerHTML = recent.map(student => `
            <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                <div>
                    <div class="fw-semibold">${student.firstName} ${student.lastName}</div>
                    <small class="text-muted">${this.formatTimeAgo(student.registrationDate)}</small>
                </div>
                <span class="badge ${this.getTrackBadgeClass(student.track)}">
                    ${this.getTrackShortName(student.track)}
                </span>
            </div>
        `).join('');
    }

    async viewStudentDetails(docId) {
        try {
            const doc = await this.db.collection('registrations').doc(docId).get();
            const student = doc.data();
            
            const modalBody = document.getElementById('student-details');
            modalBody.innerHTML = this.createStudentDetailsHTML(student);
            
            new bootstrap.Modal(document.getElementById('studentModal')).show();
        } catch (error) {
            console.error('Error loading student details:', error);
            alert('ไม่สามารถโหลดข้อมูลนักศึกษาได้: ' + error.message);
        }
    }

    createStudentDetailsHTML(student) {
        const totalCredits = student.courses ? 
            student.courses.reduce((sum, course) => sum + course.credits, 0) : 0;
        
        return `
            <div class="student-detail-item">
                <h6>📋 ข้อมูลส่วนตัว</h6>
                <p><strong>รหัสนักศึกษา:</strong> ${student.studentId}</p>
                <p><strong>ชื่อ-นามสกุล:</strong> ${student.firstName} ${student.lastName}</p>
                <p><strong>อีเมล:</strong> ${student.email}</p>
                <p><strong>สาขาวิชา:</strong> <span class="badge ${this.getTrackBadgeClass(student.track)}">${this.getTrackName(student.track)}</span></p>
                <p><strong>ชั้นปี:</strong> ปี ${student.year}</p>
                <p><strong>ภาคเรียน:</strong> ภาคเรียนที่ ${student.term}</p>
                <p><strong>วันที่ลงทะเบียน:</strong> ${this.formatDate(student.registrationDate)}</p>
            </div>
            <div class="student-detail-item">
                <h6>📚 วิชาที่ลงทะเบียน (${student.courses ? student.courses.length : 0} วิชา)</h6>
                <div>
                    ${student.courses ? student.courses.map(course => `
                        <span class="course-badge">
                            ${course.name} (${course.credits} หน่วยกิต)
                        </span>
                    `).join('') : 'ไม่มีข้อมูลวิชา'}
                </div>
            </div>
            <div class="student-detail-item">
                <h6>🧮 หน่วยกิตรวม</h6>
                <p class="fw-bold text-primary fs-4">
                    ${totalCredits} หน่วยกิต
                </p>
            </div>
        `;
    }

    async deleteStudent(docId) {
        if (!confirm('⚠️ คุณแน่ใจว่าต้องการลบข้อมูลนักศึกษาคนนี้?')) {
            return;
        }

        try {
            await this.db.collection('registrations').doc(docId).update({
                status: 'deleted',
                deletedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ Student deleted successfully');
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + error.message);
        }
    }

    // Export Functions
    exportToJSON() {
        const data = {
            exportDate: new Date().toISOString(),
            totalStudents: this.registrations.length,
            registrations: this.registrations
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `student-registrations-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    exportToCSV() {
        const headers = ['รหัสนักศึกษา', 'ชื่อ', 'นามสกุล', 'อีเมล', 'สาขาวิชา', 'ชั้นปี', 'ภาคเรียน', 'จำนวนวิชา', 'หน่วยกิตรวม', 'วันที่ลงทะเบียน'];
        
        const csvData = this.registrations.map(student => {
            const totalCredits = student.courses ? 
                student.courses.reduce((sum, course) => sum + course.credits, 0) : 0;
            
            return [
                student.studentId,
                student.firstName,
                student.lastName,
                student.email,
                this.getTrackName(student.track),
                student.year,
                student.term,
                student.courses ? student.courses.length : 0,
                totalCredits,
                this.formatDate(student.registrationDate)
            ];
        });

        const csvContent = [headers, ...csvData]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `student-registrations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    printData() {
        window.print();
    }

    // Helper Functions
    getTrackName(track) {
        const tracks = {
            software: 'วิศวกรรมซอฟต์แวร์',
            data: 'วิทยาศาสตร์ข้อมูล',
            network: 'เครือข่ายและความปลอดภัย'
        };
        return tracks[track] || track;
    }

    getTrackShortName(track) {
        const tracks = {
            software: 'SE',
            data: 'DS',
            network: 'NS'
        };
        return tracks[track] || track;
    }

    getTrackBadgeClass(track) {
        const classes = {
            software: 'bg-primary',
            data: 'bg-success',
            network: 'bg-warning text-dark'
        };
        return classes[track] || 'bg-secondary';
    }

    formatDate(timestamp) {
        if (!timestamp) return 'ไม่มีข้อมูล';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatTimeAgo(timestamp) {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'เมื่อสักครู่';
        if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
        if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
        if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
        return this.formatDate(timestamp);
    }

    showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.container-fluid').prepend(alertDiv);
    }
}

// เริ่มต้น Dashboard เมื่อโหลดเสร็จ
let firebaseDashboard;
document.addEventListener('DOMContentLoaded', function() {
    // ตรวจสอบว่า Firebase พร้อม
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        firebaseDashboard = new FirebaseDashboard();
    } else {
        console.error('Firebase not initialized');
        document.getElementById('students-tbody').innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger py-4">
                    ❌ ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้
                </td>
            </tr>
        `;
    }
});
