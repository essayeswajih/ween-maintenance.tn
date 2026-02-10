'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Wrench, Zap, Droplet, Flame, ShoppingCart, FileText, Truck, Clock, Shield, Star, Calendar, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Product, ServiceCategory, Service, Blog } from '@/lib/types'
import { API_URL, apiFetch } from '@/lib/api'
import CarouselSlider from '@/components/carousel-slider'
import { useCart } from '@/context/cart-context'
import { toast } from 'sonner'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [blogArticles, setArticles2] = useState<Blog[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    setIsLoaded(true)

    // Fetch products
    apiFetch<Product[]>('/vetrine/products?limit=10')
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err))

    // Fetch services
    apiFetch<Service[]>('/service')
      .then(data => setServices(data))
      .catch(err => console.error('Failed to fetch services:', err))

    // Fetch Blogs
    apiFetch<Blog[]>('/blogs')
      .then(data => setArticles2(data)
      ).catch(err => console.error('Failed to fetch blogs:', err))
  }, [])



  const articles = blogArticles.map(article => ({
    ...article,
    date: article.created_at,
    readTime: article.read_time,
    image: article.image_url
  }))

  // Hardcoded mapping for icons and colors based on category names/slugs
  const serviceStyleMap: Record<string, { icon: any, color: string }> = {
    'plomberie': { icon: Droplet, color: 'from-blue-500/20 to-blue-500/5' },
    'plumbing': { icon: Droplet, color: 'from-blue-500/20 to-blue-500/5' },
    'electricite': { icon: Zap, color: 'from-yellow-500/20 to-yellow-500/5' },
    'electrical': { icon: Zap, color: 'from-yellow-500/20 to-yellow-500/5' },
    'chauffage': { icon: Flame, color: 'from-orange-500/20 to-orange-500/5' },
    'heating': { icon: Flame, color: 'from-orange-500/20 to-orange-500/5' },
    'chaudieres': { icon: Wrench, color: 'from-red-500/20 to-red-500/5' },
    'boilers': { icon: Wrench, color: 'from-red-500/20 to-red-500/5' },
  }

  const displayServices = services.map((service: Service) => {
    const style = serviceStyleMap[service.slug.toLowerCase()] || serviceStyleMap[service.name.toLowerCase()] || { icon: Wrench, color: 'from-primary/20 to-primary/5' }
    return {
      ...service,
      icon: style.icon,
      color: style.color,
      href: `/services/${service.slug}`,
    }
  })


  const features = [
    {
      icon: Truck,
      title: 'Livraison Rapide',
      description: 'Livraison gratuite pour les commandes >100TND',
    },
    {
      icon: Clock,
      title: 'Disponibilité 24/7',
      description: 'Support client disponible jour et nuit',
    },
    {
      icon: Shield,
      title: 'Garantie Complète',
      description: 'Tous les produits garantis 2 ans minimum',
    },
    {
      icon: Star,
      title: 'Satisfaction Garantie',
      description: 'Retour gratuit sous 30 jours si non satisfait',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-40 bg-gradient-to-br from-primary via-background to-accent/10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  Solutions de Maintenance
                </span>
                <br />
                Professionnelles
              </h1>
            </div>

            <p className={`text-lg md:text-xl text-muted-foreground mb-8 text-balance transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Vente de produits premium et services spécialisés en plomberie, électricité, chauffage et installation de chaudières
            </p>

            <div className={`flex gap-4 justify-center flex-wrap transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link href="/products">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
                  <ShoppingCart className="w-5 h-5" />
                  Parcourir les produits
                </Button>
              </Link>
              <Link href="/services/request">
                <Button size="lg" variant="outline" className="gap-2 bg-background/50 backdrop-blur border-primary/20 hover:bg-background/80">
                  <FileText className="w-5 h-5" />
                  Demander un devis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 animate-fade-in-up`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Produits en Vedette</h2>
            <p className="text-lg text-muted-foreground">
              Découvrez notre sélection de produits de qualité supérieure
            </p>
          </div>

          <CarouselSlider
            itemsPerView={3}
            items={products.map((product, index) => (
              <div
                key={product.id}
                className={`h-full transition-all duration-700 ${isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Link href={`/products/${product.slug}`}>
                  <Card className="h-full p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group overflow-hidden border-0 bg-gradient-to-br from-background to-accent/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      <div className="text-6xl mb-4 group-hover:animate-float h-32 flex items-center justify-center relative">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-contain drop-shadow-md"
                          />
                        ) : (
                          '📦'
                        )}
                      </div>

                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {product.category_name || 'Produit'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-sm">{product.rating || 5.0}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">({product.num_ratings || 0} avis)</span>
                      </div>

                      <div className="border-t pt-4 mt-auto">
                        <p className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{product.price.toFixed(2)} TND</p>
                        <Button className="w-full gap-2 group/btn shadow-md hover:shadow-lg transition-all" size="sm" onClick={(e) => {
                          e.preventDefault()
                          addToCart(product)
                          toast.success(`${product.name} ajouté au panier`)
                        }}>
                          <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          Ajouter au panier
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          />

          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                Voir tous les produits
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section with Carousel */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 animate-fade-in-up`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Services Spécialisés</h2>
            <p className="text-lg text-muted-foreground">
              Expertise professionnelle dans tous vos besoins de maintenance
            </p>
          </div>

          <CarouselSlider
            itemsPerView={3}
            items={displayServices.map((service) => {
              const Icon = service.icon
              return (
                <Link key={service.href} href={service.href}>
                  <Card className={`h-full min-h-[320px] p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer bg-gradient-to-br ${service.color} border border-white/10 flex flex-col`}>
                    <div className="mb-6 inline-flex p-3 rounded-xl bg-white/20 backdrop-blur-md shadow-inner">
                      <Icon className="w-8 h-8 text-primary drop-shadow" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{service.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4rem]">{service.description}</p>
                    <div className="mt-auto pt-6 flex items-center text-primary font-bold text-sm group/btn">
                      <span className="relative overflow-hidden group-hover/btn:pr-6 transition-all duration-300">
                        En savoir plus
                        <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-all duration-300" />
                      </span>
                    </div>
                  </Card>
                </Link>
              )
            })}
          />
        </div>
      </section>

      {/* Articles Section with Carousel */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 animate-fade-in-up`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Articles et Ressources</h2>
            <p className="text-lg text-muted-foreground">
              Découvrez nos guides pratiques et conseils d'experts
            </p>
          </div>

          <CarouselSlider
            itemsPerView={3}
            items={articles.map((article) => (
              <Link key={article.id} href={`/blogs/${article.slug}`}>
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  {/* Article Image/Icon */}
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-12 text-5xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 h-48">
                    {article.image}
                  </div>

                  {/* Article Content */}
                  <div className="p-6 flex flex-col h-[280px]">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 overflow-hidden flex-1">
                      {article.excerpt}
                    </p>

                    {/* Meta Information */}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-tight font-medium">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 text-primary/60" />
                          <span>{article.author}</span>
                        </div>
                        <span className="bg-muted px-2 py-0.5 rounded">{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-tight font-medium">
                        <Calendar className="w-3 h-3 text-primary/60" />
                        <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          />

          <div className="text-center mt-12">
            <Link href="/blogs">
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                Voir tous les articles
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 animate-fade-in-up`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi nous choisir</h2>
            <p className="text-lg text-muted-foreground">
              Une expérience client professionnelle et fiable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className={`text-center group transition-all duration-700 ${isLoaded
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-primary via-primary/95 to-accent text-primary-foreground relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Prêt à transformer vos projets?</h2>
            <p className="text-lg mb-10 opacity-90 max-w-2xl mx-auto">
              Rejoignez des milliers de clients satisfaits et découvrez la différence d'un service professionnel
            </p>
          </div>

          <div className={`flex gap-4 justify-center flex-wrap transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link href="/products">
              <Button variant="secondary" size="lg" className="gap-2">
                <ShoppingCart className="w-5 h-5" />
                Voir les produits
              </Button>
            </Link>
            <Link href="/services/request">
              <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent backdrop-blur gap-2">
                <FileText className="w-5 h-5" />
                Demander un devis
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
