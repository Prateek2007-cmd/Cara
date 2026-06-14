document.addEventListener("DOMContentLoaded", () => {
    console.log("register.js loaded");

    const btn = document.getElementById("registerSubmitBtn");

    if (!btn) {
        console.error("Submit button not found!");
        return;
    }

    btn.addEventListener("click", async (e) => {
        e.preventDefault();

        const username = document.getElementById("registerUsername")?.value.trim();
        const email = document.getElementById("registerEmail")?.value.trim();
        const password = document.getElementById("registerPassword")?.value.trim();
        const confirmPassword = document.getElementById("confirmPassword")?.value.trim();

        const messageBox = document.getElementById("formMessage");

        // basic validation
        if (!username || !email || !password) {
            messageBox.innerText = "All fields are required!";
            messageBox.style.color = "red";
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            messageBox.innerText = "Please enter a valid email address!";
            messageBox.style.color = "red";
            return;
        }

        if (password.length < 8) {
            messageBox.innerText = "Password must be at least 8 characters long!";
            messageBox.style.color = "red";
            return;
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            messageBox.innerText = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
            messageBox.style.color = "red";
            return;
        }

        if (password !== confirmPassword) {
            messageBox.innerText = "Passwords do not match!";
            messageBox.style.color = "red";
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Registration failed");
            }

            console.log("Success:", data);

            if (window.SecureStorage) {
                SecureStorage.setItem("token", data.access_token);
                SecureStorage.setItem("user", data.user);
            } else {
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            messageBox.style.color = "green";
            messageBox.innerText = "Account created successfully! Redirecting...";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);

        } catch (err) {
            console.error(err);
            messageBox.style.color = "red";
            messageBox.innerText = err.message;
        }
    });
});
