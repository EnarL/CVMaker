# CV Maker

CV Maker is a modern web application that allows users to create and export CVs in PDF format. When opening the program redis creates a sessionId for that specific user which is used to save the input data and restore it after a page refresh. The session expires in 24 hours.

#### Currently it only supports one format of CV, which is: Personal Information, Education, Work Experience, Projects and Skills. Future improvements could include support for customizable formats, as well as separate templates for color schemes and text size configuration.


## Tech Stack

- **Frontend**: Next.js
- **Backend**: Node.js  
- **Database**: Redis  
- **Session Management**: Redis-based sessions  

---

## Features

- Create resumes with an intuitive interface  
- Manage multiple CV versions  
- Export CV in PDF  
- Real-time preview and editing  
- Secure session management    

---

## 🛠️ How to run the program

**Note**: There is currently no working deployment link available. I have made the program runnable via Docker.

## How to Run This Project

I have added example .env files, to use these .env files rename the .env.example to .env in frontend and backend directory.

```bash

# 1. Clone the Repository
git clone https://github.com/EnarL/CVMaker.git
```
```bash
# 2. Navigate to the Root Directory
cd CVMaker
```
```bash
# 3. Run the Program with Docker
docker-compose up --build
```

#### Frontend is running at: http://localhost:3000

#### Backend is running at: http://localhost:5000

#### Redis is running at: http://localhost:6379



