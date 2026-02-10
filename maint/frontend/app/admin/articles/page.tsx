'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { API_URL, apiFetch } from '@/lib/api'

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const data = await apiFetch<any[]>('/blogs')
      setArticles(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch articles:', err)
      toast.error('Erreur lors du chargement des articles')
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await apiFetch(`/blogs/${id}`, {
          method: 'DELETE',
        })
        toast.success('Article supprimé avec succès')
        setArticles(articles.filter(a => a.id !== id))
      } catch (err) {
        console.error('Delete failed:', err)
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Gestion des Articles</h1>
          <Link href="/admin/articles/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvel article
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Chercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
          />
        </div>
      </div>

      {/* Articles Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Titre</th>
                <th className="text-left p-4 font-semibold">Catégorie</th>
                <th className="text-left p-4 font-semibold">Auteur</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Slug</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Chargement des articles...
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Aucun article trouvé.
                  </td>
                </tr>
              ) : filteredArticles.map((article) => (
                <tr key={article.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium max-w-xs truncate">{article.title}</td>
                  <td className="p-4">
                    <span className="bg-primary/5 text-primary px-2 py-1 rounded text-xs font-medium border border-primary/10">
                      {article.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{article.author || 'Équipe Ween'}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(article.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4 text-sm font-mono text-muted-foreground">{article.slug}</td>
                  <td className="p-4 flex gap-2">
                    <Link href={`/blogs/${article.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" title="Voir l'article">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/articles/${article.id}/edit`}>
                      <Button variant="ghost" size="sm" title="Modifier">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(article.id)}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
