from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SECRET_KEY, FRONTEND_URL
from app.db.database import async_session
from app.models.models import User
from itsdangerous import URLSafeTimedSerializer
import httpx

router = APIRouter(prefix="/api/auth", tags=["auth"])

serializer = URLSafeTimedSerializer(SECRET_KEY)

oauth = OAuth()
oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


def create_token(user_id: str) -> str:
    return serializer.dumps({"user_id": user_id}, salt="auth-token")


def verify_token(token: str) -> dict | None:
    try:
        data = serializer.loads(token, salt="auth-token", max_age=86400 * 7)  # 7 days
        return data
    except Exception:
        return None


@router.get("/login")
async def login(request: Request):
    redirect_uri = request.url_for("auth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/callback")
async def auth_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")

    if not user_info:
        raise HTTPException(status_code=400, detail="Failed to get user info from Google")

    async with async_session() as session:
        stmt = select(User).where(User.email == user_info["email"])
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            user = User(
                email=user_info["email"],
                name=user_info.get("name", ""),
                picture=user_info.get("picture"),
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)

    auth_token = create_token(user.id)
    redirect_url = f"{FRONTEND_URL}/auth/callback?token={auth_token}"
    return RedirectResponse(url=redirect_url)


@router.get("/me")
async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = auth_header.split(" ")[1]
    data = verify_token(token)
    if not data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    async with async_session() as session:
        stmt = select(User).where(User.id == data["user_id"])
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"id": user.id, "email": user.email, "name": user.name, "picture": user.picture}
