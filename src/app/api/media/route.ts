import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { mediaDb } from '@/lib/database';

// Pasta para armazenamento de mídia
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Garantir que o diretório de uploads exista
try {
  await mkdir(UPLOAD_DIR, { recursive: true });
} catch (error) {
  console.error('Erro ao criar diretório de uploads:', error);
}

// GET /api/media - Listar arquivos de mídia
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      );
    }

    let media = mediaDb.findAll();

    // Filtrar por busca
    if (search) {
      media = media.filter(m => 
        m.filename.toLowerCase().includes(search.toLowerCase()) ||
        m.originalName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Calcular paginação
    const total = media.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMedia = media.slice(startIndex, endIndex);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: paginatedMedia,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    console.error('Erro ao buscar mídia:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/media - Upload de arquivos de mídia
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo fornecido' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido' },
        { status: 400 }
      );
    }

    // Criar nome único para o arquivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileExtension = path.extname(file.name) || getFileExtensionFromType(file.type);
    const filename = `${timestamp}-${randomString}${fileExtension}`;
    
    // Pasta final para upload
    const uploadPath = path.join(UPLOAD_DIR, folder);
    await mkdir(uploadPath, { recursive: true });
    
    // Caminho completo do arquivo
    const filePath = path.join(uploadPath, filename);
    
    // Converter File para ArrayBuffer e escrever no sistema de arquivos
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Salvar informações do arquivo no banco de dados
    const mediaInfo = mediaDb.create({
      originalName: file.name,
      filename: filename,
      path: `/uploads/${folder}/${filename}`,
      size: file.size,
      type: file.type,
      folder: folder,
      uploadedAt: new Date().toISOString()
    });

    return NextResponse.json(mediaInfo, { status: 201 });
  } catch (error) {
    console.error('Erro ao fazer upload de mídia:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função auxiliar para obter extensão de arquivo a partir do tipo MIME
function getFileExtensionFromType(mimeType: string): string {
  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/gif':
      return '.gif';
    case 'application/pdf':
      return '.pdf';
    default:
      return '';
  }
}