import { NextRequest, NextResponse } from 'next/server'
import { filiacoesDb } from '@/lib/database'
import { Filiacao } from '@/types'
import { randomUUID } from 'crypto'

// GET /api/filiacoes - Listar todas as filiações
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let filiacoes = filiacoesDb.findAll()

    // Filtrar por status se especificado
    if (status) {
      filiacoes = filiacoes.filter(f => f.status === status)
    }

    return NextResponse.json(filiacoes)
  } catch (error) {
    console.error('Erro ao buscar filiações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/filiacoes - Criar nova filiação
export async function POST(request: NextRequest) {
  try {
    // Verificar se a requisição é multipart/form-data
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
      // Tratar upload de arquivos
      const formData = await request.formData();
      
      // Extrair dados do formulário
      const nome = formData.get('nome') as string;
      const email = formData.get('email') as string;
      const telefone = formData.get('telefone') as string;
      const observacoes = formData.get('observacoes') as string;
      
      // Validação básica
      if (!nome || !email || !telefone) {
        return NextResponse.json(
          { error: 'Nome, email e telefone são obrigatórios' },
          { status: 400 }
        );
      }

      // Tratamento dos arquivos
      const documentos: string[] = [];
      
      // Salvar documento pessoal
      const documentoPessoal = formData.get('documentoPessoal') as File | null;
      if (documentoPessoal) {
        // Simulação de salvamento do arquivo (em produção, salvaria em um sistema de arquivos)
        const documentoPessoalPath = await saveFile(documentoPessoal, 'documentos-pessoais');
        documentos.push(documentoPessoalPath);
      }
      
      // Salvar comprovante de endereço
      const comprovanteEndereco = formData.get('comprovanteEndereco') as File | null;
      if (comprovanteEndereco) {
        const comprovanteEnderecoPath = await saveFile(comprovanteEndereco, 'comprovantes-endereco');
        documentos.push(comprovanteEnderecoPath);
      }
      
      // Salvar documentos adicionais
      const documentosAdicionais = formData.getAll('documentosAdicionais') as File[];
      for (const doc of documentosAdicionais) {
        const docPath = await saveFile(doc, 'documentos-adicionais');
        documentos.push(docPath);
      }
      
      // Criar a filiação
      const now = new Date().toISOString();
      const novaFiliacao = filiacoesDb.create({
        nome,
        email,
        telefone,
        data_solicitacao: now,
        status: 'pendente',
        documentos,
        observacoes: observacoes || undefined,
        createdAt: now,
        updatedAt: now,
        version: 1,
      });

      return NextResponse.json(novaFiliacao, { status: 201 });
    } else {
      // Requisição JSON tradicional
      const body = await request.json();

      // Validação básica
      const { nome, email, telefone, documentos, observacoes } = body;
      if (!nome || !email || !telefone) {
        return NextResponse.json(
          { error: 'Nome, email e telefone são obrigatórios' },
          { status: 400 }
        );
      }

      const now = new Date().toISOString();
      const novaFiliacao = filiacoesDb.create({
        nome,
        email,
        telefone,
        data_solicitacao: now,
        status: 'pendente',
        documentos: documentos || [],
        observacoes: observacoes,
        createdAt: now,
        updatedAt: now,
        version: 1,
      });

      return NextResponse.json(novaFiliacao, { status: 201 });
    }
  } catch (error) {
    console.error('Erro ao criar filiação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função auxiliar para salvar arquivos
async function saveFile(file: File, directory: string): Promise<string> {
  // Em produção, implementaria o salvamento real em um sistema de arquivos
  // Aqui está simplificado para simulação
  
  // Extrair o nome do arquivo e criar um nome único
  const originalName = file.name;
  const fileExtension = originalName.split('.').pop()?.toLowerCase() || 'bin';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
  
  // Simular caminho de arquivo (em produção, o arquivo seria salvo de fato)
  return `/storage/${directory}/${fileName}`;
}
