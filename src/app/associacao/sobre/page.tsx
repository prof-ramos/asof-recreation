"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Sobre a ASOF
            </h1>
            <p className="text-xl">
              Conheça nossa história e missão na defesa dos direitos dos Oficiais de Chancelaria
            </p>
          </div>
        </div>
      </section>

      {/* História Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Nossa História</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-lg mb-6">
                  A ASOF (Associação Nacional dos Oficiais de Chancelaria do Serviço Exterior Brasileiro)
                  foi fundada em outubro de 1990, configurando-se como uma entidade civil sem fins lucrativos
                  com sede em Brasília, Distrito Federal.
                </p>
                <p className="mb-6">
                  A associação foi criada para representar especificamente os interesses da carreira de
                  Oficial de Chancelaria, instituída pela Lei nº 3.917, de 14 de julho de 1961.
                </p>
                <p>
                  Desde sua fundação, a ASOF tem atuado incansavelmente na defesa dos direitos e na
                  valorização profissional dos Oficiais de Chancelaria do Serviço Exterior Brasileiro,
                  contribuindo para o fortalecimento e o desenvolvimento da diplomacia nacional.
                </p>
              </CardContent>
            </Card>

            {/* Missão, Visão, Valores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">Missão</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Representar e defender os interesses da carreira de Oficial de Chancelaria,
                    promovendo a valorização profissional e contribuindo para o fortalecimento
                    do Serviço Exterior Brasileiro.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">Visão</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Ser a entidade de referência na representação dos Oficiais de Chancelaria,
                    reconhecida pela sociedade e pelos poderes públicos como defensora legítima
                    dos direitos e interesses da categoria.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">Valores</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ética e transparência</li>
                    <li>Compromisso com a categoria</li>
                    <li>Defesa dos direitos trabalhistas</li>
                    <li>Valorização profissional</li>
                    <li>União e solidariedade</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Atuação */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Nossa Atuação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-3">Representação</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Diálogo permanente com o Ministério das Relações Exteriores</li>
                      <li>• Participação em negociações salariais e funcionais</li>
                      <li>• Representação em órgãos colegiados</li>
                      <li>• Articulação com entidades representativas</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-3">Serviços aos Filiados</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Assessoria jurídica especializada</li>
                      <li>• Informações sobre direitos e deveres</li>
                      <li>• Orientação funcional e administrativa</li>
                      <li>• Comunicação e divulgação de informações</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossa Força</h2>
            <p className="text-xl">Mais de 30 anos de luta e conquistas</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">30+</div>
              <div className="text-blue-200">Anos de atuação</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-200">Filiados ativos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Postos no exterior</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Suporte aos filiados</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
