import { NextRequest, NextResponse } from 'next/server';
import { 
  noticiasDb, 
  eventsDb, 
  bannersDb, 
  filiacoesDb,
  pagesDb,
  documentsDb,
  videosDb
} from '@/lib/database';
import { DashboardStats } from '@/types';

// GET /api/stats - Endpoint para estatísticas do dashboard
export async function GET(request: NextRequest) {
  try {
    // Obter estatísticas de diferentes entidades
    const noticias = noticiasDb.findAll();
    const eventos = eventsDb.findAll();
    const banners = bannersDb.findAll();
    const filiacoes = filiacoesDb.findAll();
    
    const totalNoticias = noticias.length;
    const totalEventos = eventos.length;
    const totalBanners = banners.length;
    const totalFiliacoes = filiacoes.length;
    const totalFiliacoesPendentes = filiacoes.filter(f => f.status === 'pendente').length;
    const totalFiliacoesAprovadas = filiacoes.filter(f => f.status === 'aprovada').length;
    const totalFiliacoesRejeitadas = filiacoes.filter(f => f.status === 'rejeitada').length;
    
    // Métricas detalhadas para banners
    const bannersAtivos = banners.filter(b => b.status === 1).length; // Assumindo status 1 = ativo
    const bannersExpirados = banners.filter(b => new Date(b.expired_at) < new Date()).length;
    
    // Métricas detalhadas para filiações
    const filiacoesPorMes = filiacoes.reduce((acc, filiacao) => {
      const mes = filiacao.createdAt.substring(0, 7); // YYYY-MM
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calcular acessos (simulação - em produção, seria de uma tabela de logs)
    // Para simular acesso real, vamos usar dados das entidades acessadas recentemente
    const acessosHoje = Math.floor(Math.random() * 100) + 50; // Valor simulado baseado em atividade
    const acessosMes = Math.floor(Math.random() * 1000) + 500; // Valor simulado baseado em atividade
    
    // Outras estatísticas
    const totalPaginas = pagesDb.findAll().length;
    const totalDocumentos = documentsDb.findAll().length;
    const totalVideos = videosDb.findAll().length;

    const stats: DashboardStats = {
      total_noticias: totalNoticias,
      total_eventos: totalEventos,
      total_banners: totalBanners,
      total_filiacoes_pendentes: totalFiliacoesPendentes,
      acessos_hoje: acessosHoje,
      acessos_mes: acessosMes,
    };

    // Adicionando métricas detalhadas como parte da resposta
    const detailedStats = {
      ...stats,
      detalhes: {
        banners: {
          ativos: bannersAtivos,
          expirados: bannersExpirados,
          total: totalBanners
        },
        filiacoes: {
          pendentes: totalFiliacoesPendentes,
          aprovadas: totalFiliacoesAprovadas,
          rejeitadas: totalFiliacoesRejeitadas,
          porMes: filiacoesPorMes,
          total: totalFiliacoes
        },
        acessos: {
          hoje: acessosHoje,
          mes: acessosMes,
          crescimento: 8 // percentual fixo para exemplo
        }
      }
    };

    return NextResponse.json(detailedStats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// GET /api/stats/detailed - Endpoint para estatísticas detalhadas
export async function detailedGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Obter todas as entidades
    const noticias = noticiasDb.findAll();
    const eventos = eventsDb.findAll();
    const banners = bannersDb.findAll();
    const filiacoes = filiacoesDb.findAll();
    
    // Filtrar por data se especificado
    const filteredNoticias = startDate && endDate 
      ? noticias.filter(n => new Date(n.createdAt) >= new Date(startDate) && new Date(n.createdAt) <= new Date(endDate))
      : noticias;
      
    const filteredEventos = startDate && endDate 
      ? eventos.filter(e => new Date(e.createdAt) >= new Date(startDate) && new Date(e.createdAt) <= new Date(endDate))
      : eventos;
      
    const filteredFiliacoes = startDate && endDate 
      ? filiacoes.filter(f => new Date(f.createdAt) >= new Date(startDate) && new Date(f.createdAt) <= new Date(endDate))
      : filiacoes;
    
    // Calcular estatísticas detalhadas
    const stats = {
      period: {
        start: startDate || new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        end: endDate || new Date().toISOString().split('T')[0],
      },
      noticias: {
        total: filteredNoticias.length,
        byStatus: {
          ativo: filteredNoticias.filter(n => n.status === 'ativo').length,
          inativo: filteredNoticias.filter(n => n.status === 'inativo').length,
        }
      },
      eventos: {
        total: filteredEventos.length,
        ativos: filteredEventos.filter(e => e.status === 'ativo').length,
        inativos: filteredEventos.filter(e => e.status === 'inativo').length,
      },
      filiacoes: {
        total: filteredFiliacoes.length,
        status: {
          pendente: filteredFiliacoes.filter(f => f.status === 'pendente').length,
          aprovada: filteredFiliacoes.filter(f => f.status === 'aprovada').length,
          rejeitada: filteredFiliacoes.filter(f => f.status === 'rejeitada').length,
        }
      },
      banners: {
        total: filteredFiliacoes.length,
        ativos: banners.filter(b => b.status === 1).length,
        expirados: banners.filter(b => new Date(b.expired_at) < new Date()).length,
      },
      // Simular dados de acesso por período
      acessos: {
        hoje: Math.floor(Math.random() * 100) + 50,
        periodo: Math.floor(Math.random() * 1000) + 500,
        crescimento: 15 // percentual
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas detalhadas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}