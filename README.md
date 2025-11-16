# Lumos AI Study Companion

This is a Next.js application that serves as an AI-powered study assistant. It allows users to upload documents, videos, and other resources to generate notes, mind maps, and quizzes.

## Running the Application Locally

Running this project locally requires starting both the Python backend and the Next.js frontend separately.

### 1. Backend Setup (Python/FastAPI)

The backend server handles all the AI processing, document parsing, and data storage.

1.  **Prerequisites**:
    *   Python 3.8+ installed.
    *   `pip` for package management.

2.  **Install Dependencies**:
    Your backend has several dependencies like FastAPI, Uvicorn, and dspy. Ensure they are installed. If you have a `requirements.txt` file, you can run:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set Environment Variables**:
    The application uses the Gemini API. You must set your API key as an environment variable. In your terminal, run:
    ```bash
    export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```

4.  **Run the Backend Server**:
    Assuming your main FastAPI file is named `main.py`, you can start the server using Uvicorn:
    ```bash
    uvicorn main:app --reload
    ```
    This will start the backend server, typically on `http://127.0.0.1:8000`.

### 2. Frontend Setup (Next.js)

The frontend is the user interface you interact with in the browser.

1.  **Create Environment File**:
    In the root directory of your project, create a new file named `.env.local`. This file will tell the frontend where to find the backend. Add the following line to it:
    ```
    NEXT_PUBLIC_BACKEND_URL="http://127.0.0.1:8000"
    ```

2.  **Install Dependencies**:
    Open a new terminal window, navigate to the project's root directory, and run:
    ```bash
    npm install
    ```

3.  **Run the Development Server**:
    Once the dependencies are installed, start the Next.js development server:
    ```bash
    npm run dev
    ```
    This will make the application available at `http://localhost:9002`.

### 3. Accessing the App

With both servers running, open your web browser and navigate to **`http://localhost:9002`**. You can now use the application.
