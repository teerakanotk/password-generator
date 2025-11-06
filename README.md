# Password Generator

A simple and secure password generator designed for **flexibility and ease of use**.

---

## Key Features

- **Customizable Options:** Easily adjust settings using simple checkboxes.
- **Settings Persistence:** Your preferences are automatically saved in the browser for future sessions.
- **Adjustable Length:** Generate passwords from **4 to 32 characters** long.
- **Batch Generation:** Create up to **500 passwords** in a single round.
- **Intelligent Copying:**
  - Copy a **single password** with support for auto-scroll and next-line copying.
  - Copy **all generated passwords** simultaneously.

---

## Security Note (Important for Local Deployment)

If you are running or deploying this project locally (e.g., on a development server), you must ensure the website uses a **secure context (HTTPS)**.

The **copy-to-clipboard function** will only operate correctly when the application is served over **HTTPS** (or on `localhost`).
