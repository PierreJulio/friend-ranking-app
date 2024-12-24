import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AnalysisMode from '../../components/modes/AnalysisMode';

export default function AnalysisPage({ authenticated }: { authenticated: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) {
      router.push('/');
    }
  }, [authenticated, router]);

  if (!authenticated) {
    return null;
  }

  return <AnalysisMode />;
}
