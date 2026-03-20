import React, { ChangeEvent, FormEvent, useMemo, useState } from "react";

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

const availableShirts = [
  {
    id: 1,
    name: "Playera Oficial Blanca",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    description: "Playera oficial blanca del evento.",
  },
  {
    id: 2,
    name: "Playera Oficial Negra",
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=80",
    description: "Playera oficial negra del evento.",
  },
  {
    id: 3,
    name: "Playera Edición Especial",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    description: "Diseño conmemorativo Soy de Cristo México 2026.",
  },
];

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

  const handleAttendeeFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFormError("");

    setFormData((previousState) => ({
      ...previousState,
      attendeeFile: selectedFile,
    }));

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setAttendeePreviewUrl(objectUrl);
    } else {
      setAttendeePreviewUrl("");
    }
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
    <main className="min-h-screen bg-slate-100">
      <ResponsiveHeader />

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div
          className={`mx-auto grid max-w-7xl gap-6 ${
            submittedData ? "lg:grid-cols-[1.4fr_0.85fr]" : "lg:grid-cols-1"
          }`}
        >
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6"
          >
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Formulario de asistencia
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Registro de asistentes al evento
              </h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Este formulario está enfocado en llevar el inventario de las
                personas que asistirán al evento. La compra de playera es opcional.
              </p>
            </div>

            {formError ? (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            ) : null}

            <section>
              <SectionHeading
                title="Datos del asistente"
                description="Captura la información principal de la persona que asistirá al evento."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldWrapper label="Nombre completo" htmlFor="fullName" required>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={inputClassName}
                    placeholder="Ej. César Valentín"
                    required
                  />
                </FieldWrapper>

                <FieldWrapper label="Correo electrónico" htmlFor="email" required>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClassName}
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </FieldWrapper>

                <FieldWrapper label="Teléfono" htmlFor="phone" required>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={inputClassName}
                    placeholder="55 1234 5678"
                    required
                  />
                </FieldWrapper>

                <FieldWrapper label="Edad" htmlFor="age">
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={inputClassName}
                    placeholder="Ej. 25"
                  />
                </FieldWrapper>

                <FieldWrapper label="Iglesia" htmlFor="churchName">
                  <input
                    id="churchName"
                    name="churchName"
                    type="text"
                    value={formData.churchName}
                    onChange={handleInputChange}
                    className={inputClassName}
                    placeholder="Ebenezer Príncipe de Paz"
                  />
                </FieldWrapper>

                <FieldWrapper label="Ciudad" htmlFor="city">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={inputClassName}
                    placeholder="Ciudad de México"
                  />
                </FieldWrapper>

                <FieldWrapper label="Rol" htmlFor="role" required>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={inputClassName}
                    required
                  >
                    <option value="">Selecciona un rol</option>
                    <option value="pastor">Pastor</option>
                    <option value="siervo">Siervo</option>
                  </select>
                </FieldWrapper>

                <FieldWrapper
                  label="Foto o archivo del asistente"
                  htmlFor="attendeeFile"
                  helperText="En móvil puede abrir la cámara o galería. En desktop permite subir archivo."
                >
                  <input
                    id="attendeeFile"
                    name="attendeeFile"
                    type="file"
                    accept="image/*,.pdf"
                    capture="environment"
                    onChange={handleAttendeeFileChange}
                    className={fileInputClassName}
                  />
                </FieldWrapper>
              </div>

              {attendeePreviewUrl ? (
                <PreviewCard
                  title="Vista previa del archivo del asistente"
                  previewUrl={attendeePreviewUrl}
                />
              ) : null}

              {formData.role === "pastor" ? (
                <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                  <FieldWrapper
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
                  </FieldWrapper>

                  {pastorIdPreviewUrl ? (
                    <PreviewCard
                      title="Vista previa de la identificación pastoral"
                      previewUrl={pastorIdPreviewUrl}
                      className="mt-4"
                    />
                  ) : null}
                </div>
              ) : null}

              <FieldWrapper
                label="Notas adicionales"
                htmlFor="notes"
                className="mt-4"
                helperText="Información opcional para el equipo organizador."
              >
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className={`${inputClassName} resize-none`}
                  placeholder="Escribe aquí alguna observación adicional..."
                />
              </FieldWrapper>
            </section>

            <section className="mt-8 border-t border-slate-200 pt-6">
              <SectionHeading
                title="Compra opcional de playera"
                description="Activa esta opción únicamente si el asistente desea comprar una playera oficial."
              />

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
                    Desea comprar playera oficial
                  </p>
                  <p className="text-sm text-slate-500">
                    Solo si activas esta opción se mostrarán talla, cantidad,
                    galería, método de pago y resumen de compra.
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
                    <FieldWrapper label="Talla" htmlFor="shirtSize" required>
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
                    </FieldWrapper>

                    <FieldWrapper label="Cantidad" htmlFor="shirtQuantity" required>
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
                    </FieldWrapper>
                  </div>

                  <div className="border-t border-slate-200 pt-5">
                    <SectionHeading
                      title="Método de pago"
                      description="Este apartado solo aparece porque la compra de playera está activada."
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
                        id="mercado-pago"
                        value="mercado-pago"
                        checked={formData.paymentMethod === "mercado-pago"}
                        onChange={handleInputChange}
                        title="Mercado Pago"
                        description="Pago en línea para México y Latam."
                      />
                      <PaymentOption
                        id="conekta"
                        value="conekta"
                        checked={formData.paymentMethod === "conekta"}
                        onChange={handleInputChange}
                        title="Conekta"
                        description="Tarjeta, efectivo o transferencia."
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
                className="inline-flex items-center justify-center rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
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

function ResponsiveHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <img
              src="https://via.placeholder.com/96x96.png?text=Evento"
              alt="Logo del evento"
              className="h-20 w-20 rounded-2xl object-cover ring-1 ring-slate-200"
            />

            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Soy de Cristo México 2026
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                Registro de asistentes
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Formulario responsivo para control de asistencia y compra opcional de playeras.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img
              src="https://via.placeholder.com/96x96.png?text=Iglesia"
              alt="Logo de la iglesia"
              className="h-20 w-20 rounded-2xl object-cover ring-1 ring-slate-200"
            />
          </div>
        </div>
      </div>
    </header>
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

type ShirtGalleryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function ShirtGalleryModal({ isOpen, onClose }: ShirtGalleryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Galería de playeras disponibles
            </h3>
            <p className="text-sm text-slate-500">
              Diseños disponibles para compra opcional.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>

        <div className="grid max-h-[75vh] gap-5 overflow-y-auto p-5 sm:grid-cols-2 lg:grid-cols-3">
          {availableShirts.map((shirt) => (
            <article
              key={shirt.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <img
                src={shirt.image}
                alt={shirt.name}
                className="h-72 w-full object-cover"
              />
              <div className="p-4">
                <h4 className="text-base font-semibold text-slate-900">
                  {shirt.name}
                </h4>
                <p className="mt-2 text-sm text-slate-600">
                  {shirt.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

type SectionHeadingProps = {
  title: string;
  description: string;
};

function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}

type FieldWrapperProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  helperText?: string;
  className?: string;
  children: React.ReactNode;
};

function FieldWrapper({
  label,
  htmlFor,
  required = false,
  helperText,
  className = "",
  children,
}: FieldWrapperProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </label>
      {children}
      {helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
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

const inputClassName =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100";

const fileInputClassName =
  "block w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-cyan-700";