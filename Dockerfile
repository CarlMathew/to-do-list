FROM python:3.10-slim

WORKDIR /app

COPY . /app/

RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p /app/staticfiles

EXPOSE 8000

ENV DJANGO_SETTINGS_MODULE=ListDo_Task.settings

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]