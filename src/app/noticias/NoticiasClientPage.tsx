"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NoticiaCard } from "@/components/NoticiaCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Noticia, Categoria } from "@/types";
import { fetchNoticias } from "@/utils/api";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

const ITEMS_PER_PAGE = 6;

interface NoticiasClientPageProps {
  initialNoticias: Noticia[];
  initialTotalPages: number;
  initialTotalNoticias: number;
  initialHasNextPage: boolean;
  initialHasPrevPage: boolean;
  categorias: Categoria[];
}

export default function NoticiasClientPage({
  initialNoticias,
  initialTotalPages,
  initialTotalNoticias,
  initialHasNextPage,
  initialHasPrevPage,
  categorias
}: NoticiasClientPageProps) {
  const [noticias, setNoticias] = useState<Noticia[]>(initialNoticias);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce search term with 500ms delay
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalNoticias, setTotalNoticias] = useState(initialTotalNoticias);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [hasPrevPage, setHasPrevPage] = useState(initialHasPrevPage);

  const generatePageNumbers = (currentPage: number, totalPages: number, maxPagesToShow: number = 5) => {
    const pageNumbers = [];
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, currentPage + halfMaxPages);

    if (endPage - startPage + 1 < maxPagesToShow) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const displayedPageNumbers = generatePageNumbers(currentPage, totalPages);

  useEffect(() => {
    // Don't run on initial render
    if (currentPage === 1 && debouncedSearchTerm === "" && selectedCategoria === "") return;

    const loadNoticias = async () => {
      try {
        setLoading(true);
        const data = await fetchNoticias(currentPage, ITEMS_PER_PAGE, debouncedSearchTerm, selectedCategoria);
        setNoticias(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalNoticias(data.pagination.total);
        setHasNextPage(data.pagination.hasNext);
        setHasPrevPage(data.pagination.hasPrev);
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNoticias();
  }, [currentPage, debouncedSearchTerm, selectedCategoria]);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Filtros e Busca */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Busca */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar notícias..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when search changes
                  }}
                  className="pl-10"
                />
              </div>

              {/* Resultados */}
              <div className="text-sm text-gray-600">
                {totalNoticias} notícia{totalNoticias !== 1 ? 's' : ''} encontrada{totalNoticias !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Filtros por Categoria */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Filtrar por categoria:</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategoria === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategoria("");
                    setCurrentPage(1);
                  }}
                >
                  Todas
                </Button>
                {categorias.map((categoria) => (
                  <Button
                    key={categoria.id}
                    variant={selectedCategoria === categoria.nome ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategoria(categoria.nome);
                      setCurrentPage(1);
                    }}
                    style={{
                      borderColor: categoria.cor,
                      color: selectedCategoria === categoria.nome ? 'white' : categoria.cor,
                      backgroundColor: selectedCategoria === categoria.nome ? categoria.cor : 'transparent'
                    }}
                  >
                    {categoria.nome}
                  </Button>
                ))}
              </div>
            </div>

            {/* Filtros ativos */}
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Busca: "{searchTerm}"
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {selectedCategoria && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Categoria: {selectedCategoria}
                  <button
                    onClick={() => {
                      setSelectedCategoria("");
                      setCurrentPage(1);
                    }}
                    className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Notícias Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando notícias...</p>
              </div>
            ) : noticias.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {noticias.map((noticia) => (
                    <NoticiaCard key={noticia.id} noticia={noticia} />
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevPage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>

                    <div className="flex items-center gap-1">
                      {displayedPageNumbers.map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                    >
                      Próximo
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">Nenhuma notícia encontrada.</p>
                <p className="text-gray-400 text-sm">
                  Tente ajustar os filtros de busca ou categoria.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
