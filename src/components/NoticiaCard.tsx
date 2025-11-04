import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Noticia } from "@/types";
import { formatDate, truncateText } from "@/utils/api";
import { memo, useMemo } from "react";

interface NoticiaCardProps {
  noticia: Noticia;
}

export const NoticiaCard = memo(function NoticiaCard({ noticia }: NoticiaCardProps) {
  const truncatedContent = useMemo(() => {
    return truncateText(noticia.conteudo.replace(/<[^>]*>/g, ''), 150);
  }, [noticia.conteudo]);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={noticia.imagem}
            alt={noticia.titulo}
            fill
            className="object-cover rounded-t-lg"
            onError={(e) => {
              // Fallback para imagem padrão se a imagem não carregar
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-news.jpg';
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {noticia.categorias.map((categoria) => (
              <span
                key={categoria.id}
                className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                style={{ backgroundColor: categoria.cor + '20', color: categoria.cor }}
              >
                {categoria.nome}
              </span>
            ))}
            <span>•</span>
            <span>{formatDate(noticia.datetime)}</span>
          </div>

          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            <Link
              href={`/noticias/${noticia.slug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {noticia.titulo}
            </Link>
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3">
            {truncatedContent}
          </p>

          <Link
            href={`/noticias/${noticia.slug}`}
            className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Ler mais →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});
