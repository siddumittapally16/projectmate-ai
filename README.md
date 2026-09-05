# Project Navigator AI

Absolutely. Below is the full Lovable build prompt for your ProjectMentor AI. It includes everything we've discussed: Sign Up, Create Account, Sign In, onboarding, Gemini AI, personalized project ideas, evaluation, roadmap, tasks, AI Code Builder, AI Mentor, “What Should I Do Next?”, and Project Health.

Paste the entire prompt into Lovable as one prompt.

PROJECTMENTOR AI — FULL HACKATHON MVP BUILD PROMPT

You are an expert full-stack developer, AI engineer, UI/UX designer, database architect, security engineer, and hackathon product builder.

Build a complete, functional web application called:

PROJECTMENTOR AI

Tagline

Don't just find a project idea. Build the right project.

ProjectMentor AI is an AI-powered platform for final-year students that helps them discover, evaluate, plan, build, debug, and improve their final-year projects.

The product must NOT be just an AI chatbot.

The AI must understand the student's profile and actual project state and provide personalized guidance throughout the project lifecycle.

1. MAIN PRODUCT JOURNEY

Build this complete connected journey:

Landing Page
      ↓
Sign Up
      ↓
Create Account
      ↓
Student Onboarding
      ↓
Dashboard
      ↓
Generate Personalized Project Ideas
      ↓
AI Project Evaluation
      ↓
Select Project
      ↓
AI Feature Suggestions
      ↓
AI Technology Stack
      ↓
AI Roadmap
      ↓
Task Workspace
      ↓
🔥 What Should I Do Next?
      ↓
💻 AI Code Builder
      ↓
🧠 AI Project Mentor
      ↓
Project Health
      ↓
Complete Project

All major steps must use real application data.

Do not build a static mockup.

Do not create fake buttons.

Do not hardcode the main AI responses.

2. TECHNOLOGY STACK

Use a modern full-stack architecture.

Frontend

Use:

React

TypeScript

Tailwind CSS

React Router

Responsive component architecture

Backend / Database

Use Supabase for:

Authentication

PostgreSQL

Database

Row Level Security

User-specific data

AI

Use Google Gemini API.

Use the current supported Gemini API/SDK implementation available at implementation time.

Gemini must be meaningfully integrated into the product.

3. 🔐 SIGN UP — MUST HAVE

Create a dedicated Sign Up page.

Route:

/signup

Page title:

Create Your ProjectMentor Account

Subtitle:

Start building the right final-year project with AI.

Fields:

Full Name

Email Address

Password

Confirm Password

Primary button:

Create Account

Below the form:

Already have an account? Sign In

Clicking Sign In must navigate to:

/login

Sign Up validation

Implement:

Required fields

Valid email

Password validation

Confirm password matching

Duplicate email handling

Loading state

Error messages

Successful registration

Use real Supabase Authentication.

Do NOT create fake authentication.

Do NOT store passwords in localStorage.

Do NOT hardcode a demo account as the only login.

4. 🔑 SIGN IN — MUST HAVE

Create a dedicated Sign In page.

Route:

/login

Title:

Welcome Back 👋

Subtitle:

Continue building your project with your AI mentor.

Fields:

Email

Password

Primary button:

Sign In

Below:

Don't have an account? Sign Up

Clicking Sign Up must navigate to:

/signup

Also include:

Forgot Password?

Implement password reset using Supabase if available.

After successful login:

Sign In
   ↓
Dashboard

5. ACCOUNT FLOW

The new student flow MUST be:

Landing Page
      ↓
Sign Up
      ↓
Create Account
      ↓
Account Created
      ↓
Student Onboarding
      ↓
Save Profile
      ↓
Dashboard

Returning student flow:

Landing Page
      ↓
Sign In
      ↓
Dashboard

Logout flow:

Dashboard
      ↓
Logout
      ↓
Session Ended
      ↓
Login

6. 🔒 PROTECTED ROUTES

Require authentication for:

/onboarding
/dashboard
/generate
/projects
/projects/:id
/projects/:id/features
/projects/:id/roadmap
/projects/:id/tasks
/projects/:id/code
/projects/:id/mentor
/projects/:id/health
/profile

If the user is not authenticated:

Redirect → /login

Use proper authorization and Supabase Row Level Security.

7. USER DATA ISOLATION

Every student's data must belong to their account.

User A must never be able to access User B's:

Profile

Skills

Interests

Projects

Features

Roadmap

Tasks

Code history

Mentor conversations

Project health

AI recommendations

Implement proper database relationships and RLS policies.

8. 👤 STUDENT ONBOARDING

After account creation, show:

Tell Us About Yourself

Collect:

Student Information

Full Name

College

Degree

Branch

Semester

Skills

Provide selectable options:

C

C++

Java

Python

JavaScript

TypeScript

React

Node.js

SQL

Machine Learning

Artificial Intelligence

Data Science

IoT

Cloud

Cybersecurity

Allow custom skills.

Interests

Artificial Intelligence

Agriculture

Healthcare

Education

Finance

Cybersecurity

IoT

Robotics

Sustainability

Smart Cities

Career Goals

Software Developer

AI/ML Engineer

Data Scientist

Cloud Engineer

Cybersecurity Engineer

Researcher

Entrepreneur

Other

Project Constraints

Collect:

Team size

Available weeks

Daily available hours

Budget

Experience level

Hardware availability

Save all information to Supabase.

9. 🏠 DASHBOARD

Create a modern dashboard after onboarding.

Display:

Good morning, {Student Name} 👋

Your Project
Project Progress
Project Health
Current Phase
Days Remaining
Tasks Completed
Tasks Remaining

Include prominent cards for:

✨ Generate Projects

🧠 AI Project Mentor

💻 AI Code Builder

🔥 WHAT SHOULD I DO NEXT?

📊 Project Health

10. 💡 AI PROJECT GENERATOR

Create page:

Find a Project That Fits YOU

Subtitle:

Get project ideas based on your skills, interests, career goals and constraints.

Button:

✨ Generate My Projects

Send the student's actual profile to Gemini.

Generate exactly:

5 personalized project ideas

Do NOT return generic random ideas.

Each project must include:

Title
Problem Statement
Proposed Solution
Domain
Difficulty
Estimated Duration
Technologies
Skill Match
Feasibility
Innovation
Career Relevance
Expected Impact
Risks

Consider:

Student skills

Interests

Career goal

Experience

Team size

Available weeks

Daily hours

Budget

Hardware

Different students should receive different recommendations.

Store generated projects appropriately.

11. 📊 AI PROJECT EVALUATION

For each project show:

Skill Match
Feasibility
Innovation
Career Relevance
Time Feasibility
Complexity
Overall Score

Also show:

Why This Project Fits You

Strengths

Risks

Suggested Improvements

Scores must be based on the student's actual profile and selected project.

Do NOT hardcode scores.

12. 🎯 PROJECT SELECTION

Every project card must provide:

View Details

Save

Compare

Select Project

When the student clicks:

Select This Project

Create a real project record linked to the authenticated user.

Set it as:

Active Project

All future AI features must use this active project.

13. 🛠️ AI FEATURE GENERATOR

After project selection, generate:

MVP Features

Generate 5–7 realistic MVP features.

Advanced Features

Generate 3–5 advanced features.

Each feature must include:

Feature Name
Description
Priority
Complexity
Estimated Effort
Dependencies

Allow students to accept or reject features.

Store accepted features in Supabase.

14. 💻 AI TECHNOLOGY STACK

Generate a recommended technology stack.

Include:

Frontend
Backend
Database
AI/ML
APIs
Authentication
Deployment
Testing

For each recommendation show:

Why?

The recommendation must consider:

Student skills

Project requirements

Team size

Available time

Complexity

Avoid unnecessary technologies.

15. 🗺️ AI ROADMAP

Generate a personalized development roadmap.

Use:

Selected project

Accepted features

Technology stack

Student skills

Team size

Available weeks

Complexity

Possible phases:

1. Research
2. Requirements
3. Architecture
4. Database
5. Backend
6. AI/ML
7. Frontend
8. Integration
9. Testing
10. Deployment

Each phase must contain tasks.

Each task should include:

Task Name
Description
Priority
Estimated Effort
Dependencies
Status

Store roadmap and tasks in Supabase.

16. 📋 TASK WORKSPACE

Create a real Kanban board.

Columns:

TO DO
IN PROGRESS
COMPLETED

Students can:

Create tasks

Edit tasks

Delete tasks

Change status

Set priority

Set due date

Complete tasks

When a task is completed:

Automatically update:

Project progress

Project health

AI recommendations

Next actions

17. 📈 PROJECT PROGRESS

Calculate project progress from actual tasks.

Example:

Total Tasks: 20
Completed: 8

Progress: 40%

Never hardcode progress.

Update it automatically whenever task status changes.

18. 🔥 WHAT SHOULD I DO NEXT?

This is the primary innovation feature.

Create a highly visible button:

🔥 WHAT SHOULD I DO NEXT?

When clicked, analyze:

Active project

Current phase

Roadmap

Completed tasks

Pending tasks

Task dependencies

Deadline

Progress

Project health

Accepted features

Send only relevant context to Gemini.

Return:

EXACTLY 3 PRIORITIZED ACTIONS

Each action must contain:

Task
Priority
Reason
Estimated Effort
Expected Outcome
Dependencies

Example:

1. Complete Backend API

Priority: HIGH

Reason:
Your frontend depends on this API.

Estimated Effort:
4 hours

Expected Outcome:
Frontend can communicate with the backend.

The recommendations must change as the project state changes.

19. 💻 AI CODE BUILDER — CORE MVP FEATURE

Create a dedicated page:

/projects/:id/code

Navigation:

💻 AI Code Builder

This feature helps students actually build their selected project.

The AI Code Builder must understand:

Student Profile
Selected Project
Project Features
Technology Stack
Current Roadmap Phase
Current Task
Relevant Existing Code

It must NOT behave as a generic coding chatbot.

20. ✨ GENERATE CODE

Create:

Generate Code

Fields:

What do you want to build?

Example:

Create a login API using FastAPI and PostgreSQL.

Programming Language

Options:

Python

Java

JavaScript

TypeScript

C

C++

HTML

CSS

SQL

Framework / Technology

Adapt options to the selected project stack.

Button:

🚀 Generate Code

Use Gemini to generate the code.

21. AI CODE RESPONSE

Display:

Generated Code

Use a professional code block/editor with:

Syntax highlighting

Copy button

Language label

Clear formatting

Also show:

🧠 How It Works

Explain the code in simple student-friendly language.

Also show:

📌 Where Should I Put This Code?

Example:

frontend/src/components/Login.tsx

or:

backend/routes/auth.py

22. STEP-BY-STEP CODE IMPLEMENTATION

For complex features, do not only generate one huge block of code.

Break implementation into steps:

STEP 1
Create database structure

STEP 2
Create backend API

STEP 3
Create frontend component

STEP 4
Connect frontend and backend

STEP 5
Test the feature

Each step should include:

Explanation

File path

Code

Next action

23. 🐛 DEBUG MY CODE

Add:

Debug My Code

Inputs:

Existing Code

Code editor/textarea.

Error Message

Example:

TypeError: Cannot read properties of undefined

Button:

🔧 Debug Code

Return:

Problem
↓
Why It Happened
↓
How To Fix It
↓
Corrected Code
↓
How To Test It

24. 📖 EXPLAIN MY CODE

Add:

Explain Code

Allow the student to paste code.

Provide explanations for:

What the code does

Variables

Functions

Logic

Data flow

Dependencies

Possible issues

Provide difficulty:

Beginner

Intermediate

Advanced

Default to Beginner.

25. ⚡ IMPROVE MY CODE

Add:

Improve My Code

Analyze:

Code quality

Performance

Security

Readability

Maintainability

Error handling

Testing

Show:

Before

Improved Version

What Changed?

Why?

26. 🧪 GENERATE TESTS

Add:

Generate Tests

Allow the student to provide:

Function

API

Component

Feature

Generate appropriate tests.

Explain:

How to Run These Tests

27. 🔒 CODE SECURITY CHECK

Add:

Check My Code

Analyze for common issues:

Hardcoded secrets

Unsafe input handling

SQL injection risks

Authentication problems

Authorization problems

Exposed sensitive data

Unsafe API usage

Never ask students to paste:

Passwords

API keys

Access tokens

Private credentials

Warn students that AI security analysis is advisory and should be verified.

28. 📁 PROJECT STRUCTURE GENERATOR

Generate a recommended project structure based on the student's selected stack.

Example:

project/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── tests/
│
├── database/
│
└── README.md

Explain what each folder does.

29. 🔗 CONNECT CODE BUILDER TO TASKS

Every task should have:

🤖 Build With AI

When clicked:

Identify project.

Identify task.

Identify related feature.

Identify technology.

Identify roadmap phase.

Send relevant context to Gemini.

Generate implementation plan.

Generate code.

Explain code.

Tell the student where to place it.

Example:

Task:

Create crop image upload API

Click:

Build With AI

AI opens Code Builder with:

Project:
AI Crop Disease Detection

Task:
Create crop image upload API

Technology:
FastAPI

Expected Outcome:
Upload an image and prepare it for model prediction.

30. 🔗 CONNECT CODE BUILDER TO "WHAT SHOULD I DO NEXT?"

If the AI recommends:

Complete crop image upload API

show:

💻 Build This With AI

Clicking it should open the Code Builder with the task context automatically populated.

31. 🧠 AI PROJECT MENTOR

Create:

Your AI Project Mentor

This is NOT a generic chatbot.

The mentor must understand:

Student Profile
Skills
Career Goal
Active Project
Problem Statement
Features
Technology Stack
Roadmap
Current Phase
Tasks
Completed Tasks
Pending Tasks
Deadline
Project Health
Recent Conversation

Students can ask:

How do I implement this feature?

What should I do next?

Explain my architecture.

Why should I use this technology?

How can I improve my project?

Is my project feasible?

Help me debug this.

Suggest improvements.

Quick actions:

Explain My Project
What's Next?
Review My Roadmap
Find Risks
Suggest Features
Help Me Code

Store chat history per user and project.

32. 📊 PROJECT HEALTH

Create:

Project Health

Calculate a dynamic 0–100 score.

Use:

Skill Match          20%
Feasibility           15%
Innovation            15%
Career Relevance      15%
Technical Quality     10%
Progress              15%
Time Feasibility      10%

Clearly label:

AI Project Health Model

Do not claim this is scientifically validated.

Display component scores.

Detect real risks such as:

Backend behind schedule

Testing not started

Too many advanced features

Too many incomplete tasks

Deadline approaching

Low progress

Generate:

AI Recommendation

33. 🏆 DYNAMIC WOW DEMO

Create an easy demonstration state.

Example:

Project Progress: 35%
Project Health: 78%

Backend API:
Not Completed

Testing:
Not Started

Click:

WHAT SHOULD I DO NEXT?

AI:

Complete Backend API

Then mark the backend task completed.

Automatically update:

Progress

Health

Task status

Click:

WHAT SHOULD I DO NEXT?

again.

AI should now recommend a different action, such as:

Start Integration Testing

This must demonstrate that ProjectMentor AI reacts to real project state.

34. 🏠 LANDING PAGE

Create a premium landing page.

Hero heading:

Turn Your Final-Year Project Into Something You Can Be Proud Of.

Subtitle:

ProjectMentor AI helps you discover, plan, build and improve your final-year project with personalized AI guidance.

Buttons:

Start Building

Sign In

Sign Up

35. LANDING PAGE SECTIONS

The Problem

Students struggle with:

Choosing a project

Checking feasibility

Selecting technologies

Creating a roadmap

Getting technical guidance

Writing code

Debugging

Staying on schedule

The Solution

ProjectMentor AI combines project discovery, planning, development assistance and AI mentorship.

How It Works

Create Account
      ↓
Tell Us About Yourself
      ↓
Get Personalized Ideas
      ↓
Choose the Right Project
      ↓
Get AI Roadmap
      ↓
Build With AI
      ↓
AI Mentor
      ↓
What Should I Do Next?
      ↓
Project Health

36. 🧭 NAVIGATION

Logged-out navigation

Home
How It Works
Sign In
Sign Up

Logged-in navigation

Dashboard
Generate
My Project
Roadmap
Tasks
💻 AI Code Builder
🧠 AI Mentor
Project Health
Profile
Logout

37. 🗄️ DATABASE

Use Supabase PostgreSQL.

Create tables such as:

profiles
skills
interests
projects
project_scores
project_features
project_roadmaps
tasks
chat_messages
code_sessions
project_health
ai_recommendations
saved_projects

Use foreign keys.

Every private record must be linked to the authenticated user.

Enable Row Level Security.

38. 🤖 GEMINI AI ARCHITECTURE

Create a centralized AI service layer.

Organize AI logic separately from UI.

Suggested structure:

src/
  services/
    ai/
      gemini.ts
      projectGenerator.ts
      projectEvaluator.ts
      featureGenerator.ts
      techStackGenerator.ts
      roadmapGenerator.ts
      codeBuilder.ts
      codeDebugger.ts
      mentor.ts
      projectHealth.ts
      nextActions.ts

Use structured responses where possible.

Validate Gemini responses before displaying/storing them.

39. 🔐 GEMINI SECURITY

Never expose Gemini API keys in frontend code.

Use a server-side environment variable:

GEMINI_API_KEY

Gemini requests must go through secure backend/server functionality.

Never place secrets inside:

React components

Public files

Client-side code

HTML

40. AI CONTEXT MANAGEMENT

Do not send the entire database to Gemini.

Only send relevant context.

For Code Builder:

Student Skills
Active Project
Relevant Feature
Technology Stack
Current Task
Relevant Existing Code

For Mentor:

Student Profile
Active Project
Features
Technology Stack
Roadmap
Tasks
Health
Recent Chat

For "What Should I Do Next?":

Active Project
Current Phase
Pending Tasks
Completed Tasks
Dependencies
Deadline
Progress
Health

41. CODE SAFETY

For the AI Code Builder:

Never request passwords.

Never request API keys.

Never expose secrets.

Warn about destructive operations.

Do not automatically execute arbitrary generated code.

Do not claim code was executed unless it actually was.

Clearly label generated code as AI-generated.

Encourage students to review and test generated code.

For MVP, use:

Generate
↓
Explain
↓
Review
↓
Copy
↓
Student integrates
↓
Student tests

Do NOT automatically execute arbitrary AI-generated code on the main application server.

42. 🎨 UI/UX

The product should look like a premium AI SaaS platform.

Design style:

Modern

Clean

Professional

Student-friendly

Developer-friendly

Hackathon-ready

Use:

Cards

Tabs

Progress bars

Status badges

Clean tables

Code editor areas

Kanban board

Charts where useful

Subtle animations

Responsive layouts

Avoid:

Cartoonish design

Excessive gradients

Clutter

Fake statistics

Excessive animations

Generic college-project styling

43. ACCESSIBILITY

Implement:

Semantic HTML

Proper form labels

Keyboard navigation

Visible focus states

Good contrast

Accessible buttons

Accessible dialogs

Meaningful error messages

Responsive text

Do not rely only on color for status

44. PERFORMANCE

Optimize:

Database queries

Gemini requests

React rendering

Page loading

Do not regenerate AI results unnecessarily.

Store generated:

Projects

Evaluations

Features

Roadmaps

Recommendations

Only regenerate when required.

45. ERROR HANDLING

Every important operation needs:

Loading
Success
Error
Retry

Handle:

Authentication failures

Database errors

Gemini errors

Network failures

Invalid forms

Missing profile

Missing project

Empty task state

If Gemini fails, show:

AI service is temporarily unavailable. Please try again.

Provide a Retry button.

Never create fake AI responses.

46. DEMO PROFILE

Create optional sample/demo data:

Skills:
Python
React
SQL
Machine Learning

Interest:
Agriculture

Career:
AI/ML Engineer

Team Size:
3

Available Time:
8 weeks

Example project:

AI Crop Disease Detection

Clearly label sample information as demo data.

47. TESTING

Before declaring the application complete, test:

Authentication

✓ Sign Up
✓ Create Account
✓ Duplicate email
✓ Sign In
✓ Wrong password
✓ Logout
✓ Session persistence
✓ Protected routes
✓ Password reset

Profile

✓ Create profile
✓ Edit profile
✓ Save skills
✓ Save interests
✓ Save constraints

AI

✓ Generate projects
✓ Evaluate projects
✓ Generate features
✓ Generate tech stack
✓ Generate roadmap
✓ AI Code Builder
✓ Debug code
✓ Explain code
✓ Generate tests
✓ AI Mentor
✓ Project Health
✓ What Should I Do Next?

Tasks

✓ Create task
✓ Edit task
✓ Delete task
✓ Change status
✓ Complete task
✓ Progress updates

Security

✓ User A cannot access User B
✓ Gemini key not exposed
✓ RLS works
✓ Protected routes work

Accessibility

✓ Keyboard navigation
✓ Form labels
✓ Focus states
✓ Contrast
✓ Responsive layout

Fix major errors before completion.

48. MVP PRIORITY

The following are mandatory:

1. Sign Up
2. Create Account
3. Sign In
4. Logout
5. Protected Routes
6. Student Onboarding
7. AI Project Generator
8. AI Project Evaluation
9. Project Selection
10. AI Feature Generator
11. AI Technology Stack
12. AI Roadmap
13. Task Workspace
14. 💻 AI Code Builder
15. 🧠 AI Project Mentor
16. 🔥 What Should I Do Next?
17. Project Health

Do not sacrifice these features for unnecessary extras.

49. DO NOT BUILD IN MVP

Do NOT spend significant time building:

Documentation generator

Viva Coach

Social network

Mentor marketplace

Payments

Advanced analytics

Complex admin dashboard

Mobile application

Multiple AI providers

Notifications

Team collaboration

These can be Phase 2.

50. IMPLEMENTATION ORDER

Follow this order.

PHASE 1 — FOUNDATION

Set up:

React

TypeScript

Tailwind

Supabase

Routing

Component system

PHASE 2 — AUTHENTICATION

Implement:

Sign Up

Create Account

Sign In

Logout

Sessions

Protected routes

RLS

TEST authentication before continuing.

PHASE 3 — ONBOARDING

Build student profile.

PHASE 4 — GEMINI

Set up secure Gemini integration.

PHASE 5 — PROJECT INTELLIGENCE

Build:

Project generator

Evaluation

Selection

Features

Technology stack

PHASE 6 — EXECUTION

Build:

Roadmap

Tasks

Progress

PHASE 7 — AI CODE BUILDER

Build:

Generate code

Explain code

Debug code

Improve code

Generate tests

Security check

PHASE 8 — AI MENTOR

Build project-aware mentor.

PHASE 9 — AI INTELLIGENCE

Build:

Project Health

Risk Detection

What Should I Do Next?

PHASE 10 — CONNECT EVERYTHING

Ensure task changes update:

Progress
Health
Risks
Recommendations
Next Actions
Mentor Context

PHASE 11 — TEST

Test the entire application.

PHASE 12 — POLISH

Improve:

UI

Accessibility

Responsiveness

Performance

Loading states

Error states

51. HACKATHON DEMO FLOW

The ideal demo:

1. Landing Page

2. Sign Up

3. Create Account

4. Student Onboarding

5. Generate 5 AI project ideas

6. Show personalized project evaluation

7. Select project

8. Generate features

9. Generate technology stack

10. Generate roadmap

11. Open Tasks

12. Complete a task

13. Open AI Code Builder

14. Generate code for the task

15. Explain/debug code

16. Open AI Mentor

17. Ask a technical question

18. Click:
🔥 WHAT SHOULD I DO NEXT?

19. Show 3 personalized actions

20. Open Project Health

21. Show risks

Target demo:

Approximately 5 minutes.

52. HACKATHON EVALUATION ALIGNMENT

Optimize the project for:

Code Quality

Use clean TypeScript, reusable components, proper architecture and separation of concerns.

Security

Use:

Supabase Auth

RLS

Protected routes

Secure Gemini calls

Environment variables

Efficiency

Avoid unnecessary AI and database calls.

Testing

Test authentication, AI, database, tasks and the full workflow.

Accessibility

Use semantic HTML, labels, keyboard navigation, focus states and sufficient contrast.

Problem Statement Alignment

Clearly solve:

Final-year students struggle to choose the right project and successfully move from idea to execution.

Google Services Usage

Gemini must be deeply integrated into:

Project generation

Project evaluation

Feature generation

Technology recommendations

Roadmap generation

Code generation

Debugging

Mentoring

Risk detection

Project health

Next-action recommendations

53. FINAL PRODUCT POSITIONING

ProjectMentor AI is NOT:

Just another AI chatbot.

ProjectMentor AI is:

An AI-powered project lifecycle mentor that understands what a student is building and helps them actually build it.

The AI connects:

Student
   ↓
Skills
   ↓
Project
   ↓
Features
   ↓
Technology
   ↓
Roadmap
   ↓
Tasks
   ↓
Code
   ↓
Testing
   ↓
Progress
   ↓
AI Guidance
   ↓
Next Action
   ↓
Completed Project

54. FINAL INSTRUCTION

Build ProjectMentor AI as a real working hackathon-ready application.

The first working flow MUST be:

Landing Page
      ↓
Sign Up
      ↓
Create Account
      ↓
Student Onboarding
      ↓
Dashboard

Returning users MUST be able to:

Landing Page
      ↓
Sign In
      ↓
Dashboard

Then implement the complete MVP.

Use real Supabase authentication.

Use real Supabase database operations.

Use real Gemini AI.

Use real project/task state.

Use real AI recommendations.

Do not hardcode the core AI functionality.

Do not create fake buttons.

Do not expose API keys.

Do not stop at the UI.

After implementation, test the complete workflow and fix errors.

The final product must be suitable for a live hackathon demonstration.

BUILD PROJECTMENTOR AI NOW.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/49dcbe71-91b1-4ef3-9f36-07c2c05bf510).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
