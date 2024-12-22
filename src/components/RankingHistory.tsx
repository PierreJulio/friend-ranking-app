import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { motion } from 'framer-motion';
import { History, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '../components/ui/button';

interface RankingHistoryProps {
  userId: string;
  onClose: () => void;
}

interface GroupedRankings {
  [key: string]: HistoryItem[];
}

interface HistoryItem {
  id: string;
  finalRankings: {
    friend: string;
    averageScore: string;
  }[];
  timestamp: Date;
}

const RankingHistory: React.FC<RankingHistoryProps> = ({ userId, onClose }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedRanking, setSelectedRanking] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const groupRankingsByDay = (rankings: HistoryItem[]) => {
    return rankings.reduce((groups: GroupedRankings, ranking) => {
      const dateKey = new Date(ranking.timestamp).toLocaleDateString('fr-FR');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(ranking);
      return groups;
    }, {});
  };

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
          finalRankings: doc.data().finalRankings || [],
          timestamp: doc.data().timestamp?.toDate()
        }));
        
        setHistory(rankings);
        setLoading(false);
      } catch {
        setError('L&apos;index est en cours de création. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const handleDelete = async (rankingId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce classement ?')) {
      try {
        await deleteDoc(doc(db, 'finalRankings', rankingId));
        setHistory(prevHistory => prevHistory.filter(item => item.id !== rankingId));
      } catch {
        setError('Erreur lors de la suppression du classement.');
      }
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="p-6 bg-white rounded-xl shadow-lg max-w-3xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center text-gray-800">
            <History className="mr-3 text-indigo-500" size={24} />
            Historique des Classements
          </h2>
          <Button 
            onClick={onClose} 
            variant="outline"
            className="hover:bg-gray-50 transition-colors duration-200"
          >
            Fermer
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            Vous n'avez pas encore créé de classement.
          </p>
          <p className="text-gray-400 mt-2">
            Commencez par créer votre premier classement !
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-6 bg-white rounded-xl shadow-lg max-w-3xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center text-gray-800">
          <History className="mr-3 text-indigo-500" size={24} />
          Historique des Classements
        </h2>
        <Button 
          onClick={onClose} 
          variant="outline"
          className="hover:bg-gray-50 transition-colors duration-200"
        >
          Fermer
        </Button>
      </div>

      <div className="space-y-8">
        {Object.entries(groupRankingsByDay(history)).map(([date, rankings]) => (
          <div key={date} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
              {new Date(rankings[0].timestamp).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </h3>
            
            <div className="space-y-4 pl-4">
              {rankings.map((ranking, index) => (
                <motion.div
                  key={ranking.id}
                  initial={false}
                  animate={{ backgroundColor: selectedRanking === ranking.id ? '#F9FAFB' : '#FFFFFF' }}
                  className="border border-gray-200 rounded-xl p-5 hover:border-indigo-200 transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium text-gray-700">
                      Classement de {formatDateTime(ranking.timestamp).time}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleDelete(ranking.id)}
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Supprimer
                      </Button>
                      <Button
                        onClick={() => setSelectedRanking(selectedRanking === ranking.id ? null : ranking.id)}
                        variant="ghost"
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                      >
                        {selectedRanking === ranking.id ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                        <span className="text-sm">
                          {selectedRanking === ranking.id ? 'Réduire' : 'Voir les détails'}
                        </span>
                      </Button>
                    </div>
                  </div>
                  
                  {selectedRanking === ranking.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 space-y-3"
                    >
                      {ranking.finalRankings.map((rank: any) => (
                        <motion.div
                          key={rank.friend}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="p-3 bg-white rounded-lg border border-gray-100 hover:border-indigo-100 
                                   hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">
                              <span className="text-indigo-500 mr-2">{rank.rank}.</span>
                              {rank.friend}
                            </span>
                            <span className="text-sm text-gray-500">
                              Score: <span className="font-semibold text-gray-700">{rank.averageScore}</span>
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RankingHistory;