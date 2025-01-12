FROM python:3.10

# Install system dependencies for building MySQL/MariaDB dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libmariadb-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements file and install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-deps --no-cache-dir -r requirements.txt

# Copy the actual communicator directory
COPY communicator/communicator/ /app/communicator/

# Expose application port
EXPOSE 8000

# Command to run the backend server
CMD ["uvicorn", "communicator.asgi:application", "--host", "0.0.0.0", "--port", "8000", "--log-level", "debug"]
#CMD ["python", "manage.py", "runserver"]