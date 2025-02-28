'use client';

import { useParams } from 'next/navigation';
import {
  buscarAtividadePorId,
} from '@/lib/services/atividadeService';
import {
  Calendar,
  User,
  Clipboard as ClipboardText,
  AlertCircle,
} from 'lucide-react';

export default function AtividadeDetalhes() {
  const { id } = useParams();
  const activity = buscarAtividadePorId(id as string);

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Atividade não encontrada
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            A atividade solicitada não está mais disponível ou foi removida
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/20 p-6 sm:p-8">
        <header className="mb-6 sm:mb-8 border-b dark:border-gray-700 pb-4 sm:pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ClipboardText className="h-6 w-6 text-blue-500" />
            <span className="flex-1">{activity.nome}</span>
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {activity.tipo}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                  Responsável pela Atividade
                </h2>
              </div>
              <p className="text-gray-900 dark:text-gray-200 pl-8">
                {activity.responsavel}
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Final
                </h2>
              </div>
              <p className="text-gray-900 dark:text-gray-200 pl-8">
                {new Date(activity.dataFim).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <ClipboardText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição Completa
              </h2>
            </div>
            <p className="text-gray-900 dark:text-gray-200 pl-8 whitespace-pre-line overflow-hidden">
              {activity.descricao || (
                <span className="text-gray-500 italic ">
                  Nenhuma descrição fornecida
                </span>
              )}
            </p>
          </div>


        </div>
      </div>
    </div>
  );
}