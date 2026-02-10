export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Header */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Politique de confidentialité</h1>
          <p className="text-muted-foreground mt-2">Dernière mise à jour: Janvier 2024</p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Ween-Maintenance.tn (« nous » ou « notre ») valorise votre vie privée. Cette
              Politique de confidentialité explique comment nous collectons, utilisons,
              divulguons et sauvegardons vos informations lorsque vous visitez notre site web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Informations que nous collectons</h2>
            <p className="text-muted-foreground mb-4">Nous collectons les informations suivantes:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Informations personnelles (nom, email, téléphone, adresse)</li>
              <li>Informations de paiement (données de carte bancaire cryptées)</li>
              <li>Données de navigation (pages visitées, temps d'accès)</li>
              <li>Cookies et technologies de suivi similaires</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Utilisation de vos informations</h2>
            <p className="text-muted-foreground mb-4">
              Nous utilisons les informations collectées pour:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Traiter vos commandes et paiements</li>
              <li>Communiquer avec vous</li>
              <li>Améliorer nos services</li>
              <li>Vous envoyer des mises à jour marketing (avec votre consentement)</li>
              <li>Respecter les obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Sécurité des données</h2>
            <p className="text-muted-foreground">
              Nous utilisons des mesures de sécurité appropriées pour protéger vos
              informations personnelles contre l'accès non autorisé, la modification et
              la divulgation. Cela inclut le chiffrement SSL et les normes de sécurité PCI.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Partage d'informations</h2>
            <p className="text-muted-foreground mb-4">
              Nous ne vendons pas, ne louons pas et ne partageons pas vos informations
              personnelles avec des tiers, sauf:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Avec nos prestataires de services (paiement, livraison)</li>
              <li>Conformément à la loi</li>
              <li>Avec votre consentement explicite</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
            <p className="text-muted-foreground">
              Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez
              contrôler les cookies via les paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Droits de l'utilisateur</h2>
            <p className="text-muted-foreground mb-4">Vous avez le droit de:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Accéder à vos données personnelles</li>
              <li>Corriger les informations inexactes</li>
              <li>Demander la suppression de vos données</li>
              <li>Vous opposer au traitement</li>
              <li>Porter plainte auprès d'une autorité de protection des données</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Contact</h2>
            <p className="text-muted-foreground">
              Si vous avez des questions sur cette Politique de confidentialité, veuillez
              nous contacter à info@ween-maintenance.tn ou +216 27 553 981.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
