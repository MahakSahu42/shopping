from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
    title: str
    category: str
    description: str | None = None
    image_url: str
    additional_images: list[str] = Field(default_factory=list)
    base_price: float
    variants: list["ProductVariantCreate"] = Field(default_factory=list)


class ProductVariantCreate(BaseModel):
    size: str
    color: str
    stock: int = 0
    sku: str


class ProductVariantResponse(ProductVariantCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ProductResponse(ProductCreate):
    id: int
    variants: list[ProductVariantResponse]

    model_config = ConfigDict(from_attributes=True)
