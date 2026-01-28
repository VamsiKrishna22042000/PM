Project Management System
A comprehensive project management solution with integrated AI capabilities for enhanced productivity and workflow management.

Overview
The Project Management System is a robust web application designed to streamline project workflows, task management, and team collaboration. Built with a modern tech stack and enhanced with AI-powered features, this system helps teams efficiently manage projects, generate structured tasks, and maintain organized workflows.

Features
Core Functionality
User Management: Complete authentication system with role-based access control
Project Management: Create, view, edit, and delete projects
Task Management: Organize work with customizable task tracking
Comment System: Facilitate team communication within tasks and projects
Request Handling: Manage and track feature requests and changes
AI-Powered Features
Intelligent Item Generation: Automatically generate well-structured tasks, stories, and bugs with appropriate acceptance criteria and test cases
Epic Breakdown: Convert high-level epics into detailed user stories and tasks with a single API call
Smart Complexity Estimation: AI-powered story point estimation using Fibonacci sequence (2, 3, 5, 8) based on task complexity
Structured Output: Consistent JSON formatting for all generated items ensuring seamless integration with the project workflow
Tech Stack
Backend: Node.js with Express.js
Database: PostgreSQL with Prisma ORM
Authentication: JWT-based authentication system
AI Integration: Groq API with LLaMA 3.3 70B model
Security: Helmet for HTTP security, express-rate-limit for API protection
Validation: Zod schema validation
API Documentation
Authentication Endpoints
POST /user/register - Register a new user
POST /user/login - Authenticate and receive JWT token
Project Endpoints
POST /projects - Create a new project
GET /projects/:id - Get project by ID
GET /projects - Get all projects for an organization
PUT /projects/:id - Update project details
DELETE /projects/:id - Delete a project
Task Endpoints
POST /tasks - Create a new task
GET /tasks/:id - Get task by ID
GET /tasks/project/:projectId - Get all tasks for a project
PUT /tasks/:id - Update task details
DELETE /tasks/:id - Delete a task
Comment Endpoints
POST /comments - Add a comment
GET /comments/:id - Get comment by ID
GET /comments/task/:taskId - Get all comments for a task
PUT /comments/:id - Update a comment
DELETE /comments/:id - Delete a comment
Request Endpoints
POST /requests - Create a new request
GET /requests/:id - Get request by ID
GET /requests - Get all requests
PUT /requests/:id - Update request details
DELETE /requests/:id - Delete a request
AI-Powered Item Generation Endpoints
Single Item Generation
Endpoint: POST /item/createSingle
Rate Limit: 2 requests per 5 minutes
Authentication: Required
Request Body:
json
{
  "description": "Detailed description of the item",
  "itemType": "STORY|TASK|BUG"
}
Response Format:
For STORY or TASK:
json
{
  "acceptance_criteria": ["criterion1", "criterion2", ...],
  "test_cases": [
    {
      "title": "Test case title",
      "steps": ["step1", "step2", ...]
    }
  ],
  "pointers": 2|3|5|8
}
For BUG:
json
{
  "steps": ["step1", "step2", ...],
  "pointers": 2|3|5|8
}
Multiple Items Generation (Epic Breakdown)
Endpoint: POST /item/createMultiple
Rate Limit: 2 requests per 5 minutes
Authentication: Required
Request Body:
json
{
  "description": "Detailed description of the epic",
  "storiesCount": 3,
  "taskCount": 5
}
Response Format:
json
[
  {
    "title": "Item title",
    "description": "Item description",
    "acceptance_criteria": ["criterion1", "criterion2", ...],
    "test_cases": [
      {
        "title": "Test case title",
        "steps": ["step1", "step2", ...]
      }
    ],
    "pointers": 2|3|5|8
  },
  ...
]
AI Model Details
The system uses Groq's LLaMA 3.3 70B Versatile model to generate structured project items with the following characteristics:

Zero-shot capability: Generates high-quality outputs without requiring training examples
Consistent formatting: Always produces valid JSON in the expected schema
Intelligent complexity estimation: Assigns appropriate story points based on task complexity
Comprehensive test cases: Automatically generates relevant test cases and acceptance criteria
Rate-limited access: Prevents API abuse while ensuring availability for legitimate use
Getting Started
Prerequisites
Node.js (v16+)
PostgreSQL database
Groq API key
Installation
Clone the repository
git clone https://github.com/yourusername/project_management_system.git
Install dependencies
npm install
Set up environment variables Create a .env file with the following variables:
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/pm_database
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
Run database migrations
npx prisma migrate dev
Start the development server
npm run dev
Security Features
JWT-based authentication
Password hashing with bcrypt
API rate limiting to prevent abuse
Input validation with Zod
HTTP security headers with Helmet
License
MIT

Author
Vamsi Krishna
