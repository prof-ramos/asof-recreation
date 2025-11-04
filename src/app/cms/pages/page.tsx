import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Edit, Eye } from "lucide-react"

export default function PagesPage() {
  const pages = [
    { id: 1, slug: "sobre", titulo: "Sobre a ASOF", status: "ativo", acessos: 1250 },
    { id: 2, slug: "membros", titulo: "Membros", status: "ativo", acessos: 890 },
    { id: 3, slug: "contato", titulo: "Contato", status: "ativo", acessos: 567 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administração de Páginas</h1>
          <p className="text-muted-foreground">Gerencie as páginas estáticas do site</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Nova Página</Button>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{page.titulo}</h3>
                  <p className="text-sm text-muted-foreground">/{page.slug}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={page.status === "ativo" ? "default" : "secondary"}>
                      {page.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {page.acessos} acessos
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button>
                  <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
