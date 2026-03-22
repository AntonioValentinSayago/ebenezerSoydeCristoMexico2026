import { useEffect, useState } from "react";
import { getShirtAll } from "../../api/DevShirtAPI";
import type { Shirt } from "../../types";
import LoadingOverlay from "../SpinnerOverlay";
import ErrorState from "../ErrorState";

type ShirtGalleryModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const ShirtGalleryModal = ({ isOpen, onClose }: ShirtGalleryModalProps) => {

    const [shirts, setShirts] = useState<Shirt[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    
    const fetchShirts = async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await getShirtAll();
            setShirts(response.data);
        } catch (error) {
            console.error(error);
            setError("No se pudieron cargar las playeras.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        fetchShirts();
    }, [isOpen]);

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

                <div className="max-h-[75vh] overflow-y-auto p-5">
                    {isLoading ? (
                        <LoadingOverlay message="Un momento estamos cargando playeras..." />
                    ) : error ? (
                        <ErrorState message={error} onRetry={fetchShirts}/>
                    ) : shirts.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No hay playeras disponibles por el momento.
                        </p>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {shirts.map((shirt) => (
                                <article
                                    key={shirt.id}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                                >
                                    <img
                                        src={shirt.images?.[0]?.url || "https://via.placeholder.com/400x400?text=Sin+imagen"}
                                        alt={shirt.name}
                                        className="h-72 w-full object-cover"
                                    />

                                    <div className="p-4">
                                        <h4 className="text-base font-semibold text-slate-900">
                                            {shirt.name}
                                        </h4>

                                        <p className="mt-2 text-sm text-slate-600">
                                            Precio: ${shirt.price} MXN
                                        </p>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Stock total: {shirt.stock}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ShirtGalleryModal