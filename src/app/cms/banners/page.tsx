import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Image, Plus, Edit, Trash2 } from "lucide-react"

export default function BannersPage() {
  // Mock data - será substituído por dados reais da API
  const banners = [
    {
      id: 1,
      title: "Seminário Previdência Sustentável",
      categoria: "Eventos",
      path_image: "/banners/seminario.jpg",
      url: "https://asof.org.br/eventos/seminario",
      window: "_blank" as const,
      published_at: "2025-01-15",
      expired_at: "2025-12-31",
      status: 1,
      clicks: 245,
    },
    {
      id: 2,
      title: "Filiação ASOF",
      categoria: "Associação",
      path_image: "/banners/filiacao.jpg",
      url: "https://asof.org.br/filiacao",
      window: "_self" as const,
      published_at: "2025-01-01",
      expired_at: "2025-12-31",
      status: 1,
      clicks: 189,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Banners</h1>
          <p className="text-muted-foreground">
            Gerencie os banners exibidos no site da ASOF
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Banner
        </Button>
      </div>

      {/* Lista de Banners */}
      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-12 bg-muted rounded flex items-center justify-center">
                    <Image className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{banner.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{banner.categoria}</Badge>
                      <Badge variant={banner.status ? "default" : "secondary"}>
                        {banner.status ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {banner.clicks} cliques • Expira em {new Date(banner.expired_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
