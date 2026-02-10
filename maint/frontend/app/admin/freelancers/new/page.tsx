'use client'

import FreelancerForm from '@/components/admin/FreelancerForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewFreelancerPage() {
    return (
        <div className="p-6">
            <div className="mb-8">
                <Link href="/admin/freelancers" className="flex items-center gap-2 text-primary hover:underline mb-4 w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </Link>
                <h1 className="text-3xl font-bold">Nouveau Freelancer</h1>
                <p className="text-muted-foreground mt-2">Ajoutez un nouveau freelancer au système.</p>
            </div>

            <FreelancerForm />
        </div>
    )
}
