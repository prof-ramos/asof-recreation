"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Image, Calendar, TrendingUp, Eye, Loader2 } from "lucide-react"
import { DashboardStats } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats');
        
        if (!response.ok) {
          throw new Error('Erro ao buscar estatísticas');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
        setError('Erro ao carregar estatísticas do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Dados simulados de atividades recentes (em produção, viria de um endpoint específico)
  const recentActivities = [
    { id: 1, type: "noticia", title: "Nova notícia publicada", time: "2h atrás" },
    { id: 2, type: "filiacao", title: "Nova filiação pendente", time: "4h atrás" },
    { id: 3, type: "evento", title: "Evento criado", time: "1d atrás" },
    { id: 4, type: "banner", title: "Banner atualizado", time: "2d atrás" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel administrativo da ASOF
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-red-500 mb-2">
                <TrendingUp className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-1">Erro ao carregar estatísticas</h3>
              <p className="text-gray-600 mb-4">{error || 'Dados indisponíveis no momento'}</p>
              <button 
                className="text-blue-600 hover:underline"
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo da ASOF
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Notícias</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_noticias}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Ativos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_eventos}</div>
            <p className="text-xs text-muted-foreground">
              Ativos no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banners Ativos</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_banners}</div>
            <p className="text-xs text-muted-foreground">
              Publicados no site
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filiações Pendentes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_filiacoes_pendentes}</div>
            <p className="text-xs text-muted-foreground">
              Requer análise
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acessos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Acessos Hoje
            </CardTitle>
            <CardDescription>
              Número de visitantes únicos hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.acessos_hoje.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">+12% em relação a ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Acessos do Mês
            </CardTitle>
            <CardDescription>
              Total de acessos no mês atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.acessos_mes.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">+8% em relação ao mês passado</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>
            Últimas ações realizadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={
                    activity.type === "noticia" ? "default" :
                    activity.type === "filiacao" ? "destructive" :
                    activity.type === "evento" ? "secondary" : "outline"
                  }>
                    {activity.type}
                  </Badge>
                  <span className="text-sm">{activity.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
