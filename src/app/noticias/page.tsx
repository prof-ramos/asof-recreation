import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { fetchNoticias, fetchCategorias } from "@/utils/api";
import NoticiasClientPage from "./NoticiasClientPage";

const ITEMS_PER_PAGE = 6;

export default async function NoticiasPage() {
  const initialNoticiasData = await fetchNoticias(1, ITEMS_PER_PAGE, "", "");
  const categorias = await fetchCategorias();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Comunicação
            </h1>
            <p className="text-xl">
              Fique por dentro das últimas notícias e atualizações da ASOF
            </p>
          </div>
        </div>
      </section>

      <NoticiasClientPage 
        initialNoticias={initialNoticiasData.data}
        initialTotalPages={initialNoticiasData.pagination.totalPages}
        initialTotalNoticias={initialNoticiasData.pagination.total}
        initialHasNextPage={initialNoticiasData.pagination.hasNext}
        initialHasPrevPage={initialNoticiasData.pagination.hasPrev}
        categorias={categorias}
      />

      <Footer />
    </div>
  );
}