import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, Download, FileText } from "lucide-react"

export default function BibliotecaPage() {
  const documentos = [
    { id: 1, titulo: "Estatuto ASOF", categoria: "Documentos Oficiais", tipo: "PDF", tamanho: "2.5MB", downloads: 45 },
    { id: 2, titulo: "Regimento Interno", categoria: "Normas", tipo: "PDF", tamanho: "1.8MB", downloads: 32 },
    { id: 3, titulo: "Relatório Anual 2024", categoria: "Relatórios", tipo: "PDF", tamanho: "5.2MB", downloads: 78 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Documentos</h1>
          <p className="text-muted-foreground">Gerencie os documentos disponíveis para download</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Novo Documento</Button>
      </div>

      <div className="grid gap-4">
        {documentos.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{doc.titulo}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{doc.categoria}</Badge>
                      <Badge variant="secondary">{doc.tipo}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {doc.tamanho} • {doc.downloads} downloads
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
