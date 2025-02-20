# DevX - Intelligent System Supporting Project Requirements Analysis

## Market Problem
Analyzing project requirements efficiently can be challenging, especially when ensuring quality and collaboration among team members. Traditional methods may lack flexibility and adaptability to specific project needs.

## Our Solution
DevX is an AI-powered system designed to provide comprehensive analysis of project requirements and quality. By allowing users to select from different AI models, it offers flexibility and adaptability, ensuring precise project support and improved team collaboration.

## How We Build the Project
We begin by adapting AI models for image selection and text generation. Users can input queries based on three parameters:
- **For Who:** Identifying the target audience.
- **Doing What:** Defining the action or context.
- **Additional Information:** Providing extra details to refine the analysis.

<div align="center">
  
![Creating](https://github.com/user-attachments/assets/ce8e49f7-2bfe-4242-9c45-1ca81e655508)

</div>

## Key Features
### 🔍 AI-Assisted Project Analysis
Users can collaborate with selected AI models to discuss and analyze their projects effectively.

### 🛠️ Component Editing
Our system enables manual and AI-assisted component editing, allowing better customization to fit project requirements.
<div align="center">
  
![Edition](https://github.com/user-attachments/assets/006a15be-ba63-4c81-bc29-12665cb13d19)

</div>

<div align="center">
  
![Edition2](https://github.com/user-attachments/assets/ac4e2698-d7b9-425d-8f34-d29b63f32f00)

</div>


### 👤 Customizable User Profiles
Users can personalize their profiles by inviting team members, editing descriptions, and adjusting settings to suit their needs.
<div align="center">
  
![Account](https://github.com/user-attachments/assets/d10b32d7-73d8-4d61-b116-991270b7cab2)

</div>


### 🔑 Project Roles & Permissions
Each project member is assigned one of three roles: **Owner, Manager, or Member**. These roles determine the level of access and control over the project.

### ⏳ Real-Time System
Our reactive system ensures that users receive real-time updates on the current state of their projects.

### 🤝 Build-in chat system
Every poject has its own chat with other users and AI
<div align="center">
  
![Chat](https://github.com/user-attachments/assets/e1a7b0b0-b3cd-4353-b359-ea02f4974480)


</div>

### List of available modules:
## Modules Available for Generation

#### 1. Names
The application allows the generation of various app names
<div align="center">
  <img height="400" src="https://i.imgur.com/yWA7eIQ.jpg"  />
</div>

#### 2. Specifications
The app can generate detailed specifications for different use cases, providing essential details about:

- System architecture
- Features and capabilities
- Design elements
<div align="center">
  <img height="400" src="https://i.imgur.com/P1mQtRJ.jpg"  />
</div>

#### 3. Functional and Non-Functional Requirements
The module generates requirements for the system, divided into:

- **Functional Requirements**: What the system should do (e.g., authentication, data processing).
- **Non-Functional Requirements**: Quality attributes like performance, scalability, and security.
<div align="center">
  <img height="400" src="https://i.imgur.com/9S2Iu8E.jpg"  />
</div>

#### 4. Actors
This module defines the roles interacting with the system, such as:

- End-users
- Administrators
- External systems
<div align="center">
  <img height="400" src="https://i.imgur.com/rU7hPcr.jpg"  />
</div>

#### 5. Risks
The application can help assess potential risks involved in project execution, including:

- Technical risks
- Business risks
- Market risks
<div align="center">
  <img height="400" src="https://i.imgur.com/yYmJ1YH.jpg"  />
</div>

#### 6. Motto
A generator for creating the project's core motto or tagline that encapsulates the vision and mission of the application.
<div align="center">
  <img height="400" src="https://i.imgur.com/xtlBi9i.jpg"  />
</div>

#### 7. Business Strategy
This module creates strategic plans for the business, including:

- Target audience
- Competitive advantage
- Marketing approaches
<div align="center">
  <img height="400" src="https://i.imgur.com/scGEDmB.jpg"  />
</div>

#### 8. Elevator Speech
The generator creates a concise elevator pitch that summarizes the project's value proposition.
<div align="center">
  <img height="400" src="https://i.imgur.com/DGzesOy.jpg"  />
</div>

#### 9. Project Time Planning
This module assists in planning the project's timeline by generating:

- Milestones
- Deadlines
- Task dependencies
<div align="center">
  <img height="400" src="https://i.imgur.com/zvKXC7Q.jpg"  />
</div>

#### 10. Database Schema
The application provides database schema diagrams, which include:

- Entity-relationship models
- Database tables
- Relationship between entities
<div align="center">
  <img height="400" src="https://i.imgur.com/3OMjrn1.jpg"  />
</div>

#### 11. Logo
Generates logo designs that match the branding guidelines and style of the application.
<div align="center">
  <img height="400" src="https://i.imgur.com/mkyyMTb.jpg"  />
</div>

---
# Setup:
#### Install docker and docker compose

#### Set all of the below environment variables, suggested settings are below
```
DOCKER_COMPOSE_CONFIG = TRUE
2 AI_ID=651ffd7ac0f14c3aaf123456
3 SERVER_URL="http://localhost:8000"
4 JWT_SECRET=secret
5 MONGODB_URL=<mongodb-atlas-url>
6 DATABASE_NAME=Projects
7 OPENAI_API_KEY=<open-ai-api-key>
8 REALTIME_SERVER_URL=http://localhost:3000 
```

#### Run containers using docker compose
```
docker compose up
```
