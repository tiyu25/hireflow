import type { Application } from "../../../../api/applications";
import { PLATFORM_LABELS, STATUS_LABELS } from "../../../../constants/application";
import { getDdayInfo } from "../../../../utils/dateCount";
import ApplicationStatusBadge from "../../../common/status/ApplicationStatusBadge";
import DetailInfoRow from "./DetailInfoRow";

const DEADLINE_STATUSES: Application["status"][] = [
    "planned", "interview", "reject", "pendingInterview", "applied", "finalPass",
];
const APPLICATION_DATE_STATUSES: Application["status"][] = [
    "interview", "reject", "pendingInterview", "applied", "finalPass",
];
const INTERVIEW_DATE_STATUSES: Application["status"][] = [
    "interview", "reject", "pendingInterview", "finalPass",
];

interface DetailApplicationInfoProps {
    application: Application;
}

const DetailApplicationInfo = ({ application }: DetailApplicationInfoProps) => {

    const ddayText = getDdayInfo(application);
    
    return (
        <div>
            {/* D-Day */}
            {ddayText && (
                <span className="inline-flex items-center h-7 px-2 text-primary text-xs xl:text-sm font-medium bg-light-primary rounded-md mb-3 xl:mb-4">
                    {ddayText.label} {ddayText.dday}
                </span>
            )}
            {/* Application Info */}
            <div>
                <span className="text-md xl:text-lg text-black-5">{application?.company_name}</span>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                    <strong className="text-xl xl:text-2xl">{application.job_title}</strong>
                    <ApplicationStatusBadge status={application.status} />
                </div>
            </div>

            <div className="mt-6 xl:mt-8">
                <div className="flex flex-col md:grid md:grid-cols-2 gap-y-4">
                    {DEADLINE_STATUSES.includes(application.status) && (
                        <DetailInfoRow label="서류 마감일">{application.deadline}</DetailInfoRow>
                    )}
                    {APPLICATION_DATE_STATUSES.includes(application.status) && (
                        <DetailInfoRow label="서류 지원일">{application.application_date}</DetailInfoRow>
                    )}
                    {INTERVIEW_DATE_STATUSES.includes(application.status) && (
                        <DetailInfoRow label="면접일">{application.interview_date}</DetailInfoRow>
                    )}
                    {application.status === "finalPass" && (
                        <DetailInfoRow label="출근 예정일">{application.start_date}</DetailInfoRow>
                    )}
                    <DetailInfoRow label="지원 현황">{application.status ? STATUS_LABELS[application.status] : "-"}</DetailInfoRow>
                    <DetailInfoRow label="지원 플랫폼">{application.platform ? PLATFORM_LABELS[application.platform] ?? application.platform : ""}</DetailInfoRow>
                    <DetailInfoRow label="채용공고 URL" className="col-span-2">
                        <a
                            href={application.url ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black-6 text-sm xl:text-md underline"
                        >
                            채용공고 바로가기
                        </a>
                    </DetailInfoRow>
                </div>
            </div>
        </div>
    )
}
export default DetailApplicationInfo;