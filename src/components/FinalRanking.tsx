import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, RefreshCw, Award, Shield, Smile, Star, ChevronRight, ChevronLeft, History } from 'lucide-react';
import { Radar } from 'react-chartjs-2';
import Button from '../components/ui/button';
import personalityTraits from '../data/personalityTraits';

const badges: { [key: string]: { label: string; icon: React.ReactNode } } = {
  'emotional-support': {
    label: 'Support émotionnel de l\'année',
    icon: <Shield className="w-5 h-5 text-blue-500" />,
  },
  'fun-adventure': {
    label: 'Roi/Reine de l\'aventure',
    icon: <Smile className="w-5 h-5 text-yellow-500" />,
  },
  'confidentiality': {
    label: 'Meilleur confident',
    icon: <Award className="w-5 h-5 text-green-500" />,
  },
  'perfect-emotional-support': {
    label: 'Score parfait en Soutien Émotionnel',
    icon: <Star className="w-5 h-5 text-purple-500" />,
  },
  'perfect-fun-adventure': {
    label: 'Score parfait en Fun & Aventure',
    icon: <Star className="w-5 h-5 text-purple-500" />,
  },
  'perfect-confidentiality': {
    label: 'Score parfait en Confidentialité',
    icon: <Star className="w-5 h-5 text-purple-500" />,
  },
};

interface FinalRankingProps {
  finalRankings: {
    rank: number;
    friend: string;
    avatar: string | null;
    averageScore: string;
    traits: { [traitId: string]: number };
    badges: string[];
  }[];
  onRestart: () => void;
  onRestartWithSameFriends: () => void;
  showHistory: boolean;
  setShowHistory: (value: boolean) => void;
}

const FinalRanking: React.FC<FinalRankingProps> = ({ finalRankings, onRestart, onRestartWithSameFriends, showHistory, setShowHistory }) => {
  const [showGraph, setShowGraph] = useState<{ [key: number]: boolean }>({});

  const toggleGraph = (index: number) => {
    setShowGraph(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold my-4 flex items-center">
          <Users className="mr-2" /> Classement Final
        </h2>
        <Button 
          onClick={() => setShowHistory(true)}
          className="flex items-center"
          variant="outline"
        >
          <History className="w-4 h-4 mr-2" />
          Voir l'historique
        </Button>
      </div>
      <p className="mb-4">
        Voici le classement final de vos amis basé sur les traits de personnalité évalués.
      </p>
      <div className="space-y-4">
        {finalRankings.map((ranking, index) => {
          const traitLabels = personalityTraits.map((trait) => trait.name);
          const traitScores = personalityTraits.map((trait) => ranking.traits[trait.id]);

          const data = {
            labels: traitLabels,
            datasets: [
              {
                label: `${ranking.friend}`,
                data: traitScores,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
          };

          const options = {
            scales: {
              r: {
                min: 0,
                max: 5,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          };

          return (
            <motion.div
              key={ranking.rank}
              className="p-4 bg-white rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: ranking.rank * 0.1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  {ranking.avatar ? (
                    <img
                      src={ranking.avatar}
                      alt={ranking.friend}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                      {ranking.friend.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <strong className="text-lg">
                      {ranking.rank}. {ranking.friend}
                    </strong>
                    <p className="text-sm text-gray-600">
                      Score Moyen: {ranking.averageScore}
                    </p>
                  </div>
                </div>
                <Button onClick={() => toggleGraph(index)} variant="outline" className="flex items-center justify-center">
                  {showGraph[index] ? <ChevronLeft className="mr-2" /> : <ChevronRight className="mr-2" />}
                  {showGraph[index] ? 'Voir les résultats' : 'Voir le graphique'}
                </Button>
              </div>
              {showGraph[index] ? (
                <div className="mb-4">
                  <Radar data={data} options={options} />
                </div>
              ) : (
                <>
                  {ranking.badges.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center">
                      <h3 className="text-md font-bold mr-2">Badges :</h3>
                      {ranking.badges.map((badgeId, index) => {
                        const badge = badges[badgeId];
                        if (badge) {
                          return (
                            <div key={index} className="flex items-center mr-4 mb-2">
                              {badge.icon}
                              <span className="ml-1 text-sm">{badge.label}</span>
                            </div>
                          );
                        } else {
                          return (
                            <div key={index} className="flex items-center mr-4 mb-2">
                              <Award className="w-5 h-5 text-gray-500" />
                              <span className="ml-1 text-sm">{badgeId}</span>
                            </div>
                          );
                        }
                      })}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {Object.entries(ranking.traits).map(([traitId, score]) => (
                      <div
                        key={traitId}
                        className="flex items-center space-x-1 bg-gray-100 p-2 rounded-lg"
                      >
                        <span className="text-sm font-semibold">
                          {personalityTraits.find((trait) => trait.id === traitId)?.name}:
                        </span>
                        <span className="text-sm">{score}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-6">
        <Button
          variant="secondary"
          className="w-full flex items-center justify-center"
          onClick={onRestart}
        >
          <RefreshCw className="mr-2" /> Recommencer avec de nouveaux amis
        </Button>
        <Button
          variant="secondary"
          className="w-full flex items-center justify-center mt-2"
          onClick={onRestartWithSameFriends}
        >
          <RefreshCw className="mr-2" /> Recommencer avec les mêmes amis
        </Button>
      </div>
    </motion.div>
  );
};

export default FinalRanking;