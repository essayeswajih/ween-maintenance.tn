// app/admin/articles/[id]/edit/EditArticleClient.tsx
'use client'

import { useState, useEffect } from 'react';
import BlogForm from '@/components/admin/BlogForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { API_URL } from '@/lib/api';

interface EditArticleClientProps {
  blogId: number | string; // accept string from params
}

export default function EditArticleClient({ blogId }: EditArticleClientProps) {
  const id = Number(blogId); // safely convert
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || isNaN(id)) {
      toast.error("ID d'article invalide");
      setLoading(false);
      return;
    }

    const url = `${API_URL}/blogs/${id}`;
    console.log("Fetching article from:", url);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Article non trouvé");
        return res.json();
      })
      .then(data => {
        setArticle(data); // safely set initialData
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch article:', err);
        toast.error("Erreur lors du chargement de l'article");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!article) return <div className="p-8 text-center">Article non trouvé</div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link href="/admin/articles" className="flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>
        <h1 className="text-3xl font-bold">Modifier l'Article</h1>
        <p className="text-muted-foreground mt-2">
          Modifiez les détails de l'article "{article.title}".
        </p>
      </div>

      <BlogForm
        initialData={article}
        blogId={id}
        isEdit
      />
    </div>
  );
}
