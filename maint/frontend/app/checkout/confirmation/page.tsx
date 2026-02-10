import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function ConfirmationPage() {
    return (
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
            <h1 className="text-4xl font-bold mb-4">Commande confirmée !</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md">
                Merci pour votre commande. Nous avons bien reçu votre demande et nous la traiterons dans les plus brefs délais.
            </p>
            <Link href="/">
                <Button size="lg">
                    Retour à l'accueil
                </Button>
            </Link>
        </div>
    )
}
