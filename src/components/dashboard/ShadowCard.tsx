interface ShadowCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const ShadowCard = ({ title, children, className }: ShadowCardProps) => {
    return (
        <div className={`${className} p-6 bg-white shadow-[0_0_6px_0_#EBF1FA] rounded-2xl`}>
            {title && (
                <strong className="w-full flex items-center justify-between pb-4 xl:pb-6 text-md xl:text-lg">{title}</strong>
            )}
            {children}
        </div>
    )
}
export default ShadowCard;