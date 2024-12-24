import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ThemedMode from '../../components/modes/ThemedMode';

export default function ThemedPage({ authenticated }: { authenticated: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) {
      router.push('/');
    }
  }, [authenticated, router]);

  if (!authenticated) {
    return null;
  }

  return <ThemedMode />;
}
