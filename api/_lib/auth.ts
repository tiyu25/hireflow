/// <reference types="node" />

import { createClient } from "@supabase/supabase-js";

// 요청 헤더의 Supabase 토큰이 유효한지 확인
export async function verifyUser(request: Request): Promise<boolean> {
    const authHeader = request.headers.get('Authorization');

    // 헤더가 없거나 Bearer 토큰이 아니면 인증 실패
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }

    const token = authHeader.slice('Bearer '.length);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase 환경변수가 설정되지 않았습니다.');
        return false;
    }

    // 서버에서는 세션을 저장할 곳이 없으므로 저장 기능을 끔
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
    });

    // Supabase 인증 서버에 토큰을 보내 진짜인지 확인
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return false;
    }

    return true;
}