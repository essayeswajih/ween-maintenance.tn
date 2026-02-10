from sqlalchemy.orm import Session
from models.blogModels import Blog

def seed_blogs_if_empty(db: Session):
    try:
        if db.query(Blog).count() == 0:
            print("No blogs found. Seeding initial data...")
            blogs = [
                Blog(
                    title='Guide complet d\'installation de chauffage',
                    slug='guide-complet-dinstallation-de-chauffage',
                    excerpt='Apprenez les étapes essentielles pour installer un système de chauffage professionnel dans votre maison.',
                    content="""
                    <h2>Introduction</h2>
                    <p>L'installation d'un système de chauffage est une étape cruciale pour le confort de votre maison. Ce guide vous accompagne à travers les étapes essentielles.</p>
                    <h2>Étapes de préparation</h2>
                    <p>Avant de commencer, assurez-vous d'avoir réalisé un bilan thermique de votre habitation. Cela vous permettra de choisir la puissance adaptée.</p>
                    <h2>Choix du système</h2>
                    <p>Chaudière gaz, pompe à chaleur ou radiateurs électriques ? Le choix dépend de votre isolation, de votre budget et de vos préférences écologiques.</p>
                    <h2>Installation et Sécurité</h2>
                    <p>Faites toujours appel à un professionnel certifié pour l'installation. Les normes de sécurité, notamment pour le gaz et l'électricité, sont strictes.</p>
                    <h2>Conclusion</h2>
                    <p>Une bonne installation garantit performance et économies d'énergie sur le long terme.</p>
                    """,
                    category='Chauffage',
                    author='Ahmed Beni',
                    image_url='🔥',
                    read_time='8 min',
                    status='Publié'
                ),
                Blog(
                    title='Conseils de maintenance pour vos plomberies',
                    slug='conseils-de-maintenance-pour-vos-plomberies',
                    excerpt='Découvrez comment maintenir votre système de plomberie en excellent état et éviter les dégâts d\'eau.',
                    content="""
                    <h2>L'importance de la maintenance</h2>
                    <p>Une plomberie bien entretenue vous évite des réparations coûteuses. Voici quelques gestes simples à adopter.</p>
                    <h2>Vérifiez les fuites</h2>
                    <p>Inspectez régulièrement vos robinets et tuyaux. Une petite fuite peut se transformer en dégât des eaux important.</p>
                    <h2>Nettoyage des siphons</h2>
                    <p>Pensez à nettoyer les siphons de vos éviers et lavabos pour éviter les bouchons et les mauvaises odeurs.</p>
                    <h2>Conclusion</h2>
                    <p>La prévention est la clé d'une plomberie saine.</p>
                    """,
                    category='Plomberie',
                    author='Fatima Saidi',
                    image_url='💧',
                    read_time='6 min',
                    status='Publié'
                ),
                Blog(
                    title='Sécurité électrique : ce que vous devez savoir',
                    slug='securite-electrique-ce-que-vous-devez-savoir',
                    excerpt='Les normes de sécurité électrique essentielles pour protéger votre maison et votre famille.',
                    content="""
                    <h2>Normes fondamentales</h2>
                    <p>La sécurité électrique n'est pas une option. Connaître les bases peut sauver des vies.</p>
                    <h2>Tableau électrique</h2>
                    <p>Votre tableau doit être aux normes, avec des disjoncteurs différentiels pour protéger contre les chocs électriques.</p>
                    <h2>Les dangers du bricolage</h2>
                    <p>Ne touchez jamais à une installation sous tension. Coupez toujours le courant au disjoncteur principal.</p>
                    """,
                    category='Électricité',
                    author='Karim Ben',
                    image_url='⚡',
                    read_time='7 min',
                    status='Publié'
                ),
                Blog(
                    title='Économies d\'énergie : optimisez votre thermostat',
                    slug='economies-denergie-optimisez-votre-thermostat',
                    excerpt='Réduisez votre consommation d\'énergie en utilisant intelligemment votre système de chauffage.',
                    content="""
                    <h2>Programmation</h2>
                    <p>Un thermostat programmable peut réduire votre facture de 15%. Réglez-le pour baisser la température quand vous êtes absent.</p>
                    <h2>Température idéale</h2>
                    <p>19°C dans les pièces à vivre et 16°C dans les chambres sont suffisants pour le confort et la santé.</p>
                    """,
                    category='Chauffage',
                    author='Mariem Khamis',
                    image_url='📱',
                    read_time='5 min',
                    status='Publié'
                ),
                Blog(
                    title='Les erreurs courantes en installation de chaudière',
                    slug='les-erreurs-courantes-en-installation-de-chaudiere',
                    excerpt='Évitez les pièges et les erreurs fréquentes lors de l\'installation d\'une chaudière moderne.',
                    content="""
                    <h2>Mauvais dimensionnement</h2>
                    <p>Une chaudière trop puissante consomme trop, une pas assez puissante ne chauffe pas assez. Le calcul est précis.</p>
                    <h2>Négliger l'entretien</h2>
                    <p>L'entretien annuel est obligatoire et essentiel pour la sécurité et la performance.</p>
                    """,
                    category='Chaudières',
                    author='Riad Moussa',
                    image_url='🔧',
                    read_time='9 min',
                    status='Publié'
                ),
                Blog(
                    title='Rénovation électrique : tout ce qu\'il faut savoir',
                    slug='renovation-electrique-tout-ce-quil-faut-savoir',
                    excerpt='Guide complet pour rénover l\'installation électrique de votre domicile en toute sécurité.',
                    content="""
                    <h2>Diagnostic</h2>
                    <p>Commencez par un diagnostic complet de l'existant réalisé par un professionnel.</p>
                    <h2>Planification</h2>
                    <p>Pensez à vos besoins futurs : plus de prises, domotique, véhicule électrique...</p>
                    """,
                    category='Électricité',
                    author='Salma Fourati',
                    image_url='🔌',
                    read_time='10 min',
                    status='Publié'
                )
            ]
            db.add_all(blogs)
            db.commit()
            print(f"Successfully seeded {len(blogs)} blogs.")
        else:
            print("Blogs table is not empty. Skipping seed.")
    except Exception as e:
        print(f"Error seeding blogs: {e}")
        db.rollback()
