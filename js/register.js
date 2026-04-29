const params = new URLSearchParams(window.location.search);
const error = params.get('error');
const msg = document.getElementById('msg');

if (error === 'mismatch') msg.textContent = 'Passwords do not match.';
if (error === 'email_taken') msg.textContent = 'Email already registered.';

document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        const icon = btn.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

const passwordInput = document.getElementById('password');

const segments = [
    document.getElementById('seg1'),
    document.getElementById('seg2'),
    document.getElementById('seg3')
];

const strengthLabel = document.getElementById('strength-label');

function getStrength(password) {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10 || !/[0-9]/.test(password)) return 2;
    return 3;
}

const colors = ['', '#dc2626', '#f59e0b', '#16a34a'];
const labels = ['', 'Weak', 'Medium', 'Strong'];

passwordInput.addEventListener('input', () => {
    const level = getStrength(passwordInput.value);
    segments.forEach((seg, i) => {
        seg.style.backgroundColor = i < level ? colors[level] : '';
    });
    strengthLabel.textContent = labels[level];
    strengthLabel.style.color = colors[level];
});