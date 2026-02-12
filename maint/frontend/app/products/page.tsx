import { Suspense } from 'react'
import ProductsClient from './ProductsClient'

export default async function ProductsPage({
  searchParams: searchParamsPromise
}: {
  searchParams: Promise<{ category?: string, subcategory?: string, search?: string, maxPrice?: string }>
}) {
  const searchParams = await searchParamsPromise

  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    }>
      <ProductsClient initialFilters={searchParams} />
    </Suspense>
  )
}
