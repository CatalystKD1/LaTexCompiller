# 📄 LaTeX Variable Editor & PDF Generator

A full-stack web application that allows users to:

- Upload a `.tex` file
- Automatically extract `\newcommand` variables
- Edit variables dynamically in a React UI
- Compile LaTeX into a PDF
- Preview and download the updated document

---

## 🚀 Features

- Dynamic parsing of LaTeX `\newcommand`
- Auto-generated input fields for variables
- Live LaTeX preview
- PDF compilation using `pdflatex`
- Download with custom file name
- Split-screen editor + preview UI

---

## 🧱 Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **LaTeX Engine:** `pdflatex` (MiKTeX / TeX Live)

---

## 📦 Installation

Clone the repo:

```bash
git clone <your-repo-url>
cd <your-project>
```

---

## ⚙️ Backend Setup (LaTeX Required)

### 🪟 Windows

1. Install MiKTeX: https://miktex.org/download
2. Enable "Install missing packages on-the-fly"
3. Find your pdflatex path:
```bash
where pdflatex
```
4. Update `server.js` with full path

---

### 🍎 macOS

```bash
brew install --cask mactex
pdflatex --version
```

---

### 🐧 Linux

```bash
sudo apt update
sudo apt install texlive-full
pdflatex --version
```

---

## ⚛️ Frontend Setup

```bash
npm install
```

---

## ▶️ Running the App

### Two Terminals

Backend:
```bash
cd src/server
node server.js
```

Frontend:
```bash
npm run dev
```

---

### Single Command

```bash
npm install --save-dev concurrently
```

Add to package.json:
```json
"start": "concurrently \"npm run dev\" \"node src/server/server.js\""
```

Run:
```bash
npm start
```

---

## 📄 Usage

1. Upload a `.tex` file
2. Edit variables
3. Enter PDF name
4. Click compile
5. Download PDF

---

## ⚠️ Notes

- Uses `-no-shell-escape` for safety
- Ensure pdflatex is installed and accessible
- Windows users may need full path

---

## 🚀 Future Improvements

- Auto compile
- Error logs display
- Cloud deployment

---

## Dependencies
- Node.js
- React
- Express
- LaTex Compiler (MikTex for windows)
- Concurrency
