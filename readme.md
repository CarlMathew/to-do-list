# Setting Up Django on Docker

## Step 1: Install WhiteNoise
Install WhiteNoise to serve static files efficiently:
```bash
pip install whitenoise
```

## Step 2: Update `settings.py`
Modify your `settings.py` file with the following configuration:
```python
# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this to middleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

## Step 3: Update `urls.py`
Modify your `urls.py` file as follows:
```python
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path('secret_admin/', admin.site.urls),
    path("listdo/", include("base.urls")),
    path("", RedirectView.as_view(url="/listdo/login", permanent=True)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## Step 4: Save Dependencies
Generate the `requirements.txt` file:
```bash
pip freeze > requirements.txt
```

## Step 5: Create a `Dockerfile`
Write the following content into a `Dockerfile`:
```dockerfile
# Dockerfile
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy project files into the container
COPY . /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create static files directory
RUN mkdir -p /app/staticfiles

# Expose the application port
EXPOSE 8000

# Set Django settings module environment variable
ENV DJANGO_SETTINGS_MODULE=ListDo_Task.settings

# Command to run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

## Step 6: Create `docker-compose.yml`
Write the following content into a `docker-compose.yml` file:
```yaml
version: '3.8'

services:
  web:
    build: .
    command: >
      sh -c " \
      python manage.py collectstatic --noinput && \
      python manage.py makemigrations && \
      python manage.py migrate && \
      python manage.py runserver 0.0.0.0:8000"
    volumes:
      - .:/app
      - static_volume:/app/staticfiles
    ports:
      - "8000:8000"
    environment:
      - DJANGO_SETTINGS_MODULE=ListDo_Task.settings
      - DEBUG=False
      - ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

volumes:
  static_volume:
```

## Step 7: Build and Run the Containers
Run the following command to build and start the containers:
```bash
docker-compose up --build
```

## Optional: Remove Containers, Networks, and Volumes
If you want to clean up completely, use:
```bash
docker-compose down -v
```

---

Your Django application should now be running on [http://localhost:8000](http://localhost:8000).

