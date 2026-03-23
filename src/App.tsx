import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";
import NavHeader from "./components/NavHeader";
import SectionHeading from "./components/SectionHeading";
import ShirtGalleryModal from "./components/store/ShirtGalleryModal";
import FormRegister from "./components/FormRegister";
import FieldWrapperInput from "./components/views/FieldWrapperInput";
import { inputClassName } from "./utils/utils";
import bgImage from "./assets/fondoSoydeCristoRojo.jpg"

type UserRole = "" | "pastor" | "siervo";
type ShirtSize = "" | "CH" | "M" | "G" | "XG" | "2XG";
type PaymentMethod = "" | "stripe" | "mercado-pago" | "conekta" | "transferencia";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  churchName: string;
  city: string;
  role: UserRole;
  pastorIdFile: File | null;
  notes: string;
  attendeesCount: number;
  wantsShirt: boolean;
  shirtSize: ShirtSize;
  shirtQuantity: number;
  paymentMethod: PaymentMethod;
  attendeeFile: File | null;
};

type SubmittedState = {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  churchName: string;
  city: string;
  role: UserRole;
  notes: string;
  attendeesCount: number;
  wantsShirt: boolean;
  shirtSize: ShirtSize;
  shirtQuantity: number;
  paymentMethod: PaymentMethod;
  attendeeFileName: string | null;
  pastorIdFileName: string | null;
  totalAmount: number;
};

const SHIRT_PRICE = 250;

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  age: "",
  churchName: "",
  city: "",
  role: "",
  pastorIdFile: null,
  notes: "",
  attendeesCount: 1,
  wantsShirt: false,
  shirtSize: "",
  shirtQuantity: 1,
  paymentMethod: "",
  attendeeFile: null,
};

export default function EventAttendanceForm() {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [attendeePreviewUrl, setAttendeePreviewUrl] = useState("");
  const [pastorIdPreviewUrl, setPastorIdPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedState | null>(null);
  const [formError, setFormError] = useState("");

  const shirtTotal = useMemo(() => {
    if (!formData.wantsShirt) return 0;
    return formData.shirtQuantity * SHIRT_PRICE;
  }, [formData.wantsShirt, formData.shirtQuantity]);

  const totalAmount = useMemo(() => shirtTotal, [shirtTotal]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    setFormError("");

    if (type === "checkbox" && event.target instanceof HTMLInputElement) {
      const checked = event.target.checked;

      setFormData((previousState) => ({
        ...previousState,
        [name]: checked,
        ...(name === "wantsShirt" && !checked
          ? {
              shirtSize: "",
              shirtQuantity: 1,
              paymentMethod: "",
            }
          : {}),
      }));

      return;
    }

    if (name === "attendeesCount" || name === "shirtQuantity") {
      setFormData((previousState) => ({
        ...previousState,
        [name]: Number(value),
      }));
      return;
    }

    if (name === "role") {
      setFormData((previousState) => ({
        ...previousState,
        role: value as UserRole,
        ...(value !== "pastor"
          ? {
              pastorIdFile: null,
            }
          : {}),
      }));

      if (value !== "pastor") {
        setPastorIdPreviewUrl("");
      }

      return;
    }

    setFormData((previousState) => ({
      ...previousState,
      [name]: value,
    }));
  };

  const handlePastorIdFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFormError("");

    setFormData((previousState) => ({
      ...previousState,
      pastorIdFile: selectedFile,
    }));

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPastorIdPreviewUrl(objectUrl);
    } else {
      setPastorIdPreviewUrl("");
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setAttendeePreviewUrl("");
    setPastorIdPreviewUrl("");
    setFormError("");
    setSubmittedData(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (formData.role === "pastor" && !formData.pastorIdFile) {
      setFormError(
        "Si seleccionas el rol de pastor, debes subir una identificación antes de continuar."
      );
      return;
    }

    if (formData.wantsShirt && !formData.paymentMethod) {
      setFormError(
        "Debes seleccionar un método de pago si el asistente desea comprar playera."
      );
      return;
    }

    if (formData.wantsShirt && !formData.shirtSize) {
      setFormError("Debes seleccionar una talla para la playera.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: SubmittedState = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        churchName: formData.churchName,
        city: formData.city,
        role: formData.role,
        notes: formData.notes,
        attendeesCount: formData.attendeesCount,
        wantsShirt: formData.wantsShirt,
        shirtSize: formData.shirtSize,
        shirtQuantity: formData.shirtQuantity,
        paymentMethod: formData.paymentMethod,
        attendeeFileName: formData.attendeeFile?.name ?? null,
        pastorIdFileName: formData.pastorIdFile?.name ?? null,
        totalAmount,
      };

      console.log("Payload enviado:", payload);

      await new Promise((resolve) => setTimeout(resolve, 900));

      setSubmittedData(payload);
      alert("Registro guardado correctamente.");
    } catch (error) {
      console.error(error);
      setFormError("Ocurrió un error al guardar el registro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <NavHeader />

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div
          className={`mx-auto grid max-w-7xl gap-6 ${
            submittedData ? "lg:grid-cols-[1.4fr_0.85fr]" : "lg:grid-cols-1"
          }`}
        >
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-zinc-900 text-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6"
          >

            {formError ? (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            ) : null}

            <section>
              <SectionHeading
                title="Formulario de Resgitro"
                description="Iinformación de la persona que asistirá al evento."
              />

              <FormRegister 
                handleInputChangeForm={handleInputChange}
              />

              {attendeePreviewUrl ? (
                <PreviewCard
                  title="Vista previa del archivo del asistente"
                  previewUrl={attendeePreviewUrl}
                />
              ) : null}

              {formData.role === "pastor" ? (
                <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                  <FieldWrapperInput
                    label="Identificación de pastor"
                    htmlFor="pastorIdFile"
                    required
                    helperText="Este archivo es obligatorio cuando el rol seleccionado es pastor."
                  >
                    <input
                      id="pastorIdFile"
                      name="pastorIdFile"
                      type="file"
                      accept="image/*,.pdf"
                      capture="environment"
                      onChange={handlePastorIdFileChange}
                      className={fileInputClassName}
                      required={formData.role === "pastor"}
                    />
                  </FieldWrapperInput>

                  {pastorIdPreviewUrl ? (
                    <PreviewCard
                      title="Vista previa de la identificación pastoral"
                      previewUrl={pastorIdPreviewUrl}
                      className="mt-4"
                    />
                  ) : null}
                </div>
              ) : null}

            </section>

            <section className="mt-8 border-t border-slate-200 pt-6">

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  name="wantsShirt"
                  checked={formData.wantsShirt}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <p className="font-medium text-slate-800">
                    ¿Desea comprar playera oficial?
                  </p>
                  <p className="text-sm text-slate-500">
                    Ver opciones disponibles.
                  </p>
                </div>
              </label>

              {formData.wantsShirt ? (
                <div className="mt-5 space-y-5">
                  <div className="flex flex-col gap-3 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">
                        Playeras disponibles
                      </p>
                      <p className="text-sm text-slate-600">
                        Consulta los diseños disponibles antes de seleccionar talla y cantidad.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsGalleryOpen(true)}
                      className="inline-flex items-center justify-center rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
                    >
                      Ver galería de playeras
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldWrapperInput label="Talla" htmlFor="shirtSize" required>
                      <select
                        id="shirtSize"
                        name="shirtSize"
                        value={formData.shirtSize}
                        onChange={handleInputChange}
                        className={inputClassName}
                        required={formData.wantsShirt}
                      >
                        <option value="">Selecciona una talla</option>
                        <option value="CH">CH</option>
                        <option value="M">M</option>
                        <option value="G">G</option>
                        <option value="XG">XG</option>
                        <option value="2XG">2XG</option>
                      </select>
                    </FieldWrapperInput>

                    <FieldWrapperInput label="Cantidad" htmlFor="shirtQuantity" required>
                      <input
                        id="shirtQuantity"
                        name="shirtQuantity"
                        type="number"
                        min="1"
                        value={formData.shirtQuantity}
                        onChange={handleInputChange}
                        className={inputClassName}
                        required={formData.wantsShirt}
                      />
                    </FieldWrapperInput>
                  </div>

                  <div className="border-t border-slate-200 pt-5">
                    <SectionHeading
                      title="Método de pago"
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                      <PaymentOption
                        id="stripe"
                        value="stripe"
                        checked={formData.paymentMethod === "stripe"}
                        onChange={handleInputChange}
                        title="Stripe"
                        description="Pago con tarjeta."
                      />
                      <PaymentOption
                        id="transferencia"
                        value="transferencia"
                        checked={formData.paymentMethod === "transferencia"}
                        onChange={handleInputChange}
                        title="Transferencia"
                        description="Pago manual por depósito o transferencia."
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </section>

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Guardando..." : "Guardar registro"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Limpiar formulario
              </button>
            </div>
          </form>

          {submittedData ? (
            <aside className="h-fit rounded-3xl bg-slate-900 p-5 text-white shadow-sm">
              <h2 className="text-lg font-semibold">Resumen</h2>
              <p className="mt-1 text-sm text-slate-300">
                Información registrada correctamente.
              </p>

              <div className="mt-6 space-y-4">
                <SummaryRow label="Asistente" value={submittedData.fullName} />
                <SummaryRow label="Correo" value={submittedData.email} />
                <SummaryRow label="Teléfono" value={submittedData.phone} />
                <SummaryRow label="Rol" value={getRoleLabel(submittedData.role)} />
                <SummaryRow
                  label="Iglesia"
                  value={submittedData.churchName || "Sin capturar"}
                />
                <SummaryRow
                  label="Ciudad"
                  value={submittedData.city || "Sin capturar"}
                />
                <SummaryRow
                  label="Asistentes"
                  value={String(submittedData.attendeesCount)}
                />
                <SummaryRow
                  label="Archivo asistente"
                  value={submittedData.attendeeFileName || "No cargado"}
                />
                {submittedData.role === "pastor" ? (
                  <SummaryRow
                    label="ID Pastor"
                    value={submittedData.pastorIdFileName || "No cargado"}
                  />
                ) : null}
                <SummaryRow
                  label="Compra playera"
                  value={submittedData.wantsShirt ? "Sí" : "No"}
                />
              </div>

              {submittedData.wantsShirt ? (
                <div className="mt-6 rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold text-slate-100">
                    Resumen de compra
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <span>Precio unitario</span>
                      <span>${SHIRT_PRICE} MXN</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <span>Cantidad</span>
                      <span>{submittedData.shirtQuantity}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <span>Talla</span>
                      <span>{submittedData.shirtSize || "Sin seleccionar"}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-200">
                      <span>Método de pago</span>
                      <span>{getPaymentLabel(submittedData.paymentMethod)}</span>
                    </div>

                    <div className="border-t border-white/20 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-100">Total</span>
                        <span className="text-xl font-bold">
                          ${submittedData.totalAmount} MXN
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-300">
                    Este registro solo corresponde a asistencia. No se agregó compra de playera.
                  </p>
                </div>
              )}
            </aside>
          ) : null}
        </div>
      </section>

      <ShirtGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </main>
  );
}


type PreviewCardProps = {
  title: string;
  previewUrl: string;
  className?: string;
};

function PreviewCard({ title, previewUrl, className = "" }: PreviewCardProps) {
  return (
    <div className={`mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 ${className}`}>
      <p className="mb-2 text-sm font-medium text-slate-700">{title}</p>
      <img
        src={previewUrl}
        alt={title}
        className="h-56 w-full rounded-xl object-cover"
      />
    </div>
  );
}



type PaymentOptionProps = {
  id: string;
  value: PaymentMethod;
  checked: boolean;
  title: string;
  description: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
};

function PaymentOption({
  id,
  value,
  checked,
  title,
  description,
  onChange,
}: PaymentOptionProps) {
  return (
    <label
      htmlFor={id}
      className={`cursor-pointer rounded-2xl border p-4 transition ${
        checked
          ? "border-cyan-600 bg-cyan-50 ring-2 ring-cyan-100"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          id={id}
          name="paymentMethod"
          type="radio"
          value={value}
          checked={checked}
          onChange={onChange}
          className="mt-1 h-4 w-4 border-slate-300 text-cyan-600 focus:ring-cyan-500"
        />
        <div>
          <p className="font-medium text-slate-800">{title}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </label>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="max-w-[60%] text-right text-sm font-medium text-slate-100">
        {value}
      </span>
    </div>
  );
}

function getPaymentLabel(paymentMethod: PaymentMethod) {
  switch (paymentMethod) {
    case "stripe":
      return "Stripe";
    case "mercado-pago":
      return "Mercado Pago";
    case "conekta":
      return "Conekta";
    case "transferencia":
      return "Transferencia";
    default:
      return "Sin seleccionar";
  }
}

function getRoleLabel(role: UserRole) {
  switch (role) {
    case "pastor":
      return "Pastor";
    case "siervo":
      return "Siervo";
    default:
      return "Sin seleccionar";
  }
}



const fileInputClassName =
  "block w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-cyan-700";