import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { CheckCircle2, Users, Award, Globe } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: CheckCircle2,
      title: 'Qualité',
      description: 'Produits et services de haute qualité garantis',
    },
    {
      icon: Users,
      title: 'Expertise',
      description: 'Équipe d\'experts qualifiés et expérimentés',
    },
    {
      icon: Award,
      title: 'Fiabilité',
      description: 'Service fiable et professionnel garanti',
    },
    {
      icon: Globe,
      title: 'Accessibilité',
      description: 'Services accessibles à tous les clients',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">À propos de nous</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ween-Maintenance.tn est une plateforme professionnelle dédiée à la maintenance,
            la vente de matériel et la gestion de services spécialisés depuis 2020.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Notre mission</h2>
            <p className="text-muted-foreground mb-4">
              Offrir une expérience client professionnelle, fluide et sécurisée pour tous
              les besoins de maintenance, permettant à nos clients d'accéder facilement à
              des produits de qualité et à des services spécialisés.
            </p>
            <p className="text-muted-foreground">
              Nous nous engageons à fournir des solutions fiables et innovantes en
              plomberie, électricité, chauffage et installation de chaudières.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Notre vision</h2>
            <p className="text-muted-foreground mb-4">
              Devenir la plateforme de référence en Tunisie pour les services et produits
              de maintenance, reconnue pour son excellence, sa fiabilité et son innovation.
            </p>
            <p className="text-muted-foreground">
              Nous aspirons à contribuer à l'amélioration de la qualité de vie de nos
              clients en fournissant des services professionnels accessibles et efficaces.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <Card key={value.title} className="p-6 text-center">
                  <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '4+', label: 'Années d\'expérience' },
            { number: '2,500+', label: 'Clients satisfaits' },
            { number: '5,000+', label: 'Produits disponibles' },
            { number: '24/7', label: 'Support client' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold text-primary mb-2">{stat.number}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Mohamed Wajih',
                role: 'Fondateur & PDG',
                bio: 'Expert en maintenance avec 10+ années d\'expérience',
              },
              {
                name: 'Fatima Ben',
                role: 'Directrice des opérations',
                bio: 'Responsable de la qualité et des services',
              },
              {
                name: 'Ahmed Hassan',
                role: 'Chef technique',
                bio: 'Expert en plomberie et chauffage',
              },
            ].map((member) => (
              <Card key={member.name} className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Travaillez avec nous</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Nous recherchons des professionnels qualifiés pour rejoindre notre équipe
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact">
              <Button>Nous contacter</Button>
            </Link>
            <Button variant="outline">Envoyer un CV</Button>
          </div>
        </Card>
      </section>
    </>
  )
}
