let currentQuestion = null;
let timerInterval = null;

async function startVerification() {
    if (localStorage.getItem('authenticated')) {
        window.location.href = 'home.html';
        return;
    }

    if (localStorage.getItem('blocked')) {
        showError('您已被永久封禁，无法访问');
        return;
    }

    try {
        const response = await fetch('others/problems.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const problems = await response.json();
        currentQuestion = problems[Math.floor(Math.random() * problems.length)];
        document.getElementById('question').textContent = currentQuestion.question;
        startTimer();
    } catch (error) {
        console.error('Failed to load verification question:', error);
        showError('无法加载验证问题');
    }
}

function startTimer() {
    let timeLeft = 40;
    const timerElement = document.getElementById('timer');
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleFailure();
        }
    }, 1000);
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
    const correctAnswers = currentQuestion.answers.map(a => a.toLowerCase());
    if (correctAnswers.includes(userAnswer)) {
        handleSuccess();
    } else {
        handleFailure();
    }
}

function handleSuccess() {
    clearInterval(timerInterval);
    localStorage.setItem('authenticated', true);
    localStorage.setItem('authTime', Date.now());

    const permanentExemptionCheckbox = document.createElement('input');
    permanentExemptionCheckbox.type = 'checkbox';
    permanentExemptionCheckbox.id = 'permanentExemption';
    const label = document.createElement('label');
    label.textContent = '记住我（永久豁免）';
    label.setAttribute('for', 'permanentExemption');

    const confirmButton = document.createElement('button');
    confirmButton.textContent = '确认';
    confirmButton.onclick = () => {
        if (permanentExemptionCheckbox.checked) {
            localStorage.setItem('permanentExemption', 'granted');
        }
        window.location.href = 'home.html';
    };

    const authContainer = document.querySelector('.auth-container');
    const checkboxDiv = document.createElement('div');
    checkboxDiv.style.margin = '1rem 0';
    checkboxDiv.appendChild(permanentExemptionCheckbox);
    checkboxDiv.appendChild(label);
    authContainer.appendChild(checkboxDiv);
    authContainer.appendChild(confirmButton);
}

function handleFailure() {
    clearInterval(timerInterval);
    const failures = localStorage.getItem('failureCount') || 0;
    localStorage.setItem('failureCount', parseInt(failures) + 1);
    if (parseInt(failures) >= 2) {
        localStorage.setItem('blocked', true);
    }
    showError('验证失败，请重新尝试');
}

function showError(message) {
    alert(message);
    window.location.reload();
}

document.body.style.cursor = "url('others/2.png'), auto";    