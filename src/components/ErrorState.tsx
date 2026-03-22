type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

const ErrorState = ({
  message = "Ocurrió un error inesperado.",
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* Icono */}
      <div className="mb-4 text-4xl">⚠️</div>

      {/* Mensaje */}
      <p className="text-sm font-medium text-red-600">{message}</p>

      {/* Botón retry opcional */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorState;