import { useEffect, useState } from 'react'
import './App.css'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase';
import { BrowserRouter } from 'react-router-dom';
import Router from './router/Router';
import LoadingOverlay from './components/common/loading/LoadingOverlay';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  // 세션 확인이 끝났는지 여부
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    return <LoadingOverlay />
  }


  return (
    <BrowserRouter>
      <Router session={session}/>
    </BrowserRouter>
  )
}

export default App
