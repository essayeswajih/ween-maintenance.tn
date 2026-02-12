from urllib.parse import unquote
from sqlalchemy import asc, desc, func, or_
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from models.vetrineModels import OrderStatus, Product, Order, OrderItem, CartItem, Category, SubCategory
from schemas.vetrine import CategoryBase, ProductBase, OrderCreate, CartItemBase, OrderItemBase, SubCategoryBase
from datetime import datetime
from fastapi import HTTPException
from random import randint

from controller.sendMail import send_email
from utils.auth import getSlug

# CRUD operations for Product
def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category_name: Optional[str] = None,
    subcategory_name: Optional[str] = None,
    max_price: Optional[float] = None,
    sortBy: Optional[str] = 'popularite',
    searchFor: Optional[str] = None
) -> List[Product]:
    query = db.query(Product).options(joinedload(Product.category), joinedload(Product.subcategory))

    # Filter by category if category_name is provided (except "tous")
    if category_name and category_name.lower() != "tous":
        category = db.query(Category).filter(func.lower(Category.name) == category_name.lower()).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        query = query.filter(Product.category_id == category.id)

    # Filter by subcategory if subcategory_name is provided (except "tous")
    if subcategory_name and subcategory_name.lower() != "tous":
        subcategory = db.query(SubCategory).filter(func.lower(SubCategory.name) == subcategory_name.lower()).first()
        if not subcategory:
            raise HTTPException(status_code=404, detail="SubCategory not found")
        query = query.filter(Product.subcategory_id == subcategory.id)

    # Filter by price if max_price is provided
    if max_price:
        query = query.filter(Product.price <= max_price)

    if searchFor and searchFor.strip():
        search_query = f"%{searchFor.strip()}%"
        query = query.filter(
            Product.name.ilike(search_query) |
            Product.description.ilike(search_query)
        )

    # Apply sorting
    if sortBy == 'prix-asc':
        query = query.order_by(asc(Product.price))
    elif sortBy == 'prix-desc':
        query = query.order_by(desc(Product.price))
    elif sortBy == 'popularite':
        query = query.order_by(desc(Product.num_ratings))  # Using num_ratings for popularity
    else:
        query = query.order_by(asc(Product.id))

    # Apply pagination
    query = query.offset(skip).limit(limit)
    products = query.all()
    
    return products

def get_product_by_id(db: Session, product_id: int) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()
def get_product_by_slug(db: Session, product_slug: str) -> Optional[Product]:
    return db.query(Product).filter(Product.slug == unquote(product_slug)).first()

def create_product(db: Session, product: ProductBase) -> Product:
    db_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        stock_quantity=product.stock_quantity,
        in_stock=product.in_stock if product.in_stock is not None else True,
        category_id=product.category_id,
        subcategory_id=product.subcategory_id,
        discounted_price=product.discounted_price,
        image_url=product.image_url,
        image2_url=product.image2_url,
        image3_url=product.image3_url,
        image4_url=product.image4_url,
        promo=product.promo,
        buzzent=product.buzzent,
        rating=product.rating,
        num_ratings=product.num_ratings,
        # Optional frontend fields
        sizes=product.sizes,
        colors=product.colors,
        materials=product.materials,
        care=product.care,
        features=product.features,
        sku=product.sku,
        slug=getSlug(product.name)
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
def update_product(db: Session, product_id: int, product: ProductBase) -> Optional[Product]:
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        return None

    db_product.name = product.name
    db_product.description = product.description
    db_product.price = product.price
    db_product.stock_quantity = product.stock_quantity
    db_product.in_stock = product.in_stock if product.in_stock is not None else db_product.in_stock
    db_product.category_id = product.category_id
    db_product.subcategory_id = product.subcategory_id
    db_product.discounted_price = product.discounted_price
    db_product.image_url = product.image_url
    db_product.image2_url = product.image2_url
    db_product.image3_url = product.image3_url
    db_product.image4_url = product.image4_url
    db_product.promo = product.promo
    db_product.buzzent = product.buzzent
    db_product.rating = product.rating
    db_product.num_ratings = product.num_ratings
    # Optional frontend fields
    db_product.sizes = product.sizes
    db_product.colors = product.colors
    db_product.materials = product.materials
    db_product.care = product.care
    db_product.features = product.features
    db_product.sku = product.sku
    db_product.slug=getSlug(product.name)

    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int) -> None:
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="Product not found")
    
# CRUD operations for Category

# Get all categories
def get_categories(db: Session, skip: int = 0, limit: int = 10) -> List[Category]:
    return db.query(Category).options(joinedload(Category.subcategories)).offset(skip).limit(limit).all()

# Get a category by ID
def get_category_by_id(db: Session, category_id: int) -> Category:
    return db.query(Category).filter(Category.id == category_id).first()

# Create a new category
def create_category(db: Session, category: CategoryBase) -> Category:
    db_category = Category(name=category.name,description=category.description,image_url=category.image_url)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# Update an existing category
def update_category(db: Session, category_id: int, category: CategoryBase) -> Category:
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category:
        db_category.name = category.name
        db_category.description = category.description
        db_category.image_url = category.image_url  
        db.commit()
        db.refresh(db_category)
        return db_category
    return None

# Delete a category
def delete_category(db: Session, category_id: int) -> None:
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category:
        db.delete(db_category)
        db.commit()
    
# CRUD operations for SubCategory

def get_subcategories(db: Session, skip: int = 0, limit: int = 100) -> List[SubCategory]:
    return db.query(SubCategory).offset(skip).limit(limit).all()

def get_subcategory_by_id(db: Session, subcategory_id: int) -> Optional[SubCategory]:
    return db.query(SubCategory).filter(SubCategory.id == subcategory_id).first()

def get_subcategories_by_category(db: Session, category_id: int) -> List[SubCategory]:
    return db.query(SubCategory).filter(SubCategory.category_id == category_id).all()

def create_subcategory(db: Session, subcategory: SubCategoryBase) -> SubCategory:
    db_subcategory = SubCategory(
        name=subcategory.name,
        description=subcategory.description,
        image_url=subcategory.image_url,
        category_id=subcategory.category_id,
        slug=getSlug(subcategory.name)
    )
    db.add(db_subcategory)
    db.commit()
    db.refresh(db_subcategory)
    return db_subcategory

def update_subcategory(db: Session, subcategory_id: int, subcategory: SubCategoryBase) -> Optional[SubCategory]:
    db_subcategory = db.query(SubCategory).filter(SubCategory.id == subcategory_id).first()
    if not db_subcategory:
        return None
    db_subcategory.name = subcategory.name
    db_subcategory.description = subcategory.description
    db_subcategory.image_url = subcategory.image_url
    db_subcategory.category_id = subcategory.category_id
    db_subcategory.slug = getSlug(subcategory.name)
    db.commit()
    db.refresh(db_subcategory)
    return db_subcategory

def delete_subcategory(db: Session, subcategory_id: int) -> None:
    db_subcategory = db.query(SubCategory).filter(SubCategory.id == subcategory_id).first()
    if db_subcategory:
        db.delete(db_subcategory)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="SubCategory not found")

# CRUD operations for Order
def get_orders(db: Session, skip: int = 0, limit: int = 10, user_email: Optional[str] = None) -> List[Order]:
    if skip < 0 or limit <= 0:
        raise HTTPException(status_code=400, detail="Invalid pagination parameters.")
    
    query = db.query(Order).options(joinedload(Order.items))
    if user_email:
        query = query.filter(Order.email == user_email)
        
    return query.order_by(desc(Order.created_at)).offset(skip).limit(limit).all()

def get_order_by_id(db: Session, order_id: int) -> Optional[Order]:
    return db.query(Order).filter(Order.id == order_id).first()

def delete_order(db: Session, order_id: int) -> None:
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        db.delete(db_order)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="Order not found")

def create_order(db: Session, order_create: OrderCreate, total_amount: float) -> Order:
    # Validate items list
    if not order_create.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item.")

    # Validate products and stock before creating the order
    for item in order_create.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with ID {item.product_id} not found.")
        if item.quantity <= 0:
            raise HTTPException(status_code=400, detail=f"Quantity for product {product.name} must be positive.")
    # Create the order
    order = Order(
        total_amount=total_amount,
        status=OrderStatus.PENDING,  # Use enum value directly
        created_at=datetime.utcnow(),
        username=order_create.username,
        email=order_create.email,
        telephone=order_create.telephone,
        location=order_create.location,
        payment_method=order_create.payment_method,
        payed= "check",  # Default to false, can be updated later
        code = str(randint(10000, 99999))  + "-" + str(randint(10000, 99999)) + "-" + str(randint(10000, 99999)) + "-" + str(randint(10000, 99999))  # Generate a random code for the order
    )
    db.add(order)
    db.flush()  # Get order.id without committing yet

    # Create order items and update stock
    for item in order_create.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price,
            name=product.name if product else None,
            color = item.color,
            size = item.size
        )
        db.add(order_item)
        product.stock_quantity -= item.quantity  # Update stock

    # Commit all changes at once
    db.commit()
    db.refresh(order)
    html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>Confirmation de commande</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f6f6f6;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
            <td align="center" style="padding:30px 15px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                
                <!-- Header -->
                <tr>
                    <td style="padding:24px;text-align:center;border-bottom:1px solid #eeeeee;">
                    <h1 style="margin:0;color:#000;font-size:24px;">Roséa</h1>
                    </td>
                </tr>

                <!-- Content -->
                <tr>
                    <td style="padding:24px;color:#333;font-size:14px;line-height:1.6;">
                    <p>Bonjour,</p>

                    <p>
                        Merci pour votre commande <strong>{order.code}</strong>.<br>
                        Votre commande sera traitée rapidement.
                    </p>

                    <table width="100%" cellpadding="8" cellspacing="0" style="background:#fafafa;border-radius:6px;margin:16px 0;">
                        <tr>
                        <td><strong>Montant total</strong></td>
                        <td align="right">{order.total_amount} TND</td>
                        </tr>
                        <tr>
                        <td><strong>Statut</strong></td>
                        <td align="right">{order.status}</td>
                        </tr>
                    </table>

                    <p style="text-align:center;margin:24px 0;">
                        <a href="https://rosea.tn/order/{order.code}"
                        style="background:#000;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;display:inline-block;">
                        Suivre ma commande
                        </a>
                    </p>

                    <p>
                        Cordialement,<br>
                        <strong>Roséa Team</strong>
                    </p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="padding:16px;text-align:center;font-size:12px;color:#888;border-top:1px solid #eeeeee;">
                    © {2026} Roséa — Tous droits réservés
                    </td>
                </tr>

                </table>
            </td>
            </tr>
        </table>
        </body>
        </html>
        """

    # send_email
    try:
        send_email(
            to_email=order.email,
            subject="Confirmation de commande",
            body=(
                html_body
            )
        )
    except Exception as e:
        print(f"Error sending email: {e}")
    return order

# CRUD operations for CartItem
def get_cart_items(db: Session, user_id: int) -> List[CartItem]:
    return db.query(CartItem).filter(CartItem.user_id == user_id).all()

def add_to_cart(db: Session, cart_item: CartItemBase) -> CartItem:
    # Check if product exists
    product = db.query(Product).filter(Product.id == cart_item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    # Check if product stock is sufficient
    if cart_item.quantity > product.stock_quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock.")
    
    db_cart_item = CartItem( product_id=cart_item.product_id, quantity=cart_item.quantity)
    db.add(db_cart_item)
    db.commit()
    db.refresh(db_cart_item)
    return db_cart_item

def remove_from_cart(db: Session, user_id: int, cart_item_id: int) -> None:
    db_cart_item = db.query(CartItem).filter(CartItem.id == cart_item_id, CartItem.user_id == user_id).first()
    if not db_cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found.")
    
    db.delete(db_cart_item)
    db.commit()
