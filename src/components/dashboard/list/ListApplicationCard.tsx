import { Link } from "react-router-dom";
import type { Application } from "../../../api/applications";
import { getDdayInfo } from "../../../utils/dateCount";
import { PLATFORM_LABELS } from "../../../constants/application";
import ApplicationStatusBadge from "../../common/status/ApplicationStatusBadge";

interface ListApplicationCardProps {
    application: Application;
}

// 상태에 따라 카드에 보여줄 날짜 문구
const getDateText = (application: Application): string | null => {
    switch (application.status) {
        case "planned" :
        case "reject" :
            return `${application.deadline} 서류 마감`;
        case "interview" :
        case "pendingInterview" :
            return `${application.interview_date} 면접`;
        case "applied" :
            return `${application.application_date} 지원`;
        case "finalPass" :
            return `${application.start_date} 입사`;
        default :
            return null;
    }
}

const ListApplicationCard = ({ application }: ListApplicationCardProps) => {
    const ddayInfo = getDdayInfo(application);
    const dateText = getDateText(application);
    const platformLabel = application.platform
        ? PLATFORM_LABELS[application.platform] ?? application.platform
        : null;

    return (
        <Link
            to={`/dashboard/detail/${application.id}`}
            className="relative w-full text-left bg-white p-4 xl:p-5 rounded-xl shadow-[0_0_6px_0_#EBF1FA] cursor-pointer"
        >
            <p className="text-xs xl:text-sm text-black-6">{application.company_name}</p>
            <strong className="block mt-0.5 font-semibold text-md xl:text-lg">{application.job_title}</strong>
            <div className="flex gap-1.5 mt-2 mb-3 flex-wrap">
                {ddayInfo && (
                    <p className="text-primary font-semibold text-xs xl:text-sm">{ddayInfo.dday}</p>
                )}
                {dateText && (
                    <p className="text-black-6 text-xs xl:text-sm">{dateText}</p>
                )}
                {platformLabel && (
                    <p className="text-black-6 text-xs xl:text-sm">{platformLabel}</p>
                )}
            </div>
            <ApplicationStatusBadge status={application.status} />
        </Link>
    )
}
export default ListApplicationCard;