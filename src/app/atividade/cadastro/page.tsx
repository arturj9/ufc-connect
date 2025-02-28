/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { criarAtividade, atualizarAtividade, buscarAtividadePorId } from '@/lib/services/atividadeService';
import {
    AlertCircle,
    CheckCircle2,
    ArrowLeft,
    Loader2,
    PencilLine,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const createActivitySchema = z.object({
    id: z.string().optional(),
    nome: z
        .string()
        .min(3, 'O nome deve ter pelo menos 3 caracteres')
        .max(100, 'O nome deve ter no máximo 100 caracteres'),
    responsavel: z
        .string()
        .min(3, 'O responsável deve ter pelo menos 3 caracteres')
        .max(100, 'O responsável deve ter no máximo 100 caracteres'),
    dataFim: z
        .string()
        .refine((val) => {
            const selectedDate = new Date(val);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        }, 'A data de fim deve ser igual ou posterior a hoje'),
    descricao: z
        .string().optional(),
    tipo: z.enum(['Pesquisa', 'Docência', 'Extensão'], {
        errorMap: () => ({ message: 'Selecione um tipo de atividade válido.' })
    }),
});

type ActivityFormData = z.infer<typeof createActivitySchema>;

export const dynamic = 'force-dynamic'; // Disable prerendering

function AtividadeCadastroContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEditing = !!id;
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<ActivityFormData>({
        resolver: zodResolver(createActivitySchema),
    });

    // Fetch activity data on the client side
    useEffect(() => {
        if (isEditing && id) {
            const fetchActivity = async () => {
                try {
                    const activityData = await buscarAtividadePorId(id);
                    if (activityData) {
                        setValue('id', activityData.id);
                        setValue('nome', activityData.nome);
                        setValue('responsavel', activityData.responsavel);
                        setValue('dataFim', new Date(activityData.dataFim).toISOString().split('T')[0]);
                        setValue('descricao', activityData.descricao || '');
                        setValue('tipo', activityData.tipo);
                    }
                } catch (error) {
                    console.error('Erro ao buscar atividade:', error);
                    toast.error('Erro ao carregar atividade', {
                        icon: <AlertCircle className="text-red-500" />,
                        className: 'dark:bg-gray-800 dark:text-white',
                    });
                } finally {
                    setIsLoading(false); // Set loading to false after fetching
                }
            };
            fetchActivity();
        } else {
            setIsLoading(false); // Set loading to false if not editing
        }
    }, [isEditing, id, setValue]);

    const onSubmit = async (data: ActivityFormData) => {
        try {
            const activityData = {
                nome: data.nome,
                responsavel: data.responsavel,
                dataFim: new Date(data.dataFim),
                descricao: data.descricao,
                tipo: data.tipo,
            };

            if (isEditing && data.id) {
                await atualizarAtividade(data.id, activityData);
                toast.success('Atividade atualizada com sucesso!', {
                    icon: <CheckCircle2 className="text-green-500" />,
                    className: 'dark:bg-gray-800 dark:text-white',
                    duration: 4000,
                    position: 'top-right',
                });
            } else {
                await criarAtividade(activityData);
                toast.success('Atividade criada com sucesso!', {
                    icon: <CheckCircle2 className="text-green-500" />,
                    className: 'dark:bg-gray-800 dark:text-white',
                    duration: 4000,
                    position: 'top-right',
                });
            }

            router.push('/atividade/listagem');
        } catch (error) {
            toast.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} atividade`, {
                icon: <AlertCircle className="text-red-500" />,
                className: 'dark:bg-gray-800 dark:text-white',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
            <Toaster position="top-right" />

            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl dark:shadow-gray-900/20 p-4 sm:p-6 lg:p-8">
                <header className="mb-4 sm:mb-6 space-y-1 sm:space-y-2 border-b dark:border-gray-700 pb-4 sm:pb-6">
                    <button
                        onClick={() => router.push('/atividade/listagem')}
                        className="mb-2 sm:mb-4 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                        Voltar para atividades
                    </button>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <PencilLine className="h-6 w-6 text-blue-500" />
                                Editar Atividade
                            </>
                        ) : (
                            'Nova Atividade Acadêmica'
                        )}
                    </h1>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {isEditing && <input type="hidden" {...register('id')} />}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                        {/* Nome */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="nome"
                                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
                            >
                                Nome da Atividade*
                            </label>
                            <input
                                type="text"
                                id="nome"
                                {...register('nome')}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:border-transparent ${errors.nome
                                        ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700'
                                    } text-gray-900 dark:text-gray-100`}
                                placeholder="Nome da atividade"
                            />
                            {errors.nome && (
                                <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-start gap-1">
                                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5" />
                                    <span className="flex-1">{errors.nome.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Responsável */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="responsavel"
                                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
                            >
                                Responsável pela Atividade*
                            </label>
                            <input
                                type="text"
                                id="responsavel"
                                {...register('responsavel')}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:border-transparent ${errors.responsavel
                                        ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700'
                                    } text-gray-900 dark:text-gray-100`}
                                placeholder="Nome do responsável"
                            />
                            {errors.responsavel && (
                                <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-start gap-1">
                                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5" />
                                    <span className="flex-1">{errors.responsavel.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Data de Fim */}
                        <div className="sm:col-span-1">
                            <label
                                htmlFor="dataFim"
                                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
                            >
                                Data de Fim*
                            </label>
                            <input
                                type="date"
                                id="dataFim"
                                {...register('dataFim')}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:border-transparent ${errors.dataFim
                                        ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700'
                                    } text-gray-900 dark:text-gray-100`}
                            />
                            {errors.dataFim && (
                                <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-start gap-1">
                                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5" />
                                    <span className="flex-1">{errors.dataFim.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Descrição */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="descricao"
                                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
                            >
                                Descrição da Atividade
                            </label>
                            <textarea
                                id="descricao"
                                {...register('descricao')}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:border-transparent ${errors.descricao
                                        ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700'
                                    } text-gray-900 dark:text-gray-100`}
                                placeholder="Descrição detalhada da atividade"
                            />
                            {errors.descricao && (
                                <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-start gap-1">
                                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5" />
                                    <span className="flex-1">{errors.descricao.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Tipo de Atividade */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="tipo"
                                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
                            >
                                Tipo de Atividade*
                            </label>
                            <div className="relative">
                                <select
                                    id="tipo"
                                    {...register('tipo')}
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:border-transparent  ${errors.tipo
                                            ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700'
                                        } text-gray-900 dark:text-gray-100`}
                                >
                                    <option value="Pesquisa">Pesquisa</option>
                                    <option value="Docência">Docência</option>
                                    <option value="Extensão">Extensão</option>
                                </select>
                                {errors.tipo && (
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                                    </div>
                                )}
                            </div>
                            {errors.tipo && (
                                <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-start gap-1">
                                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5" />
                                    <span className="flex-1">{errors.tipo.message}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.push('/atividade/listagem')}
                            className="w-full sm:w-auto bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg py-2 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 rounded-lg py-2 px-4 text-sm font-semibold text-white"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                            ) : isEditing ? (
                                'Atualizar Atividade'
                            ) : (
                                'Criar Atividade'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AtividadeCadastro(){
    return (
        <Suspense>
            <AtividadeCadastroContent />
        </Suspense>
    )
}

export default AtividadeCadastro;