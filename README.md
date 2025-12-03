# MemorialBridge - A Cultural Tribute (Pakistan Theme) MVP

A Django web application for preserving memories and celebrating lives. This project allows users to create memorials, share memories, and contribute to meaningful tributes.

## Connect With Us

- **Website**: [thememorialbridge.com](https://memorialbridge.onrender.com)
- **Instagram**: [@the.memorial.bridge](https://instagram.com/the.memorial.bridge)
- **Facebook**: [MemorialBridge](https://facebook.com/MemorialBridge)
- **LinkedIn**: [MemorialBridge](https://linkedin.com/company/MemorialBridge)
- **TikTok**: [@thememorialbridge](https://tiktok.com/@thememorialbridge)

## Features

- User authentication with email verification simulation
- Memorial creation and management
- Memory posting (text, images, video links)
- Public memorial exploration with search functionality
- Personal dashboard for memorial management
- Contribution simulation (donations and tree planting)
- Pakistani-themed design with cultural sensitivity

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository** (if using git):
   ```bash
   git clone <repository-url>
   cd MemorialBridge
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply database migrations**:
   ```bash
   cd memorialbridge
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Load seed data**:
   ```bash
   python manage.py seed_data
   ```

6. **Run the development server**:
   ```bash
   python manage.py runserver
   ```

7. **Access the application**:
   Open your browser and go to `http://127.0.0.1:8000/`

## Default Test Account

- **Username**: demo
- **Password**: demo1234

## Project Structure

```
memorialbridge/
├── memorialbridge/          # Main project directory
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── main_app/               # Main application
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── management/
│       └── commands/
│           └── seed_data.py
├── static/                 # Static files
│   ├── css/
│   ├── js/
│   └── images/
├── templates/              # HTML templates
│   ├── base.html
│   ├── main_app/
│   └── auth/
├── media/                  # User uploads
└── requirements.txt
```

## Key Features

### User Flow
1. **Landing Page**: Features carousel of top memorials
2. **Sign Up/Login**: User authentication system
3. **Email Verification**: Simulated verification process
4. **Memorial Creation**: Protected form for creating memorials
5. **Memory Posting**: Add memories to any memorial
6. **Exploration**: Browse and search public memorials
7. **Dashboard**: Manage personal memorials
8. **Contributions**: Simulate donations and tree planting

### Models
- **UserProfile**: Extended user model with verification status
- **Memorial**: Core memorial entity with visibility controls
- **Memory**: User-contributed memories (text, image, video)

## Limitations

This is an MVP with the following limitations:
- **Email verification**: Simulated (no actual emails sent)
- **Contributions**: Non-transactional (just counters)
- **File uploads**: Stored locally (not cloud storage)
- **Search**: Basic name-based filtering only

## Cultural Theme

The application uses a Pakistani-inspired color palette and design elements to create a respectful, culturally-appropriate memorial platform.

## Development

### Adding New Features
1. Update models in `main_app/models.py`
2. Create/update views in `main_app/views.py`
3. Add URL patterns in `main_app/urls.py`
4. Create templates in `templates/main_app/`
5. Add static files in `static/`

### Running Tests
```bash
python manage.py test
```

### Admin Interface
Create a superuser to access Django admin:
```bash
python manage.py createsuperuser
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
The MIT License is a permissive open-source license that allows you to:
- Use, copy, modify, and distribute this software
- Use it for commercial purposes
- Include it in proprietary software

The only requirement is that the license and copyright notice must be included with any substantial portions of the software.
