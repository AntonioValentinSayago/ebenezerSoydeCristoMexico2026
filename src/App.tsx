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
  churchName: string;
  willAttend: AttendanceOption;
  hasCompanions: boolean;       // 🔥 NUEVO
  companionsCount: number;      // 🔥 NUEVO
};

type SubmittedState = FormState & {
  folio: string;
};

const API_URL = "https://soydecristoelavivamientomexico.onrender.com/api/v1/register";

export default function EventAttendanceForm() {
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    phone: "",
    churchName: "",
    willAttend: "",
    hasCompanions: false,
    companionsCount: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submittedData, setSubmittedData] = useState<SubmittedState | null>(null);
  const [showModal, setShowModal] = useState(false);

  const PRICE = 180;

  useEffect(() => {
    const saved = localStorage.getItem("event_registration");
    if (saved) {
      setSubmittedData(JSON.parse(saved));
    }
  }, []);

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

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      hasCompanions: checked,
      companionsCount: checked ? prev.companionsCount : 0,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!formData.fullName || !formData.phone || !formData.churchName || !formData.willAttend) {
      setFormError("Todos los campos son obligatorios.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        churchName: formData.churchName,
        willAttend: formData.willAttend,
        hasCompanions: formData.hasCompanions,
        companionsCount: formData.companionsCount,
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

      setSubmittedData(result);
      localStorage.setItem("event_registration", JSON.stringify(result));
      setShowModal(true);

      setFormData({
        fullName: "",
        phone: "",
        churchName: "",
        willAttend: "",
        hasCompanions: false,
        companionsCount: 0,
      });

    } catch (error: any) {
      setFormError(error.message || "Error al registrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPeople =
    1 + (submittedData?.hasCompanions ? submittedData.companionsCount : 0);

  const totalAmount = totalPeople * PRICE;

  const getWhatsAppLink = () => {
    const phoneNumber = "5575373203";

    if (!submittedData) return "#";

    const message = `
Hola, realicé mi pago para el almuerzo de Pastores.

Nombre: ${submittedData.fullName}
Teléfono: ${submittedData.phone}
Iglesia: ${submittedData.churchName}
Folio: ${submittedData.folio}

Acompañantes: ${submittedData.hasCompanions ? submittedData.companionsCount : 0}
Total personas: ${totalPeople}
Total pagado: $${totalAmount} MXN

Adjunto comprobante.
    `;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      churchName: "",
      willAttend: "",
      hasCompanions: false,
      companionsCount: 0,
    });
    setFormError("");
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-2">

          <NavHeader />

          <form
            onSubmit={handleSubmit}
            className="w-full rounded-3xl bg-zinc-900/95 p-6 text-white shadow-xl"
          >
            <h2 className="text-xl font-bold text-center mb-6">
              Formulario de Registro para el almuerzo de Pastores con un costo de $180
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

              <input
                name="churchName"
                placeholder="Nombre de la iglesia"
                value={formData.churchName}
                onChange={handleInputChange}
                className="w-full rounded-xl p-3 text-black bg-white"
              />

              <select
                name="willAttend"
                value={formData.willAttend}
                onChange={handleInputChange}
                className="w-full rounded-xl p-3 text-black bg-white"
              >
                <option value="">¿Asistirá al almuerzo de Pastores?</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>

              {/* 🔥 ACOMPAÑANTES */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasCompanions}
                  onChange={handleCheckboxChange}
                />
                <label>¿Va acompañado?</label>
              </div>

              {formData.hasCompanions && (
                <input
                  type="number"
                  min={1}
                  placeholder="Número de acompañantes"
                  value={formData.companionsCount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      companionsCount: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-xl p-3 text-black bg-white"
                />
              )}
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

          {submittedData && (
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4">
                Registro guardado
              </h3>

              <p><b>Folio:</b> {submittedData.folio}</p>
              <p><b>Nombre:</b> {submittedData.fullName}</p>
              <p><b>Teléfono:</b> {submittedData.phone}</p>
              <p><b>Iglesia:</b> {submittedData.churchName}</p>
              <p><b>Acompañantes:</b> {submittedData.hasCompanions ? submittedData.companionsCount : 0}</p>
              <p><b>Total personas:</b> {totalPeople}</p>

              <p className="text-lg font-bold text-green-700">
                Total a pagar: ${totalAmount} MXN
              </p>

              <p>
                <b>Asistencia:</b>{" "}
                {submittedData.willAttend === "si" ? "Sí asistirá" : "No asistirá"}
              </p>

              {submittedData.willAttend === "si" && (
                <div className="mt-4 p-4 rounded-xl bg-yellow-200 text-black text-sm">
                  <p className="font-bold mb-2">💳 Datos para pago</p>
                  <p><b>Banco:</b> Banamex</p>
                  <p><b>Nombre del Titular:</b> Pablo Benito Peña Salazar</p>
                  <p><b>Cuenta:</b> 5204166221164793</p>
                  <p><b>Monto total:</b> ${totalAmount} MXN</p>

                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold"
                  >
                    Enviar comprobante por WhatsApp
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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