from sqlalchemy import JSON, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    category: Mapped[str] = mapped_column(String(128), index=True)
    description: Mapped[str | None]
    image_url: Mapped[str]
    additional_images: Mapped[list[str]] = mapped_column(JSON, default=list)
    price_cents: Mapped[int]
    variants: Mapped[list["ProductVariant"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    size: Mapped[str] = mapped_column(String(64))
    color: Mapped[str] = mapped_column(String(64))
    stock: Mapped[int] = mapped_column(default=0)
    sku: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    product: Mapped[Product] = relationship(back_populates="variants")
