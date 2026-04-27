import { useEffect, useMemo, useState } from "react";

// ================= TYPES =================
interface Member {
  id: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  edad: number;
  bautizado: number;
  cobertura: number;
  cursos: string[];
  talentos_json: string[];
  ministerios_json: string[];
  correo: string;
  telefono: string;
  ocupacion?: string;
  estado_civil?: string;
  genero?: string;
}

// ================= MOCK =================
const mockData: Member[] = [
  {
    id: "1",
    nombres: "Juan",
    apellido_paterno: "Perez",
    apellido_materno: "Lopez",
    edad: 28,
    bautizado: 1,
    cobertura: 1,
    cursos: ["Biblia 1", "Liderazgo"],
    talentos_json: ["Canto", "Guitarra"],
    ministerios_json: ["Alabanza", "Jóvenes"],
    correo: "juan@test.com",
    telefono: "1234567890",
    ocupacion: "Ingeniero",
    estado_civil: "Soltero",
    genero: "Masculino",
  },
    {
    id: "2",
    nombres: "Cesar",
    apellido_paterno: "Perez",
    apellido_materno: "Lopez",
    edad: 28,
    bautizado: 1,
    cobertura: 1,
    cursos: ["Biblia 1", "Liderazgo"],
    talentos_json: ["Canto", "Guitarra"],
    ministerios_json: ["Alabanza", "Jóvenes"],
    correo: "juan@test.com",
    telefono: "1234567890",
    ocupacion: "Ingeniero",
    estado_civil: "Soltero",
    genero: "Masculino",
  },
];

export default function Dashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");

  const fetchMembers = async () => setMembers(mockData);

  useEffect(() => {
    fetchMembers();
  }, []);

  const filtered = useMemo(() => {
    return members.filter((m) =>
      `${m.nombres} ${m.apellido_paterno} ${m.apellido_materno}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [members, search]);

  const Badge = (value: number) => (
    <span
      className={`px-2 py-1 text-xs rounded-full font-semibold ${
        value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {value ? "Sí" : "No"}
    </span>
  );

  const Chips = (items: string[], color: string) => (
    <div className="flex flex-wrap gap-1">
      {items.map((i, idx) => (
        <span key={idx} className={`px-2 py-1 text-xs rounded ${color}`}>
          {i}
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg w-1/3"
          />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
            <span className="text-sm font-medium">Admin</span>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6 overflow-auto">
          <h1 className="text-xl font-bold mb-4">Miembros</h1>

          <div className="bg-white rounded-xl shadow p-4">
            {/* TOP BAR */}
            <div className="flex justify-between mb-4">
              <span className="text-sm text-gray-500">
                Mostrando {filtered.length} registros
              </span>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">
                + Nuevo
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-[1200px] w-full text-sm">
                <thead className="border-b text-gray-500">
                  <tr>
                    <th className="p-2 text-left">Nombre</th>
                    <th>Edad</th>
                    <th>Bautizado</th>
                    <th>Cobertura</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Ocupación</th>
                    <th>Cursos</th>
                    <th>Talentos</th>
                    <th>Ministerios</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">
                        {m.nombres} {m.apellido_paterno} {m.apellido_materno}
                        <div className="text-xs text-gray-400">{m.correo}</div>
                      </td>
                      <td className="text-center">{m.edad}</td>
                      <td className="text-center">{Badge(m.bautizado)}</td>
                      <td className="text-center">{Badge(m.cobertura)}</td>
                      <td>{m.correo}</td>
                      <td>{m.telefono}</td>
                      <td>{m.ocupacion}</td>
                      <td>{Chips(m.cursos, "bg-blue-100 text-blue-700")}</td>
                      <td>{Chips(m.talentos_json, "bg-purple-100 text-purple-700")}</td>
                      <td>{Chips(m.ministerios_json, "bg-green-100 text-green-700")}</td>
                      <td className="space-x-2">
                        <button className="text-indigo-600 text-xs">Edit</button>
                        <button className="text-red-600 text-xs">Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
