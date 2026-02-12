'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Search,
    Upload,
    Trash2,
    Copy,
    ExternalLink,
    Loader2,
    Image as ImageIcon,
    Check
} from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { toast } from 'sonner'

export default function AdminMediaPage() {
    const [images, setImages] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchImages()
    }, [])

    const fetchImages = async () => {
        try {
            setLoading(true)
            const data = await apiFetch<{ images: string[] }>('/images')
            if (data && data.images) {
                setImages(data.images)
            } else {
                setImages([])
            }
        } catch (error: any) {
            console.error('Failed to fetch images:', error)
            toast.error(`Erreur lors du chargement: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (e.g., 5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Le fichier est trop volumineux (max 5Mo)')
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        try {
            setUploading(true)
            console.log('Uploading file:', file.name)
            const result = await apiFetch<any>('/upload', {
                method: 'POST',
                body: formData,
            })
            console.log('Upload result:', result)
            toast.success('Image téléchargée avec succès')
            fetchImages()

            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = ''
        } catch (error: any) {
            console.error('Upload failed:', error)
            toast.error(`Échec du téléchargement: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (imageUrl: string) => {
        const filename = imageUrl.split('/').pop()
        if (!filename) return

        if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return

        try {
            await apiFetch(`/delete/${filename}`, {
                method: 'DELETE',
            })
            toast.success('Image supprimée')
            setImages(images.filter(img => img !== imageUrl))
        } catch (error: any) {
            console.error('Delete failed:', error)
            toast.error(`Erreur lors de la suppression: ${error.message}`)
        }
    }

    const copyToClipboard = (url: string) => {
        const fullUrl = `${window.location.origin}${url}`
        navigator.clipboard.writeText(fullUrl)
        setCopiedUrl(url)
        toast.success('Lien copié !')
        setTimeout(() => setCopiedUrl(null), 2000)
    }

    const filteredImages = images.filter(img =>
        img.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.split('/').pop()?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Médiathèque</h1>
                    <p className="text-muted-foreground">Gérez vos images et fichiers multimédias.</p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <Button
                        disabled={uploading}
                        className="gap-2"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading ? 'Téléchargement...' : 'Télécharger une image'}
                    </Button>
                </div>
            </div>

            <Card className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher une image..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </Card>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Chargement de la médiathèque...</p>
                </div>
            ) : filteredImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-lg bg-muted/50">
                    <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-xl font-medium">Aucune image trouvée</p>
                    <p className="text-muted-foreground">Commencez par télécharger des fichiers.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredImages.map((url, index) => {
                        const filename = url.split('/').pop()
                        return (
                            <Card key={index} className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all">
                                <div className="aspect-square relative flex items-center justify-center bg-muted/30">
                                    <img
                                        src={url}
                                        alt={filename}
                                        className="object-contain w-full h-full p-2"
                                    />

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            onClick={() => copyToClipboard(url)}
                                            title="Copier le lien"
                                        >
                                            {copiedUrl === url ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                        <a href={url} target="_blank" rel="noopener noreferrer">
                                            <Button size="icon" variant="secondary" title="Voir l'original">
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        </a>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => handleDelete(url)}
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-2 border-t bg-background/50 backdrop-blur-sm">
                                    <p className="text-xs truncate font-medium" title={filename}>
                                        {filename}
                                    </p>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
