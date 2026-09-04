import { useEffect, useState } from 'react'
import './App.css'
import Login from './pages/Login'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 페이지가 열릴 때 지금 세션이 있는지 한 번 확인
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    // 이후 로그인/로그아웃 등으로 세션이 바뀔 때마다 자동 감지
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    }
  }, []);

  if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (session) {
      const provider = session.user.app_metadata.provider;

      if (provider === "kakao") {
        return <div>카카오 로그인 완료</div>;
      }

      if (provider === "google") {
        return <div>구글 로그인 완료</div>;
      }
    }

  return (
    <>
      <Login />
    </>
  )
}

export default App
