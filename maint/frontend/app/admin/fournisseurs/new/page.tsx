'use client'

import FournisseurForm from '@/components/admin/FournisseurForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewFournisseurPage() {
    return (
        <div className="p-6">
            <div className="mb-8">
                <Link href="/admin/fournisseurs" className="flex items-center gap-2 text-primary hover:underline mb-4 w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </Link>
                <h1 className="text-3xl font-bold">Nouveau Fournisseur</h1>
                <p className="text-muted-foreground mt-2">Ajoutez un nouveau partenaire fournisseur au système.</p>
            </div>

            <FournisseurForm />
        </div>
    )
}
