'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search as SearchIcon, X } from 'lucide-react'
import { useState } from 'react'

export default function SearchPage() {
  const [query, setQuery] = useState('')

  const searchResults = [
    {
      id: 1,
      title: 'Robinetterie professionnelle',
      category: 'Plomberie',
      price: '45.99 DT',
      excerpt: 'Robinetterie de qualité professionnelle...',
      image: '🚰',
    },
    {
      id: 2,
      title: 'Câble électrique 2.5mm²',
      category: 'Électricité',
      price: '12.50 DT',
      excerpt: 'Câble électrique haute qualité conforme aux normes...',
      image: '⚡',
    },
    {
      id: 3,
      title: 'Service d\'installation plomberie',
      category: 'Services',
      price: 'Devis personnalisé',
      excerpt: 'Installation complète de système de plomberie...',
      image: '🔧',
    },
    {
      id: 4,
      title: 'Radiateur aluminium 60cm',
      category: 'Chauffage',
      price: '120.00 DT',
      excerpt: 'Radiateur aluminium haute performance...',
      image: '🔥',
    },
  ]

  return (
    <>
      {/* Header */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Recherche</h1>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-3 w-6 h-6 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher produits, services..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border rounded-lg bg-background text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="container mx-auto px-4 py-12">
        {query ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Résultats pour "{query}"
              </h2>
              <p className="text-muted-foreground mb-6">
                {searchResults.length} résultat(s) trouvé(s)
              </p>
            </div>

            <div className="space-y-4">
              {searchResults.map((result) => (
                <Link key={result.id} href={`/products/${result.category.toLowerCase()}`}>
                  <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer flex gap-6">
                    <div className="text-5xl flex-shrink-0">{result.image}</div>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold">{result.title}</h3>
                        <span className="text-sm font-medium text-primary">
                          {result.price}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {result.category}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {result.excerpt}
                      </p>
                      <Button size="sm">
                        {result.category === 'Services'
                          ? 'Demander un devis'
                          : 'Voir le produit'}
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">Aucune recherche effectuée</h2>
            <p className="text-muted-foreground mb-6">
              Entrez un terme de recherche pour trouver des produits et services
            </p>
            <Link href="/products">
              <Button>Parcourir les produits</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Popular Searches */}
      {!query && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Recherches populaires</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Plomberie',
              'Électricité',
              'Chauffage',
              'Chaudière',
              'Robinetterie',
              'Câble électrique',
              'Radiateur',
              'Tuyauterie',
            ].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-sm font-medium transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
