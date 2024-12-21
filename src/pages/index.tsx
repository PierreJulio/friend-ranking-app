import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthScreen from '../components/AuthScreen';

export default function Home({ authenticated }: { authenticated: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push('/app');
    }
  }, [authenticated, router]);

  return <AuthScreen />;
}
