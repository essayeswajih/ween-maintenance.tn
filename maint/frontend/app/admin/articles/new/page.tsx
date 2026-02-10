'use client'

import BlogForm from '@/components/admin/BlogForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NewArticlePage() {
    return (
        <div className="p-6">
            <div className="mb-8">
                <Link href="/admin/articles" className="flex items-center gap-2 text-primary hover:underline mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </Link>
                <h1 className="text-3xl font-bold">Nouvel Article</h1>
                <p className="text-muted-foreground mt-2">Créez un nouvel article pour le blog.</p>
            </div>

            <BlogForm />
        </div>
    )
}
