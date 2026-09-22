from fastapi import APIRouter

router = APIRouter()


@router.post("/payments")
def handle_payment_event(payload: dict) -> dict[str, str]:
    return {"status": "received"}
