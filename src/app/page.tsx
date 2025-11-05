"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NoticiaCard } from "@/components/NoticiaCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Noticia, Banner, Foto } from "@/types";
import { fetchNoticias, fetchBanners, fetchFotos } from "@/utils/api";

export default function Home() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [noticiasData, bannersData, fotosData] = await Promise.all([
          fetchNoticias(),
          fetchBanners(),
          fetchFotos()
        ]);
        setNoticias(noticiasData.data);
        setBanners(bannersData);
        setFotos(fotosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section with Banner */}
      {banners.length > 0 && (
        <section className="relative h-96 bg-gradient-to-r from-blue-900 to-blue-700">
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                ASOF - Associação Nacional dos Oficiais de Chancelaria
              </h1>
              <p className="text-xl mb-8">
                Defendendo os direitos e interesses dos servidores do Itamaraty
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg">
                  <Link href="/filie-se">Filiar-se</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-900">
                  <Link href="/associacao/sobre">Sobre nós</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Últimas Notícias */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Últimas Notícias</h2>
            <Button asChild variant="outline">
              <Link href="/noticias">Ver todas</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((noticia) => (
              <NoticiaCard key={noticia.id} noticia={noticia} />
            ))}
          </div>
        </div>
      </section>

      {/* Galeria de Fotos */}
      {fotos.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Galeria de Fotos</h2>
              <Button asChild variant="outline">
                <Link href="/galeria">Ver todas</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {fotos.slice(0, 8).map((foto) => (
                <Card key={foto.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-32 w-full">
                      <Image
                        src={foto.url}
                        alt={foto.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chamada para Ação */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Junte-se à ASOF</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Faça parte da luta pelos direitos dos servidores do Serviço Exterior Brasileiro
          </p>
          <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
            <Link href="/filie-se">Filiar-se agora</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
