type LoadingOverlayProps = {
    isVisible?: boolean;
}

const LoadingOverlay = ({ isVisible }: LoadingOverlayProps) => {
    return (
        <div
            className={`fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-300
                ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
            role="status"
            aria-live="polite"
        >
            <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
    )
}
export default LoadingOverlay;