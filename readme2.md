
1. Running via streamlit app
- Build the Docker image:
    ```bash
    docker build -t ai-backend .
    ```
- Run with environment variables:
    ```bash
    docker run -p 8501:8501 \
    -e GEMINI_API_KEY=your_gemini_api_key \
    -e DB_USER=root \
    -e DB_PASSWORD=your_password \
    -e DB_HOST=your_db_host \
    -e DB_PORT=3306 \
    -e DB_NAME=transactionsDB \
    ai-backend
    ```