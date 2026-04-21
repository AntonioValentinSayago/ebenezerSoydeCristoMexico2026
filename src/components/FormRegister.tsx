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
        phone: "",
        breakfastAttendance: "",
        email: "",
        age: "",
        churchName: "",
        city: "",
        role: "",
        pastorIdFile: null,
        notes: "",
        attendeesCount: 0,
        wantsShirt: false,
        shirtSize: "",
        shirtQuantity: 0,
        paymentMethod: "",
        attendeeFile: null
    };

    const [formData, setFormData] = useState<FormState>(initialFormState);
    console.log(setFormData)
    return (
        <div className="grid gap-4 sm:grid-cols-3">
            <FieldWrapperInput label="Nombre Completo" htmlFor="fullName" required>
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

            <FieldWrapperInput label="¿Asistirá al desayuno de pastores?" htmlFor="breakfastAttendance">
                <select
                    id="breakfastAttendance"
                    name="breakfastAttendance"
                    value={formData.breakfastAttendance}
                    onChange={handleInputChangeForm}
                    className={inputClassName}
                >
                    <option value="" disabled>Seleccione una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                </select>
            </FieldWrapperInput>
        </div>
    )
}

export default FormRegister
