# Todo Manager

A task management application built with SvelteKit frontend and Django backend fork from [https://github.com/VaclavJirka/todo_manager](https://github.com/VaclavJirka/todo_manager).

## Prerequisites

Before setting up the application, ensure you have the following installed:

- **Python 3.8+** with pip
- **Node.js 18+** with npm

## Project Structure

```
todo-manager/
├── cms/                    # Django backend
│   ├── manage.py
│   ├── requirements.txt    # Python dependencies
│   └── ...
├── app/                    # SvelteKit frontend
│   ├── package.json
│   ├── src/
│   └── ...
└── README.md
```

## Setup Instructions

### 1. Backend Setup (Django)

Create and activate a Python virtual environment:

```bash
# Navigate to the cms folder
cd cms

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Run database migrations (if applicable):

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### 2. Frontend Setup (SvelteKit)

Open a new terminal window/tab and navigate to the app folder:

```bash
cd app
```

Install Node.js dependencies:

```bash
npm install
```

Start the SvelteKit development server:

```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## Running the Application

1. **Start the backend first**: In the `cms` folder, activate your Python environment and run `python manage.py runserver`
2. **Start the frontend**: In the `app` folder, run `npm run dev`
3. **Access the application**: Open your browser and navigate to `http://localhost:5173`
