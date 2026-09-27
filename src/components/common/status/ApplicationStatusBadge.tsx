import { APPLICATION_STATUS, type ApplicationStatus } from "../../../constants/ApplicationStatus";

interface ApplicationStatusProps {
    status: ApplicationStatus
}

const ApplicationStatusBadge = ({ status }: ApplicationStatusProps) => {
    const { label, icon, className } = APPLICATION_STATUS[status];

    return (
        <span
            className={`inline-flex gap-1 items-center h-6 px-2 font-medium text-xs rounded-sm ${className ?? ""}`}
        >
            <img src={icon} alt="" className="h-3.5" />
            {label}
        </span>
    )
}
export default ApplicationStatusBadge;