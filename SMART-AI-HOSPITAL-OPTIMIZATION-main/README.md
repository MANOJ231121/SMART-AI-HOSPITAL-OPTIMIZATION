# SmartCare — AI-Powered Multilingual Hospital Management System

A unified, full-stack hospital management and patient intake platform connecting:
1. **SmartCare Patient Portal** (`http://localhost:5173`): Patient-facing multilingual voice registration kiosk with AI symptom routing, doctor recommendation, and live token tracking.
2. **SmartCare Hospital Manager** (`http://localhost:5174`): Hospital staff and administration portal with Role-Based Access Control (RBAC), OPD consultation workstations, bed management, and live queues.
3. **Spring Boot REST Backend** (`http://localhost:8080`): Enterprise Spring Boot 3.2.5 backend with MongoDB persistence, JWT authentication, AI clinical symptom routing, and real-time queue orchestration.

---

## 🏛️ System Architecture

```
                                  ┌──────────────────────────────────────────────┐
                                  │      SmartCare Patient Kiosk Frontend        │
                                  │   (Port 5173 - React / Vite / SmartCare UI)  │
                                  │  - Voice & Speech Registration (Web Speech)  │
                                  │  - Multilingual Triage (HI / EN / GU)        │
                                  │  - Smart Doctor Match & Live Token Tracker   │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                                                  REST API Calls
                                                         │
┌──────────────────────────────────────────────┐         │         ┌──────────────────────────────────────────────┐
│     Smart Hospital Manager Staff Frontend    │         │         │          MongoDB Database Server             │
│   (Port 5174 - React / Vite / Light Theme)   │◄────────┼────────►│ (Port 27017: hospital_optimization_db)      │
│  - Admin: System Users, Patients & Audit     │         │         │ - users, departments, beds, queues           │
│  - Doctor: OPD Queue, AI Intake, Diagnosis   │         │         │ - patient_registrations, appointments        │
│  - Receptionist: Walk-in Registration        │         │         └──────────────────────────────────────────────┘
│  - Nurse: Bed & Ward Real-Time Occupancy     │         │
└──────────────────────┬───────────────────────┘         │
                       │                                 │
                       └────────────────►┌───────────────┴──────────────┐◄────────────────┘
                                         │   Spring Boot 3.2.5 Backend  │
                                         │       (Port 8080 API)        │
                                         │  - Spring Security + JWT     │
                                         │  - AI Symptom Routing Engine │
                                         │  - Role-Based Access Control │
                                         │  - Dynamic Queue Position    │
                                         └──────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### 📋 Prerequisites

Before running the project, make sure you have the following installed:
- **Java 17+** (JDK 17, 21, or 25)
- **Maven 3.8+**
- **Node.js 18+** & `npm`
- **MongoDB** running locally on default port `27017`

---

### ⚡ One-Click Startup (Windows)

Simply double-click or run:
```cmd
start-all.bat
```
or run the PowerShell script:
```powershell
.\start-all.ps1
```
This automatically launches the Spring Boot backend and both React frontends in separate terminal windows!

---

### 🛠️ Manual Step-by-Step Setup

#### Step 1: Start MongoDB
Ensure MongoDB is running locally on port `27017`:
```bash
# Windows Services
net start MongoDB
# Or run mongod directly
mongod --dbpath "C:\data\db"
```

#### Step 2: Start the Spring Boot Backend (Port 8080)
```bash
cd HOSPITAL-OPTIMIZATION/backend
mvn spring-boot:run
```
*The backend automatically seeds initial doctor accounts, departments, hospital beds, and demo queues on first startup.*

#### Step 3: Start SmartCare Patient Frontend (Port 5173)
```bash
cd smartcare
npm install
npm run dev -- --port 5173
```
*Access at: [http://localhost:5173](http://localhost:5173)*

#### Step 4: Start SmartCare Hospital Manager Frontend (Port 5174)
```bash
cd HOSPITAL-OPTIMIZATION
npm install
npm run dev -- --port 5174
```
*Access at: [http://localhost:5174](http://localhost:5174)*

---

## 🔑 Default Login Credentials

| Role | Email | Password | Dashboard Features |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@hospital.com` | `Admin@123` | Full system control, edit all patient records, staff provisioning, analytics |
| **Doctor** | `doctor@hospital.com` | `Doctor@123` | OPD consultation queue, voice transcripts, clinical diagnosis, prescriptions |
| **Doctor (Orthopedics)** | `dr.karan@hospital.com` | `Doctor@123` | Orthopedics OPD queue, patient file editing |
| **Nurse** | `nurse@hospital.com` | `Nurse@123` | Bed management, ward status, patient assignment |
| **Receptionist** | `receptionist@hospital.com` | `Receptionist@123` | Front-desk triage, walk-in registration |
| **Patient** | `patient@hospital.com` | `Patient@123` | Personal token tracker & appointment history |

> **Tip**: On the login page (`http://localhost:5174/login`), click any of the **Quick Demo Account** buttons to autofill credentials instantly!

---

## ✨ Key Features & Capabilities

### 🎙️ 1. Multilingual Voice Patient Registration (`smartcare`)
- **Speech-to-Text & Text-to-Speech**: Conversational intake in **English**, **Hindi (हिन्दी)**, and **Gujarati (ગુજરાતી)** with phonetic fallback.
- **Smart Entity Extraction**: Automatically extracts Patient Name, Contact Number (supports spoken numbers in Hindi/Gujarati/English), Age, Gender, and Compound Symptoms (e.g. *"knee pain and headache"*).
- **AI-Assisted Department Routing**: Matches symptoms to one of 8 clinical departments with confidence metrics and medical disclaimer.
- **Smart Doctor Match**: Recommends doctors based on live queue load, sub-specialty keyword match, and severity.

### 🔐 2. Role-Based Access Control (RBAC) & Patient Management
- **Strict Authorization**:
  - **Doctors** and **Admins** have full authority to edit patient demographic and clinical records.
  - **Doctors** can view original voice transcripts, enter clinical diagnoses, and write prescriptions.
  - Non-authorized roles (`NURSE`, `RECEPTIONIST`, `PATIENT`) cannot alter doctor/clinical records (**HTTP 403 Forbidden**).

### 🎨 3. Cohesive Visual Design & Navigation
- Unified light theme with Clinical Ink color palette (`#0F3B3A` ink, `#3FBFA0` mint, `#F7F7F4` background).
- Official **SmartCare Medical Heart-Pulse Logo** integrated across all pages and sidebars.
- Full step-by-step **Back navigation** across all patient intake screens.

---

## 📡 API Endpoints Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `POST` | `/api/patient/register` | Public | Register patient from voice kiosk & generate token |
| `GET` | `/api/patient/registration/{id}` | Public/Auth | Retrieve registration details |
| `PUT` | `/api/patient/registration/{id}` | Doctor, Admin | Update patient details (RBAC protected) |
| `DELETE` | `/api/patient/registration/{id}` | Admin | Delete patient registration record |
| `GET` | `/api/doctor/patients` | Doctor, Admin | Get patients assigned to logged-in doctor |
| `PUT` | `/api/doctor/patients/{id}` | Doctor, Admin | Update diagnosis, prescription, notes |
| `GET` | `/api/admin/patients` | Admin | List all registered patients |
| `PUT` | `/api/admin/patients/{id}` | Admin | Edit any patient record |
| `GET` | `/api/departments` | Public | List all hospital departments |
| `GET` | `/api/doctors` | Public | List all active doctors |
| `GET` | `/api/queue/status/{token}` | Public | Live queue position & wait time |

---

## 📁 Repository Structure

```
.
├── smartcare/                     # Patient-facing voice registration kiosk
│   ├── src/
│   │   ├── components/            # UI components, Logo, Mic, Wave
│   │   ├── data/                  # Script steps, department mappings
│   │   ├── pages/patient/         # Voice registration, Recommendation, Tracking
│   │   ├── service/               # Speech-to-text, text-to-speech, REST API
│   │   └── App.jsx                # Main patient funnel routing
│   └── package.json
│
├── HOSPITAL-OPTIMIZATION/         # Hospital staff & admin portal + Spring Boot backend
│   ├── backend/                   # Spring Boot 3.2.5 REST API
│   │   ├── src/main/java/com/hospital/optimization/
│   │   │   ├── config/            # SecurityConfig, DataInitializer
│   │   │   ├── controller/        # Auth, Admin, Doctor, Patient, Queue
│   │   │   ├── dto/               # Request & response transfer objects
│   │   │   ├── model/             # MongoDB documents (User, Patient, Queue, Bed)
│   │   │   ├── repository/        # Spring Data MongoDB repositories
│   │   │   └── service/           # Routing, Queue, Patient, Dashboard services
│   │   └── pom.xml
│   ├── src/                       # React staff dashboard frontend
│   │   ├── components/            # Sidebar, Navbar, SmartCareLogo
│   │   ├── context/               # AuthContext (JWT & demo fallbacks)
│   │   ├── pages/dashboards/      # Admin, Doctor, Nurse, Receptionist views
│   │   └── services/api.js        # Axios client
│   └── package.json
│
├── start-all.bat                  # One-click Windows batch launcher
├── start-all.ps1                  # One-click PowerShell launcher
├── .gitignore                     # Root gitignore
└── README.md                      # Project documentation
```

---

## 👨‍💻 Contributing & Development

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
