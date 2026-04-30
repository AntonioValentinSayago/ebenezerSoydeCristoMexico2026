import { useEffect, useMemo, useState } from "react";
import bgImage from "./assets/logo-vertical.jpg";

// TYPES
interface Member {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  edad: number;
  correo: string;
  telefono: string;
  cursos: string[];
  talentos_json: string[];
  ministerios_json: string[];
  cobertura: boolean;
}

// UI COMPONENTS
const Badge = ({ value }: { value: boolean }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
    value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
  }`}>
    {value ? "Activo" : "Inactivo"}
  </span>
);

const Tags = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-1">
    {items?.slice(0, 2).map((t, i) => (
      <span key={i} className="bg-gray-100 px-2 py-1 rounded-md text-xs">
        {t}
      </span>
    ))}
    {items?.length > 2 && (
      <span className="text-xs text-gray-400">+{items.length - 2}</span>
    )}
  </div>
);

// CHIP INPUT
const ChipInput = ({ label, values, setValues }: any) => {
  const [input, setInput] = useState("");

  const add = () => {
    if (!input.trim()) return;
    setValues([...values, input.trim()]);
    setInput("");
  };

  const remove = (i: number) =>
    setValues(values.filter((_: any, idx: number) => idx !== i));

  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>

      <div className="flex gap-2 mt-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-400"
        />
        <button onClick={add} className="px-3 bg-blue-600 text-white rounded-lg">
          +
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {values.map((v: string, i: number) => (
          <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
            {v} <button onClick={() => remove(i)}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Member | null>(null);
  const [showToggle, setShowToggle] = useState(false);

  const [form, setForm] = useState({
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    edad: "",
    correo: "",
    telefono: "",
    cursos: [] as string[],
    talentos_json: [] as string[],
    ministerios_json: [] as string[],
  });

  // FETCH
  const fetchMembers = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:4000/api/v1/ebenezer");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // FILTER
  const filtered = useMemo(() => {
    return data.filter((m) =>
      `${m.nombres} ${m.apellido_paterno} ${m.apellido_materno}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  // PAGINACIÓN
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // TOGGLE
  const handleToggle = async () => {
    if (!selected) return;

    const res = await fetch(
      `http://localhost:4000/api/v1/ebenezer/${selected.id}/status`,
      { method: "PUT" }
    );

    const json = await res.json();

    setData(prev =>
      prev.map(m =>
        m.id === selected.id ? { ...m, cobertura: json.data.cobertura } : m
      )
    );

    setShowToggle(false);
  };

  // CREATE
  const handleCreate = async () => {
    await fetch("http://localhost:4000/api/v1/ebenezer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        edad: Number(form.edad),
        cobertura: true,
        bautizado: false,
      }),
    });

    setShowCreate(false);
    fetchMembers();
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#eef2ff] to-white min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img src={bgImage} width={45} className="rounded-xl shadow" />
          <h1 className="text-xl font-semibold text-slate-800">
            Membresía Iglesia
          </h1>
        </div>

        <div className="flex gap-3">
          <input
            placeholder="Buscar..."
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-lg border bg-white text-sm w-64"
          />

          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          >
            + Nuevo
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th>Edad</th>
              <th>Contacto</th>
              <th>Estado</th>
              <th>Cursos</th>
              <th>Talentos</th>
              <th>Ministerios</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center p-6">Cargando...</td>
              </tr>
            ) : (
              paginated.map((m) => (
                <tr key={m.id} className="border-t hover:bg-gray-50">

                  <td className="p-3">
                    <div className="font-medium">{m.nombres} {m.apellido_paterno}</div>
                    <div className="text-xs text-gray-400">{m.apellido_materno}</div>
                  </td>

                  <td className="text-center">{m.edad}</td>

                  <td className="text-xs text-gray-500">
                    {m.correo}<br />{m.telefono}
                  </td>

                  <td className="text-center">
                    <Badge value={m.cobertura} />
                  </td>

                  <td><Tags items={m.cursos} /></td>
                  <td><Tags items={m.talentos_json} /></td>
                  <td><Tags items={m.ministerios_json} /></td>

                  <td className="text-center">
                    <button
                      onClick={() => {
                        setSelected(m);
                        setShowToggle(true);
                      }}
                      className={`px-3 py-1 text-xs text-white rounded ${
                        m.cobertura ? "bg-red-500" : "bg-green-600"
                      }`}
                    >
                      {m.cobertura ? "Deshabilitar" : "Activar"}
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* MODAL CREATE */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white rounded-2xl p-6 w-[650px] shadow-xl">

            <h2 className="text-lg font-semibold mb-4">Nuevo Miembro</h2>

            <div className="grid grid-cols-2 gap-4">

              <input className="input" placeholder="Nombres"
                onChange={(e)=>setForm({...form,nombres:e.target.value})}/>

              <input className="input" placeholder="Apellido Paterno"
                onChange={(e)=>setForm({...form,apellido_paterno:e.target.value})}/>

              <input className="input" placeholder="Apellido Materno"
                onChange={(e)=>setForm({...form,apellido_materno:e.target.value})}/>

              <input className="input" type="number" placeholder="Edad"
                onChange={(e)=>setForm({...form,edad:e.target.value})}/>

              <input className="input col-span-2" placeholder="Correo"
                onChange={(e)=>setForm({...form,correo:e.target.value})}/>

              <input className="input col-span-2" placeholder="Teléfono"
                onChange={(e)=>setForm({...form,telefono:e.target.value})}/>

            </div>

            <div className="mt-4 space-y-4">
              <ChipInput label="Cursos" values={form.cursos} setValues={(v:any)=>setForm({...form,cursos:v})}/>
              <ChipInput label="Talentos" values={form.talentos_json} setValues={(v:any)=>setForm({...form,talentos_json:v})}/>
              <ChipInput label="Ministerios" values={form.ministerios_json} setValues={(v:any)=>setForm({...form,ministerios_json:v})}/>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={()=>setShowCreate(false)} className="px-4 py-2 bg-gray-200 rounded-lg">
                Cancelar
              </button>

              <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Guardar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL TOGGLE */}
      {showToggle && selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <p className="mb-4 text-sm">
              ¿Seguro que deseas {selected.cobertura ? "deshabilitar" : "activar"}?
            </p>

            <div className="flex justify-end gap-2">
              <button onClick={()=>setShowToggle(false)} className="bg-gray-200 px-3 py-1 rounded">
                Cancelar
              </button>
              <button onClick={handleToggle} className="bg-blue-600 text-white px-3 py-1 rounded">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;