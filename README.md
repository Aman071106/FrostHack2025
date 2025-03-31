

# AI-Powered Real-Time Finance Tracker  
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

```mermaid  
graph TD  
    A[User Query] -->|Preprocess Request| B[Query Embedding]  
    B -->|Fetch Relevant Transactions| C[Pathway Vector Store]  
    C -->|Retrieve Top Matching Data| D[Retrieved Financial Data]  
    D -->|Pass Data to Fetch.AI Agent| E[Finance Advisor Agent]  
    E -->|Generates AI-Driven Insights| F[Final AI Response]  
    F -->|Displays on Dashboard| G[Next.js Frontend]  
```  

---

## 🛠️ Installation & Setup (MacOS and Ubuntu)  

### 1️⃣ Backend Setup (Flask & Fetch.AI Agents)  
```bash  
# Clone the repository  
git clone https://github.com/Aman071106/FrostHack2025.git  
cd FrostHack2025  
cd aibackend  

# Set up virtual environment  
python3 -m venv venv  
source venv/bin/activate  # On Windows: venv\Scripts\activate  

# Install dependencies  
pip install -r backend/requirements.txt  

# Run Flask server  
python backend/app.py  
```  

### 2️⃣ Fetch.AI Agents Setup  
In **one terminal**, run:  
```bash  
cd agents  
python rag.py  
```  
In **another terminal**, run:  
```bash  
cd agents  
python user.py  
```  

### 3️⃣ Frontend Setup (Next.js & TypeScript)  
```bash  
# Navigate to frontend directory  
cd frontend  

# Install dependencies  
npm install  

# Run the Next.js frontend  
npm run dev  
```  

### 4️⃣ Accessing the Website  
Once everything is running, open your browser and go to:  
```
http://localhost:3000
```

---

## 📊 Dashboard Preview  
![image](https://github.com/user-attachments/assets/b9298ee4-024e-41ad-aa95-477900161220)  
## 🤖 Financify Agent  
![image](https://github.com/user-attachments/assets/9151ad08-8759-47e5-97a7-91d7504facf2)  


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

### ✅ **What's New?**  
- **Added RAG Pipeline Flowchart** 📊  
- **Flowcharts are now interactive** (GitHub renders MermaidJS)  
- **Updated Local Hosting Instructions** for better clarity  

Let me know if you want any more modifications! 🚀
