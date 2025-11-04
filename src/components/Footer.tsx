import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ASOF</h3>
            <p className="text-gray-300 text-sm">
              Associação Nacional dos Oficiais de Chancelaria do Serviço Exterior Brasileiro.
              Defendendo os direitos e interesses dos servidores do Itamaraty.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/associacao/sobre" className="text-gray-300 hover:text-white transition-colors">
                  Sobre a ASOF
                </Link>
              </li>
              <li>
                <Link href="/associacao/membros" className="text-gray-300 hover:text-white transition-colors">
                  Membros
                </Link>
              </li>
              <li>
                <Link href="/filie-se" className="text-gray-300 hover:text-white transition-colors">
                  Filie-se
                </Link>
              </li>
              <li>
                <Link href="/revista" className="text-gray-300 hover:text-white transition-colors">
                  Revista
                </Link>
              </li>
            </ul>
          </div>

          {/* Comunicação */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Comunicação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/noticias" className="text-gray-300 hover:text-white transition-colors">
                  Notícias
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="text-gray-300 hover:text-white transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/biblioteca" className="text-gray-300 hover:text-white transition-colors">
                  Biblioteca
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-300 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <div className="text-sm text-gray-300 space-y-2">
              <p>Palácio do Itamaraty</p>
              <p>Brasília - DF</p>
              <p>CEP: 70170-900</p>
              <p className="pt-2">
                <a href="mailto:contato@asof.org.br" className="hover:text-white transition-colors">
                  contato@asof.org.br
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 ASOF - Todos os direitos reservados
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/politica-privacidade" className="text-sm text-gray-400 hover:text-white transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/termos-uso" className="text-sm text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
