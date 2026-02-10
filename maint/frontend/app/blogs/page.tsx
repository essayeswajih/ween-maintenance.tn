'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowRight, Clock, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { API_URL, apiFetch } from '@/lib/api'
import { blogArticles } from '@/lib/blog-data'
import { Blog } from '@/lib/types'

export default function BlogPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [articles, setArticles] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsLoaded(true)
    const loadBlogs = async () => {
      try {
        const data = await apiFetch<Blog[]>('/blogs', { cache: 'no-store' })
        // Prioritize backend data. Only fallback if data is null/undefined (not empty array)
        if (data && Array.isArray(data)) {
          setArticles(data.length > 0 ? data : [])
        } else {
          // Fallback if data structure is wrong
          console.warn("Invalid blog data from API, using fallback")
          setArticles(blogArticles as unknown as Blog[])
        }
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
        // Fallback on error (backend down)
        setArticles(blogArticles as unknown as Blog[])
      } finally {
        setLoading(false)
      }
    }
    loadBlogs()
  }, [])

  const categories = [
    { name: 'Tous', count: articles.length },
    { name: 'Plomberie', count: articles.filter(a => a.category === 'Plomberie').length },
    { name: 'Électricité', count: articles.filter(a => a.category === 'Électricité').length },
    { name: 'Chauffage', count: articles.filter(a => a.category === 'Chauffage').length },
    { name: 'Chaudières', count: articles.filter(a => a.category === 'Chaudières').length },
  ]

  const [selectedCategory, setSelectedCategory] = useState('Tous')

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'Tous' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      {/* Header */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Maintenance</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Conseils, guides et actualités sur la maintenance, plomberie, électricité et chauffage
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="container mx-auto px-4 py-8 -mt-6 relative z-10">
        <div className={`transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Chercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <div className={`mb-8 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <h3 className="font-semibold text-lg mb-4">Catégories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-4 py-2 rounded transition-all ${selectedCategory === category.name
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                      } flex justify-between items-center`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs opacity-70">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-0">
                <h4 className="font-semibold mb-4">Newsletter</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Abonnez-vous pour recevoir nos derniers articles et conseils
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="w-full px-3 py-2 border rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button size="sm" className="w-full">
                    S'abonner
                  </Button>
                </form>
              </Card>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="lg:col-span-3">
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/blogs/${article.slug}`}
                  >
                    <div
                      className={`transition-all duration-700 ${isLoaded
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                        }`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <Card className="h-full overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col group">
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-5xl overflow-hidden">
                          <div className="group-hover:scale-110 transition-transform duration-300">
                            {article.image_url || '📝'}
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {article.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(article.created_at).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {article.author || 'Équipe Ween'}
                            </div>
                            <div className="flex items-center gap-1 ml-auto">
                              <Clock className="w-4 h-4" />
                              {article.read_time || '5 min'}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground text-lg">Aucun article trouvé.</p>
                <p className="text-sm text-muted-foreground mt-2">Essayez une autre recherche ou catégorie</p>
              </Card>
            )}

            {/* Pagination - Hidden when filtered */}
            {selectedCategory === 'Tous' && searchQuery === '' && (
              <div className={`mt-12 flex justify-center gap-2 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? 'default' : 'outline'}
                    size="sm"
                    className={page === 1 ? '' : 'bg-transparent'}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className={`container mx-auto px-4 py-16 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Card className="bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground p-8 md:p-12 border-0">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Des questions ou besoin d'aide?</h2>
              <p className="opacity-90">
                Notre équipe d'experts est prête à vous assister avec vos besoins en maintenance
              </p>
            </div>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="gap-2">
                Nous contacter <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </>
  )
}
