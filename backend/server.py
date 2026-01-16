from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import os
import logging
import uuid
import base64
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
JWT_SECRET = os.environ['JWT_SECRET_KEY']
JWT_ALGORITHM = os.environ['JWT_ALGORITHM']
ACCESS_TOKEN_EXPIRE = int(os.environ['ACCESS_TOKEN_EXPIRE_MINUTES'])

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============= MODELS =============
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Album(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    category: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AlbumCreate(BaseModel):
    name: str
    description: str
    category: str

class Photo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    album_id: str
    title: str
    description: Optional[str] = ""
    image_data: str  # base64 encoded image
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PhotoCreate(BaseModel):
    album_id: str
    title: str
    description: Optional[str] = ""

# ============= AUTH FUNCTIONS =============
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if user is None:
        raise credentials_exception
    return user

# ============= AUTH ROUTES =============
@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    # Verificar credenciais contra variáveis de ambiente
    admin_email = os.environ.get('ADMIN_EMAIL')
    admin_password = os.environ.get('ADMIN_PASSWORD')
    
    if not admin_email or not admin_password:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Admin credentials not configured"
        )
    
    # Validar email e senha
    if user_data.email != admin_email or user_data.password != admin_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Criar ou atualizar usuário admin no banco
    existing_user = await db.users.find_one({"email": admin_email}, {"_id": 0})
    if not existing_user:
        user_obj = User(
            email=admin_email,
            password_hash=get_password_hash(admin_password)
        )
        doc = user_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.users.insert_one(doc)
    
    access_token = create_access_token(data={"sub": admin_email})
    return {"access_token": access_token, "token_type": "bearer"}

# ============= ALBUM ROUTES =============
@api_router.get("/albums", response_model=List[Album])
async def get_albums():
    albums = await db.albums.find({}, {"_id": 0}).to_list(1000)
    for album in albums:
        if isinstance(album['created_at'], str):
            album['created_at'] = datetime.fromisoformat(album['created_at'])
    return albums

@api_router.get("/albums/{album_id}", response_model=Album)
async def get_album(album_id: str):
    album = await db.albums.find_one({"id": album_id}, {"_id": 0})
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    if isinstance(album['created_at'], str):
        album['created_at'] = datetime.fromisoformat(album['created_at'])
    return album

@api_router.post("/albums", response_model=Album)
async def create_album(album_data: AlbumCreate, current_user: dict = Depends(get_current_user)):
    album_obj = Album(**album_data.model_dump())
    doc = album_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.albums.insert_one(doc)
    return album_obj

@api_router.put("/albums/{album_id}", response_model=Album)
async def update_album(album_id: str, album_data: AlbumCreate, current_user: dict = Depends(get_current_user)):
    result = await db.albums.find_one({"id": album_id}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=404, detail="Album not found")
    
    update_data = album_data.model_dump()
    await db.albums.update_one({"id": album_id}, {"$set": update_data})
    
    updated_album = await db.albums.find_one({"id": album_id}, {"_id": 0})
    if isinstance(updated_album['created_at'], str):
        updated_album['created_at'] = datetime.fromisoformat(updated_album['created_at'])
    return updated_album

@api_router.delete("/albums/{album_id}")
async def delete_album(album_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.albums.delete_one({"id": album_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Album not found")
    
    # Delete all photos in this album
    await db.photos.delete_many({"album_id": album_id})
    return {"message": "Album deleted successfully"}

# ============= PHOTO ROUTES =============
@api_router.get("/photos", response_model=List[Photo])
async def get_photos(album_id: Optional[str] = None):
    query = {"album_id": album_id} if album_id else {}
    photos = await db.photos.find(query, {"_id": 0}).to_list(1000)
    for photo in photos:
        if isinstance(photo['created_at'], str):
            photo['created_at'] = datetime.fromisoformat(photo['created_at'])
    return photos

@api_router.get("/photos/{photo_id}", response_model=Photo)
async def get_photo(photo_id: str):
    photo = await db.photos.find_one({"id": photo_id}, {"_id": 0})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    if isinstance(photo['created_at'], str):
        photo['created_at'] = datetime.fromisoformat(photo['created_at'])
    return photo

@api_router.post("/photos/upload")
async def upload_photo(
    album_id: str = Form(...),
    title: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    # Verify album exists
    album = await db.albums.find_one({"id": album_id}, {"_id": 0})
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    
    # Read and encode image
    contents = await file.read()
    image_base64 = base64.b64encode(contents).decode('utf-8')
    
    # Create photo
    photo_obj = Photo(
        album_id=album_id,
        title=title,
        description=description,
        image_data=f"data:image/jpeg;base64,{image_base64}"
    )
    doc = photo_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.photos.insert_one(doc)
    
    return photo_obj

@api_router.put("/photos/{photo_id}", response_model=Photo)
async def update_photo(photo_id: str, title: str = Form(...), description: str = Form(""), current_user: dict = Depends(get_current_user)):
    result = await db.photos.find_one({"id": photo_id}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    await db.photos.update_one({"id": photo_id}, {"$set": {"title": title, "description": description}})
    
    updated_photo = await db.photos.find_one({"id": photo_id}, {"_id": 0})
    if isinstance(updated_photo['created_at'], str):
        updated_photo['created_at'] = datetime.fromisoformat(updated_photo['created_at'])
    return updated_photo

@api_router.delete("/photos/{photo_id}")
async def delete_photo(photo_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.photos.delete_one({"id": photo_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"message": "Photo deleted successfully"}

# ============= PUBLIC ROUTES =============
@api_router.get("/")
async def root():
    return {"message": "Oriani Multissoluções API"}

@api_router.get("/categories")
async def get_categories():
    return {
        "categories": [
            "Elétrica",
            "Hidráulica",
            "Pintura",
            "Montagem de Móveis",
            "Instalações"
        ]
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
