"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import { useFiliacaoStore } from "@/stores/filiacao-store"

export default function FiliacaoPage() {
  const {
    filiacoes,
    loading,
    error,
    fetchFiliacoes,
    approveFiliacao,
    rejectFiliacao
  } = useFiliacaoStore()

  useEffect(() => {
    fetchFiliacoes()
  }, [fetchFiliacoes])

  const handleApprove = async (id: number) => {
    if (confirm('Tem certeza que deseja aprovar esta filiação?')) {
      await approveFiliacao(id, 'Aprovada pelo administrador')
    }
  }

  const handleReject = async (id: number) => {
    const motivo = prompt('Motivo da rejeição:')
    if (motivo) {
      await rejectFiliacao(id, motivo)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>
      case "aprovada":
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Aprovada</Badge>
      case "rejeitada":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejeitada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Filiações</h1>
        <p className="text-muted-foreground">
          Aprovar ou rejeitar solicitações de filiação à ASOF
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filiacoes.filter(f => f.status === "pendente").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filiacoes.filter(f => f.status === "aprovada").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filiacoes.filter(f => f.status === "rejeitada").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Filiações */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitações de Filiação</CardTitle>
          <CardDescription>
            Gerencie todas as solicitações de filiação recebidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filiacoes.map((filiacao) => (
              <div key={filiacao.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{filiacao.nome}</h3>
                    {getStatusBadge(filiacao.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Email: {filiacao.email}</p>
                    <p>Telefone: {filiacao.telefone}</p>
                    <p>Data: {new Date(filiacao.data_solicitacao).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded">Documentos: {filiacao.documentos.length}</span>
                    {filiacao.observacoes && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Obs: {filiacao.observacoes}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {filiacao.status === "pendente" && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApprove(filiacao.id)}
                        disabled={loading}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(filiacao.id)}
                        disabled={loading}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejeitar
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
