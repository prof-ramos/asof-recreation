"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Plus, MapPin, Users, Edit, Trash2, Save, X, Image } from "lucide-react";
import { Evento } from "@/types";
import MediaUpload from "@/components/MediaUpload";
import { 
  fetchEventos, 
  createEvento, 
  updateEvento, 
  deleteEvento 
} from "@/utils/api";

// Esquema de validação para o formulário de evento
const eventoSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  data: z.string().min(1, "Data é obrigatória"),
  local: z.string().optional(),
  status: z.enum(['ativo', 'inativo'])
});

type EventoFormValues = z.infer<typeof eventoSchema>;

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [eventoToEdit, setEventoToEdit] = useState<Evento | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [imagemToCreate, setImagemToCreate] = useState<File | null>(null);
  const [imagemToEdit, setImagemToEdit] = useState<File | null>(null);

  // Formulário para criação de evento
  const createForm = useForm<EventoFormValues>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      data: "",
      local: "",
      status: "ativo"
    }
  });

  // Formulário para edição de evento
  const editForm = useForm<EventoFormValues>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      data: "",
      local: "",
      status: "ativo"
    }
  });

  useEffect(() => {
    if (eventoToEdit) {
      editForm.reset({
        titulo: eventoToEdit.titulo,
        descricao: eventoToEdit.descricao,
        data: eventoToEdit.data,
        local: eventoToEdit.local || "",
        status: eventoToEdit.status
      });
    }
  }, [eventoToEdit, editForm]);

  useEffect(() => {
    const loadEventos = async () => {
      try {
        setLoading(true);
        const data = await fetchEventos();
        setEventos(data);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar eventos. Tente novamente mais tarde.");
        console.error("Erro ao carregar eventos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEventos();
  }, []);

  const handleCreateEvento = async (data: EventoFormValues) => {
    try {
      const novoEvento = await createEvento({
        titulo: data.titulo,
        descricao: data.descricao,
        data: data.data,
        local: data.local,
        status: data.status
      }, imagemToCreate || undefined); // Passar a imagem se existir

      if (novoEvento) {
        setEventos([...eventos, novoEvento]);
        setShowCreateDialog(false);
        createForm.reset();
        setImagemToCreate(null); // Limpar imagem após upload
      } else {
        setError("Erro ao criar evento. Por favor, tente novamente.");
      }
    } catch (err) {
      setError("Erro ao criar evento. Por favor, tente novamente.");
      console.error("Erro ao criar evento:", err);
    }
  };

  const handleUpdateEvento = async (data: EventoFormValues) => {
    if (!eventoToEdit) return;

    try {
      const eventoAtualizado = await updateEvento(eventoToEdit.id, {
        titulo: data.titulo,
        descricao: data.descricao,
        data: data.data,
        local: data.local,
        status: data.status
      }, imagemToEdit || undefined); // Passar a imagem se existir

      if (eventoAtualizado) {
        setEventos(eventos.map(e => e.id === eventoToEdit.id ? eventoAtualizado : e));
        setShowEditDialog(false);
        setEventoToEdit(null);
        setImagemToEdit(null); // Limpar imagem após upload
      } else {
        setError("Erro ao atualizar evento. Por favor, tente novamente.");
      }
    } catch (err) {
      setError("Erro ao atualizar evento. Por favor, tente novamente.");
      console.error("Erro ao atualizar evento:", err);
    }
  };

  const handleDeleteEvento = async (id: number) => {
    setDeletingId(id);
    try {
      const success = await deleteEvento(id);
      if (success) {
        setEventos(eventos.filter(e => e.id !== id));
      } else {
        setError("Erro ao excluir evento. Por favor, tente novamente.");
      }
    } catch (err) {
      setError("Erro ao excluir evento. Por favor, tente novamente.");
      console.error("Erro ao excluir evento:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const openEditDialog = (evento: Evento) => {
    setEventoToEdit(evento);
    setShowEditDialog(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Eventos</h1>
            <p className="text-muted-foreground">Gerencie os eventos da ASOF</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />Novo Evento
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Eventos</h1>
            <p className="text-muted-foreground">Gerencie os eventos da ASOF</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />Novo Evento
          </Button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
          <button 
            className="ml-4 text-red-700 hover:underline"
            onClick={() => setError(null)}
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Eventos</h1>
          <p className="text-muted-foreground">Gerencie os eventos da ASOF</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />Novo Evento
        </Button>
      </div>

      <div className="grid gap-4">
        {eventos.length > 0 ? (
          eventos.map((evento) => (
            <Card key={evento.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="font-medium">{evento.titulo}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(evento.data).toLocaleDateString('pt-BR')}
                      </div>
                      {evento.local && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {evento.local}
                        </div>
                      )}
                    </div>
                    <Badge variant={evento.status === "ativo" ? "default" : "secondary"}>
                      {evento.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openEditDialog(evento)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteEvento(evento.id)}
                      disabled={deletingId === evento.id}
                    >
                      {deletingId === evento.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum evento encontrado.</p>
          </div>
        )}
      </div>

      {/* Diálogo para criação de evento */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Evento</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar um novo evento.
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateEvento)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="Título do evento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descrição do evento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="local"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input placeholder="Local do evento (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>Imagem</FormLabel>
                <MediaUpload
                  onFileUpload={(file) => setImagemToCreate(file as any)} // Temporary fix for type
                  allowedTypes={['image/jpeg', 'image/jpg', 'image/png']}
                  maxFileSize={5 * 1024 * 1024} // 5MB
                  folder="eventos"
                  multiple={false}
                />
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Criar Evento
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para edição de evento */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>
              Atualize as informações do evento.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdateEvento)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="Título do evento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descrição do evento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="local"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input placeholder="Local do evento (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>Imagem</FormLabel>
                <MediaUpload
                  onFileUpload={(file) => setImagemToEdit(file as any)} // Temporary fix for type
                  allowedTypes={['image/jpeg', 'image/jpg', 'image/png']}
                  maxFileSize={5 * 1024 * 1024} // 5MB
                  folder="eventos"
                  multiple={false}
                  initialFiles={eventoToEdit?.imagem ? [{ 
                    id: 0, 
                    originalName: 'current-image',
                    filename: eventoToEdit.imagem.split('/').pop() || 'image',
                    path: eventoToEdit.imagem,
                    size: 0,
                    type: 'image/jpeg',
                    folder: 'eventos',
                    uploadedAt: new Date().toISOString()
                  } as any] : []} // Temporary fix for type
                />
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false);
                    setEventoToEdit(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
