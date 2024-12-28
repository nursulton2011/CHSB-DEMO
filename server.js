const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = 3000;

// Пароль для администратора (хранится в зашифрованном виде)
const adminPassword = "admin123";
const hashedPassword = bcrypt.hashSync(adminPassword, 10);

// Middleware для парсинга JSON
app.use(express.json());

// Статическая папка для клиентских файлов
app.use(express.static(path.join(__dirname, "public")));

// Обработка логина на сервере
app.post("/login", (req, res) => {
    const { password } = req.body;

    if (bcrypt.compareSync(password, hashedPassword)) {
        res.json({ success: true, message: "Admin logged in" });
    } else {
        res.json({ success: false, message: "Incorrect password" });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
