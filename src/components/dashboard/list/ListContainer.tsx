import ButtonBase from "../../common/button/ButtonBase";

import AddIcon from "@/assets/images/add_plus_icn.svg";
import { useEffect, useState } from "react";
import { type Application, getApplications } from "../../../api/applications";
import { supabase } from "../../../lib/supabase";
import { type ApplicationStatus } from "../../../constants/ApplicationStatus";
import { Link, useNavigate } from "react-router-dom";
import LoadingOverlay from "../../common/loading/LoadingOverlay";
import ListApplicationCard from "./ListApplicationCard";

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
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ isError, setIsError ] = useState<boolean>(false);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError || !userData.user) {
                    // 로그인 정보가 없으면 로그인 페이지로
                    navigate("/login", { replace: true });
                    return;
                }
    
                const { data, error } = await getApplications(userData.user.id);
                if (error || !data) {
                    console.error(error);
                    setIsError(true);
                    return;
                }
                setApplications(data);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplications();
    }, [navigate]);

    return (
        <div>
            <LoadingOverlay isVisible={isLoading} />
            {/* 상단 */}
            <div className="flex justify-between xl:flex-row flex-col gap-4 pt-6 pb-4 px-8">
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

            {isError ? (
              <div className="text-center py-20 text-black-6">
                목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
              </div>  
            ) : (
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
                                            {items.map((item) =>(
                                                <ListApplicationCard key={item.id} application={item} />
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
            )}

        </div>
    )
}
export default ListContainer;