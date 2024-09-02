# journal_app
Journal App using React + Typescript + Django

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTB4bDl4MDJwa2ZkdGJzaHRvdnkwbGUweGwzY3RnMWh0azY5OXI0cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ha2Y9sYTYHdnXdwVL6/giphy.gif)

### Project Specifications:

- Create app for personal journaling
- Build frontend with React and Typescript
- Build backend with Django REST framework
- Utilize SQL for database

### Features:

- Custom text editor for styling journal text
- Functionality for saving journal to database and exporting to pdf
- Sortable and searchable list view of existing journals
- Settings for managing user-specific tags for indexed searching

## Installation

### Backend

```bash
# Create virtual environment then runs on 'localhost:8000'
# You will need to use postman or similar to manually
# create a user through the user api then store the id
# in env file for frontend
cd backend
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
