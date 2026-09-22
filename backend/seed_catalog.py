from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.product import Product, ProductVariant


CATALOG = [
    {
        "title": "Chanderi Silk Festive Kurta Set",
        "category": "Kurtas",
        "description": "Handcrafted Chanderi silk kurta with delicate zardozi detailing and matching trousers.",
        "base_price": 2899.00,
        "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
        "variants": [
            {"size": "S", "color": "Maroon", "stock": 8, "sku": "KRT-MRN-S"},
            {"size": "M", "color": "Maroon", "stock": 12, "sku": "KRT-MRN-M"},
            {"size": "L", "color": "Maroon", "stock": 6, "sku": "KRT-MRN-L"},
        ],
    },
    {
        "title": "Banarasi Kanjivaram Blend Saree",
        "category": "Sarees",
        "description": "Rich woven border saree in royal bottle green with unstitched blouse piece.",
        "base_price": 4599.00,
        "image_url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb",
        "variants": [
            {"size": "Free Size", "color": "Emerald Green", "stock": 15, "sku": "SAR-GRN-FS"},
        ],
    },
    {
        "title": "Aesthetic Ribbed Bodycon Dress",
        "category": "Dresses",
        "description": "Slim-fit long-sleeve knit dress in midnight blue.",
        "base_price": 1499.00,
        "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
        "variants": [
            {"size": "S", "color": "Navy Blue", "stock": 10, "sku": "DRS-BLU-S"},
            {"size": "M", "color": "Navy Blue", "stock": 15, "sku": "DRS-BLU-M"},
        ],
    },
    {
        "title": "Pure Cotton Oversized Graphic T-Shirt",
        "category": "T-Shirts",
        "description": "240 GSM heavy combed cotton boxy tee in vintage off-white.",
        "base_price": 799.00,
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
        "variants": [
            {"size": "M", "color": "Off-White", "stock": 25, "sku": "TEE-WHT-M"},
            {"size": "L", "color": "Off-White", "stock": 30, "sku": "TEE-WHT-L"},
        ],
    },
    {
        "title": "Relaxed Fit Linen Casual Shirt",
        "category": "Shirts",
        "description": "Breathable 100% linen Cuban collar shirt in soft olive green.",
        "base_price": 1899.00,
        "image_url": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
        "variants": [
            {"size": "M", "color": "Olive", "stock": 14, "sku": "SHR-OLV-M"},
            {"size": "L", "color": "Olive", "stock": 18, "sku": "SHR-OLV-L"},
        ],
    },
]


with SessionLocal() as db:
    created = 0
    skipped = 0
    for item in CATALOG:
        existing_sku = db.scalar(
            select(ProductVariant.id).where(
                ProductVariant.sku == item["variants"][0]["sku"]
            )
        )
        if existing_sku is not None:
            skipped += 1
            continue

        product = Product(
            name=item["title"],
            category=item["category"],
            description=item["description"],
            image_url=item["image_url"],
            additional_images=[],
            price_cents=round(item["base_price"] * 100),
            variants=[ProductVariant(**variant) for variant in item["variants"]],
        )
        db.add(product)
        created += 1

    db.commit()
    print(f"Created {created} products; skipped {skipped} existing products.")
