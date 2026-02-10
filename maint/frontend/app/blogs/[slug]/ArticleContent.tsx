'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar, User, Clock, ArrowLeft, Share2, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ArticleContentProps {
    article: any;
    relatedArticles: any[];
}

export default function ArticleContent({ article, relatedArticles }: ArticleContentProps) {
    const [isLiked, setIsLiked] = useState(false)

    if (!article) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-3xl font-bold mb-4">Article non trouvé</h1>
                <p className="text-muted-foreground mb-6">Désolé, cet article n'existe pas.</p>
                <Link href="/blogs">
                    <Button>Retour au blog</Button>
                </Link>
            </div>
        )
    }

    return (
        <>
            {/* Header */}
            <section className="py-8 bg-muted/50 border-b">
                <div className="container mx-auto px-4">
                    <Link href="/blogs" className="flex items-center gap-2 text-primary hover:underline mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Retour au blog
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                            {article.category}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">{article.title}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm flex-wrap">
                        <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{article.author || 'Équipe Ween'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(article.created_at || Date.now()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{article.read_time || '5 min'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Featured Image */}
                        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-20 text-9xl flex items-center justify-center mb-8">
                            {article.image_url || '📝'}
                        </div>

                        {/* Article Text */}
                        <Card className="p-8 prose prose-sm dark:prose-invert max-w-none">
                            <div
                                className="space-y-4 text-foreground"
                                dangerouslySetInnerHTML={{
                                    __html: (article.content || '')
                                        .replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-6 mb-4">')
                                        .replace(/<p>/g, '<p class="text-base leading-relaxed mb-4">')
                                        .replace(/<\/p>/g, '</p>')
                                        .replace(/<\/h2>/g, '</h2>'),
                                }}
                            />
                        </Card>

                        {/* Share and Like */}
                        <div className="flex gap-4 mt-8">
                            <Button
                                variant="outline"
                                className={`gap-2 flex-1 ${isLiked ? 'bg-red-50 dark:bg-red-950' : ''}`}
                                onClick={() => setIsLiked(!isLiked)}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                {isLiked ? 'J\'aime' : 'Aimer'}
                            </Button>
                            <Button variant="outline" className="gap-2 flex-1 bg-transparent">
                                <Share2 className="w-5 h-5" />
                                Partager
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Author Info */}
                        <Card className="p-6 mb-6">
                            <h3 className="font-semibold mb-4">À propos de l'auteur</h3>
                            <div className="text-center">
                                <div className="text-5xl mb-3">👤</div>
                                <h4 className="font-semibold mb-2">{article.author || 'Équipe Ween'}</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Expert en {article.category?.toLowerCase() || 'maintenance'} avec une vaste expérience.
                                </p>
                                <Link href="/blogs">
                                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                                        Voir plus d'articles
                                    </Button>
                                </Link>
                            </div>
                        </Card>

                        {/* Related Articles */}
                        {relatedArticles.length > 0 && (
                            <Card className="p-6">
                                <h3 className="font-semibold mb-4">Articles similaires</h3>
                                <div className="space-y-4">
                                    {relatedArticles.map((art) => (
                                        <Link key={art.slug} href={`/blogs/${art.slug}`} className="block">
                                            <div className="hover:bg-muted p-3 rounded transition-colors">
                                                <p className="font-medium text-sm line-clamp-2 hover:text-primary">
                                                    {art.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(art.created_at || Date.now()).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
