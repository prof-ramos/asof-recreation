import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Evento } from "@/types";
import { formatDate } from "@/utils/api";

interface EventoCardProps {
  evento: Evento;
}

export function EventoCard({ evento }: EventoCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'inativo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'inativo':
        return 'Encerrado';
      default:
        return status;
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getStatusColor(evento.status)}>
            {getStatusText(evento.status)}
          </Badge>
          <span className="text-sm text-gray-500">
            {formatDate(evento.data)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            <Link
              href={`/eventos/exibe/${evento.uuid}`}
              className="hover:text-blue-600 transition-colors"
            >
              {evento.titulo}
            </Link>
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3">
            {evento.descricao}
          </p>

          {evento.local && (
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {evento.local}
            </div>
          )}

          <Link
            href={`/eventos/exibe/${evento.uuid}`}
            className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Ver detalhes →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
