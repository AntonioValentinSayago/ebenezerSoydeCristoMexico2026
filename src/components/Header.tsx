import React from "react";

interface HeaderProps {
  logo?: string;
  churchName: string;
}

const Header: React.FC<HeaderProps> = ({ logo, churchName }) => {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 mb-5 rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo + Nombre */}
        <div className="flex items-center gap-3">
          {logo ? (
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 object-contain rounded-full"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full font-bold">
              ⛪
            </div>
          )}

          <h1 className="text-lg md:text-xl font-semibold text-gray-800 tracking-wide">
            {churchName}
          </h1>
        </div>

        {/* Navegación opcional */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#" className="hover:text-green-600 transition">
            Registros de Hermanos 2026
          </a>
          
        </nav>

      </div>
    </header>
  );
};

export default Header;