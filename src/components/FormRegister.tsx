import FieldWrapperInput from "./views/FieldWrapperInput"
import type { FormState } from "../types";
import { useState, type ChangeEvent } from "react";
import { inputClassName } from "../utils/utils";

type handleInputChangeProps = {
    handleInputChangeForm: (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void
}

const FormRegister = ({ handleInputChangeForm }: handleInputChangeProps) => {

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

    const [formData, setFormData] = useState<FormState>(initialFormState);
    console.log(setFormData)
    return (
        <div className="grid gap-4 sm:grid-cols-3">
            <FieldWrapperInput label="Nombre (S)" htmlFor="fullName" required>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChangeForm}
                    className={inputClassName}
                    required
                />
            </FieldWrapperInput>
                        <FieldWrapperInput label="Apellidos" htmlFor="fullName" required>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChangeForm}
                    className={inputClassName}
                    required
                />
            </FieldWrapperInput>

            <FieldWrapperInput label="Correo electrónico" htmlFor="email">
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChangeForm}
                    className={inputClassName}
                    placeholder="ejemplo@correo.com"
                    required
                />
            </FieldWrapperInput>

            <FieldWrapperInput label="Teléfono" htmlFor="phone">
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChangeForm}
                    className={inputClassName}
                    placeholder="55 1234 5678"
                    required
                />
            </FieldWrapperInput>

            <FieldWrapperInput label="Edad" htmlFor="age">
                <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    value={formData.age}
                    onChange={handleInputChangeForm}
                    className={inputClassName}
                    placeholder="Ej. 25"
                />
            </FieldWrapperInput>

            <FieldWrapperInput label="Rol" htmlFor="role" required>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChangeForm}
                    className={inputClassName}
                    required
                >
                    <option value="">Selecciona un rol</option>
                    <option value="pastor">Pastor</option>
                    <option value="siervo">Asistente del Congreso</option>
                </select>
            </FieldWrapperInput>
        </div>
    )
}

export default FormRegister
