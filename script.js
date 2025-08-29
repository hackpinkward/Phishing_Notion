// 表单验证和交互功能
class LoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.submitButton = this.form.querySelector('.btn-primary');
        this.togglePasswordBtn = document.querySelector('.toggle-password');
        this.emailError = document.getElementById('email-error');
        this.passwordError = document.getElementById('password-error');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupFormValidation();
    }
    
    bindEvents() {
        // 表单提交
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // 实时验证
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        
        // 输入时清除错误
        this.emailInput.addEventListener('input', () => this.clearError(this.emailError));
        this.passwordInput.addEventListener('input', () => this.clearError(this.passwordError));
        
        // 添加输入限制
        this.emailInput.addEventListener('input', (e) => this.limitEmailInput(e));
        this.passwordInput.addEventListener('input', (e) => this.limitPasswordInput(e));
        
        // 回车键提交
        this.form.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSubmit(e);
            }
        });
    }
    
    setupPasswordToggle() {
        if (this.togglePasswordBtn) {
            this.togglePasswordBtn.addEventListener('click', () => {
                const type = this.passwordInput.type === 'password' ? 'text' : 'password';
                this.passwordInput.type = type;
                
                // 更新图标
                const svg = this.togglePasswordBtn.querySelector('svg');
                if (type === 'text') {
                    svg.innerHTML = `
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    `;
                } else {
                    svg.innerHTML = `
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    `;
                }
                
                // 更新aria-label
                this.togglePasswordBtn.setAttribute('aria-label', 
                    type === 'password' ? 'Show password' : 'Hide password'
                );
            });
        }
    }
    
    setupFormValidation() {
        // 添加输入验证样式
        this.emailInput.addEventListener('focus', () => this.addFocusStyle(this.emailInput));
        this.passwordInput.addEventListener('focus', () => this.addFocusStyle(this.passwordInput));
        
        this.emailInput.addEventListener('blur', () => this.removeFocusStyle(this.emailInput));
        this.passwordInput.addEventListener('blur', () => this.removeFocusStyle(this.passwordInput));
    }
    
    addFocusStyle(input) {
        input.parentElement.classList.add('focused');
    }
    
    removeFocusStyle(input) {
        input.parentElement.classList.remove('focused');
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!email) {
            this.showError(this.emailError, 'Please enter your email address');
            this.emailInput.classList.add('error');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError(this.emailError, 'Please enter a valid email address');
            this.emailInput.classList.add('error');
            return false;
        }
        
        // 检查邮箱长度
        if (email.length > 254) {
            this.showError(this.emailError, 'Email address is too long');
            this.emailInput.classList.add('error');
            return false;
        }
        
        // 检查邮箱格式的合理性
        if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
            this.showError(this.emailError, 'Please enter a valid email address');
            this.emailInput.classList.add('error');
            return false;
        }
        
        this.clearError(this.emailError);
        this.emailInput.classList.remove('error');
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput.value.trim();
        
        if (!password) {
            this.showError(this.passwordError, 'Please enter your password');
            this.passwordInput.classList.add('error');
            return false;
        }
        
        if (password.length < 8) {
            this.showError(this.passwordError, 'Password must be at least 8 characters');
            this.passwordInput.classList.add('error');
            return false;
        }
        
        if (password.length > 128) {
            this.showError(this.passwordError, 'Password is too long');
            this.passwordInput.classList.add('error');
            return false;
        }
        
        // 检查密码是否包含常见弱密码
        const weakPasswords = ['password', '123456', '12345678', 'qwerty', 'abc123', 'password123', 'admin', 'letmein'];
        if (weakPasswords.includes(password.toLowerCase())) {
            this.showError(this.passwordError, 'Please choose a stronger password');
            this.passwordInput.classList.add('error');
            return false;
        }
        
        // 检查密码是否只包含数字
        if (/^\d+$/.test(password)) {
            this.showError(this.passwordError, 'Password should contain letters and numbers');
            this.passwordInput.classList.add('error');
            return false;
        }
        
        this.clearError(this.passwordError);
        this.passwordInput.classList.remove('error');
        return true;
    }
    
    showError(element, message) {
        element.textContent = message;
        element.classList.add('show');
    }
    
    clearError(element) {
        element.textContent = '';
        element.classList.remove('show');
    }
    
    setLoadingState(loading) {
        if (loading) {
            this.submitButton.classList.add('loading');
            this.submitButton.disabled = true;
            this.submitButton.querySelector('.btn-text').style.opacity = '0';
            this.submitButton.querySelector('.loading-spinner').style.display = 'block';
        } else {
            this.submitButton.classList.remove('loading');
            this.submitButton.disabled = false;
            this.submitButton.querySelector('.btn-text').style.opacity = '1';
            this.submitButton.querySelector('.loading-spinner').style.display = 'none';
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // 最终验证表单
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            // 添加震动效果提示错误
            this.shakeForm();
            
            // 聚焦到第一个错误的输入框
            if (!isEmailValid) {
                this.emailInput.focus();
            } else if (!isPasswordValid) {
                this.passwordInput.focus();
            }
            return;
        }
        
        // 额外的安全检查
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value.trim();
        
        // 检查是否包含可疑内容
        if (this.containsSuspiciousContent(email) || this.containsSuspiciousContent(password)) {
            this.showError(this.emailError, 'Please enter valid credentials');
            this.shakeForm();
            return;
        }
        
        // 设置加载状态
        this.setLoadingState(true);
        
        try {
            // 模拟API调用延迟
            await this.simulateLogin();
            
            // 成功后的处理
            this.handleSuccess();
            
        } catch (error) {
            console.error('Login error:', error);
            this.handleError();
        }
    }
    
    async simulateLogin() {
        // 模拟网络延迟
        return new Promise((resolve) => {
            setTimeout(resolve, 2000 + Math.random() * 1000);
        });
    }
    
    handleSuccess() {
        // 显示成功消息
        this.showSuccessMessage();
        
        // 延迟跳转
        setTimeout(() => {
            window.location.href = 'education.html';
        }, 1500);
    }
    
    handleError() {
        this.setLoadingState(false);
        this.showError(this.emailError, 'Login failed, please try again');
        this.shakeForm();
    }
    
    showSuccessMessage() {
        // 创建成功提示
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Login successful! Redirecting...</span>
        `;
        
        // 插入到表单前面
        this.form.parentNode.insertBefore(successMessage, this.form);
        
        // 添加动画
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 100);
    }
    
    shakeForm() {
        this.form.classList.add('shake');
        setTimeout(() => {
            this.form.classList.remove('shake');
        }, 500);
    }

    containsSuspiciousContent(text) {
        // 检查是否包含SQL注入、XSS等可疑内容
        const suspiciousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /union\s+select/i,
            /drop\s+table/i,
            /insert\s+into/i,
            /delete\s+from/i,
            /update\s+set/i,
            /exec\s*\(/i,
            /eval\s*\(/i
        ];
        
        return suspiciousPatterns.some(pattern => pattern.test(text));
    }
    
    limitEmailInput(e) {
        const input = e.target;
        const value = input.value;
        
        // 限制长度
        if (value.length > 254) {
            input.value = value.substring(0, 254);
        }
        
        // 清除错误
        this.clearError(this.emailError);
        input.classList.remove('error');
    }
    
    limitPasswordInput(e) {
        const input = e.target;
        const value = input.value;
        
        // 限制长度
        if (value.length > 128) {
            input.value = value.substring(0, 128);
        }
        
        // 清除错误
        this.clearError(this.passwordError);
        input.classList.remove('error');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化登录表单
    new LoginForm();
    
    // 添加页面加载动画
    document.body.classList.add('loaded');
    
    // 添加键盘导航支持
    setupKeyboardNavigation();
    
    // 添加性能监控
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        });
    }
});

// 键盘导航支持
function setupKeyboardNavigation() {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            // 处理Tab键导航
            const focusable = [...document.querySelectorAll(focusableElements)];
            const firstFocusable = focusable[0];
            const lastFocusable = focusable[focusable.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// 添加CSS动画类
const style = document.createElement('style');
style.textContent = `
    .shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    
    .success-message {
        background: #10b981;
        color: white;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }
    
    .success-message.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .success-message svg {
        stroke: white;
        stroke-width: 2;
    }
    
    .focused input {
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px rgba(138, 63, 252, 0.1);
    }
    
    body.loaded .container {
        animation: slideUp 0.6s ease-out;
    }
`;

document.head.appendChild(style);
