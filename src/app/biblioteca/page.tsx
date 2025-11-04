"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Publicacao {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  tipo: 'pdf' | 'doc' | 'link';
  tamanho?: string;
  dataPublicacao: string;
  downloads: number;
  destaque: boolean;
}

export default function BibliotecaPage() {
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [categoriaFilter, setCategoriaFilter] = useState<string>('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for publications
    const mockPublicacoes: Publicacao[] = [
      {
        id: 1,
        titulo: "Regulamento da Carreira de Oficial de Chancelaria",
        descricao: "Documento completo com todas as normas e regulamentos da carreira",
        categoria: "Regulamentos",
        tipo: "pdf",
        tamanho: "2.3 MB",
        dataPublicacao: "2024-01-15",
        downloads: 245,
        destaque: true
      },
      {
        id: 2,
        titulo: "Tabela Salarial 2024",
        descricao: "Tabela completa de salários e benefícios dos Oficiais de Chancelaria",
        categoria: "Salários",
        tipo: "pdf",
        tamanho: "1.8 MB",
        dataPublicacao: "2024-02-01",
        downloads: 189,
        destaque: true
      },
      {
        id: 3,
        titulo: "Guia de Direitos Trabalhistas",
        descricao: "Manual completo sobre direitos e deveres dos servidores públicos",
        categoria: "Direitos",
        tipo: "pdf",
        tamanho: "3.1 MB",
        dataPublicacao: "2024-03-10",
        downloads: 156,
        destaque: false
      },
      {
        id: 4,
        titulo: "Convenções Coletivas 2020-2023",
        descricao: "Arquivo com todas as convenções coletivas assinadas no período",
        categoria: "Convenções",
        tipo: "pdf",
        tamanho: "4.2 MB",
        dataPublicacao: "2024-01-20",
        downloads: 98,
        destaque: false
      },
      {
        id: 5,
        titulo: "Portal do Servidor - MRE",
        descricao: "Link para o portal oficial do Ministério das Relações Exteriores",
        categoria: "Links Úteis",
        tipo: "link",
        dataPublicacao: "2024-01-01",
        downloads: 0,
        destaque: true
      },
      {
        id: 6,
        titulo: "Jurisprudência - Casos Relevantes",
        descricao: "Compilado de decisões judiciais relevantes para a categoria",
        categoria: "Jurídico",
        tipo: "pdf",
        tamanho: "5.7 MB",
        dataPublicacao: "2024-02-15",
        downloads: 67,
        destaque: false
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setPublicacoes(mockPublicacoes);
      setLoading(false);
    }, 500);
  }, []);

  const categorias = ['todos', ...Array.from(new Set(publicacoes.map(p => p.categoria)))];

  const filteredPublicacoes = categoriaFilter === 'todos'
    ? publicacoes
    : publicacoes.filter(p => p.categoria === categoriaFilter);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'pdf':
        return '📄';
      case 'doc':
        return '📝';
      case 'link':
        return '🔗';
      default:
        return '📄';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'doc':
        return 'bg-blue-100 text-blue-800';
      case 'link':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando biblioteca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Biblioteca
            </h1>
            <p className="text-xl">
              Acesso a documentos, publicações e recursos importantes para a categoria
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categorias.map((categoria) => (
              <Button
                key={categoria}
                variant={categoriaFilter === categoria ? 'default' : 'outline'}
                onClick={() => setCategoriaFilter(categoria)}
                className="capitalize"
              >
                {categoria === 'todos' ? 'Todas as Categorias' : categoria}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Destaques */}
      {categoriaFilter === 'todos' && (
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Destaques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicacoes.filter(p => p.destaque).map((publicacao) => (
                <Card key={publicacao.id} className="hover:shadow-lg transition-shadow border-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-100 text-blue-800">Destaque</Badge>
                      <span className="text-2xl">{getTipoIcon(publicacao.tipo)}</span>
                    </div>
                    <CardTitle className="text-lg">{publicacao.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {publicacao.descricao}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{publicacao.categoria}</span>
                      <span>{publicacao.downloads} downloads</span>
                    </div>
                    <Button className="w-full mt-4" size="sm">
                      {publicacao.tipo === 'link' ? 'Acessar' : 'Download'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Todas as Publicações */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {categoriaFilter === 'todos' ? 'Todas as Publicações' : `Categoria: ${categoriaFilter}`}
            </h2>
            <p className="text-gray-600">
              {filteredPublicacoes.length} publicação(ões) encontrada(s)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPublicacoes.map((publicacao) => (
              <Card key={publicacao.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl flex-shrink-0">
                      {getTipoIcon(publicacao.tipo)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTipoColor(publicacao.tipo)}>
                          {publicacao.tipo.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-500">{publicacao.categoria}</span>
                      </div>

                      <h3 className="font-semibold text-lg mb-2">{publicacao.titulo}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {publicacao.descricao}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>Data: {new Date(publicacao.dataPublicacao).toLocaleDateString('pt-BR')}</span>
                        {publicacao.tamanho && <span>Tamanho: {publicacao.tamanho}</span>}
                        {publicacao.downloads > 0 && <span>{publicacao.downloads} downloads</span>}
                      </div>

                      <Button className="w-full">
                        {publicacao.tipo === 'link' ? 'Acessar Link' : 'Download'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPublicacoes.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhuma publicação encontrada
                </h3>
                <p className="text-gray-500">
                  Não há publicações disponíveis nesta categoria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Solicitar Documento */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Não encontrou o que procura?</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Entre em contato conosco para solicitar documentos específicos ou esclarecer dúvidas
                sobre nossa biblioteca de publicações.
              </p>
              <Button asChild>
                <Link href="/contato">Fazer Solicitação</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
