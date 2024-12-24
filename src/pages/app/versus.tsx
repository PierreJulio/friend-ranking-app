import { useEffect } from 'react';
import { useRouter } from 'next/router';
import VersusMode from '../../components/modes/VersusMode';

export default function VersusPage({ authenticated }: { authenticated: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) {
      router.push('/');
    }
  }, [authenticated, router]);

  if (!authenticated) {
    return null;
  }

  return <VersusMode />;
}
