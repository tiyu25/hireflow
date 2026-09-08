import { useState } from "react";
import DateField1 from "../../common/form/DateField1";
import InputField1 from "../../common/form/InputField1";
import SelectField1 from "../../common/form/SelectField1";
import Collapsible from "./Collapsible";

const JobInfoSection = () => {
    const [url, setUrl] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [platform, setPlatform] = useState("");
    const [applyStatus, setApplyStatus] = useState("");
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [applicationDate, setApplicationDate] = useState<Date | null>(null);
    const [interviewDate, setInterviewDate] = useState<Date | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);

    return (
        <Collapsible title="채용 정보" toggle={false}>
            <div className="flex flex-col gap-4">
                <SelectField1
                    label="지원 현황"
                    options={[
                        { value: "planned", label: "지원 예정" },
                        { value: "applied", label: "서류 지원" },
                        { value: "interview", label: "면접" },
                        { value: "finalPass", label: "최종 합격" },
                        { value: "reject", label: "불합격" }
                    ]}
                    value={applyStatus}
                    onChange={(e) => setApplyStatus(e.target.value)}
                />
                <InputField1
                    label="채용공고 URL"
                    type="text"
                    placeholder="채용공고 URL을 입력해주세요."
                    inputClassName="w-full"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <InputField1
                    label="회사명"
                    type="text"
                    placeholder="회사명을 입력해주세요."
                    inputClassName="w-full"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <InputField1
                    label="채용공고명"
                    type="text"
                    placeholder="채용공고명을 입력해주세요."
                    inputClassName="w-full"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                />
                <SelectField1
                    label="채용 플랫폼"
                    options={[
                        { value: "saramin", label: "사람인" },
                        { value: "jobkorea", label: "잡코리아" },
                        { value: "wanted", label: "원티드" }
                    ]}
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                />
                <DateField1
                    label="서류 마감일"
                    selected={deadline}
                    onChange={setDeadline}
                    placeholder="YYYY-MM-DD"
                    inputClassName="w-50"
                />
                <DateField1
                    label="서류 지원일"
                    selected={applicationDate}
                    onChange={setApplicationDate}
                    placeholder="YYYY-MM-DD"
                    inputClassName="w-50"
                />
                <DateField1
                    label="면접일"
                    selected={interviewDate}
                    onChange={setInterviewDate}
                    placeholder="YYYY-MM-DD"
                    inputClassName="w-50"
                />
                <DateField1
                    label="출근 예정일"
                    selected={startDate}
                    onChange={setStartDate}
                    placeholder="YYYY-MM-DD"
                    inputClassName="w-50"
                />
            </div>
        </Collapsible>
    )
}
export default JobInfoSection;