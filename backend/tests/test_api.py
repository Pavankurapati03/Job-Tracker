from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from main import app

client = TestClient(app)

def test_root():
    """Test the root health check endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Job Tracker API is running 🚀"}


@patch("routes.auth.users_collection.find_one", new_callable=AsyncMock)
@patch("routes.auth.users_collection.insert_one", new_callable=AsyncMock)
def test_register_success(mock_insert_one, mock_find_one):
    """Test successful user registration with database mocks."""
    # Mock that the username and email are not already registered (both find_one calls return None)
    mock_find_one.return_value = None
    
    # Mock insert_one as an async call
    mock_insert_one.return_value = AsyncMock()

    response = client.post("/api/auth/register", json={
        "username": "testci",
        "email": "testci@example.com",
        "password": "testpassword123"
    })

    assert response.status_code == 201
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


@patch("routes.auth.users_collection.find_one", new_callable=AsyncMock)
def test_login_success(mock_find_one):
    """Test successful user login with database mocks."""
    from auth import get_password_hash
    hashed_pwd = get_password_hash("testpassword123")

    # Mock that find_one returns our mock user
    mock_find_one.return_value = {
        "_id": "user-uuid-12345",
        "username": "testci",
        "email": "testci@example.com",
        "hashed_password": hashed_pwd
    }

    response = client.post("/api/auth/login", json={
        "username": "testci",
        "password": "testpassword123"
    })

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


@patch("routes.auth.users_collection.find_one", new_callable=AsyncMock)
def test_login_failed_wrong_password(mock_find_one):
    """Test login failure when user provides a wrong password."""
    from auth import get_password_hash
    hashed_pwd = get_password_hash("testpassword123")

    # Mock that find_one returns our mock user
    mock_find_one.return_value = {
        "_id": "user-uuid-12345",
        "username": "testci",
        "email": "testci@example.com",
        "hashed_password": hashed_pwd
    }

    response = client.post("/api/auth/login", json={
        "username": "testci",
        "password": "wrongpassword"
    })

    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username/email or password"
