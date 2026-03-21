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

type ShirtGalleryModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const ShirtGalleryModal = ({ isOpen, onClose }: ShirtGalleryModalProps) => {
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
    )
}

export default ShirtGalleryModal