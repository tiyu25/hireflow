import type { ApplicationStatus } from "../../../constants/ApplicationStatus";
import DateField1 from "../../common/form/DateField1";
import InputField1 from "../../common/form/InputField1";
import SelectField1 from "../../common/form/SelectField1";
import Collapsible from "./Collapsible";

type FieldName = "url" | "companyName" | "jobTitle" | "platform" | "deadline" | "applicationDate" | "interviewDate" | "startDate";

// 상태별 활성화 필드 목록 정의
export const STATUS_TO_FIELDS: Record<ApplicationStatus, FieldName[]> = {
    planned: ["url", "companyName", "jobTitle", "platform", "deadline"],
    applied: ["url", "companyName", "jobTitle", "platform", "deadline", "applicationDate"],
    interview: ["url", "companyName", "jobTitle", "platform", "deadline", "applicationDate", "interviewDate"],
    pendingInterview: ["url", "companyName", "jobTitle", "platform", "deadline", "applicationDate", "interviewDate"],
    finalPass: ["url", "companyName", "jobTitle", "platform", "deadline", "applicationDate", "interviewDate", "startDate"],
    reject: ["url", "companyName", "jobTitle", "platform", "deadline", "applicationDate", "interviewDate"],
}

interface JobInfoSectionProps {
    status: ApplicationStatus;
    onStatusChange: (value: ApplicationStatus) => void;
    url: string;
    onUrlChange: (value: string) => void;
    companyName: string;
    onCompanyNameChange: (value: string) => void;
    jobTitle: string;
    onJobTitleChange: (value: string) => void;
    platform: string;
    onPlatformChange: (value: string) => void;
    deadline: Date | null;
    onDeadlineChange: (value: Date | null) => void;
    applicationDate: Date | null;
    onApplicationDateChange: (value: Date | null) => void;
    interviewDate: Date | null;
    onInterviewDateChange: (value: Date | null) => void;
    startDate: Date | null;
    onStartDateChange: (value: Date | null) => void;
}

const JobInfoSection = ({ status, onStatusChange, url, onUrlChange, companyName, onCompanyNameChange, jobTitle, onJobTitleChange, platform, onPlatformChange, deadline, onDeadlineChange, applicationDate, onApplicationDateChange, interviewDate, onInterviewDateChange, startDate, onStartDateChange }: JobInfoSectionProps) => {

    const visibleFields = STATUS_TO_FIELDS[status];

    return (
        <Collapsible title="채용 정보" toggle={false}>
            <div className="flex flex-col gap-4">
                <SelectField1
                    label="지원 현황"
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value as ApplicationStatus)}
                    options={[
                        { value: "planned", label: "지원 예정" },
                        { value: "applied", label: "서류 지원" },
                        { value: "interview", label: "면접 예정" },
                        { value: "pendingInterview", label: "면접 결과 대기" },
                        { value: "finalPass", label: "최종 합격" },
                        { value: "reject", label: "불합격" }
                    ]}
                />
                {visibleFields.includes("url") && (
                    <InputField1
                        label="채용공고 URL"
                        type="text"
                        placeholder="채용공고 URL을 입력해주세요."
                        inputClassName="w-full"
                        value={url}
                        onChange={(e) => onUrlChange(e.target.value)}
                    />
                )}
                {visibleFields.includes("companyName") && (
                    <InputField1
                        label="회사명"
                        type="text"
                        placeholder="회사명을 입력해주세요."
                        inputClassName="w-full"
                        value={companyName}
                        onChange={(e) => onCompanyNameChange(e.target.value)}
                    />
                )}
                {visibleFields.includes("jobTitle") && (
                    <InputField1
                        label="채용공고명"
                        type="text"
                        placeholder="채용공고명을 입력해주세요."
                        inputClassName="w-full"
                        value={jobTitle}
                        onChange={(e) => onJobTitleChange(e.target.value)}
                    />
                )}
                {visibleFields.includes("platform") && (
                    <SelectField1
                        label="채용 플랫폼"
                        options={[
                            { value: "saramin", label: "사람인" },
                            { value: "jobkorea", label: "잡코리아" },
                            { value: "wanted", label: "원티드" }
                        ]}
                        value={platform}
                        onChange={(e) => onPlatformChange(e.target.value)}
                    />
                )}
                {visibleFields.includes("deadline") && (
                    <DateField1
                        label="서류 마감일"
                        selected={deadline}
                        onChange={onDeadlineChange}
                        placeholder="YYYY-MM-DD"
                        inputClassName="w-full md:w-50"
                    />
                )}
                {visibleFields.includes("applicationDate") && (
                    <DateField1
                        label="서류 지원일"
                        selected={applicationDate}
                        onChange={onApplicationDateChange}
                        placeholder="YYYY-MM-DD"
                        inputClassName="w-full md:w-50"
                    />
                )}
                {visibleFields.includes("interviewDate") && (
                    <DateField1
                        label="면접일"
                        selected={interviewDate}
                        onChange={onInterviewDateChange}
                        placeholder="YYYY-MM-DD"
                        inputClassName="w-full md:w-50"
                    />
                )}
                {visibleFields.includes("startDate") && (
                    <DateField1
                        label="출근 예정일"
                        selected={startDate}
                        onChange={onStartDateChange}
                        placeholder="YYYY-MM-DD"
                        inputClassName="w-full md:w-50"
                    />
                )}
            </div>
        </Collapsible>
    )
}
export default JobInfoSection;