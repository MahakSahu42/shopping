from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_database
from app.models.product import Product, ProductVariant
from app.schemas.product import ProductCreate, ProductResponse

router = APIRouter()


@router.get("")
def list_products(db: Session = Depends(get_database)) -> list[ProductResponse]:
    products = db.scalars(select(Product)).all()
    return [_product_response(product) for product in products]


def _product_response(product: Product) -> ProductResponse:
    return ProductResponse(
        id=product.id,
        title=product.name,
        category=product.category,
        description=product.description,
        image_url=product.image_url,
        additional_images=product.additional_images,
        base_price=product.price_cents / 100,
        variants=product.variants,
    )


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_database),
) -> ProductResponse:
    product = Product(
        name=payload.title,
        category=payload.category,
        description=payload.description,
        image_url=payload.image_url,
        additional_images=payload.additional_images,
        price_cents=round(payload.base_price * 100),
        variants=[ProductVariant(**variant.model_dump()) for variant in payload.variants],
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return _product_response(product)


@router.get("/{product_id}/variants")
def list_product_variants(product_id: int) -> list[dict[str, int]]:
    return []
