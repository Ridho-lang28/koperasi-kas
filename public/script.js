// public/script.js
const API_BASE = '/api';

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('koperasikas_user'));
    const currentPage = window.location.pathname.split('/').pop();
    const publicPages = ['login.html', 'register.html', '']; 
    
    if (!user && !publicPages.includes(currentPage)) window.location.href = 'login.html';
    if (user && publicPages.includes(currentPage)) window.location.href = 'index.html';
}

async function handleLogin(username, password) {
    try {
        const res = await fetch(`${API_BASE}/login.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem('koperasikas_user', JSON.stringify(data.data));
            showToast('Login berhasil!', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        } else {
            showToast(data.error || 'Gagal login.', 'error');
        }
    } catch (err) {
        showToast('Error jaringan/server.', 'error');
    }
}

async function handleRegister(nama, username, password) {
    try {
        const res = await fetch(`${API_BASE}/register.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, username, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            showToast('Daftar berhasil! Silakan login.', 'success');
            setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
            showToast(data.error || 'Gagal daftar.', 'error');
        }
    } catch (err) {
        showToast('Error jaringan/server.', 'error');
    }
}

function logout() {
    localStorage.removeItem('koperasikas_user');
    window.location.href = 'login.html';
}

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-5 right-5 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in transition-all duration-300 ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('bg-[#DC1B33]', 'text-white');
            link.classList.remove('text-gray-400', 'hover:text-white', 'hover:bg-gray-800');
        }
    });
});