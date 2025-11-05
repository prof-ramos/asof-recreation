"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, X, Check } from "lucide-react";

export default function FilieSePage() {
  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [documentoPessoal, setDocumentoPessoal] = useState<File | null>(null);
  const [comprovanteEndereco, setComprovanteEndereco] = useState<File | null>(null);
  const [documentosAdicionais, setDocumentosAdicionais] = useState<File[]>([]);
  
  // Estados para feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [documentosPreview, setDocumentosPreview] = useState<{name: string, type: string}[]>([]);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      // Validação dos campos
      if (!nome || !email || !telefone) {
        throw new Error("Preencha todos os campos obrigatórios.");
      }
      
      if (!documentoPessoal) {
        throw new Error("Envie o documento pessoal (RG ou CPF).");
      }
      
      if (!comprovanteEndereco) {
        throw new Error("Envie o comprovante de endereço.");
      }

      // Preparar dados para envio
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("email", email);
      formData.append("telefone", telefone);
      formData.append("documentoPessoal", documentoPessoal);
      formData.append("comprovanteEndereco", comprovanteEndereco);
      
      documentosAdicionais.forEach((file, index) => {
        formData.append(`documentosAdicionais`, file);
      });

      // Enviar para API
      const response = await fetch("/api/filiacoes", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao enviar a solicitação de filiação.");
      }

      // Em caso de sucesso
      const data = await response.json();
      setSubmitSuccess(true);
      setNome("");
      setEmail("");
      setTelefone("");
      setDocumentoPessoal(null);
      setComprovanteEndereco(null);
      setDocumentosAdicionais([]);
      setDocumentosPreview([]);
    } catch (error: any) {
      setSubmitError(error.message || "Erro ao enviar a solicitação de filiação.");
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para pré-visualizar os documentos adicionais
  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: "principal" | "adicional") => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (tipo === "principal") {
        // Para documento pessoal ou comprovante de endereço
        if (e.target.name === "documentoPessoal") {
          setDocumentoPessoal(file);
        } else if (e.target.name === "comprovanteEndereco") {
          setComprovanteEndereco(file);
        }
      } else if (tipo === "adicional") {
        // Para documentos adicionais
        const newDocumentos = [...documentosAdicionais, file];
        setDocumentosAdicionais(newDocumentos);
        
        // Adiciona à pré-visualização
        setDocumentosPreview([...documentosPreview, { name: file.name, type: file.type }]);
      }
    }
  };

  // Função para remover documento adicional
  const removeDocumento = (index: number) => {
    const novosDocumentos = [...documentosAdicionais];
    novosDocumentos.splice(index, 1);
    setDocumentosAdicionais(novosDocumentos);
    
    const novaPreview = [...documentosPreview];
    novaPreview.splice(index, 1);
    setDocumentosPreview(novaPreview);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Filie-se à ASOF
            </h1>
            <p className="text-xl">
              Junte-se à Associação Nacional dos Oficiais de Chancelaria
            </p>
          </div>
        </div>
      </section>

      {/* Formulário de Filiação */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Formulário de Filiação</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo para solicitar sua filiação à ASOF. 
                  Todos os campos obrigatórios são marcados com *
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Solicitação enviada com sucesso!</h3>
                    <p className="text-gray-600 mb-4">
                      Recebemos sua solicitação de filiação. Em breve você receberá um e-mail com instruções sobre o andamento do seu pedido.
                    </p>
                    <Button 
                      onClick={() => {
                        setSubmitSuccess(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Fazer nova solicitação
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Mensagens de erro */}
                    {submitError && (
                      <Alert variant="destructive">
                        <AlertDescription>{submitError}</AlertDescription>
                      </Alert>
                    )}

                    {/* Dados pessoais */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Dados Pessoais</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nome">
                            Nome Completo * <span className="text-red-500">(obrigatório)</span>
                          </Label>
                          <Input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Digite seu nome completo"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email">
                            E-mail * <span className="text-red-500">(obrigatório)</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu.email@exemplo.com"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="telefone">
                            Telefone * <span className="text-red-500">(obrigatório)</span>
                          </Label>
                          <Input
                            id="telefone"
                            type="tel"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            placeholder="(00) 00000-0000"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Documentos necessários */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Documentos Necessários</h3>
                      
                      <div className="space-y-6">
                        {/* Documento Pessoal */}
                        <div>
                          <Label htmlFor="documentoPessoal">
                            Documento Pessoal (RG ou CPF) * <span className="text-red-500">(obrigatório)</span>
                          </Label>
                          <div className="mt-1 flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                  {documentoPessoal 
                                    ? documentoPessoal.name 
                                    : "Clique para fazer upload do documento pessoal"}
                                </p>
                              </div>
                              <input 
                                id="documentoPessoal" 
                                name="documentoPessoal"
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleDocumentoChange(e, "principal")}
                                required={!documentoPessoal}
                              />
                            </label>
                          </div>
                        </div>
                        
                        {/* Comprovante de Endereço */}
                        <div>
                          <Label htmlFor="comprovanteEndereco">
                            Comprovante de Endereço * <span className="text-red-500">(obrigatório)</span>
                          </Label>
                          <div className="mt-1 flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                  {comprovanteEndereco 
                                    ? comprovanteEndereco.name 
                                    : "Clique para fazer upload do comprovante de endereço"}
                                </p>
                              </div>
                              <input 
                                id="comprovanteEndereco" 
                                name="comprovanteEndereco"
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleDocumentoChange(e, "principal")}
                                required={!comprovanteEndereco}
                              />
                            </label>
                          </div>
                        </div>
                        
                        {/* Documentos Adicionais */}
                        <div>
                          <Label htmlFor="documentosAdicionais">
                            Documentos Adicionais (Opcional)
                          </Label>
                          <div className="mt-1 flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                  Clique para adicionar documentos adicionais
                                </p>
                              </div>
                              <input 
                                id="documentosAdicionais" 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleDocumentoChange(e, "adicional")}
                                multiple
                              />
                            </label>
                          </div>
                          
                          {/* Lista de documentos adicionais */}
                          {documentosPreview.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-sm text-gray-600">Documentos adicionais:</p>
                              <ul className="space-y-2">
                                {documentosPreview.map((doc, index) => (
                                  <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                    <div className="flex items-center">
                                      <FileText className="w-4 h-4 mr-2 text-blue-500" />
                                      <span className="text-sm truncate max-w-xs">{doc.name}</span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeDocumento(index)}
                                      className="p-1 h-auto"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Declaração */}
                    <div className="space-y-2">
                      <Label>
                        Declaração
                      </Label>
                      <div className="p-4 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-700">
                          Declaro que li e concordo com os estatutos da ASOF e com todas as informações 
                          fornecidas são verdadeiras. Estou ciente de que posso ser solicitado a apresentar 
                          documentos adicionais caso necessário.
                        </p>
                      </div>
                    </div>

                    {/* Botão de envio */}
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Enviando..." : "Enviar Solicitação de Filiação"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}