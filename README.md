# USUS

## AI Simulation Environment for Human Staff Training

USUS is an AI-powered simulation and training platform designed to help organizations train, practice, evaluate, and improve human staff communication and customer-service skills through realistic AI-driven scenarios.

Instead of learning only through documents, lectures, or passive courses, trainees interact with simulated customers, handle realistic situations, and receive structured feedback on their performance.

---

## Table of Contents

- [Overview](#overview)
- [Problem](#problem)
- [Solution](#solution)
- [Product Vision](#product-vision)
- [Core Training Experience](#core-training-experience)
- [Training Categories](#training-categories)
- [Difficulty Levels](#difficulty-levels)
- [Evaluation Framework](#evaluation-framework)
- [Product Features](#product-features)
- [User Types](#user-types)
- [Frontend Architecture](#frontend-architecture)
- [Frontend Page Structure](#frontend-page-structure)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Application Flow](#application-flow)
- [Scenario Architecture](#scenario-architecture)
- [Session Architecture](#session-architecture)
- [Development Principles](#development-principles)
- [Development Roadmap](#development-roadmap)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Commands](#development-commands)
- [Testing](#testing)
- [Code Organization](#code-organization)
- [Git Workflow](#git-workflow)
- [Project Status](#project-status)
- [USUS Product Principle](#usus-product-principle)
- [License](#license)

---

# Overview

USUS is an AI simulation environment for human staff training.

The platform allows a trainee to:

1. Select a training category.
2. Select a scenario.
3. Review the scenario briefing.
4. Enter an AI-powered role-play session.
5. Communicate with an AI customer.
6. Complete the scenario.
7. Receive an evaluation.
8. Review mistakes and missed opportunities.
9. Repeat the scenario and improve.
10. Track performance over time.

The central idea is:

> **Practice → Perform → Evaluate → Improve → Repeat**

---

# Problem

Traditional staff training often depends on:

- Classroom sessions
- Videos
- Manuals
- Slides
- Written policies
- Role-playing with another employee
- Infrequent performance evaluations

These approaches can be difficult to scale and may not provide enough realistic practice.

Employees may understand what they are supposed to do but still struggle when faced with:

- Angry customers
- Confused customers
- Emotional situations
- Complaints
- Policy restrictions
- Difficult conversations
- Escalation
- Conflicting customer expectations

USUS provides a controlled environment where employees can repeatedly practice these situations.

---

# Solution

USUS creates realistic customer-service simulations using AI.

The AI acts as the customer while the trainee acts as the staff member.

The customer can have different:

- Personalities
- Emotional states
- Communication styles
- Problems
- Expectations
- Difficulty levels
- Escalation patterns

The trainee's performance is then evaluated against predefined training criteria.

USUS is therefore designed as a structured:

**Simulation + Training + Evaluation system.**

---

# Product Vision

The long-term vision of USUS is to become an AI-powered training environment that organizations can use to:

- Train employees
- Practice customer interactions
- Improve communication skills
- Evaluate employee performance
- Identify skill gaps
- Track employee progress
- Create organization-specific scenarios
- Support hiring evaluations
- Support performance reviews

USUS is not simply a chatbot.

It is a structured simulation, training, and evaluation platform.

---

# Core Training Experience

The core USUS experience consists of five major stages.

## 1. Prepare

The trainee selects a scenario and receives:

- Scenario description
- Customer profile
- Situation
- Learning objectives
- Skills being tested
- Difficulty level
- Relevant company information

---

## 2. Simulate

The trainee enters an AI-powered role-play.

The AI acts as the customer.

The conversation can change based on the trainee's responses.

Possible customer behaviours include:

- Calm
- Confused
- Frustrated
- Angry
- Emotional
- Impatient
- Resistant
- Cooperative

---

## 3. Evaluate

After the simulation, USUS evaluates the trainee's performance.

The evaluation considers predefined dimensions and scenario-specific criteria.

---

## 4. Feedback

The trainee receives:

- Overall score
- Dimension scores
- Strengths
- Weaknesses
- Missed opportunities
- Specific examples
- Recommendations
- Suggested areas for improvement

---

## 5. Improve

The trainee can:

- Review the conversation
- Understand mistakes
- Try the scenario again
- Compare previous attempts
- Track improvement over time

---

# Training Categories

Scenarios are grouped into training categories.

Initial categories include:

- Communication
- Empathy
- De-escalation
- Problem Resolution
- Policy & Compliance

Additional categories can be introduced later.

Each category can contain multiple scenarios and difficulty levels.

Example:

```text
De-escalation
│
├── Beginner
│   ├── Frustrated Customer
│   └── Delayed Response
│
├── Intermediate
│   ├── Angry Customer
│   └── Repeated Complaint
│
└── Advanced
    ├── Escalated Customer
    └── High-Stakes Complaint
````

---

# Difficulty Levels

USUS uses three primary difficulty levels:

* Beginner
* Intermediate
* Advanced

Difficulty can be determined by factors such as:

* Customer emotional intensity
* Number of objectives
* Policy restrictions
* Conversation complexity
* Escalation behaviour
* Required resolution
* Time pressure

---

# Evaluation Framework

USUS evaluates trainee performance across seven primary dimensions.

| Dimension     | Description                                                                           |
| ------------- | ------------------------------------------------------------------------------------- |
| Accuracy      | Whether the trainee provides correct information                                      |
| Empathy       | Whether the trainee acknowledges and responds appropriately to customer emotions      |
| Clarity       | Whether communication is clear and understandable                                     |
| Policy        | Whether company policies and rules are followed                                       |
| Resolution    | Whether the trainee successfully addresses the customer's problem                     |
| De-escalation | Whether the trainee reduces tension and manages difficult emotions                    |
| Efficiency    | Whether the trainee handles the situation effectively without unnecessary interaction |

Each dimension contributes to the overall evaluation.

---

# Product Features

## Trainee Features

### Authentication

* Login
* Sign up
* Password recovery
* Session management

### Dashboard

* Overall training score
* Training progress
* Skill performance
* Recent sessions
* Recommended scenarios
* Quick actions

### Learning Path

* Beginner → Intermediate → Advanced progression
* Training categories
* Category progress
* Scenario completion
* Skill progression

### Scenario Browser

Trainees can:

* Search scenarios
* Filter by category
* Filter by difficulty
* Sort scenarios
* View previous scores
* Start a scenario

### Scenario Brief

Before beginning a simulation, trainees see:

* Scenario title
* Category
* Difficulty
* Customer profile
* Situation
* Objective
* Skills being tested
* Important information
* Estimated duration

### AI Role-Play

The trainee interacts with an AI customer using text.

The system tracks:

* Conversation history
* Customer responses
* Trainee responses
* Session state
* Key conversation moments

Voice interaction can be added as an extension of the same simulation engine.

### Evaluation & Feedback

After a session:

* Overall score
* Seven dimension scores
* Performance summary
* Strengths
* Improvement areas
* Missed opportunities
* Conversation analysis
* Recommendations

### Session History

Trainees can review previous sessions.

The system can show:

* Scenario
* Date
* Score
* Status
* Duration
* Conversation
* Previous feedback
* Attempt comparison

Example:

```text
Attempt 1 → 61
Attempt 2 → 74
Attempt 3 → 83
```

---

# Organization Features

## Admin Dashboard

Administrators and managers can view:

* Total trainees
* Active trainees
* Sessions completed
* Average score
* Team performance
* Skill performance
* Improvement trends
* Recent activity

The dashboard should focus on actionable information rather than excessive charts.

Managers should be able to quickly understand:

* Who is performing well?
* Who needs help?
* Which skills are weak?
* Is the team improving?

---

# Scenario Management

Administrators can manage the scenario library.

Capabilities include:

* Create scenario
* Edit scenario
* View scenario
* Duplicate scenario
* Archive scenario
* Search scenarios
* Filter scenarios
* Publish scenarios

---

# Scenario Builder

Long-term scenario configuration can include:

## Basic Information

* Scenario name
* Description
* Category
* Difficulty

## Customer

* Name
* Persona
* Personality
* Emotional starting state

## Situation

* Background
* Customer problem
* Customer objective

## Training

* Trainee objective
* Skills being tested
* Expected outcome

## Company Knowledge

* Policies
* FAQs
* Product information
* Relevant company information

## AI Behaviour

* Personality
* Emotional behaviour
* Escalation conditions
* Resolution conditions

## Evaluation

* Evaluation dimensions
* Weighting
* Critical mistakes

---

# User Management

Administrators can manage:

* Users
* Roles
* Status
* Training progress
* Performance
* Session history

Potential actions include:

* View user
* Edit role
* Deactivate user
* View performance
* Assign training

---

# User Types

USUS can support organizational roles such as:

```text
Super Admin
    │
    └── Organization Admin
            │
            ├── Manager
            │
            └── Agent / Trainee
```

The exact role permissions will be enforced by the backend.

---

# Frontend Architecture

USUS uses the Next.js App Router.

The frontend is organized around:

* Routes
* Shared layouts
* Reusable UI components
* Feature components
* API services
* Hooks
* Types

The architecture is designed to prevent page-specific logic, reusable UI, and API logic from becoming unnecessarily mixed together.

---

# Frontend Page Structure

USUS contains 11 primary product areas.

## Trainee

1. Authentication
2. Dashboard
3. Learning Path
4. Scenario Browser
5. Scenario Brief
6. Role-Play
7. Evaluation & Feedback
8. Session History & Review

## Admin

9. Admin Dashboard
10. Scenario Management
11. User Management

Authentication contains multiple routes:

```text
/login
/signup
/forgot-password
```

These are part of the Authentication area rather than separate product areas.

---

# Project Structure

```text
USUS/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── src/
│   │
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (trainee)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── learning/
│   │   │   │   └── page.tsx
│   │   │   ├── scenarios/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [scenarioId]/
│   │   │   │       └── page.tsx
│   │   │   ├── simulation/
│   │   │   │   └── [sessionId]/
│   │   │   │       └── page.tsx
│   │   │   ├── results/
│   │   │   │   └── [sessionId]/
│   │   │   │       └── page.tsx
│   │   │   └── history/
│   │   │       └── page.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── scenarios/
│   │   │   │   └── page.tsx
│   │   │   └── users/
│   │   │       └── page.tsx
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── learning/
│   │   ├── scenarios/
│   │   ├── simulation/
│   │   ├── evaluation/
│   │   ├── history/
│   │   └── admin/
│   │
│   ├── lib/
│   │   ├── api/
│   │   ├── auth/
│   │   └── utils/
│   │
│   ├── hooks/
│   │
│   ├── types/
│   │
│   └── config/
│
├── .env.local
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

# Technology Stack

## Core

* Next.js
* React
* TypeScript

## Styling

* Tailwind CSS

## UI

* Custom USUS components
* Lucide React

## Utilities

* clsx
* tailwind-merge
* class-variance-authority

## Forms

* React Hook Form
* Zod
* @hookform/resolvers

## Data Fetching

* TanStack Query

## Client State

* Zustand

## Charts

* Recharts

## Animation

* Framer Motion

## Notifications

* Sonner

## Date Handling

* date-fns

## Testing

* Vitest
* React Testing Library
* Playwright

---

# Application Flow

The main trainee flow is:

```text
Login
  ↓
Dashboard
  ↓
Learning Path
  ↓
Scenario Browser
  ↓
Scenario Brief
  ↓
Start Simulation
  ↓
AI Role-Play
  ↓
Session Completed
  ↓
Evaluation
  ↓
Feedback
  ↓
History
  ↓
Try Again
```

---

# Scenario Architecture

A scenario is an isolated training exercise.

Conceptually:

```text
Training Category
      ↓
Difficulty
      ↓
Scenario
      ↓
Customer Profile
      ↓
Situation
      ↓
Training Objective
      ↓
AI Behaviour
      ↓
Conversation
      ↓
Evaluation
```

A scenario should contain enough information for the simulation engine to understand:

* Who the customer is
* What happened
* What the customer wants
* What the trainee should achieve
* What information is available
* What policies apply
* How the customer should behave
* What counts as a successful resolution
* What mistakes should be penalized

---

# Session Architecture

Each role-play creates a unique training session.

```text
Scenario
   ↓
Create Session
   ↓
sessionId
   ↓
Conversation
   ↓
Session Completion
   ↓
Evaluation
   ↓
Feedback
```

The `sessionId` identifies the specific training attempt.

This allows USUS to preserve:

* Conversation history
* Score
* Evaluation
* Feedback
* Duration
* Attempt number
* Date
* Scenario

---

# Development Principles

## 1. Reusable Components

Do not build the same UI twice.

If a component is used in multiple places, create it as a reusable component.

---

## 2. Separation of Responsibilities

Pages should handle page composition.

Components should handle UI.

API services should handle API communication.

Hooks should handle reusable frontend logic.

Types should define data structures.

---

## 3. Mobile Responsiveness

The web application should work across:

* Desktop
* Tablet
* Mobile

Responsive design should be considered during development rather than added at the end.

---

## 4. Loading States

Every data-dependent feature should have an appropriate loading state.

---

## 5. Error States

Every important API-dependent feature should have an appropriate error state.

---

## 6. Empty States

Where there is no data, the application should clearly explain what is happening and what the user can do next.

---

## 7. Accessibility

USUS should follow good accessibility practices:

* Keyboard navigation
* Clear labels
* Accessible buttons
* Appropriate contrast
* Visible focus states
* Screen-reader-friendly structure

---

# Development Roadmap

## Phase 1 — Foundation

* Project setup
* Frontend architecture
* Shared UI components
* Global styling
* Authentication foundation

## Phase 2 — Core Training Experience

* Dashboard
* Learning Path
* Scenario Browser
* Scenario Brief
* Role-Play
* Evaluation
* Feedback
* Session History

## Phase 3 — Organization Features

* Admin Dashboard
* Scenario Management
* User Management
* Organization-level data

## Phase 4 — Advanced Features

* Voice role-play
* Advanced scenario builder
* Organization-specific knowledge
* Formal evaluations
* Advanced analytics
* Mobile application

---

# Getting Started

## Requirements

Install the following:

* Node.js
* npm
* Git

Recommended development environment:

* Visual Studio Code

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Enter the project:

```bash
cd usus-frontend
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a file named:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=
```

Additional environment variables will be added as backend services are integrated.

Never commit `.env.local` to Git.

---

# Development Commands

Start the development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run linting:

```bash
npm run lint
```

Run unit and component tests:

```bash
npm run test
```

Run end-to-end tests:

```bash
npx playwright test
```

---

# Testing

USUS uses multiple levels of testing.

## Unit Tests

Used for:

* Utility functions
* Business logic
* Data transformations

Technology:

```text
Vitest
```

## Component Tests

Used for:

* Buttons
* Forms
* Cards
* Scenario components
* Evaluation components
* Interactive UI

Technology:

```text
React Testing Library
```

## End-to-End Tests

Used for complete user journeys.

Example:

```text
Login
 ↓
Dashboard
 ↓
Select Scenario
 ↓
Start Simulation
 ↓
Complete Session
 ↓
View Evaluation
```

Technology:

```text
Playwright
```

---

# Code Organization

Components should be named using clear, descriptive names.

Good:

```text
scenario-card.tsx
customer-profile.tsx
conversation-window.tsx
evaluation-highlight.tsx
```

Avoid vague names such as:

```text
box.tsx
thing.tsx
component.tsx
data.tsx
```

---

# Naming Convention

Use:

* `kebab-case` for files
* `PascalCase` for React components
* `camelCase` for functions and variables
* `UPPER_SNAKE_CASE` for constants where appropriate

Example:

```text
scenario-card.tsx
```

```tsx
export function ScenarioCard() {
  // ...
}
```

---

# Git Workflow

Use small, meaningful commits.

Examples:

```text
feat: add authentication layout
feat: add scenario browser
feat: add simulation interface
feat: add evaluation feedback
fix: resolve scenario loading state
fix: correct dashboard score display
refactor: simplify scenario components
```

Avoid commits such as:

```text
update
changes
final
new stuff
```

---

# Project Status

**Current Stage: Foundation / Frontend Development**

The project is being developed progressively.

Current development sequence:

```text
Foundation
    ↓
Shared UI System
    ↓
Application Layout
    ↓
Authentication
    ↓
Trainee Experience
    ↓
Simulation
    ↓
Evaluation
    ↓
Admin Experience
    ↓
Testing & Polish
```

---

# USUS Product Principle

USUS is built around one core training loop:

> **Prepare. Practice. Evaluate. Improve.**

Every feature should contribute meaningfully to that experience.

Features that do not improve training, evaluation, management, or the usability of the platform should be carefully evaluated before being added.

---

# License

Private / Proprietary.

Copyright © USUS.

