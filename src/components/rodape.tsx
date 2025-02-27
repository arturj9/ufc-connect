const Rodape = () => {
    return (
      <footer className="bg-emerald-500 text-white py-6 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} UFC Connect. Todos os direitos reservados.
          </p>
          <p className="text-sm mt-2">
            Desenvolvido por <strong>Artur Jardel</strong>.
          </p>
        </div>
      </footer>
    );
  };
  
  export default Rodape;