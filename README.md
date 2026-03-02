

# Agentic-Powered Real-Time Finance Tracker  
<p align="center">  
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" width="60" height="60"/>  
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width="60" height="60"/>  
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" width="60" height="60"/>  
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" alt="Flask" width="60" height="60"/>  
</p>  

## 🚀 Project Overview  
Our **AI-Powered Real-Time Finance Tracker** is a cutting-edge financial management system that enables users to:  
- Seamlessly upload transactions 📂  
- Link bank accounts securely 🏦  
- Gain AI-driven insights and personalized financial advice 🤖  
- Visualize earnings, investments, and expenses 📊
- Future Finance Advisor for our benefits
- Interactive Pie Charts, Line Graphs, Bar Plots for our personal finance data 

This project leverages **Pathway Vector Store**, **Fetch.AI Agents** (User Agent & Finance Advisor Agent), and integrates **Next.js (frontend)**, **TypeScript**, and **Flask (backend)** to create a fully functional and intelligent financial tracking system.  

---  

## 🛠️ Tech Stack  
| Technology | Purpose |  
|------------|---------|  
| **Next.js** | Frontend framework for a responsive UI |  
| **TypeScript** | Type-safe JavaScript for better maintainability |  
| **Flask** | Lightweight backend for API interactions |  
| **Pathway Vector Store** | Efficient transaction storage and retrieval |  
| **Fetch.AI Agents** | Autonomous AI agents for financial recommendations |  

---  

## 📈 Feature Flowchart  
```mermaid  
graph TD  
    A[User Uploads Transactions / Links Bank Account] -->|Data Stored| B[Pathway Vector Store]  
    B -->|Fetch.AI User Agent Processes Transactions| C[Fetch.AI Finance Advisor Agent]  
    C -->|Analyzes Data & Generates Insights| D[AI-Driven Financial Advice]  
    D -->|Displays Recommendations & Visualizations| E[Next.js Frontend Dashboard]  
    E -->|Triggers Email Alerts If Budget Exceeded| F[Real-Time Email Notifications]  
```  

---

## 🔎 RAG (Retrieval-Augmented Generation) Pipeline  
The **RAG Pipeline** ensures that financial insights are generated in real-time using both stored transaction history and external data sources. The following **interactive flowchart** visualizes the **RAG process**:  

![ChatGPT Image Mar 31, 2025, 06_07_49 AM](https://github.com/user-attachments/assets/9005f203-4bc4-4e99-855e-2f1f36094fcd)
 

---
# FrostHack2025  

## 🚀 Running Instructions  

### ✅ Method 1: Manually  

#### 1️⃣ Backend Setup (Flask & Fetch.AI Agents)  
```bash
# Clone the repository  
git clone https://github.com/Aman071106/FrostHack2025.git  
cd FrostHack2025  

# Set up virtual environment  
python3 -m venv venv  
source venv/bin/activate  # On Windows: venv\Scripts\activate  
```
#### 2️⃣ Environment Variables
- Create a .env file in the root directory and add the following:
```
GEMINI_API_KEY = AIzaSyD59g**************************52L2BAWKc  
DB_USER = ****  
DB_PASSWORD = ******** 
DB_HOST = ******
DB_PORT = **** 
DB_NAME = ****** 
```
#### 3️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```
#### 4️⃣ Run Backend Agents
```bash
cd aibackend/agents
python rag.py
python user.py
cd ..
cd update_transactions
python csv_uploader.py
```
#### 💻 Frontend Setup
##### ✅ Option 1: Quick Testing (Streamlit App)

```bash
cd aibackend/app
streamlit run app.py
```
##### ✅ Option 2: Full Setup (Next.js + MongoDB Auth)
```bash
# Setup Auth Backend
cd auth_backend
# Create a .env file with your MongoDB URI
# MONGODB_URI=mongodb+srv://<your-uri>

npm install dotenv mongodb express cors mongoose bcryptjs
node server.js
# Setup Frontend
cd ../../frontend
npm install next react react-dom

cd app
npm run dev
```
### 📦 Method 2: Via Docker
- 1. Streamlit app
- Create a .env file in the root directory and add the following:(or use -e tags)
```
GEMINI_API_KEY = AIzaSyD59g**************************52L2BAWKc  
DB_USER = ****  
DB_PASSWORD = ******** 
DB_HOST = ****** (ip address if machine localhost as docker localhost is diff or use `host.docker.internal`)
DB_PORT = **** 
DB_NAME = ****** 
```
```bash
  docker build -t st_app .
``` 
  OR 
```bash  
  docker pull deadlyharbor/st_app
```
#### Then
```bash
 docker run -p 8080:8080 -p 8000:8000 -p 8501:8501 -p 5001:5001 --env-file .env st_app
```
---
## 📊 Dashboard Preview  
![chart](https://github.com/user-attachments/assets/faa5fa1d-2530-4c50-b049-395e041661aa)
 
## 🤖 Financify Agent  
![query](https://github.com/user-attachments/assets/0858ef1b-f6bb-4ee1-9cfc-bd14426efdd0)



---  

## 🎯 Future Enhancements  
- 🏦 **Multi-Bank Support** (Integrate Plaid API for wider banking compatibility)  
- 📡 **Blockchain Integration** (For secure financial transactions & tracking)  

---  

## 🤝 Contributors  
- **Aman Gupta** - Backend & AI Development  
- **Harsh Yadav** - Backend & AI Development  
- **Kunal Mittal** - UI/UX, Frontend Development and Backend Development  

---  

## ⭐ Get Started Today and Plan Your Finance! 🚀  

---

