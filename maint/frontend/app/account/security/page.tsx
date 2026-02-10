'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Lock, Eye, EyeOff, Shield, Smartphone, LogOut, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { apiFetch } from '@/lib/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useEffect } from "react"

export default function SecurityPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isToggling2FA, setIsToggling2FA] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (user) {
      setTwoFactorEnabled(!!user.two_factor_enabled)
    }
  }, [user])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    if (passwords.new.length < 8) {
      toast.error('Le mot de passe doit faire au moins 8 caractères')
      return
    }

    setIsChangingPassword(true)
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          current_password: passwords.current,
          new_password: passwords.new
        })
      })
      toast.success('Votre mot de passe a été modifié avec succès.')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la modification du mot de passe')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleToggle2FA = async () => {
    setIsToggling2FA(true)
    try {
      const response = await apiFetch<{ two_factor_enabled: boolean }>('/auth/toggle-2fa', {
        method: 'POST'
      })
      setTwoFactorEnabled(response.two_factor_enabled)
      toast.success(response.two_factor_enabled ? '2FA activé' : '2FA désactivé')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour de la 2FA')
    } finally {
      setIsToggling2FA(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <>
      {/* Header */}
      <section className="py-8 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <Link href="/account" className="flex items-center gap-2 text-primary hover:underline mb-4 w-fit">
            <ArrowLeft className="w-4 h-4" />
            Retour au compte
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Sécurité</h1>
          <p className="text-muted-foreground">Gérez votre sécurité et vos paramètres de connexion</p>
        </div>
      </section>

      {/* Success Message - Removed as we use toast */}

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl space-y-6">
          {/* Change Password */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Changer votre mot de passe</h2>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Mot de passe actuel</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    placeholder="Entrez votre mot de passe actuel"
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                  />
                  <button
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="new"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    placeholder="Entrez votre nouveau mot de passe"
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                  />
                  <button
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 8 caractères, avec majuscules, minuscules et chiffres
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    placeholder="Confirmez votre nouveau mot de passe"
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                  />
                  <button
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {passwords.new && (
                <div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <div className={`h-2 flex-1 rounded-full ${passwords.new.length >= 8 ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    <span className={passwords.new.length >= 8 ? 'text-green-600' : 'text-red-600'}>
                      {passwords.new.length >= 8 ? 'Mot de passe fort' : 'Mot de passe faible'}
                    </span>
                  </div>
                </div>
              )}

              {passwords.new && passwords.new !== passwords.confirm && (
                <div className="p-3 bg-yellow-100 border border-yellow-200 text-yellow-800 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Les mots de passe ne correspondent pas
                </div>
              )}

              <Button
                onClick={handleChangePassword}
                disabled={!passwords.current || !passwords.new || passwords.new !== passwords.confirm || isChangingPassword}
                className="w-full mt-6"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Modification...
                  </>
                ) : (
                  'Changer le mot de passe'
                )}
              </Button>
            </div>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Authentification à deux facteurs</h2>
              </div>
              <Button
                variant={twoFactorEnabled ? 'outline' : 'default'}
                onClick={handleToggle2FA}
                disabled={isToggling2FA}
              >
                {isToggling2FA ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  twoFactorEnabled ? 'Désactiver' : 'Activer'
                )}
              </Button>
            </div>

            <p className="text-muted-foreground mb-4">
              Renforcez la sécurité de votre compte en activant l'authentification à deux facteurs. Vous devrez entrer un code de vérification lors de chaque connexion.
            </p>

            {twoFactorEnabled && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-3">Étapes suivantes:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Téléchargez une application d'authentification (Google Authenticator, Authy, Microsoft Authenticator)</li>
                  <li>Scannez le code QR ci-dessous</li>
                  <li>Entrez le code de 6 chiffres généré</li>
                </ol>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  Configurer 2FA
                </Button>
              </div>
            )}
          </Card>

          {/* Active Sessions */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <LogOut className="w-6 h-6 text-primary" />
              Sessions actives
            </h2>

            <div className="space-y-4">
              {[
                {
                  device: 'Chrome sur Windows',
                  ip: '192.168.1.100',
                  lastActive: 'À l\'instant',
                  isCurrent: true,
                },
                {
                  device: 'Safari sur iPhone',
                  ip: '192.168.1.101',
                  lastActive: 'Il y a 2 heures',
                  isCurrent: false,
                },
                {
                  device: 'Chrome sur Android',
                  ip: '192.168.1.102',
                  lastActive: 'Il y a 1 jour',
                  isCurrent: false,
                },
              ].map((session, idx) => (
                <div key={idx} className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {session.device}
                      {session.isCurrent && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          Cette session
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">{session.ip}</p>
                    <p className="text-xs text-muted-foreground">Dernière activité: {session.lastActive}</p>
                  </div>
                  {!session.isCurrent && (
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Déconnecter
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Security Tips */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Conseils de sécurité
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Utilisez un mot de passe unique et fort</li>
              <li>• Activez l'authentification à deux facteurs</li>
              <li>• Vérifiez régulièrement vos sessions actives</li>
              <li>• Ne partagez jamais votre mot de passe</li>
              <li>• Déconnectez-vous après chaque utilisation sur un appareil partagé</li>
            </ul>
          </Card>
        </div>
      </section>
    </>
  )
}
