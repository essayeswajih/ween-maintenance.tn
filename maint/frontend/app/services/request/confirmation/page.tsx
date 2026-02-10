import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Clock, Mail, Phone } from 'lucide-react'

export default function ConfirmationPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Card className="p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold mb-2">Demande envoyée!</h1>
          <p className="text-muted-foreground mb-6">
            Votre demande de devis a été reçue avec succès. Notre équipe vous contactera
            dans les 24 heures.
          </p>

          {/* Reference Number */}
          <Card className="p-4 bg-muted mb-6">
            <p className="text-xs text-muted-foreground mb-1">Numéro de référence</p>
            <p className="font-bold text-lg text-primary">#DEVIS-2024-01-001</p>
          </Card>

          {/* Info */}
          <div className="space-y-3 mb-8 p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-5 h-5 text-primary" />
              <span>Réponse attendue dans les 24 heures</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-5 h-5 text-primary" />
              <span>Nous vous appellerons au numéro fourni</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-5 h-5 text-primary" />
              <span>Un email de confirmation a été envoyé</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full">Retour à l'accueil</Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="w-full bg-transparent">
                Voir nos services
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="ghost" className="w-full">
                Mon compte
              </Button>
            </Link>
          </div>

          {/* Footer Message */}
          <p className="text-xs text-muted-foreground mt-6">
            Des questions? Contactez-nous à{' '}
            <a href="mailto:info@ween-maintenance.tn" className="text-primary hover:underline">
              info@ween-maintenance.tn
            </a>{' '}
            ou <a href="tel:+216XXXXXXX" className="text-primary hover:underline">
              +216 27 553 981
            </a>
          </p>
        </Card>
      </div>
    </div>
  )
}
