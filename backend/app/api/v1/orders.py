from fastapi import APIRouter, Depends

from app.api.deps import get_current_user_id

router = APIRouter()


@router.post("")
def create_order(user_id: str = Depends(get_current_user_id)) -> dict[str, str]:
    return {"status": "created", "user_id": user_id}


@router.post("/checkout")
def create_checkout_session(user_id: str = Depends(get_current_user_id)) -> dict[str, str]:
    return {"status": "pending", "user_id": user_id}
