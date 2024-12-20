import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { motion } from 'framer-motion';
import { History, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '../components/ui/button';

interface RankingHistoryProps {
  userId: string;
  onClose: () => void;
}

const RankingHistory: React.FC<RankingHistoryProps> = ({ userId, onClose }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedRanking, setSelectedRanking] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, 'finalRankings'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const rankings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));
        
        setHistory(rankings);
        setLoading(false);
      } catch (err) {
        setError('L\'index est en cours de création. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-white rounded-lg shadow-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <History className="mr-2" /> Historique des Classements
        </h2>
        <Button onClick={onClose} variant="outline">
          Fermer
        </Button>
      </div>

      <div className="space-y-4">
        {history.map((ranking, index) => (
          <div key={ranking.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                Classement du {new Date(ranking.timestamp).toLocaleDateString()}
              </h3>
              <Button
                onClick={() => setSelectedRanking(selectedRanking === index ? null : index)}
                variant="outline"
                className="flex items-center"
              >
                {selectedRanking === index ? <ChevronLeft /> : <ChevronRight />}
                {selectedRanking === index ? 'Réduire' : 'Voir les détails'}
              </Button>
            </div>
            
            {selectedRanking === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                {ranking.finalRankings.map((rank: any) => (
                  <div key={rank.friend} className="mb-4 p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {rank.rank}. {rank.friend}
                      </span>
                      <span>Score: {rank.averageScore}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RankingHistory;