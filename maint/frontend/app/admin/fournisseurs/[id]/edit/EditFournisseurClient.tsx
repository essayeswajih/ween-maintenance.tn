'use client'

import { useState, useEffect } from 'react';
import FournisseurForm from '@/components/admin/FournisseurForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { API_URL, apiFetch } from '@/lib/api';

interface EditFournisseurClientProps {
    fournisseurId: string | number;
}

export default function EditFournisseurClient({ fournisseurId }: EditFournisseurClientProps) {
    const id = Number(fournisseurId);
    const [fournisseur, setFournisseur] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || isNaN(id)) {
            toast.error("ID de fournisseur invalide");
            setLoading(false);
            return;
        }

        const fetchFournisseur = async () => {
            try {
                const data = await apiFetch<any>(`/fournisseur/${id}`);
                setFournisseur(data);
            } catch (err) {
                console.error('Failed to fetch fournisseur:', err);
                toast.error("Erreur lors du chargement du fournisseur");
            } finally {
                setLoading(false);
            }
        };

        fetchFournisseur();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Chargement...</div>;
    if (!fournisseur) return <div className="p-8 text-center">Fournisseur non trouvé</div>;

    return (
        <div className="p-6">
            <div className="mb-8">
                <Link href="/admin/fournisseurs" className="flex items-center gap-2 text-primary hover:underline mb-4 w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </Link>
                <h1 className="text-3xl font-bold">Modifier le Fournisseur</h1>
                <p className="text-muted-foreground mt-2">
                    Modifiez les détails de "{fournisseur.company_name}".
                </p>
            </div>

            <FournisseurForm
                initialData={fournisseur}
                fournisseurId={id}
                isEdit
            />
        </div>
    );
}
