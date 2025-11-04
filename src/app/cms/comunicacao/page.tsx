import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Plus, Send, Users } from "lucide-react"

export default function ComunicacaoPage() {
  const newsletters = [
    { id: 1, assunto: "Boletim Informativo Janeiro 2025", destinatarios: 450, status: "enviada", data_envio: "2025-01-15" },
    { id: 2, assunto: "Convocação Assembleia Geral", destinatarios: 380, status: "rascunho", data_envio: null },
    { id: 3, assunto: "Resultado Eleições 2024", destinatarios: 420, status: "enviada", data_envio: "2024-12-20" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comunicação</h1>
          <p className="text-muted-foreground">Gerencie newsletters e comunicações da ASOF</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Nova Newsletter</Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Assinantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">
              +15% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletters Enviadas</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Este ano
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Abertura</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              Média dos últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Newsletters */}
      <Card>
        <CardHeader>
          <CardTitle>Newsletters</CardTitle>
          <CardDescription>
            Histórico de newsletters enviadas e rascunhos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newsletters.map((newsletter) => (
              <div key={newsletter.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <h3 className="font-medium">{newsletter.assunto}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{newsletter.destinatarios} destinatários</span>
                    {newsletter.data_envio && (
                      <span>Enviada em {new Date(newsletter.data_envio).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                  <Badge variant={
                    newsletter.status === "enviada" ? "default" :
                    newsletter.status === "rascunho" ? "secondary" : "outline"
                  }>
                    {newsletter.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {newsletter.status === "rascunho" && (
                    <Button size="sm" variant="default">
                      <Send className="w-4 h-4 mr-1" />
                      Enviar
                    </Button>
                  )}
                  <Button size="sm" variant="outline">Editar</Button>
                  <Button size="sm" variant="outline">Duplicar</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
