type FieldWrapperProps = {
    label: string;
    htmlFor: string;
    required?: boolean;
    helperText?: string;
    className?: string;
    children: React.ReactNode;
};

const FieldWrapperInput = (
    {
        label,
        htmlFor,
        required = false,
        helperText,
        className = "",
        children,
    }: FieldWrapperProps
) => {
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
    )
}

export default FieldWrapperInput