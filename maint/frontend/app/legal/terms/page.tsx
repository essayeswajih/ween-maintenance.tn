export default function TermsPage() {
  return (
    <>
      {/* Header */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Conditions d'utilisation</h1>
          <p className="text-muted-foreground mt-2">Dernière mise à jour: Janvier 2024</p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Conditions générales</h2>
            <p className="text-muted-foreground mb-4">
              En accédant et en utilisant Ween-Maintenance.tn, vous acceptez de respecter
              ces conditions d'utilisation. Si vous n'êtes pas d'accord, veuillez ne pas
              utiliser notre site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Licence d'utilisation</h2>
            <p className="text-muted-foreground mb-4">
              Nous vous accordons une licence limitée, non exclusive et non transférable
              pour accéder et utiliser notre site à titre personnel, non commercial.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Restrictions d'utilisation</h2>
            <p className="text-muted-foreground mb-4">
              Vous ne pouvez pas:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Reproduire ou copier le contenu sans autorisation</li>
              <li>Utiliser des outils d'extraction de données</li>
              <li>Accéder non autorisé au site</li>
              <li>Publier du contenu offensant ou illégal</li>
              <li>Contourner les mesures de sécurité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Commandes et paiements</h2>
            <p className="text-muted-foreground mb-4">
              Toutes les commandes sont sujettes à acceptation. Nous nous réservons le
              droit de refuser ou d'annuler toute commande. Les prix sont sujets à
              changement sans préavis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Politique de retour</h2>
            <p className="text-muted-foreground mb-4">
              Les produits peuvent être retournés dans les 14 jours suivant la livraison,
              à condition que le produit soit en bon état et dans son emballage original.
              Les frais de retour peuvent s'appliquer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Garantie des produits</h2>
            <p className="text-muted-foreground mb-4">
              Tous les produits sont garantis selon les termes du fabricant. Nous ne
              sommes pas responsables des dommages causés par une utilisation incorrecte
              ou une maintenance inadéquate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Limitation de responsabilité</h2>
            <p className="text-muted-foreground mb-4">
              Ween-Maintenance.tn ne sera pas responsable de tout dommage indirect,
              accessoire, spécial ou consécutif. Notre responsabilité est limitée au
              montant de votre achat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Contenu utilisateur</h2>
            <p className="text-muted-foreground mb-4">
              Vous conservez la propriété de tout contenu que vous publiez, mais nous
              vous accordons une licence pour utiliser, reproduire et distribuer ce
              contenu sur notre plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Liens externes</h2>
            <p className="text-muted-foreground mb-4">
              Nous ne sommes pas responsables des sites web externes liés à notre
              plateforme. Nous ne contrôlons pas le contenu de ces sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Modification des conditions</h2>
            <p className="text-muted-foreground mb-4">
              Nous nous réservons le droit de modifier ces conditions à tout moment.
              Les modifications seront publiées sur cette page avec la date de dernière
              mise à jour.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Droit applicable</h2>
            <p className="text-muted-foreground mb-4">
              Ces conditions sont régies par les lois de la Tunisie et vous acceptez
              la juridiction exclusive des tribunaux compétents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
            <p className="text-muted-foreground">
              Pour toute question concernant ces conditions, veuillez nous contacter
              à info@maintenance.tn ou +216 27 553 981.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
