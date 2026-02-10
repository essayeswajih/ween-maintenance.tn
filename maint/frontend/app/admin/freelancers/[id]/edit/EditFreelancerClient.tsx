'use client'

import { useState, useEffect } from 'react';
import FreelancerForm from '@/components/admin/FreelancerForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

interface EditFreelancerClientProps {
    freelancerId: string | number;
}

export default function EditFreelancerClient({ freelancerId }: EditFreelancerClientProps) {
    const id = Number(freelancerId);
    const [freelancer, setFreelancer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || isNaN(id)) {
            toast.error("ID de freelancer invalide");
            setLoading(false);
            return;
        }

        const fetchFreelancer = async () => {
            try {
                const data = await apiFetch<any>(`/freelancers/${id}`);
                setFreelancer(data);
            } catch (err) {
                console.error('Failed to fetch freelancer:', err);
                toast.error("Erreur lors du chargement du freelancer");
            } finally {
                setLoading(false);
            }
        };

        fetchFreelancer();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Chargement...</div>;
    if (!freelancer) return <div className="p-8 text-center">Freelancer non trouvé</div>;

    return (
        <div className="p-6">
            <div className="mb-8">
                <Link href="/admin/freelancers" className="flex items-center gap-2 text-primary hover:underline mb-4 w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </Link>
                <h1 className="text-3xl font-bold">Modifier le Freelancer</h1>
                <p className="text-muted-foreground mt-2">
                    Modifiez les détails de "{freelancer.first_name} {freelancer.last_name}".
                </p>
            </div>

            <FreelancerForm
                initialData={freelancer}
                freelancerId={id}
                isEdit
            />
        </div>
    );
}
