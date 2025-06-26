# Bot Tracker

Bot Tracker is a full-stack web application that allows users to manage, monitor, and analyze the performance of automated trading bots. The app is built using a Flask backend and a React frontend, with user authentication, admin tools, and data visualization features.

## Features

### Authentication
- User registration and login with JWT-based authentication
- Role-based access control (regular users vs. admins)

### User Dashboard
- View personal bots, trades, and strategies
- Track individual bot performance

### Bot Management
- Create, edit, and delete trading bots
- Link bots to strategies and trades

### Strategy Management
- Define and manage trading strategies
- Associate strategies with bots

### Trade Management
- Log trades made by bots
- View trade details and calculate profit/loss

### Admin Features
- View all users, bots, trades, and strategies
- Approve or deactivate bots
- Access user-specific performance data

## Technologies Used

### Frontend
- React (with Vite)
- Tailwind CSS for styling
- React Router for navigation
- Toastify for notifications

### Backend
- Python + Flask
- SQLAlchemy ORM
- Flask-Migrate for database migrations
- Flask-JWT-Extended for authentication
- Flask-CORS for cross-origin requests

### Database
- SQLite (for development)
- PostgreSQL (for deployment on Render)

### Deployment
- **Frontend**: Deployed to Netlify
- **Backend**: Deployed to Render

## Project Structure
bot-tracker/
├── backend/ # Flask app
│ ├── models/ # SQLAlchemy models
│ ├── routes/ # Blueprint routes
│ ├── migrations/ # Alembic migrations
│ └── app.py # Application factory
├── frontend/ # React app
│ ├── src/ # React source files
│ ├── public/ # Static assets
│ └── index.html # Main HTML entry


## Getting Started

### Backend Setup

```bash
cd backend
pipenv install
pipenv shell
flask db upgrade
flask run

cd frontend
npm install
npm run dev

##Future Improvements
-Analytics dashboard with charts

-Filtering and sorting for trades

-Improved role management

-Email verification and password recovery

Copyright <2025> <Alex Mani>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

