// Переменная для хранения состояния администратора
let isAdmin = false;

// Массив вопросов для теста
const questions = [
    {
        question: "Savol 1",
        answers: ["Javob1", "Javob2", "Javob3", "Javob4"],
        correct: 1
    },
    {
        question: "Savol 2",
        answers: ["Javob1", "Javob2", "Javob3", "Javob4"],
        correct: 1
    },
    {
        question: "Savol 3",
        answers: ["Javob1", "Javob2", "Javob3", "Javob4"],
        correct: 2
    },
];

// Функция для входа как администратор
function loginAsAdmin() {
    const password = document.getElementById("admin-password").value;

    // Проверка пароля
    if (password === "nursulton15122011") {
        alert("Пароль правильный! Добро пожаловать в админ-панель.");
        isAdmin = true;

        // Скрываем форму входа, показываем кнопку админ-панели
        document.getElementById("admin-login").classList.add("hidden");
        document.getElementById("admin-button").style.display = "block";
    } else {
        alert("Неверный пароль. Попробуйте снова.");
    }
}

// Функция для выхода из админ-панели
function logoutAdmin() {
    isAdmin = false;
    document.getElementById("admin-login").classList.remove("hidden");
    document.getElementById("admin-button").style.display = "none";
    document.getElementById("admin-panel").style.display = "none";
}

// Переключение видимости админ-панели
function toggleAdminPanel() {
    const adminPanel = document.getElementById("admin-panel");
    adminPanel.style.display = adminPanel.style.display === "block" ? "none" : "block";
    if (adminPanel.style.display === "block") {
        loadAdminPanel();
    }
}

// Загрузка вопросов в админ-панель
function loadAdminPanel() {
    const adminContainer = document.getElementById("questions-list");
    adminContainer.innerHTML = "";  // Очистка предыдущих данных

    questions.forEach((question, index) => {
        const questionElement = document.createElement("div");
        questionElement.innerHTML = `
            <p><strong>${index + 1}.</strong> ${question.question}</p>
            <ul>
                ${question.answers.map((answer, i) => `
                    <li style="color: ${i === question.correct ? 'green' : 'black'};">
                        ${answer} ${i === question.correct ? "(Correct)" : ""}
                    </li>`).join('')}
            </ul>
        `;
        adminContainer.appendChild(questionElement);
    });
}

// Шuffling массива (для случайного порядка вопросов и ответов)
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// Функция для отображения текущего вопроса
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question").textContent = question.question;

    const answersContainer = document.getElementById("answers");
    answersContainer.innerHTML = "";

    question.answers.forEach((answer, index) => {
        const answerElement = document.createElement("div");
        answerElement.classList.add("answer");
        answerElement.textContent = answer;
        answerElement.onclick = () => handleAnswer(index, answerElement);
        answersContainer.appendChild(answerElement);

        if (isAdmin && index === question.correct) {
            answerElement.classList.add("correct");  // Помечаем правильный ответ
        }
    });

    document.getElementById("prev-button").disabled = currentQuestionIndex === 0;
    document.getElementById("next-button").disabled = false;
    updatePagination();
}

// Обработка выбора ответа
function handleAnswer(selectedIndex, selectedElement) {
    const question = questions[currentQuestionIndex];

    if (selectedAnswer !== null && selectedAnswer !== selectedElement) {
        selectedAnswer.classList.remove("selected");
    }

    selectedElement.classList.add("selected");
    selectedAnswer = selectedElement;

    if (selectedIndex === question.correct) {
        score++;
    }

    document.getElementById("next-button").disabled = false;
}

// Переход к следующему вопросу
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
}

// Переход к предыдущему вопросу
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

// Отображение результатов
function showResults() {
    document.getElementById("question-container").innerHTML = `
        <p>Siz testni tugatdiz. Sizning natijalariz: ${questions.length}tadan ${score}ta</p>
    `;
    document.querySelector(".navigation-buttons").style.display = "none";
    document.getElementById("pagination").style.display = "none";

    localStorage.setItem('testResult', JSON.stringify({ score: score, total: questions.length }));
    localStorage.setItem("testCompleted", "true");

    document.getElementById("finish-button").style.display = "none";
}

// Обновление пагинации
function updatePagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    for (let i = 0; i < questions.length; i++) {
        const pageButton = document.createElement("div");
        pageButton.classList.add("page-number");
        pageButton.textContent = i + 1;
        pageButton.onclick = () => goToQuestion(i);

        if (i === currentQuestionIndex) {
            pageButton.classList.add("active");
        }

        paginationContainer.appendChild(pageButton);
    }
}

// Переход к конкретному вопросу
function goToQuestion(index) {
    currentQuestionIndex = index;
    loadQuestion();
}

// Инициализация теста при загрузке страницы
window.onload = function () {
    if (!localStorage.getItem('testCompleted')) {
        loadQuestion();
    }
};
