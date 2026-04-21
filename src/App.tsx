import { useState, type ChangeEvent, type FormEvent } from "react";
import bgImage from "./assets/fondoSoydeCristoRojo.jpg";

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

/**
 * Generador de folio (temporal)
 */
const generateFolio = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);

  return `SDC-${yyyy}${mm}${dd}-${random}`;
};

export default function EventAttendanceForm() {
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    phone: "",
    willAttend: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submittedData, setSubmittedData] = useState<SubmittedState | null>(null);

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
   * Submit listo para backend
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
      const folio = generateFolio();

      const payload: SubmittedState = {
        ...formData,
        folio,
      };

      console.log("Payload listo para backend:", payload);

      /**
       * FUTURO BACKEND
       * await fetch("/api/register", { ... })
       */

      await new Promise((res) => setTimeout(res, 800));

      setSubmittedData(payload);

      alert(`Registro exitoso. Tu folio es: ${folio}`);
    } catch (error) {
      console.error(error);
      setFormError("Error al registrar.");
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
    setSubmittedData(null);
    setFormError("");
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="w-full rounded-3xl bg-zinc-900/95 backdrop-blur p-5 sm:p-6 md:p-8 text-white shadow-xl"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-6">
              Registro Evento "Soy de Cristo"
            </h2>

            {formError && (
              <div className="mb-4 rounded-xl bg-red-500/20 text-red-200 p-3 text-sm">
                {formError}
              </div>
            )}

            <div className="grid gap-4 sm:gap-5">
              
              {/* Nombre */}
              <input
                name="fullName"
                placeholder="Nombre completo"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full rounded-xl p-3 text-black outline-none focus:ring-2 focus:ring-red-500"
              />

              {/* Teléfono */}
              <input
                name="phone"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-xl p-3 text-black outline-none focus:ring-2 focus:ring-red-500"
              />

              {/* Asistencia */}
              <select
                name="willAttend"
                value={formData.willAttend}
                onChange={handleInputChange}
                className="w-full rounded-xl p-3 text-black outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">¿Asistirá al evento de pastores?</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* BOTONES */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex-1 bg-red-500 hover:bg-red-600 transition py-3 rounded-xl font-semibold"
              >
                {isSubmitting ? "Guardando..." : "Registrar"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto flex-1 bg-gray-300 text-black hover:bg-gray-400 transition py-3 rounded-xl"
              >
                Limpiar
              </button>
            </div>
          </form>

          {/* RESULTADO */}
          {submittedData && (
            <div className="w-full rounded-3xl bg-white p-5 sm:p-6 md:p-8 shadow-xl">
              <h3 className="text-lg sm:text-xl font-bold mb-4">
                Registro guardado
              </h3>

              <div className="space-y-2 text-sm sm:text-base">
                <p>
                  <span className="font-semibold">Folio:</span>{" "}
                  {submittedData.folio}
                </p>
                <p>
                  <span className="font-semibold">Nombre:</span>{" "}
                  {submittedData.fullName}
                </p>
                <p>
                  <span className="font-semibold">Teléfono:</span>{" "}
                  {submittedData.phone}
                </p>
                <p>
                  <span className="font-semibold">Asistencia:</span>{" "}
                  {submittedData.willAttend === "si"
                    ? "Sí asistirá"
                    : "No asistirá"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}