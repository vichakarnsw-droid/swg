let provinces = [];
let districts = [];

// โหลด JSON จังหวัด-อำเภอ
async function loadGeographyData() {
    const provincesResponse = await fetch('https://vichakarnsw-droid.github.io/swg/provinces.json');
    provinces = await provincesResponse.json();
    
    const districtsResponse = await fetch('https://vichakarnsw-droid.github.io/swg/districts.json');
    districts = await districtsResponse.json();

    populateProvinces();
}

function populateProvinces() {
    const provinceSelect = document.getElementById('studentProvince');
    provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province.provinceCode;
        option.textContent = province.provinceNameTh;
        provinceSelect.appendChild(option);
    });
}

function updateDistricts() {
    const provinceSelect = document.getElementById('studentProvince');
    const districtSelect = document.getElementById('studentDistrict');
    const selectedProvinceCode = parseInt(provinceSelect.value);

    districtSelect.innerHTML = '<option value="">เลือกอำเภอ</option>';

    if (!selectedProvinceCode) return;

    districts
        .filter(d => d.provinceCode === selectedProvinceCode)
        .forEach(district => {
            const option = document.createElement('option');
            option.value = district.districtCode;
            option.textContent = district.districtNameTh;
            districtSelect.appendChild(option);
        });
}

// ฟังก์ชันอัปโหลดไฟล์
function handleFileUpload(input) {
    const file = input.files[0];
    if (file) {
        const fileName = document.getElementById('fileName');
        const filePreview = document.getElementById('filePreview');
        
        fileName.textContent = file.name;
        filePreview.classList.remove('hidden');
    }
}

// ฟังก์ชัน submit ฟอร์ม
document.getElementById('mainForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // ตรวจสอบฟิลด์ที่จำเป็น
    const requiredFields = [
        'studentId', 'studentPrefix', 'studentFirstName', 'studentLastName', 'studentGrade',
        'parentPrefix', 'parentFirstName', 'parentLastName', 'parentPhone', 'parentEmail',
        'paymentSlip'
    ];
    let isValid = true;
    for (let field of requiredFields) {
        const element = document.getElementById(field);
        if (!element.value) {
            element.classList.add('border-red-500');
            isValid = false;
        } else {
            element.classList.remove('border-red-500');
        }
    }
    if (!isValid) {
        alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
        return;
    }

    const studentId = document.getElementById('studentId').value;
    if (studentId.length !== 13 || !/^\d+$/.test(studentId)) {
        alert('กรุณากรอกเลขบัตรประจำตัวประชาชนให้ถูกต้อง (13 หลัก)');
        return;
    }

    const formData = {
        studentId: document.getElementById('studentId').value,
        studentPrefix: document.getElementById('studentPrefix').value,
        studentFirstName: document.getElementById('studentFirstName').value,
        studentLastName: document.getElementById('studentLastName').value,
        studentGrade: document.getElementById('studentGrade').value,
        studentPhone: document.getElementById('studentPhone').value,
        studentEmail: document.getElementById('studentEmail').value,
        studentProvince: document.getElementById('studentProvince').value,
        studentDistrict: document.getElementById('studentDistrict').value,
        parentPrefix: document.getElementById('parentPrefix').value,
        parentFirstName: document.getElementById('parentFirstName').value,
        parentLastName: document.getElementById('parentLastName').value,
        parentPhone: document.getElementById('parentPhone').value,
        parentEmail: document.getElementById('parentEmail').value,
        paymentSlip: document.getElementById('paymentSlip').files[0]?.name || 'ไฟล์ที่อัปโหลด',
        timestamp: new Date().toLocaleString('th-TH')
    };

    showConfirmation(formData);
    console.log('ข้อมูลที่จะส่งไป Google Sheets:', formData);
});

// เรียกโหลดจังหวัด-อำเภอหลัง DOM โหลด
document.addEventListener('DOMContentLoaded', function() {
    loadGeographyData();
});

// Event ฟอร์ม reset, อัปโหลด, ID card input เหมือนเดิม
function resetForm() {
    document.getElementById('mainForm').reset();
    document.getElementById('filePreview').classList.add('hidden');
    document.getElementById('confirmationPage').classList.add('hidden');
    document.getElementById('registrationForm').classList.remove('hidden');
    window.scrollTo(0, 0);
}

document.getElementById('studentId').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 13) value = value.slice(0, 13);
    e.target.value = value;
});

function showConfirmation(data) {
    document.getElementById('registrationForm').classList.add('hidden');
    document.getElementById('confirmationPage').classList.remove('hidden');
    
    const confirmationData = document.getElementById('confirmationData');
    confirmationData.innerHTML = `
        <!-- แสดงข้อมูลเหมือนเดิม -->
    `;
}
