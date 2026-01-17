from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
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
db = client[os.environ.get('DB_NAME', 'oriani_database')]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', 'default_secret_key_change_me')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
ACCESS_TOKEN_EXPIRE = int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES', 1440))

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Mount static files
app.mount("/static", StaticFiles(directory=ROOT_DIR / "static"), name="static")

# Templates
templates = Jinja2Templates(directory=ROOT_DIR / "templates")

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

# ============= CATEGORIES =============
CATEGORIES = [
    "Elétrica",
    "Hidráulica",
    "Pintura",
    "Montagem de Móveis",
    "Instalações",
    "Alvenaria e Drywall"
]

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

def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email = verify_token(credentials.credentials)
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

async def get_current_user_from_cookie(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        return None
    email = verify_token(token)
    if email is None:
        return None
    user = await db.users.find_one({"email": email}, {"_id": 0})
    return user

# ============= API AUTH ROUTES =============
@api_router.post("/auth/login", response_model=Token)
async def api_login(user_data: UserLogin):
    admin_email = os.environ.get('ADMIN_EMAIL')
    admin_password = os.environ.get('ADMIN_PASSWORD')
    
    if not admin_email or not admin_password:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Admin credentials not configured"
        )
    
    if user_data.email != admin_email or user_data.password != admin_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
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

# ============= API ALBUM ROUTES =============
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
    await db.photos.delete_many({"album_id": album_id})
    return {"message": "Album deleted successfully"}

# ============= API PHOTO ROUTES =============
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
    album = await db.albums.find_one({"id": album_id}, {"_id": 0})
    if not album:
        raise HTTPException(status_code=404, detail="Álbum não encontrado")
    
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Apenas imagens JPG, PNG ou WEBP são permitidas")
    
    contents = await file.read()
    
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="A imagem deve ter no máximo 5MB")
    
    image_base64 = base64.b64encode(contents).decode('utf-8')
    mime_type = file.content_type
    
    photo_obj = Photo(
        album_id=album_id,
        title=title,
        description=description,
        image_data=f"data:{mime_type};base64,{image_base64}"
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

# ============= API PUBLIC ROUTES =============
@api_router.get("/")
async def api_root():
    return {"message": "Oriani Multissoluções API"}

@api_router.get("/categories")
async def get_categories():
    return {"categories": CATEGORIES}

# Include API router
app.include_router(api_router)

# ============= PAGE ROUTES (HTML) =============
@app.get("/", response_class=HTMLResponse)
async def home_page(request: Request):
    albums = await db.albums.find({}, {"_id": 0}).to_list(1000)
    photos = await db.photos.find({}, {"_id": 0}).to_list(1000)
    return templates.TemplateResponse("home.html", {
        "request": request,
        "albums": albums,
        "photos": photos[:8],
        "categories": CATEGORIES
    })

@app.get("/galeria", response_class=HTMLResponse)
@app.get("/galeria/{category}", response_class=HTMLResponse)
async def gallery_page(request: Request, category: str = None):
    albums = await db.albums.find({}, {"_id": 0}).to_list(1000)
    photos = await db.photos.find({}, {"_id": 0}).to_list(1000)
    
    if category:
        album_ids = [a['id'] for a in albums if a.get('category') == category]
        filtered_photos = [p for p in photos if p.get('album_id') in album_ids]
    else:
        filtered_photos = photos
    
    return templates.TemplateResponse("gallery.html", {
        "request": request,
        "albums": albums,
        "photos": filtered_photos,
        "categories": CATEGORIES,
        "current_category": category
    })

@app.get("/servicos/{service_name}", response_class=HTMLResponse)
async def service_page(request: Request, service_name: str):
    albums = await db.albums.find({"category": service_name}, {"_id": 0}).to_list(100)
    album_ids = [a['id'] for a in albums]
    photos = await db.photos.find({"album_id": {"$in": album_ids}}, {"_id": 0}).to_list(100)
    
    return templates.TemplateResponse("service.html", {
        "request": request,
        "service_name": service_name,
        "albums": albums,
        "photos": photos,
        "categories": CATEGORIES
    })

@app.get("/orcamento", response_class=HTMLResponse)
async def orcamento_page(request: Request):
    return templates.TemplateResponse("orcamento.html", {
        "request": request,
        "categories": CATEGORIES
    })

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    user = await get_current_user_from_cookie(request)
    if user:
        return RedirectResponse(url="/admin", status_code=302)
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
async def login_submit(request: Request, response: Response):
    form_data = await request.form()
    email = form_data.get("email")
    password = form_data.get("password")
    
    admin_email = os.environ.get('ADMIN_EMAIL')
    admin_password = os.environ.get('ADMIN_PASSWORD')
    
    if email != admin_email or password != admin_password:
        return templates.TemplateResponse("login.html", {
            "request": request,
            "error": "Email ou senha incorretos"
        })
    
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
    
    response = RedirectResponse(url="/admin", status_code=302)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE * 60,
        samesite="lax"
    )
    return response

@app.get("/logout")
async def logout(response: Response):
    response = RedirectResponse(url="/", status_code=302)
    response.delete_cookie("access_token")
    return response

@app.get("/admin", response_class=HTMLResponse)
async def admin_page(request: Request):
    user = await get_current_user_from_cookie(request)
    if not user:
        return RedirectResponse(url="/login", status_code=302)
    
    albums = await db.albums.find({}, {"_id": 0}).to_list(1000)
    photos = await db.photos.find({}, {"_id": 0}).to_list(1000)
    
    return templates.TemplateResponse("admin.html", {
        "request": request,
        "user": user,
        "albums": albums,
        "photos": photos,
        "categories": CATEGORIES
    })

# Admin form handlers
@app.post("/admin/album/create")
async def admin_create_album(request: Request):
    user = await get_current_user_from_cookie(request)
    if not user:
        return RedirectResponse(url="/login", status_code=302)
    
    form_data = await request.form()
    album_obj = Album(
        name=form_data.get("name"),
        description=form_data.get("description"),
        category=form_data.get("category")
    )
    doc = album_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.albums.insert_one(doc)
    
    return RedirectResponse(url="/admin", status_code=302)

@app.post("/admin/album/edit/{album_id}")
async def admin_edit_album(request: Request, album_id: str):
    user = await get_current_user_from_cookie(request)
    if not user:
        return RedirectResponse(url="/login", status_code=302)
    
    form_data = await request.form()
    update_data = {
        "name": form_data.get("name"),
        "description": form_data.get("description"),
        "category": form_data.get("category")
    }
    await db.albums.update_one({"id": album_id}, {"$set": update_data})
    
    return RedirectResponse(url="/admin", status_code=302)

@app.post("/admin/album/delete/{album_id}")
async def admin_delete_album(request: Request, album_id: str):
    user = await get_current_user_from_cookie(request)
    if not user:
        return RedirectResponse(url="/login", status_code=302)
    
    await db.albums.delete_one({"id": album_id})
    await db.photos.delete_many({"album_id": album_id})
    
    return RedirectResponse(url="/admin", status_code=302)

@app.post("/admin/photo/upload")
async def admin_upload_photo(request: Request):
    user = await get_current_user_from_cookie(request)
    if not user:
        return RedirectResponse(url="/login", status_code=302)
    
    form_data = await request.form()
    album_id = form_data.get("album_id")
    title = form_data.get("title")
    description = form_data.get("description", "")
    file = form_data.get("file")
    
    if file and file.filename:
        contents = await file.read()
        if len(contents) <= 5 * 1024 * 1024:
            image_base64 = base64.b64encode(contents).decode('utf-8')
            mime_type = file.content_type or "image/jpeg"
            
            photo_obj = Photo(
                album_id=album_id,
                title=title,
                description=description,
                image_data=f"data:{mime_type};base64,{image_base64}"
            )
            doc = photo_obj.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await db.photos.insert_one(doc)
    
    return RedirectResponse(url="/admin", status_code=302)

@app.post("/admin/photo/delete/{photo_id}")
async def admin_delete_photo(request: Request, photo_id: str):
    user = await get_current_user_from_cookie(request)
    if not user:
        return RedirectResponse(url="/login", status_code=302)
    
    await db.photos.delete_one({"id": photo_id})
    
    return RedirectResponse(url="/admin", status_code=302)

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
