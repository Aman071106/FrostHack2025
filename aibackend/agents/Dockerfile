# Use the official Python image
FROM python:3.10  

# Set the working directory inside the container
WORKDIR /app  

# Copy requirements.txt first (if it exists)
COPY ./requirements.txt /app/requirements.txt  

# Install dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt  

# Copy the rest of the project files
COPY . .  

# Ensure entrypoint.sh has execution permission
RUN chmod +x entrypoint.sh  

# Expose the port
EXPOSE 8000  

# Set the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
