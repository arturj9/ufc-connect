"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listarAtividades, removerAtividade } from '@/lib/services/atividadeService';
import { Atividade, TipoAtividade } from '@/lib/entities/Atividade';
import {
    Trash2,
    Calendar,
    User,
    ClipboardList,
    Pencil,
    Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';

function AtividadeListagem() {
    const router = useRouter();

    const [atividades, setAtividades] = useState<Atividade[]>([]);

    const getColor = (tipo: TipoAtividade) => {
        switch (tipo) {
            case 'Docência':
                return 'border-l-blue-500';
            case 'Extensão':
                return 'border-l-green-500';
            case 'Pesquisa':
                return 'border-l-yellow-500';
            default:
                return 'border-l-gray-500';
        }
    }

    useEffect(() => {
        setAtividades(listarAtividades());
    }, []);

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta atividade?')) {
            removerAtividade(id);
            setAtividades((prev) => prev.filter((atividade) => atividade.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6 pb-4 border-b flex flex-col justify-between items-start gap-4">
                    <button onClick={() => router.push('/atividade/cadastro')} className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 rounded-lg py-2 px-4 text-sm font-semibold text-white"
                    >Criar Atividade</button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {atividades.length === 0 ? (
                        <div className="col-span-full py-12 text-center">
                            <div className="max-w-md mx-auto space-y-4 text-gray-500">
                                <ClipboardList className="h-12 w-12 mx-auto opacity-75" />
                                <p className="text-lg font-medium">
                                    Nenhuma atividade cadastrada
                                </p>
                                <p className="text-sm">
                                    Comece cadastrando novas atividades para aparecerem aqui
                                </p>
                            </div>
                        </div>
                    ) : (
                        atividades.map((atividade) => (
                            <div
                                key={atividade.id}
                                className={`p-4 border-l-2 ${getColor(atividade.tipo)} sm:p-5 bg-white rounded-lg shadow-xs hover:shadow-sm border border-gray-150 transition-all duration-200 group`}
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <Link
                                        href={`/detalhes/${atividade.id}`}
                                        className="flex-1 hover:opacity-80 transition-opacity space-y-2"
                                    >
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {atividade.nome}
                                        </h2>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <User className="h-4 w-4 opacity-75" />
                                                <span>{atividade.responsavel}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <Calendar className="h-4 w-4 opacity-75" />
                                                <span>
                                                    {new Date(atividade.dataFim).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/atividade/detalhes/${atividade.id}`}
                                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Visualizar atividade"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={`/atividade/cadastro?id=${atividade.id}`}
                                            className="p-1.5 text-lime-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Editar atividade"
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(atividade.id)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Excluir atividade"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default AtividadeListagem;
