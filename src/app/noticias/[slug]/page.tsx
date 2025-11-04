import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Share2, Eye } from 'lucide-react';
import { Noticia } from '@/types';
import { fetchNoticiaBySlugDirect, formatDate } from '@/utils/api';

interface NoticiaPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: NoticiaPageProps): Promise<Metadata> {
  const noticia = await fetchNoticiaBySlugDirect(params.slug);

  if (!noticia) {
    return {
      title: 'Notícia não encontrada | ASOF',
    };
  }

  return {
    title: `${noticia.titulo} | ASOF`,
    description: noticia.conteudo.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      title: noticia.titulo,
      description: noticia.conteudo.replace(/<[^>]*>/g, '').substring(0, 160),
      images: [noticia.imagem],
      type: 'article',
      publishedTime: noticia.datetime,
    },
    twitter: {
      card: 'summary_large_image',
      title: noticia.titulo,
      description: noticia.conteudo.replace(/<[^>]*>/g, '').substring(0, 160),
      images: [noticia.imagem],
    },
  };
}

export default async function NoticiaPage({ params }: NoticiaPageProps) {
  const noticia = await fetchNoticiaBySlugDirect(params.slug);

  if (!noticia) {
    notFound();
  }

  // Simular visualizações (em produção seria incrementado no backend)
  const visualizacoes = Math.floor(Math.random() * 100) + 50;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Início</Link>
            <span>/</span>
            <Link href="/noticias" className="hover:text-blue-600">Notícias</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{noticia.titulo}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button asChild variant="ghost" className="mb-6 text-white hover:bg-white/10">
              <Link href="/noticias" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar para Notícias
              </Link>
            </Button>

            <div className="flex flex-wrap gap-2 mb-4">
              {noticia.categorias.map((categoria) => (
                <Badge
                  key={categoria.id}
                  variant="secondary"
                  className="text-white border-white/20"
                  style={{ backgroundColor: categoria.cor + '20', borderColor: categoria.cor }}
                >
                  {categoria.nome}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {noticia.titulo}
            </h1>

            <div className="flex items-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(noticia.datetime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{visualizacoes} visualizações</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo da Notícia */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Conteúdo Principal */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-0">
                    {/* Imagem da Notícia */}
                    <div className="relative h-64 md:h-96 w-full">
                      <Image
                        src={noticia.imagem}
                        alt={noticia.titulo}
                        fill
                        className="object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-news.jpg';
                        }}
                      />
                    </div>

                    {/* Conteúdo */}
                    <div className="p-8">
                      <div
                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
                      />

                      {/* Vídeo em destaque (se existir) */}
                      {noticia.destaque_video && (
                        <div className="mt-8">
                          <h3 className="text-xl font-semibold mb-4">Vídeo em Destaque</h3>
                          <div className="aspect-video">
                            <iframe
                              src={noticia.destaque_video}
                              className="w-full h-full rounded-lg"
                              allowFullScreen
                              title="Vídeo em destaque"
                            />
                          </div>
                        </div>
                      )}

                      {/* Compartilhar */}
                      <div className="mt-8 pt-8 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Share2 className="w-4 h-4" />
                            <span>Compartilhar esta notícia</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (navigator.share) {
                                  navigator.share({
                                    title: noticia.titulo,
                                    text: noticia.conteudo.replace(/<[^>]*>/g, '').substring(0, 100),
                                    url: window.location.href,
                                  });
                                } else {
                                  navigator.clipboard.writeText(window.location.href);
                                  // TODO: Mostrar toast de sucesso
                                }
                              }}
                            >
                              Compartilhar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Informações da Notícia */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Informações</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Publicado em:</span>
                        <span className="font-medium">{formatDate(noticia.datetime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visualizações:</span>
                        <span className="font-medium">{visualizacoes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID:</span>
                        <span className="font-medium">{noticia.hexa}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Categorias */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Categorias</h3>
                    <div className="flex flex-wrap gap-2">
                      {noticia.categorias.map((categoria) => (
                        <Badge
                          key={categoria.id}
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-50"
                          style={{ borderColor: categoria.cor, color: categoria.cor }}
                        >
                          {categoria.nome}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Call to Action */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-blue-900 mb-2">Junte-se à ASOF</h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Faça parte da luta pelos direitos dos servidores do Itamaraty
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/filie-se">Filiar-se</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
