import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Video, Plus, Play, Eye } from "lucide-react"

export default function VideosPage() {
  const videos = [
    { id: 1, titulo: "Seminário Previdência Sustentável", categoria: "Eventos", visualizacoes: 1250, status: "ativo" },
    { id: 2, titulo: "Assembleia Geral 2024", categoria: "Assembleias", visualizacoes: 890, status: "ativo" },
    { id: 3, titulo: "Entrevista com Presidente", categoria: "Entrevistas", visualizacoes: 567, status: "inativo" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de Vídeos</h1>
          <p className="text-muted-foreground">Gerencie os vídeos disponíveis no site</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Novo Vídeo</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                  <Video className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">{video.titulo}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{video.categoria}</Badge>
                    <Badge variant={video.status === "ativo" ? "default" : "secondary"}>
                      {video.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <Eye className="w-4 h-4 inline mr-1" />
                    {video.visualizacoes} visualizações
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Play className="w-4 h-4 mr-1" />
                    Reproduzir
                  </Button>
                  <Button size="sm" variant="outline">Editar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
