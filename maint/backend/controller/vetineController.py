import bleach
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import List, Optional
from controller.Oauth2C import get_current_user
from db.database import get_db
from models.vetrineModels import Product, Order, OrderItem, CartItem, Category, SubCategory
from models.Oauth2Models import User
from schemas.vetrine import CategoryBase, OrederStatus, ProductBase, OrderCreate, CartItemBase, OrderItemBase, OrderBase, ProductResponse, OrderDetail, SubCategoryBase, SubCategoryResponse, CategoryResponse
from crud.vetrineCrud import (
    create_category, delete_category, delete_product, get_categories, get_category_by_id,
    get_products, get_product_by_id, get_product_by_slug, create_product, get_orders, create_order,
    get_cart_items, add_to_cart, remove_from_cart, update_category, update_product, get_order_by_id,
    get_subcategories, get_subcategory_by_id, create_subcategory, update_subcategory, delete_subcategory, get_subcategories_by_category
)
from crud.settingsCrud import get_settings
from controller.sendMail import AdminEmail, send_email
from fastapi import Request
from config.limiter_config import limiter
import os
import subprocess
from datetime import datetime
from fastapi.responses import FileResponse
from fastapi import BackgroundTasks
from db.database import DATABASE_URL

router = APIRouter(
    tags=["Vetrine"]
)

# Role Check - Admin Access
def check_admin(current_user: User = Depends(get_current_user)):
    #if current_user.role != 'admin':
    #    raise HTTPException(status_code=403, detail="Not authorized")
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authorized")

# Route to get all products with filtering options
@router.get("/products", response_model=List[ProductResponse])
def get_all_products(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    subcategory: Optional[str] = None,
    max_price: Optional[float] = None,
    sortBy: Optional[str] = 'popularite',  # Default sortBy value
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return get_products(
        db,
        skip=skip,
        limit=limit,
        category_name=category,
        subcategory_name=subcategory,
        max_price=max_price,
        sortBy=sortBy,
        searchFor=search
    )

# Route to get a single product by ID
@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    db_product = get_product_by_id(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return db_product

@router.get("/products/slug/{product_slug}", response_model=ProductResponse)
def get_product_by_slug_endpoint(product_slug: str , db: Session = Depends(get_db)):
    db_product = get_product_by_slug(db, product_slug)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return db_product

# Route to create a new product
@router.post("/products", response_model=ProductBase, dependencies=[Depends(check_admin)])
def create_new_product(product: ProductBase, db: Session = Depends(get_db)):
    if(not product.category_id):
        raise HTTPException(status_code=400, detail="Category ID is required for product creation.")
    return create_product(db, product)

# Route to update an existing product
@router.put("/products/{product_id}", response_model=ProductBase, dependencies=[Depends(check_admin)])
def update_product_info(product_id: int, product: ProductBase, db: Session = Depends(get_db)):
    updated_product = update_product(db, product_id, product)
    if updated_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated_product

# Route to delete a product
@router.delete("/products/{product_id}", response_model=dict, dependencies=[Depends(check_admin)])
def delete_product_info(product_id: int, db: Session = Depends(get_db)):
    delete_product(db, product_id)
    return {"message": "Product deleted successfully."}

# Route to get all categories
@router.get("/categories", response_model=List[CategoryResponse])
def get_all_categories(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_categories(db, skip=skip, limit=limit)

# Route to get a single category by ID
@router.get("/categories/{category_id}", response_model=CategoryBase)
def get_category(category_id: int, db: Session = Depends(get_db)):
    db_category = get_category_by_id(db, category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

# Route to create a new category
@router.post("/categories", response_model=CategoryBase, dependencies=[Depends(check_admin)])
def create_new_category(category: CategoryBase, db: Session = Depends(get_db)):
    return create_category(db, category)

# Route to update an existing category
@router.put("/categories/{category_id}", response_model=CategoryBase, dependencies=[Depends(check_admin)])
def update_category_info(category_id: int, category: CategoryBase, db: Session = Depends(get_db)):
    updated_category = update_category(db, category_id, category)
    if updated_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return updated_category

# Route to delete a category
@router.delete("/categories/{category_id}", response_model=dict, dependencies=[Depends(check_admin)])
def delete_category_info(category_id: int, db: Session = Depends(get_db)):
    delete_category(db, category_id)
    return {"message": "Category deleted successfully."}

# SubCategory Endpoints

@router.get("/subcategories", response_model=List[SubCategoryResponse])
def get_all_subcategories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    subcategories = get_subcategories(db, skip=skip, limit=limit)
    return subcategories

@router.get("/subcategories/{subcategory_id}", response_model=SubCategoryResponse)
def get_subcategory(subcategory_id: int, db: Session = Depends(get_db)):
    db_subcategory = get_subcategory_by_id(db, subcategory_id)
    if db_subcategory is None:
        raise HTTPException(status_code=404, detail="SubCategory not found")
    return db_subcategory

@router.get("/categories/{category_id}/subcategories", response_model=List[SubCategoryResponse])
def get_subcategories_for_category(category_id: int, db: Session = Depends(get_db)):
    subcategories = get_subcategories_by_category(db, category_id)
    return subcategories

@router.post("/subcategories", response_model=SubCategoryBase, dependencies=[Depends(check_admin)])
def create_new_subcategory(subcategory: SubCategoryBase, db: Session = Depends(get_db)):
    return create_subcategory(db, subcategory)

@router.put("/subcategories/{subcategory_id}", response_model=SubCategoryBase, dependencies=[Depends(check_admin)])
def update_subcategory_info(subcategory_id: int, subcategory: SubCategoryBase, db: Session = Depends(get_db)):
    updated_subcategory = update_subcategory(db, subcategory_id, subcategory)
    if updated_subcategory is None:
        raise HTTPException(status_code=404, detail="SubCategory not found")
    return updated_subcategory

@router.delete("/subcategories/{subcategory_id}", response_model=dict, dependencies=[Depends(check_admin)])
def delete_subcategory_info(subcategory_id: int, db: Session = Depends(get_db)):
    delete_subcategory(db, subcategory_id)
    return {"message": "SubCategory deleted successfully."}

# Route to get orders for a user (use Pydantic schema here)
@router.get("/orders", response_model=List[OrderBase])
def get_user_orders(
    skip: int = 0, limit: int = 10, 
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if current_user.role == "admin":
        return get_orders(db, skip=skip, limit=limit)
    return get_orders(db, skip=skip, limit=limit, user_email=current_user.email)

# Route to get a single order by ID
@router.get("/orders/{order_id}", response_model=OrderDetail)
def get_order_details(
    order_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_order = get_order_by_id(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Allow admins to view any order, but regular users can only view their own orders
    if current_user.role != "admin" and db_order.email != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    
    # Calculate tax and shipping
    subtotal = sum(item.price * item.quantity for item in db_order.items)
    settings = get_settings(db)
    db_order.shipping_cost = settings.shipping_cost if subtotal < settings.free_shipping_threshold else 0
    db_order.tax_amount = subtotal * (settings.tax_rate / 100)
    
    # Ensure article names are populated for all items
    for item in db_order.items:
        if not item.name and item.product:
            item.name = item.product.name
            
    return db_order

# Route to create an order
@router.post("/orders", response_model=OrderBase)
@limiter.limit("5/minute")
def create_new_order(
    request: Request, 
    order_create: OrderCreate,
    db: Session = Depends(get_db),
):
    if not order_create.items:
        raise HTTPException(status_code=400, detail="Order must contain items.")
    
    # Validate that the quantity is positive
    if any(item.quantity <= 0 for item in order_create.items):
        raise HTTPException(status_code=400, detail="Quantity must be a positive number.")
    
    total = sum(item.price * item.quantity for item in order_create.items)
    settings = get_settings(db)
    shipping_cost = settings.shipping_cost if total < settings.free_shipping_threshold else 0
    tax_amount = total * (settings.tax_rate / 100)
    # Calculate total amount
    total_amount = total + shipping_cost + tax_amount
    
    return create_order(db,order_create=order_create, total_amount=total_amount)
# Update Order Status
@router.put("/orders/orderStatus/{order_id}", response_model=OrderBase)
def update_order_status(
    order_id: int, order_update: OrederStatus, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    db_order.status = order_update.status
    db.commit()
    db.refresh(db_order)
    return db_order
    raise credentials_exception

#update Order
@router.put("/orders/{order_id}", response_model=OrderBase)
def update_order_info(
    order_id: int,
    order_update: OrderBase, 
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
    ):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    db_order.status = order_update.status
    db.commit()
    db.refresh(db_order)
    db_order.status = order_update.status
    db.commit()
    db.refresh(db_order)
    return db_order

@router.delete("/orders/{order_id}", response_model=dict, dependencies=[Depends(check_admin)])
def delete_order_endpoint(order_id: int, db: Session = Depends(get_db)):
    # Assuming delete_order is imported or available in crud
    from crud.vetrineCrud import delete_order
    delete_order(db, order_id)
    return {"message": "Order deleted successfully"}

# Route to get cart items for a user
@router.get("/cart", response_model=List[CartItemBase])
def get_user_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_cart_items(db, user_id=current_user.id)

# Route to add item to the cart
@router.post("/cart", response_model=CartItemBase)
def add_item_to_cart(
    cart_item: CartItemBase, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    product = db.query(Product).filter(Product.id == cart_item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Ensure there's enough stock
    if product.stock_quantity < cart_item.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock for this product.")
    
    return add_to_cart(db, user_id=current_user.id, cart_item=cart_item)

# Route to remove item from the cart
@router.delete("/cart/{cart_item_id}", response_model=dict)
def remove_item_from_cart(
    cart_item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    db_cart_item = db.query(CartItem).filter(CartItem.id == cart_item_id, CartItem.user_id == current_user.id).first()
    if not db_cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    remove_from_cart(db, user_id=current_user.id, cart_item_id=cart_item_id)
    return {"message": "Item removed from cart successfully."}

@router.get("/orders/orderCode/{order_code}", response_model=OrderDetail)
def get_order_by_code(
    order_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_order = db.query(Order).filter(Order.code == order_code).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Allow admins to view any order, but regular users can only view their own orders
    if current_user.role != "admin" and db_order.email != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
        
    # Calculate tax and shipping
    subtotal = sum(item.price * item.quantity for item in db_order.items)
    settings = get_settings(db)
    db_order.shipping_cost = settings.shipping_cost if subtotal < settings.free_shipping_threshold else 0
    db_order.tax_amount = subtotal * (settings.tax_rate / 100)
    
    # Ensure article names are populated for all items
    for item in db_order.items:
        if not item.name and item.product:
            item.name = item.product.name
            
    return db_order
# subscribe to newsletter sending emil and return 201
class Newsletter(BaseModel):
    email: str

@router.post("/subscribe_to_newsletter", response_model=dict)
@limiter.limit("3/minute")
def subscribe_to_newsletter(request: Request, newsletter: Newsletter):
    email = newsletter.email
    try:
        send_email(
            subject="Apiculture Newsletter Subscription",
            body=f"{email} has subscribed to the Apiculture newsletter.",
            to_email=AdminEmail
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send subscription email.")
    
    return {"message": "Successfully subscribed to the newsletter."}

# Contact Form
class contactRequest(BaseModel):
    name: str
    email: EmailStr
    sujet: str
    message: str

@router.post("/support-contact", response_model=dict)
@limiter.limit("3/minute")
def contact_form(request: Request, contact_form: contactRequest):
    if not contact_form.name or not contact_form.email or not contact_form.sujet or not contact_form.message:
        raise HTTPException(status_code=400, detail="All fields are required.")
    
    # Sanitize inputs
    name = bleach.clean(contact_form.name)
    sujet = bleach.clean(contact_form.sujet)
    message = bleach.clean(contact_form.message)
    
    try:
        send_email(
            subject="Apiculture Contact Message",
            body=f"Name: {name}\nEmail: {contact_form.email}\nSujet: {sujet}\nMessage: {message}",
            to_email=AdminEmail,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send contact message.")
    
    return {"message": "Successfully sent the message."}

# Database Export
@router.get("/settings/export", dependencies=[Depends(check_admin)])
def export_database(background_tasks: BackgroundTasks):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"backup_{timestamp}.sql"
    filepath = f"/tmp/{filename}"

    # Construct pg_dump command
    command = f"pg_dump {DATABASE_URL} > {filepath}"
    
    try:
        # Run pg_dump
        subprocess.run(command, shell=True, check=True)
        
        # Schedule file deletion after response
        background_tasks.add_task(os.remove, filepath)
        
        return FileResponse(
            path=filepath,
            filename=filename,
            media_type='application/sql',
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Database export failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
