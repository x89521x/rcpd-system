function switchMainTab(evt, tabId) {
    document.querySelectorAll('.main-tab-pane').forEach(p => {
        p.classList.remove('active-pane');
        p.style.display = 'none';
    });
    document.querySelectorAll('.sub-nav-btn').forEach(b => b.classList.remove('active'));

    let targetTab = document.getElementById(tabId);
    if(targetTab) {
        targetTab.style.display = 'block';
        setTimeout(() => { targetTab.classList.add('active-pane'); }, 10);
    }
    evt.currentTarget.classList.add('active');
}

function switchInnerSubTab(evt, subTabId) {
    document.querySelectorAll('.inner-tab-content').forEach(p => {
        p.classList.remove('active-inner');
        p.style.display = 'none';
    });
    document.querySelectorAll('.inner-sub-btn').forEach(b => b.classList.remove('active'));

    let target = document.getElementById(subTabId);
    if(target) {
        target.style.display = 'block';
        setTimeout(() => {
            target.classList.add('active-inner');
        }, 15);
    }
    evt.currentTarget.classList.add('active');
}

function toggleAccordion(header) {
    let body = header.nextElementSibling;
    if (body.style.display === "none" || body.style.display === "") {
        body.style.display = "flex";
    } else {
        body.style.display = "none";
    }
}

function toggleCustomDropdown(dropdownId, event) {
    event.stopPropagation();
    document.querySelectorAll('.custom-options-container').forEach(box => {
        if (box.id !== dropdownId) {
            box.style.display = 'none';
            box.parentElement.classList.remove('open');
        }
    });

    let dropdown = document.getElementById(dropdownId);
    let wrapper = dropdown.parentElement;
    
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
        wrapper.classList.remove('open');
    } else {
        dropdown.style.display = "block";
        wrapper.classList.add('open');
    }
}

function selectCustomOption(type, value, text) {
    if (type === 'sysRole') {
        document.getElementById('newSystemRole').value = value;
        document.getElementById('selectedSysRoleText').innerText = text;
        document.getElementById('sysRoleDropdown').style.display = 'none';
        document.getElementById('wrapperSysRole').classList.remove('open');
    } else if (type === 'role') {
        document.getElementById('newRole').value = value;
        document.getElementById('selectedRoleText').innerText = text;
        document.getElementById('roleDropdown').style.display = 'none';
        document.getElementById('wrapperRole').classList.remove('open');
    } else if (type === 'rank') {
        document.getElementById('newRank').value = value;
        document.getElementById('selectedRankText').innerText = text;
        document.getElementById('rankDropdown').style.display = 'none';
        document.getElementById('wrapperRank').classList.remove('open');
    }
}

window.addEventListener('click', () => {
    document.querySelectorAll('.custom-options-container').forEach(box => {
        box.style.display = 'none';
        box.parentElement.classList.remove('open');
    });
});

let selectedCrimes = [];
const nameInput = document.getElementById('suspectName');
const cccdInput = document.getElementById('suspectCCCD');
const reduceInput = document.getElementById('reduceMinutes');
const debtInput = document.getElementById('debtCount');
const checkSDVK = document.getElementById('checkSDVK');
const checkTangTru = document.getElementById('checkTangTru');

const resName = document.getElementById('resName');
const resCCCD = document.getElementById('resCCCD');
const resCrimes = document.getElementById('resCrimes');
const resTotalMinutes = document.getElementById('resTotalMinutes');
const resStatus = document.getElementById('resStatus');

document.querySelectorAll('.crime-row-item').forEach(item => {
    item.addEventListener('click', function() {
        let points = parseInt(this.getAttribute('data-points'));
        let name = this.getAttribute('data-name');

        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
            selectedCrimes = selectedCrimes.filter(c => c.name !== name);
        } else {
            this.classList.add('selected');
            selectedCrimes.push({ name: name, points: points });
        }
        updateTicket();
    });
});

const reduceCheckboxes = document.querySelectorAll('.reduce-check');
reduceCheckboxes.forEach(cb => cb.addEventListener('change', updateTicket));

if(checkSDVK) checkSDVK.addEventListener('change', updateTicket);
if(checkTangTru) checkTangTru.addEventListener('change', updateTicket);
if(debtInput) debtInput.addEventListener('input', updateTicket);
if(nameInput) nameInput.addEventListener('input', updateTicket);
if(cccdInput) cccdInput.addEventListener('input', updateTicket);
if(reduceInput) reduceInput.addEventListener('input', updateTicket);

function updateTicket() {
    let totalPoints = 0;
    let listCrimesFormatted = [];

    let hasSDVK = checkSDVK && checkSDVK.checked;

    selectedCrimes.forEach(item => {
        let isDieu6 = item.name.includes("Tàng trữ, sử dụng vũ khí trái phép");
        if (isDieu6 && hasSDVK) {
            totalPoints += 0;
        } else {
            totalPoints += item.points;
        }
        listCrimesFormatted.push(item.name);
    });

    if (checkTangTru && checkTangTru.checked) {
        totalPoints += 30;
        listCrimesFormatted.push("Tàng trữ vũ khí nóng trái phép");
    }

    let debtCount = parseInt(debtInput.value) || 0;
    if (debtCount > 0) {
        totalPoints += debtCount * 5;
        listCrimesFormatted.push(`Vi phạm luật người tiêu dùng (x${debtCount})`);
    }

    let totalReduce = parseInt(reduceInput.value) || 0;
    let reduceLabels = [];
    reduceCheckboxes.forEach(cb => {
        if (cb.checked) {
            totalReduce += parseInt(cb.getAttribute('data-reduce')) || 0;
            let label = cb.getAttribute('data-label');
            if (label) reduceLabels.push(label);
        }
    });

    let finalMinutes = Math.max(0, totalPoints - totalReduce);

    let crimesText = "";
    if (listCrimesFormatted.length > 0) {
        crimesText = listCrimesFormatted.join(' + ');
        if (reduceLabels.length > 0) {
            crimesText += ` ( ${reduceLabels.join(' ')} )`;
        }
    }

    if(resName) resName.innerText = nameInput ? nameInput.value : "";
    if(resCCCD) resCCCD.innerText = cccdInput ? cccdInput.value : "";
    if(resCrimes) resCrimes.innerText = crimesText;
    if(resTotalMinutes) resTotalMinutes.innerText = finalMinutes + " phút";
    if(resStatus) resStatus.innerText = (listCrimesFormatted.length > 0) ? "Đang xử lý..." : "Chưa";
}

function resetForm() {
    selectedCrimes = [];
    document.querySelectorAll('.crime-row-item').forEach(i => i.classList.remove('selected'));
    reduceCheckboxes.forEach(cb => cb.checked = false);
    if(checkSDVK) checkSDVK.checked = false;
    if(checkTangTru) checkTangTru.checked = false;
    if(debtInput) debtInput.value = 0;
    if(reduceInput) reduceInput.value = 0;
    if(nameInput) nameInput.value = "";
    if(cccdInput) cccdInput.value = "";
    updateTicket();
}

function copyResult() {
    let textToCopy = `Tên: ${resName.innerText}\nCCCD: ${resCCCD.innerText}\nTội Danh: ${resCrimes.innerText}\nMức Án: ${resTotalMinutes.innerText}\nĐã xử lý: Chưa`;
    navigator.clipboard.writeText(textToCopy);
    alert("Đã sao chép thông tin xử án thành công!");
}

let searchInput = document.getElementById('searchCrimeInput');
if(searchInput) {
    searchInput.addEventListener('input', function(e) {
        let keyword = e.target.value.toLowerCase();
        document.querySelectorAll('.crime-row-item').forEach(item => {
            item.style.display = item.innerText.toLowerCase().includes(keyword) ? "flex" : "none";
        });
    });
}

// XỬ LÝ FORM ĐƠN TỪ DISCORD
const ROLE_TAG_DISCORD = "<@&1531303731524665404>";

function updateDonTuPreview() {
    let nTen = document.getElementById('nghiTen') ? document.getElementById('nghiTen').value : "";
    let nChucVu = document.getElementById('nghiChucVu') ? document.getElementById('nghiChucVu').value : "";
    let nLyDo = document.getElementById('nghiLyDo') ? document.getElementById('nghiLyDo').value : "";
    let nNgayNghi = document.getElementById('nghiNgayNghi') ? document.getElementById('nghiNgayNghi').value : "";
    let nNgayQuayLai = document.getElementById('nghiNgayQuayLai') ? document.getElementById('nghiNgayQuayLai').value : "";
    let nKyTen = document.getElementById('nghiKyTen') ? document.getElementById('nghiKyTen').value : "";

    let nghiStr = `Đơn Xin Nghỉ\nKính gửi : ${ROLE_TAG_DISCORD}\nTôi tên: ${nTen}\nChức vụ: ${nChucVu}\nLý do : ${nLyDo}\nNgày nghỉ : ${nNgayNghi}\nNgày quay lại : ${nNgayQuayLai}\nKý tên : ${nKyTen}`;
    let pNghi = document.getElementById('previewNghiText');
    if (pNghi) pNghi.innerText = nghiStr;

    let rTen = document.getElementById('roiTen') ? document.getElementById('roiTen').value : "";
    let rChucVu = document.getElementById('roiChucVu') ? document.getElementById('roiChucVu').value : "";
    let rLyDo = document.getElementById('roiLyDo') ? document.getElementById('roiLyDo').value : "";
    let rNgayRoi = document.getElementById('roiNgayRoi') ? document.getElementById('roiNgayRoi').value : "";
    let rKyTen = document.getElementById('roiKyTen') ? document.getElementById('roiKyTen').value : "";

    let roiStr = `Đơn Xin Rời Ngành\nKính gửi : ${ROLE_TAG_DISCORD}\nTôi tên: ${rTen}\nChức vụ: ${rChucVu}\nLý do : ${rLyDo}\nNgày rời : ${rNgayRoi}\nKý tên : ${rKyTen}`;
    let pRoi = document.getElementById('previewRoiText');
    if (pRoi) pRoi.innerText = roiStr;
}

['nghiTen','nghiChucVu','nghiLyDo','nghiNgayNghi','nghiNgayQuayLai','nghiKyTen','roiTen','roiChucVu','roiLyDo','roiNgayRoi','roiKyTen'].forEach(id => {
    let el = document.getElementById(id);
    if(el) el.addEventListener('input', updateDonTuPreview);
});

function copyFormNghi() {
    let pNghi = document.getElementById('previewNghiText');
    if(pNghi) {
        navigator.clipboard.writeText(pNghi.innerText);
        alert("Đã sao chép Đơn Xin Nghỉ! Dán vào Discord sẽ tag trực tiếp ban ngành.");
    }
}

function copyFormRoi() {
    let pRoi = document.getElementById('previewRoiText');
    if(pRoi) {
        navigator.clipboard.writeText(pRoi.innerText);
        alert("Đã sao chép Đơn Xin Rời Ngành! Dán vào Discord sẽ tag trực tiếp ban ngành.");
    }
}

let defaultAccounts = [
    { username: "admin", systemRole: "Điều Hành Hệ Thống", role: "Giám Đốc", rank: "Đại tá" }
];

let accounts = JSON.parse(localStorage.getItem('rcpd_accounts')) || defaultAccounts;
let adminAcc = accounts.find(acc => acc.username === "admin");
if (adminAcc) {
    adminAcc.systemRole = "Điều Hành Hệ Thống";
} else {
    accounts.unshift(defaultAccounts[0]);
}
localStorage.setItem('rcpd_accounts', JSON.stringify(accounts));

let adminLogs = JSON.parse(localStorage.getItem('rcpd_admin_logs')) || [];
let loggedInUser = JSON.parse(localStorage.getItem('rcpd_logged_user')) || null;

window.addEventListener('DOMContentLoaded', () => {
    let activePane = document.querySelector('.main-tab-pane.active');
    if(activePane) {
        activePane.classList.add('active-pane');
    }

    let activeSubTab = document.querySelector('.inner-tab-content.active');
    if(activeSubTab) {
        activeSubTab.classList.add('active-inner');
    }

    let savedUser = localStorage.getItem('rcpd_remember_user');
    let savedPass = localStorage.getItem('rcpd_remember_pass');
    
    if (savedUser && savedPass) {
        document.getElementById('inputLoginUser').value = savedUser;
        document.getElementById('inputLoginPass').value = savedPass;
        document.getElementById('rememberMeCheck').checked = true;
    }

    if (loggedInUser) {
        document.getElementById('loginScreenOverlay').style.display = 'none';
        document.getElementById('mainAppContainer').style.display = 'block';
        renderAuthUI();
    }
    updateDonTuPreview();
});

function executeSystemLogin() {
    let u = document.getElementById('inputLoginUser').value.trim();
    let p = document.getElementById('inputLoginPass').value.trim();
    let remember = document.getElementById('rememberMeCheck').checked;

    let found = accounts.find(acc => acc.username === u);
    let isAuthenticated = false;

    if (u === "admin" && btoa(p) === "VGhvbmNAMTk1OA==") {
        isAuthenticated = true;
        found = accounts.find(acc => acc.username === "admin");
    } else if (found && found.pass === p) {
        isAuthenticated = true;
    }

    if (isAuthenticated && found) {
        loggedInUser = found;
        localStorage.setItem('rcpd_logged_user', JSON.stringify(loggedInUser));

        if (remember) {
            localStorage.setItem('rcpd_remember_user', u);
        } else {
            localStorage.removeItem('rcpd_remember_user');
            localStorage.removeItem('rcpd_remember_pass');
        }

        let overlay = document.getElementById('loginScreenOverlay');
        overlay.classList.add('fade-out');

        setTimeout(() => {
            overlay.style.display = 'none';
            document.getElementById('mainAppContainer').style.display = 'block';
            renderAuthUI();
        }, 400);

    } else {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
    }
}

function logoutSystem() {
    loggedInUser = null;
    localStorage.removeItem('rcpd_logged_user');
    let overlay = document.getElementById('loginScreenOverlay');
    overlay.classList.remove('fade-out');
    overlay.style.display = 'flex';
    document.getElementById('mainAppContainer').style.display = 'none';
}

function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'flex';
}
function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
}

function logAdminAction(actionText) {
    let timeStr = new Date().toLocaleString('vi-VN');
    let logEntry = {
        time: timeStr,
        admin: loggedInUser ? loggedInUser.username : 'System',
        action: actionText
    };
    adminLogs.unshift(logEntry);
    if(adminLogs.length > 50) adminLogs.pop();
    localStorage.setItem('rcpd_admin_logs', JSON.stringify(adminLogs));
}

function renderAdminLogs() {
    let tbody = document.getElementById('adminLogsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (adminLogs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="padding:15px; text-align:center; color:#64748b;">Chưa có nhật ký hoạt động nào được ghi nhận.</td></tr>`;
        return;
    }

    adminLogs.forEach(log => {
        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid #f1f5f9; transition: 0.2s;">
                <td style="padding: 12px; font-size: 12px; color: #64748b;">${log.time}</td>
                <td style="padding: 12px; font-weight: 600; color: #b45309;">${log.admin}</td>
                <td style="padding: 12px; font-size: 13px; color: #1e293b;">${log.action}</td>
            </tr>
        `;
    });
}

function clearAdminLogs() {
    adminLogs = [];
    localStorage.removeItem('rcpd_admin_logs');
    renderAdminLogs();
    alert("Đã xóa sạch nhật ký hoạt động hệ thống!");
}

function renderAuthUI() {
    let display = document.getElementById('currentUserDisplay');
    let navManageBtn = document.getElementById('navManageTabBtn');
    let navAdminLogsBtn = document.getElementById('navAdminLogsTabBtn');
    let roleBadge = document.getElementById('adminRoleBadge');

    if (loggedInUser) {
        if(display) display.innerText = `Xin chào, ${loggedInUser.username} (${loggedInUser.role} - ${loggedInUser.rank})`;
        if(roleBadge && loggedInUser.username === 'admin') roleBadge.innerText = "Quyền: Điều Hành Hệ Thống";
        
        let isManager = (loggedInUser.username === 'admin') || (loggedInUser.systemRole === 'Quản Lý') || (loggedInUser.systemRole === 'Điều Hành Hệ Thống');

        if (isManager) {
            if(navManageBtn) navManageBtn.style.display = 'inline-block';
            renderAccountTable();
        } else {
            if(navManageBtn) navManageBtn.style.display = 'none';
        }

        if (loggedInUser.username === 'admin') {
            if(navAdminLogsBtn) navAdminLogsBtn.style.display = 'inline-block';
            renderAdminLogs();
        } else {
            if(navAdminLogsBtn) navAdminLogsBtn.style.display = 'none';
        }

        let nTen = document.getElementById('nghiTen');
        let nChucVu = document.getElementById('nghiChucVu');
        let nKyTen = document.getElementById('nghiKyTen');
        let rTen = document.getElementById('roiTen');
        let rChucVu = document.getElementById('roiChucVu');
        let rKyTen = document.getElementById('roiKyTen');

        if(nTen && !nTen.value) nTen.value = loggedInUser.username;
        if(nChucVu && !nChucVu.value) nChucVu.value = `${loggedInUser.role} (${loggedInUser.rank})`;
        if(nKyTen && !nKyTen.value) nKyTen.value = loggedInUser.username;
        if(rTen && !rTen.value) rTen.value = loggedInUser.username;
        if(rChucVu && !rChucVu.value) rChucVu.value = `${loggedInUser.role} (${loggedInUser.rank})`;
        if(rKyTen && !rKyTen.value) rKyTen.value = loggedInUser.username;

        updateDonTuPreview();
    }
}

function createAccountByAdmin() {
    let u = document.getElementById('newUsername').value.trim();
    let p = document.getElementById('newPassword').value.trim();
    let sysRole = document.getElementById('newSystemRole').value;
    let role = document.getElementById('newRole').value;
    let rank = document.getElementById('newRank').value;

    if (!u || !p) {
        alert("Vui lòng điền đầy đủ tài khoản và mật khẩu!");
        return;
    }

    if (accounts.some(acc => acc.username === u)) {
        alert("Tên tài khoản này đã tồn tại trong hệ thống!");
        return;
    }

    accounts.push({ username: u, pass: p, systemRole: sysRole, role: role, rank: rank });
    localStorage.setItem('rcpd_accounts', JSON.stringify(accounts));
    
    logAdminAction(`Cấp phát tài khoản mới: [${u}] với vai trò (${sysRole})`);

    renderAccountTable();
    if(loggedInUser && loggedInUser.username === 'admin') renderAdminLogs();

    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    alert("Cấp phát tài khoản sĩ quan thành công!");
}

function deleteAccount(index) {
    if (accounts[index].username === "admin") {
        alert("Không thể xóa tài khoản Điều Hành Hệ Thống (admin)!");
        return;
    }
    let targetUser = accounts[index].username;
    accounts.splice(index, 1);
    localStorage.setItem('rcpd_accounts', JSON.stringify(accounts));
    
    logAdminAction(`Xóa tài khoản sĩ quan: [${targetUser}]`);

    renderAccountTable();
    if(loggedInUser && loggedInUser.username === 'admin') renderAdminLogs();
}

function renderAccountTable() {
    let tbody = document.getElementById('accountTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    accounts.forEach((acc, index) => {
        let roleDisplay = acc.systemRole;
        if (acc.username === 'admin') roleDisplay = 'Điều Hành Hệ Thống';
        let isSpecial = (acc.username === 'admin' || acc.systemRole === 'Quản Lý');

        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid #f1f5f9; transition: 0.2s;">
                <td style="padding: 12px; font-weight: 600; color:#1e293b;">${acc.username}</td>
                <td style="padding: 12px;"><span style="background:${isSpecial?'#fef3c7':'#f1f5f9'}; color:${isSpecial?'#b45309':'#475569'}; padding:4px 10px; border-radius:6px; font-size:12px; font-weight:600;">${roleDisplay}</span></td>
                <td style="padding: 12px; color:#334155; font-weight:500;">${acc.rank}</td>
                <td style="padding: 12px; text-align:center;">
                    ${acc.username !== 'admin' ? `<button style="background:#ef4444; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600;" onclick="deleteAccount(${index})">Xóa</button>` : `<span style="color:#94a3b8; font-size:12px; font-style:italic;">Hệ thống</span>`}
                </td>
            </tr>
        `;
    });
}

updateTicket();