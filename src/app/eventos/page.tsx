"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EventoCard } from "@/components/EventoCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Evento } from "@/types";
import { fetchEventos } from "@/utils/api";

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filteredEventos, setFilteredEventos] = useState<Evento[]>([]);
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventos = async () => {
      try {
        const data = await fetchEventos();
        // Simular mais eventos para a página
        const duplicated = Array.from({ length: 8 }, (_, i) => ({
          ...data[0],
          id: data[0].id + i,
          uuid: `event-uuid-${i + 1}`,
          titulo: `${data[0].titulo} ${i + 1}`,
          data: new Date(Date.now() + (i * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Próximas semanas
          status: i < 3 ? 'ativo' : 'inativo' as 'ativo' | 'inativo'
        }));
        setEventos(duplicated);
        setFilteredEventos(duplicated);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEventos();
  }, []);

  useEffect(() => {
    if (statusFilter === 'todos') {
      setFilteredEventos(eventos);
    } else {
      setFilteredEventos(eventos.filter(evento => evento.status === statusFilter));
    }
  }, [eventos, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando eventos...</p>
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
              Eventos
            </h1>
            <p className="text-xl">
              Acompanhe nossas atividades, seminários e eventos da categoria
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant={statusFilter === 'todos' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('todos')}
            >
              Todos os Eventos
            </Button>
            <Button
              variant={statusFilter === 'ativo' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('ativo')}
            >
              Eventos Ativos
            </Button>
            <Button
              variant={statusFilter === 'inativo' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('inativo')}
            >
              Eventos Encerrados
            </Button>
          </div>
        </div>
      </section>

      {/* Eventos Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {statusFilter === 'todos' ? 'Todos os Eventos' :
               statusFilter === 'ativo' ? 'Eventos Ativos' : 'Eventos Encerrados'}
            </h2>
            <p className="text-gray-600">
              {statusFilter === 'todos'
                ? 'Confira nossa programação completa de eventos'
                : statusFilter === 'ativo'
                ? 'Eventos que estão acontecendo ou estão por vir'
                : 'Eventos já realizados pela ASOF'
              }
            </p>
          </div>

          {filteredEventos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEventos.map((evento) => (
                <EventoCard key={evento.id} evento={evento} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum evento encontrado
                </h3>
                <p className="text-gray-500">
                  {statusFilter === 'ativo'
                    ? 'Não há eventos ativos no momento.'
                    : statusFilter === 'inativo'
                    ? 'Nenhum evento encerrado encontrado.'
                    : 'Nenhum evento disponível.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Newsletter / Inscrição */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Não perca nenhum evento!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Inscreva-se em nossa newsletter e receba informações sobre todos os nossos eventos
            e atividades da categoria.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900"
            />
            <Button className="bg-white text-blue-900 hover:bg-gray-100">
              Inscrever-se
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
