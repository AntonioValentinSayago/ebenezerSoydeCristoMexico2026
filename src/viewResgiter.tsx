import { useEffect, useMemo, useState } from "react";

type AttendanceOption = "si" | "no";

type Registration = {
  id: number;
  folio: string;
  fullName: string;
  phone: string;
  churchName: string;
  willAttend: AttendanceOption;
  companionsCount?: number;
};

type LocalStatus = {
  paid: boolean;
  attended: boolean;
};

// const API_URL =
//   "http://localhost:4000/api/v1/register/consulta";
const API_URL =
   "https://soydecristoelavivamientomexico.onrender.com/api/v1/register/consulta";

const PAGE_SIZE = 20;

export default function Dashboard() {
  const [data, setData] = useState<Registration[]>([]);
  const [search, setSearch] = useState("");
  const [statusMap, setStatusMap] = useState<Record<string, LocalStatus>>({});
  const [loading, setLoading] = useState(false);
  const [slowLoading, setSlowLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * 🔥 Fetch con control de red lenta
   */
  useEffect(() => {
    let slowTimer: any;

    const fetchData = async () => {
      setLoading(true);

      slowTimer = setTimeout(() => {
        setSlowLoading(true);
      }, 2000); // 👈 si tarda más de 2s

      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        setData(json.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        clearTimeout(slowTimer);
        setLoading(false);
        setSlowLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * 🔥 localStorage
   */
  useEffect(() => {
    const saved = localStorage.getItem("dashboard_status");
    if (saved) setStatusMap(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboard_status", JSON.stringify(statusMap));
  }, [statusMap]);

  /**
   * 🔍 Filtro
   */
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const term = search.toLowerCase();
      return (
        item.fullName.toLowerCase().includes(term) ||
        item.phone.includes(term) ||
        item.folio.toLowerCase().includes(term) ||
        item.churchName.toLowerCase().includes(term)
      );
    });
  }, [data, search]);

  /**
   * 🔥 KPIs
   */
  const total = filteredData.length;

  const totalPaid = filteredData.filter(
    (r) => statusMap[r.folio]?.paid
  ).length;

  const totalPending = total - totalPaid;

  const totalPeople = filteredData.reduce(
    (acc, r) => acc + 1 + (r.companionsCount || 0),
    0
  );

  /**
   * 🔥 Paginación
   */
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  /**
   * 🔥 Toggle checks
   */
  const toggleStatus = (folio: string, field: "paid" | "attended") => {
    setStatusMap((prev) => ({
      ...prev,
      [folio]: {
        ...prev[folio],
        [field]: !prev[folio]?.[field],
      },
    }));
  };

  /**
   * 📁 Export CSV
   */
  const exportToCSV = () => {
    const headers = [
      "Folio",
      "Nombre",
      "Teléfono",
      "Iglesia",
      "Acompañantes",
      "Total Personas",
      "Pagó",
      "Asistió",
    ];

    const rows = filteredData.map((r) => {
      const companions = r.companionsCount || 0;
      const totalP = 1 + companions;

      return [
        r.folio,
        r.fullName,
        r.phone,
        r.churchName,
        companions,
        totalP,
        statusMap[r.folio]?.paid ? "Sí" : "No",
        statusMap[r.folio]?.attended ? "Sí" : "No",
      ];
    });

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "registros.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6">

      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p>Total registros</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <p>Pagados</p>
          <p className="text-2xl font-bold">{totalPaid}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <p>Pendientes</p>
          <p className="text-2xl font-bold">{totalPending}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <p>Total personas</p>
          <p className="text-2xl font-bold">{totalPeople}</p>
        </div>
      </div>

      {/* BUSCADOR + EXPORT */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="p-3 rounded-xl border w-full md:w-1/2"
        />

        <button
          onClick={exportToCSV}
          className="bg-blue-500 text-white px-4 py-3 rounded-xl"
        >
          Exportar a Excel
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center p-6">
          <p className="animate-pulse">Cargando datos...</p>
          {slowLoading && (
            <p className="text-sm text-gray-500 mt-2">
              Esto está tardando más de lo normal... revisa tu conexión
            </p>
          )}
        </div>
      )}

      {/* TABLA */}
      {!loading && (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3">Folio</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Iglesia</th>
                <th className="p-3">Acomp.</th>
                <th className="p-3">Total</th>
                <th className="p-3">Pagó</th>
                <th className="p-3">Asistió</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((r) => {
                const companions = r.companionsCount || 0;
                const totalP = 1 + companions;

                return (
                  <tr key={r.folio} className="border-b hover:bg-gray-50">
                    <td className="p-3">{r.folio}</td>
                    <td className="p-3">{r.fullName}</td>
                    <td className="p-3">{r.phone}</td>
                    <td className="p-3">{r.churchName}</td>
                    <td className="p-3 text-center">{companions}</td>
                    <td className="p-3 text-center">{totalP}</td>

                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={statusMap[r.folio]?.paid || false}
                        onChange={() => toggleStatus(r.folio, "paid")}
                      />
                    </td>

                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={statusMap[r.folio]?.attended || false}
                        onChange={() => toggleStatus(r.folio, "attended")}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINACIÓN */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            ←
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            className="px-3 py-1 bg-gray-200 rounded"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}