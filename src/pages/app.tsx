import { useEffect } from 'react';
import { useRouter } from 'next/router';
import GameModeSelection from '../components/GameModeSelection';

export default function AppPage({ authenticated }: { authenticated: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) {
      router.push('/');
    }
  }, [authenticated, router]);

  if (!authenticated) {
    return null;
  }

  return <GameModeSelection />;
}
