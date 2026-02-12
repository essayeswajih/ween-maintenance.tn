export interface User {
    id: number
    username: string
    full_name?: string
    email: string
    phone?: string
    role: string
    two_factor_enabled?: number
}

export interface AuthResponse {
    message: string
    user: User
}

export interface ApiError {
    detail: string | { msg: string }[]
}

export interface Product {
    id: number
    name: string
    description?: string
    price: number
    discounted_price?: number
    stock_quantity: number
    in_stock: boolean
    category_id: number
    image_url?: string
    image2_url?: string
    image3_url?: string
    image4_url?: string
    promo: boolean
    rating?: number
    num_ratings?: number
    slug: string
    features?: string[]
    materials?: string[]
    sku?: string
    category?: string
    category_name?: string
    subcategory_id?: number
    subcategory_name?: string
}

export interface ServiceCategory {
    id: number
    name: string
    description?: string
    image_url?: string
    slug: string
}

export interface Service {
    id: number
    name: string
    slug: string
    description?: string
    price: number
    price_unit?: string
    specialties?: string
    disponiblity: string
    moyDuration: number
    category_id?: number
    image_url?: string
    rating: number
    num_ratings: number
    features?: string[]
    process?: { step: number; title: string; description: string }[]
}

export interface Rating {
    id: number
    user_id: number
    service_id?: number
    product_id?: number
    rating: number
    comment?: string
    created_at: string
    user?: User
}

export interface SubCategory {
    id: number
    name: string
    category_id: number
    slug: string
}

export interface Category {
    id: number
    name: string
    description?: string
    image_url?: string
    subcategories?: SubCategory[]
}

export interface Blog {
    id: number
    title: string
    content: string
    category: string
    author?: string
    image_url?: string
    slug: string
    excerpt?: string
    read_time?: string
    created_at: string
    status?: string
    views?: number
}
