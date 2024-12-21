import { useEffect } from 'react';
import { useRouter } from 'next/router';
import FriendRankingApp from '../components/FriendRankingApp';

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

  return <FriendRankingApp />;
}
