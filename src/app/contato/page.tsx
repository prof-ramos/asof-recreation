"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1000));

    setLoading(false);
    setSubmitted(true);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      assunto: '',
      mensagem: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Entre em Contato
            </h1>
            <p className="text-xl">
              Estamos aqui para ajudar. Entre em contato conosco.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Envie sua mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="text-green-600 text-4xl mb-4">✓</div>
                    <h3 className="text-xl font-semibold text-green-600 mb-2">
                      Mensagem enviada com sucesso!
                    </h3>
                    <p className="text-gray-600">
                      Agradecemos seu contato. Retornaremos em breve.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      className="mt-4"
                      variant="outline"
                    >
                      Enviar outra mensagem
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                          Nome *
                        </label>
                        <Input
                          id="nome"
                          name="nome"
                          type="text"
                          required
                          value={formData.nome}
                          onChange={handleChange}
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          E-mail *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone
                        </label>
                        <Input
                          id="telefone"
                          name="telefone"
                          type="tel"
                          value={formData.telefone}
                          onChange={handleChange}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div>
                        <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-1">
                          Assunto *
                        </label>
                        <Input
                          id="assunto"
                          name="assunto"
                          type="text"
                          required
                          value={formData.assunto}
                          onChange={handleChange}
                          placeholder="Assunto da mensagem"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                        Mensagem *
                      </label>
                      <Textarea
                        id="mensagem"
                        name="mensagem"
                        required
                        rows={5}
                        value={formData.mensagem}
                        onChange={handleChange}
                        placeholder="Digite sua mensagem aqui..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? 'Enviando...' : 'Enviar Mensagem'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Endereço</h4>
                    <p className="text-gray-600">
                      Palácio do Itamaraty<br />
                      Esplanada dos Ministérios<br />
                      Brasília - DF<br />
                      CEP: 70170-900
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">E-mail</h4>
                    <p className="text-gray-600">
                      contato@asof.org.br
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Telefone</h4>
                    <p className="text-gray-600">
                      (61) 2030-8000
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horário de Atendimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Segunda a Sexta:</strong> 8h às 18h</p>
                    <p><strong>Sábado:</strong> 8h às 12h</p>
                    <p><strong>Domingo:</strong> Fechado</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
