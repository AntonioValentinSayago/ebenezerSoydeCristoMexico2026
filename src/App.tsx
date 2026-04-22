import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import bgImage from "./assets/fondoSoydeCristoRojo.jpg";
import NavHeader from "./components/NavHeader";

/**
 * Tipos
 */
type AttendanceOption = "" | "si" | "no";

type FormState = {
  fullName: string;
  phone: string;
  willAttend: AttendanceOption;
};

type SubmittedState = FormState & {
  folio: string;
};

const API_URL = "http://localhost:4000/api/v1/register";

export default function EventAttendanceForm() {
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    phone: "",
    willAttend: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submittedData, setSubmittedData] = useState<SubmittedState | null>(null);

  // 🔥 Modal
  const [showModal, setShowModal] = useState(false);

  /**
   * Cargar desde localStorage al iniciar
   */
  useEffect(() => {
    const saved = localStorage.getItem("event_registration");
    if (saved) {
      setSubmittedData(JSON.parse(saved));
    }
  }, []);

  /**
   * Handle inputs
   */
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormError("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Submit con API real
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!formData.fullName || !formData.phone || !formData.willAttend) {
      setFormError("Todos los campos son obligatorios.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        willAttend: formData.willAttend,
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error en el registro");
      }

      const result: SubmittedState = {
        ...payload,
        folio: data.data.folio,
      };

      // 🔥 Guardar en estado
      setSubmittedData(result);

      // 🔥 Guardar en localStorage
      localStorage.setItem("event_registration", JSON.stringify(result));

      // 🔥 Mostrar modal
      setShowModal(true);

      // 🔥 Limpiar formulario
      setFormData({
        fullName: "",
        phone: "",
        willAttend: "",
      });

    } catch (error: any) {
      setFormError(error.message || "Error al registrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      willAttend: "",
    });
    setFormError("");
  };

  return (
    <main
    className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-6"
    style={{ backgroundImage: `url(${bgImage})` }}
    >
    <NavHeader />
      <div className="w-full max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-2">

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="w-full rounded-3xl bg-zinc-900/95 p-6 text-white shadow-xl"
          >
            <h2 className="text-xl font-bold text-center mb-6">
              Formulario de Registro
            </h2>

            {formError && (
              <div className="mb-4 rounded-xl bg-red-500/20 text-red-200 p-3 text-sm">
                {formError}
              </div>
            )}

            <div className="grid gap-4">

              <input
                name="fullName"
                placeholder="Nombre completo"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full rounded-xl p-3 text-black bg-white"
              />

              <input
                name="phone"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-xl p-3 text-black bg-white"
              />

              <select
                name="willAttend"
                value={formData.willAttend}
                onChange={handleInputChange}
                className="w-full rounded-xl p-3 text-black bg-white"
              >
                <option value="">¿Asistirá al desayuno de Pastores?</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-xl"
              >
                {isSubmitting ? "Guardando..." : "Registrar"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-300 text-black py-3 rounded-xl"
              >
                Limpiar
              </button>
            </div>
          </form>

          {/* RESULTADO */}
          {submittedData && (
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4">
                Registro guardado
              </h3>

              <p><b>Folio:</b> {submittedData.folio}</p>
              <p><b>Nombre:</b> {submittedData.fullName}</p>
              <p><b>Teléfono:</b> {submittedData.phone}</p>
              <p>
                <b>Asistencia:</b>{" "}
                {submittedData.willAttend === "si" ? "Sí asistirá" : "No asistirá"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 MODAL */}
      {showModal && submittedData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md text-center shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Registro exitoso 🎉
            </h2>

            <p className="mb-2">Tu folio es:</p>
            <p className="text-2xl font-black text-red-600 mb-4">
              {submittedData.folio}
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}