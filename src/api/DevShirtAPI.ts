import { isAxiosError } from "axios";
import api from "../config/axios";

export async function getShirtAll() {
    try {
        const { data } = await api('/shirts')
        console.log(data);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error al obtener playeras");
        }

        throw new Error("Error inesperado al obtener playeras");
    }
}