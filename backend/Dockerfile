# Use official Python image as base
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Install system dependencies and uv (correct package name)
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev && \
    pip install --no-cache-dir uvicorn && \
    pip install --no-cache-dir uvloop && \
    rm -rf /var/lib/apt/lists/*


# Copy dependency files
COPY pyproject.toml ./

# Install dependencies using pip (uv is now installed via pip)
RUN pip install --no-cache-dir .

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 8000

# Set the command to run your backend server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]