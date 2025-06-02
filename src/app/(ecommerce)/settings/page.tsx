"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Key, Loader2, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: string;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function UserSettingsPage() {
  const { data: session, update } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
  });

  // Cargar datos del usuario
  useEffect(() => {
    fetchUserProfile();
  }, []);
  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setFormData({
          name: userData.name || "",
          username: userData.username || "",
        });
      } else {
        toast.error("Error al cargar el perfil");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar el perfil");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        
        // Actualizar la sesión con los nuevos datos
        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
            username: updatedUser.username,
          }
        });
        
        toast.success("Perfil actualizado correctamente");
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar el perfil");    } finally {
      setSaving(false);
    }
  };

  // Loading state is now handled by loading.tsx

  return (
    <div className="space-y-6 container px-4 2xl:px-0 mx-auto py-8 min-h-screen">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Mi Configuración</h1>
      </div>

      <div className="text-muted-foreground">
        Gestiona tu información personal y configuración de cuenta
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
            <CardDescription>
              Actualiza tu información básica de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ingresa tu nombre completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Ingresa tu nombre de usuario"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  El email no se puede cambiar
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Seguridad
            </CardTitle>
            <CardDescription>
              Gestiona la seguridad de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Recuperación de Contraseña</h4>
                  <p className="text-sm text-muted-foreground">
                    Enviar enlace de recuperación a tu email
                  </p>
                </div>
                <Link href="/auth/forgot-password">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Enviar
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información de la Cuenta */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
          <CardDescription>
            Detalles de tu cuenta de usuario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">
                ID de Usuario:
              </span>
              <div className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">
                {user?.id || "No disponible"}
              </div>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Tipo de Cuenta:</span>
              <div className="font-semibold mt-1">
                {user?.role === "ADMIN" ? "Administrador" : "Usuario"}
              </div>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Cuenta creada:
              </span>
              <div className="mt-1">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "No disponible"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
