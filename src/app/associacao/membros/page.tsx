"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Membro {
  id: number;
  nome: string;
  cargo: string;
  departamento?: string;
  email?: string;
  telefone?: string;
  foto?: string;
}

export default function MembrosPage() {
  // Mock data for board members
  const membrosDiretoria: Membro[] = [
    {
      id: 1,
      nome: "Manuel Bezerra",
      cargo: "Presidente",
      email: "presidente@asof.org.br",
      telefone: "(61) 99999-0001"
    },
    {
      id: 2,
      nome: "Aline de Souza",
      cargo: "Diretora-Executiva",
      email: "diretora@asof.org.br",
      telefone: "(61) 99999-0002"
    },
    {
      id: 3,
      nome: "Carlos Eduardo Silva",
      cargo: "Vice-Presidente",
      email: "vice@asof.org.br",
      telefone: "(61) 99999-0003"
    },
    {
      id: 4,
      nome: "Maria Fernanda Costa",
      cargo: "Secretária-Geral",
      email: "secretaria@asof.org.br",
      telefone: "(61) 99999-0004"
    },
    {
      id: 5,
      nome: "Roberto Santos",
      cargo: "Tesoureiro",
      email: "tesoureiro@asof.org.br",
      telefone: "(61) 99999-0005"
    }
  ];

  const membrosEquipe: Membro[] = [
    {
      id: 6,
      nome: "Ana Paula Oliveira",
      cargo: "Assessora Jurídica",
      departamento: "Assessoria Jurídica",
      email: "juridico@asof.org.br"
    },
    {
      id: 7,
      nome: "João Pedro Lima",
      cargo: "Coordenador de Comunicação",
      departamento: "Comunicação",
      email: "comunicacao@asof.org.br"
    },
    {
      id: 8,
      nome: "Carla Regina Mendes",
      cargo: "Coordenadora Administrativa",
      departamento: "Administração",
      email: "administracao@asof.org.br"
    },
    {
      id: 9,
      nome: "Fernando Alves",
      cargo: "Assessor Parlamentar",
      departamento: "Relações Institucionais",
      email: "parlamentar@asof.org.br"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nossa Equipe
            </h1>
            <p className="text-xl">
              Conheça os profissionais dedicados à defesa dos direitos dos Oficiais de Chancelaria
            </p>
          </div>
        </div>
      </section>

      {/* Diretoria */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Diretoria Executiva</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A diretoria da ASOF é composta por profissionais experientes e comprometidos
              com a defesa dos interesses da categoria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {membrosDiretoria.map((membro) => (
              <Card key={membro.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {membro.nome.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{membro.nome}</CardTitle>
                  <p className="text-blue-600 font-semibold">{membro.cargo}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2 text-sm text-gray-600">
                    {membro.email && (
                      <p>
                        <span className="font-medium">E-mail:</span> {membro.email}
                      </p>
                    )}
                    {membro.telefone && (
                      <p>
                        <span className="font-medium">Telefone:</span> {membro.telefone}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Equipe Técnica */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Equipe Técnica</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Profissionais especializados que dão suporte aos filiados e à diretoria
              em suas atividades diárias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {membrosEquipe.map((membro) => (
              <Card key={membro.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-gray-600">
                        {membro.nome.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{membro.nome}</h3>
                      <p className="text-blue-600 font-medium">{membro.cargo}</p>
                      {membro.departamento && (
                        <p className="text-sm text-gray-500 mb-2">{membro.departamento}</p>
                      )}
                      {membro.email && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">E-mail:</span> {membro.email}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Conselho Fiscal */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Conselho Fiscal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">CF</span>
                    </div>
                    <h4 className="font-semibold">Conselheiro 1</h4>
                    <p className="text-sm text-gray-600">Nome do Conselheiro</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">CF</span>
                    </div>
                    <h4 className="font-semibold">Conselheiro 2</h4>
                    <p className="text-sm text-gray-600">Nome do Conselheiro</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">CF</span>
                    </div>
                    <h4 className="font-semibold">Suplente</h4>
                    <p className="text-sm text-gray-600">Nome do Suplente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
