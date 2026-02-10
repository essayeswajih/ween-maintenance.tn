'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const footerSections = [
    {
      title: 'Produits',
      links: [
        { label: 'Tous les produits', href: '/products' },
        { label: 'Catégories', href: '/products' },
        { label: 'Recherche', href: '/search' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'Tous les services', href: '/services' },
        { label: 'Devis en ligne', href: '/services/request' },
        { label: 'Rendez-vous', href: '/services' },
      ],
    },
    {
      title: 'Client',
      links: [
        { label: 'Connexion', href: '/login' },
        { label: 'Mon compte', href: '/account' },
        { label: 'Mes commandes', href: '/account/orders' },
        { label: 'Mes devis', href: '/account/services' },
      ],
    },
    {
      title: 'Entreprise',
      links: [
        { label: 'À propos', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Blog', href: '/blogs' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ]

  return (
    <footer className="border-t border-border/40 bg-gradient-to-b from-background to-muted/50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-3 mb-4">
              <img src="/WEEN-maintenance.png" alt="Logo" className="w-10 h-10 aspect-square object-cover rounded-xl hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg">Maintenance</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Plateforme professionnelle de maintenance et services spécialisés en plomberie, électricité, chauffage et installation de chaudières.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-primary" />
                </div>
                <span>Tunis, Tunisie</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-3 h-3 text-primary" />
                </div>
                <span>+216 27 553 981</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-3 h-3 text-primary" />
                </div>
                <span>info@ween-maintenance.tn</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div
              key={section.title}
              className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <h4 className="font-semibold mb-6 text-foreground">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors relative group"
                    >
                      <span className="group-hover:pl-2 transition-all">{link.label}</span>
                      <span className="absolute -left-1 top-0 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border/40 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-sm text-muted-foreground">
              © {currentYear} Ween-Maintenance.tn. Tous droits réservés. <span className="text-primary">developed by</span> <Link href="https://softhub.tn" target="_blank" className="text-primary hover:underline">SoftHub.tn</Link>
            </div>
            <div className="flex gap-6 justify-start md:justify-end text-sm flex-wrap">
              <Link
                href="/legal/privacy-policy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Politique de confidentialité
              </Link>
              <Link
                href="/legal/terms"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Conditions d'utilisation
              </Link>
              <Link
                href="/legal/cookies"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
