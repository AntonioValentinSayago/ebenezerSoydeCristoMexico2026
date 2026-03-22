type LoadingOverlayProps = {
  message?: string;
};

const LoadingOverlay = ({ message = "Cargando..." }: LoadingOverlayProps) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      {/* Spinner */}
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />

      {/* Texto */}
      <p className="mt-4 text-sm font-medium text-slate-700">{message}</p>
    </div>
  );
};

export default LoadingOverlay;