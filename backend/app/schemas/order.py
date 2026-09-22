from pydantic import BaseModel


class OrderCreate(BaseModel):
    product_id: int
    quantity: int = 1


class OrderResponse(BaseModel):
    id: int
    status: str
