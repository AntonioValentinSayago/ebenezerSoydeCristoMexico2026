type SectionHeadingProps = {
    title: string;
    description?: string;
};

const SectionHeading = ({ title, description= '' }: SectionHeadingProps) => {
    return (
        <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">{description}</p>
            <div className="mt-2 text-slate-300"><hr/></div>
        </div>
    )
}

export default SectionHeading