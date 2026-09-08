interface FormCardProps {
    children: React.ReactNode;
}

const FormCard = ({ children }: FormCardProps) => {
    return (
        <div className="p-6 bg-white shadow-[0_0_6px_0_#EBF1FA] rounded-2xl">
            {children}
        </div>
    )
}
export default FormCard;