import { useEffect, useState } from 'react'
import './App.css'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase';
import FormContainer from './components/dashboard/form/FormContainer';
import { BrowserRouter } from 'react-router-dom';
import Router from './router/Router';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // 페이지가 열릴 때 지금 세션이 있는지 한 번 확인
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
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
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}

export default App
