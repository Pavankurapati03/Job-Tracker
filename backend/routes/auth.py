from fastapi import APIRouter, HTTPException, status, Depends
from models import UserRegister, UserResponse, User, Token, UserLogin, ProfileUpdate, PasswordChange, AccountDelete
from database import users_collection, jobs_collection, serialize_doc
from auth import get_password_hash, verify_password, create_access_token, get_current_user
import uuid

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=201)
async def register(payload: UserRegister):
    """Register a new user, hashes password, inserts into MongoDB, and returns JWT."""
    username_clean = payload.username.strip()
    email_clean = payload.email.strip().lower()
    
    # Check username
    existing_username = await users_collection.find_one({"username": username_clean})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
        
    # Check email
    existing_email = await users_collection.find_one({"email": email_clean})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    hashed_pwd = get_password_hash(payload.password)
    user_id = str(uuid.uuid4())
    
    new_user = {
        "_id": user_id,
        "username": username_clean,
        "email": email_clean,
        "hashed_password": hashed_pwd
    }
    
    await users_collection.insert_one(new_user)
    
    token = create_access_token(data={"sub": username_clean})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(payload: UserLogin):
    """Authenticate credentials against DB and returns JWT access token."""
    login_id = payload.username.strip()
    
    # Check username or email
    user_doc = await users_collection.find_one({"username": login_id})
    if not user_doc:
        user_doc = await users_collection.find_one({"email": login_id.lower()})
        
    if not user_doc or not verify_password(payload.password, user_doc["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = create_access_token(data={"sub": user_doc["username"]})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Retrieve verified profile metadata for active session."""
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email
    )


@router.put("/profile")
async def update_profile(payload: ProfileUpdate, current_user: User = Depends(get_current_user)):
    """Update username and/or email. Requires current password for verification."""
    # Verify current password
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    update_data = {}

    # Check & update username
    if payload.username and payload.username.strip() != current_user.username:
        username_clean = payload.username.strip()
        existing = await users_collection.find_one({"username": username_clean})
        if existing and str(existing["_id"]) != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        update_data["username"] = username_clean

    # Check & update email
    if payload.email and payload.email.strip().lower() != current_user.email:
        email_clean = payload.email.strip().lower()
        existing = await users_collection.find_one({"email": email_clean})
        if existing and str(existing["_id"]) != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        update_data["email"] = email_clean

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No changes provided"
        )

    await users_collection.update_one(
        {"_id": current_user.id},
        {"$set": update_data}
    )

    # If username changed, issue a new JWT token
    new_username = update_data.get("username", current_user.username)
    new_token = create_access_token(data={"sub": new_username})

    return {
        "message": "Profile updated successfully",
        "access_token": new_token,
        "token_type": "bearer",
        "user": {
            "id": current_user.id,
            "username": update_data.get("username", current_user.username),
            "email": update_data.get("email", current_user.email)
        }
    }


@router.put("/password")
async def change_password(payload: PasswordChange, current_user: User = Depends(get_current_user)):
    """Change account password. Requires current password verification."""
    # Verify current password
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    if len(payload.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters"
        )

    new_hashed = get_password_hash(payload.new_password)
    await users_collection.update_one(
        {"_id": current_user.id},
        {"$set": {"hashed_password": new_hashed}}
    )

    return {"message": "Password changed successfully"}


@router.delete("/account")
async def delete_account(payload: AccountDelete, current_user: User = Depends(get_current_user)):
    """Permanently delete account and all associated jobs. Requires password confirmation."""
    # Verify password
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is incorrect"
        )

    # Delete all jobs belonging to this user
    await jobs_collection.delete_many({"user_id": current_user.id})

    # Delete the user account
    await users_collection.delete_one({"_id": current_user.id})

    return {"message": "Account deleted successfully"}

