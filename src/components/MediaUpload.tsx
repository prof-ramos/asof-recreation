'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, File, Image as ImageIcon, FileText, Trash2 } from 'lucide-react';
import { Media } from '@/types';

interface MediaUploadProps {
  onFileUpload: (file: Media) => void;
  allowedTypes?: string[];
  maxFileSize?: number; // in bytes
  folder?: string;
  multiple?: boolean;
  initialFiles?: Media[];
}

export default function MediaUpload({
  onFileUpload,
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  folder = 'general',
  multiple = false,
  initialFiles = []
}: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<Media[]>(initialFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList) => {
    if (!multiple && files.length >= 1) {
      setError('Apenas um arquivo é permitido para este campo');
      return;
    }

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Validar tipo de arquivo
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        setError(`Tipo de arquivo não permitido: ${file.type}. Tipos permitidos: ${allowedTypes.join(', ')}`);
        continue;
      }

      // Validar tamanho do arquivo
      if (file.size > maxFileSize) {
        setError(`Arquivo muito grande: ${file.name}. Tamanho máximo: ${maxFileSize / (1024 * 1024)}MB`);
        continue;
      }

      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Simular progresso de upload (em uma implementação real, isso viria da API)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev === null) return 10;
          if (prev >= 90) {
            clearInterval(interval);
            return 90; // Aguardar resposta da API
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload');
      }

      const uploadedFile = await response.json();
      setFiles(prev => multiple ? [...prev, uploadedFile] : [uploadedFile]);
      onFileUpload(uploadedFile);
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err);
      setError(err.message || 'Erro ao fazer upload do arquivo');
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: number) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4" />;
    } else if (type === 'application/pdf') {
      return <FileText className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <Card className={dragActive ? 'border-blue-500 border-2' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Upload de Mídia
            <Badge variant="secondary">{files.length} arquivos</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form 
            className="relative"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              className="hidden"
              onChange={handleFileInput}
              accept={allowedTypes.join(',')}
            />
            
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                <p className="text-gray-600">
                  Arraste e solte arquivos aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {allowedTypes.join(', ')} - Máx. {maxFileSize / (1024 * 1024)}MB
                </p>
              </div>
            </div>
            
            {uploadProgress !== null && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Enviando...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Arquivos Enviados</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded">
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <p className="font-medium truncate max-w-xs">{file.originalName}</p>
                    <div className="flex text-xs text-gray-500 space-x-2">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.type}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}