import { neon } from '@neondatabase/serverless'
import { revalidatePath } from 'next/cache'

export default function ComentariosPage() {
  async function create(formData: FormData) {
    'use server'

    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL não está configurada no ambiente.')
    }

    const rawComment = formData.get('comment')
    const comment = typeof rawComment === 'string' ? rawComment.trim() : ''

    if (!comment) {
      throw new Error('Informe um comentário antes de enviar.')
    }

    const sql = neon(connectionString)
    await sql('INSERT INTO comments (comment) VALUES ($1)', [comment])

    revalidatePath('/comentarios')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl space-y-6 bg-white p-8 rounded-lg shadow-md">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-blue-900">Comentários</h1>
          <p className="text-gray-600">
            Envie um comentário para testarmos a conexão com o banco Postgres via Neon.
          </p>
        </header>
        <form action={create} className="space-y-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Comentário
            </label>
            <input
              id="comment"
              name="comment"
              type="text"
              required
              placeholder="Escreva um comentário"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Enviar comentário
          </button>
        </form>
        <p className="text-sm text-gray-500">
          Certifique-se de executar <code className="rounded bg-gray-100 px-1 py-0.5">vercel env pull .env.development.local</code> e de ter criado a tabela{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5">comments</code> antes de testar.
        </p>
      </div>
    </div>
  )
}
