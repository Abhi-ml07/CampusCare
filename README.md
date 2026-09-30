# 🏫 CampusCare

### Smart Campus Issue Reporting & Tracking Platform

CampusCare is a smart web-based platform that allows students to report
campus issues and track their resolution status in real time.

The platform improves communication between students and campus authorities
by providing a centralized system for reporting, monitoring, and resolving
campus-related problems.

---

## 🚀 Features

- 👨‍🎓 Student registration and login
- 🔐 Secure password hashing with bcrypt
- 📝 Campus issue/complaint reporting
- 📊 Complaint tracking dashboard
- 🔄 Real-time complaint status updates
- 🏢 Department-based issue management
- 👨‍💼 Admin complaint management
- 🔎 Complaint filtering and tracking
- 🗄️ MongoDB database integration
- 📱 Responsive web interface
- ☁️ Deployment-ready with Gunicorn

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Flask | Web framework |
| MongoDB | Database |
| PyMongo | MongoDB integration |
| HTML5 | Frontend structure |
| CSS3 | Styling |
| JavaScript | Frontend interaction |
| bcrypt | Password security |
| python-dotenv | Environment configuration |
| Gunicorn | Production server |
| Render | Deployment |

---

## 🏗️ System Architecture

Student
   │
   ▼
Web Interface
   │
   ▼
Flask Application
   │
   ├── Authentication
   ├── Complaint Management
   ├── Admin Management
   └── Status Tracking
   │
   ▼
MongoDB
   │
   ▼
Campus Authorities

## 📂 Project Structure

CampusCare/
├── main.py
├── requirements.txt
├── README.md
├── .env.example
├── .gitignore
├── templates/
├── static/

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Abhi-ml07/CampusCare.git
cd CampusCare
