import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Page non trouvée</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/">
            <Button size="lg">Retour à l'accueil</Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline">
              Parcourir les produits
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
