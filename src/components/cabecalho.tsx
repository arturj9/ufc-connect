'use client';

import Link from 'next/link';
import { Notebook, Home } from 'lucide-react';

export default function Cabecalho() {

  const NavItems = () => (
    <>
      <Link
        href="/"
        className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>
      <Link
        href="/atividade/listagem"
        className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Notebook className="h-4 w-4" />
        Atividades
      </Link>
    </>
  );

  return (
    <header className="bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <h1 className="text-2xl text-emerald-500">
              UFC Connect
            </h1>
          </Link>

          <div className="hidden sm:flex items-center gap-4">
            <NavItems />
          </div>
        </div>
      </div>
    </header>
  );
}