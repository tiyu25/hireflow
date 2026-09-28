import ButtonBase from "../../common/button/ButtonBase";
import ApplicationStatusBadge from "../../common/status/ApplicationStatusBadge";

import More from "@/assets/images/more_icn.svg";
import AddIcon from "@/assets/images/add_plus_icn.svg";
import { useEffect, useState } from "react";
import { type Application, getApplications } from "../../../api/applications";
import { supabase } from "../../../lib/supabase";
import { APPLICATION_STATUS, type ApplicationStatus } from "../../../constants/ApplicationStatus";
import { Link, useNavigate } from "react-router-dom";
import { getDday } from "../../../utils/dateCount";

const PLATFORM_LABELS: Record<string, string> = {
    saramin: "사람인",
    jobkorea: "잡코리아",
    wanted: "원티드",
}

interface Section {
    title: string;
    status: ApplicationStatus[];
}
const SECTIONS: Section[] = [
    { title: "지원 예정", status: ["planned"] },
    { title: "서류 지원", status: ["applied"] },
    { title: "면접", status: ["interview", "pendingInterview"] },
    { title: "최종 합격", status: ["finalPass"] },
    { title: "불합격", status: ["reject"] },
]

const ListContainer = () => {
    const navigate = useNavigate();

    const [ applications, setApplications ] = useState<Application[]>([]);

    useEffect(() => {
        const fetchApplications = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) return;

            const { data, error } = await getApplications(userData.user.id);
            if (error || !data) {
                console.error(error);
                return;
            }
            setApplications(data);
        };

        fetchApplications();
    }, []);

    return (
        <div>
            {/* 상단 */}
            <div className="flex justify-between align-center xl:flex-row flex-col gap-4 pt-6 pb-4 px-8">
                <div className="flex items-center gap-3">
                    <strong className="text-2xl xl:text-3xl">DashBoard</strong>
                    <p className="text-sm xl:text-[15px]">Total <span className="font-semibold">{applications.length}</span></p>
                </div>
                <ButtonBase
                    base="base2"
                    className="bg-primary text-white"
                    onClick={() => navigate('/dashboard/form')}
                >
                    등록하기
                </ButtonBase>
            </div>

            <div className="flex flex-col xl:flex-row gap-3 xl:gap-5 px-8 xl:pb-0 pb-8">
                {/* 카드 */}
                {SECTIONS.map((sec) => {
                    const items = applications.filter((app) => sec.status.includes(app.status));

                    return (
                        <div key={sec.title} className="bg-light-primary rounded-xl p-5 xl:p-6 flex-1">
                            <strong className="block text-md xl:text-lg mb-4 xl:mb-6">
                                {sec.title}
                                <span className="text-primary"> {items.length}</span>
                            </strong>
                            {items.length === 0 ? (
                                <div className="text-center py-8 xl:py-17 text-gray-7 text-sm">
                                    등록된 글이 없습니다.
                                </div>
                            ) : (
                                    <div className="flex flex-col gap-2 max-h-[63vh] overflow-y-scroll scrollbar-hide">
                                        {items.map((item) => (
                                            <button 
                                                key={item.id}
                                                onClick={() => navigate(`/dashboard/detail/${item.id}`)}
                                                className="relative w-full text-left bg-white p-4 xl:p-5 rounded-xl shadow-[0_0_6px_0_#EBF1FA] cursor-pointer"
                                            >
                                                <p className="text-xs xl:text-sm text-black-6">{item.company_name}</p>
                                                <strong className="block mt-0.5 font-semibold text-md xl:text-lg">{item.job_title}</strong>
                                                <div className="flex gap-1.5 mt-2 mb-3 flex-wrap">
                                                    <p className="text-primary font-semibold text-xs xl:text-sm">{getDday(item.deadline)}</p>
                                                    {(item.status === "planned" || item.status === "reject") && (
                                                        <p className="text-black-6 text-xs xl:text-sm">{item.deadline} 서류 마감</p>
                                                    )}
                                                    {(item.status === "interview" || item.status === "pendingInterview") &&  (
                                                        <p className="text-black-6 text-xs xl:text-sm">{item.interview_date} 면접</p>
                                                    )}
                                                    {item.status === "applied" && (
                                                        <p className="text-black-6 text-xs xl:text-sm">{item.application_date} 지원</p>
                                                    )}
                                                    {item.status === "finalPass" && (
                                                        <p className="text-black-6 text-xs xl:text-sm">{item.start_date} 입사</p>
                                                    )}
                                                    <p className="text-black-6 text-xs xl:text-sm">{PLATFORM_LABELS[item.platform ?? ""] ?? item.platform}</p>
                                                </div>
                                                <ApplicationStatusBadge status={item.status} />
                                            </button>
                                        ))}
                                    </div>
                            )}
                            <Link
                                to="/dashboard/form"
                                className="flex items-center gap-1 font-semibold text-sm xl:text-base text-gray-7 mt-4"
                            >
                                <img src={AddIcon} alt="" />
                                추가하기
                            </Link>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}
export default ListContainer;