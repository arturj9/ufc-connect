"use client";

import { useEffect, useState } from "react";
import { listarAtividades } from "@/lib/services/atividadeService";
import { Atividade, TipoAtividade } from "@/lib/entities/Atividade";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function Dashboard() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [dadosGrafico, setDadosGrafico] = useState<{ tipo: TipoAtividade; quantidade: number }[]>([]);

  useEffect(() => {
    const fetchAtividades = async () => {
      const atividadesObtidas = await listarAtividades();
      setAtividades(atividadesObtidas);
      processarDados(atividadesObtidas);
    };

    fetchAtividades();
  }, []);

  const processarDados = (atividades: Atividade[]) => {
    const contagem: Record<TipoAtividade, number> = {
      Pesquisa: 0,
      Docência: 0,
      Extensão: 0,
    };

    atividades.forEach((atividade) => {
      contagem[atividade.tipo]++;
    });

    setDadosGrafico([
      { tipo: "Pesquisa", quantidade: contagem.Pesquisa },
      { tipo: "Docência", quantidade: contagem.Docência },
      { tipo: "Extensão", quantidade: contagem.Extensão },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-6 pb-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard de Atividades</h1>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg shadow text-center">
            <h2 className="text-lg font-semibold text-gray-700">Total de Atividades</h2>
            <p className="text-2xl font-bold text-emerald-500">{atividades.length}</p>
          </div>
        </div>

        {/* Gráfico de Barras */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Atividades por Tipo</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosGrafico}>
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#31df73" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabela de Atividades */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Últimas Atividades</h2>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Responsável</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Data de Término</th>
              </tr>
            </thead>
            <tbody>
              {atividades.slice(0, 5).map((atividade) => (
                <tr key={atividade.id} className="border-t">
                  <td className="p-3">{atividade.nome}</td>
                  <td className="p-3">{atividade.responsavel}</td>
                  <td className="p-3">{atividade.tipo}</td>
                  <td className="p-3">
                    {new Date(atividade.dataFim).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
