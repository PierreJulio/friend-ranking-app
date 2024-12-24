import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, RefreshCw, Award, Shield, Smile, Star, ChevronRight, ChevronLeft, History } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Button from '../components/ui/button';
import personalityTraits from '../data/personalityTraits';
import Image from 'next/image';

// Enregistrer les éléments Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
}

const FinalRanking: React.FC<FinalRankingProps> = ({ finalRankings, onRestart, onRestartWithSameFriends, setShowHistory }) => {
  const [showGraph, setShowGraph] = useState<{ [key: number]: boolean }>({});
  const [selectedRank] = useState<number | null>(null);

  const toggleGraph = (index: number) => {
    setShowGraph(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold flex items-center text-gray-800">
          <Users className="mr-2 text-blue-500" /> Classement Final
        </h2>
        <Button 
          onClick={() => setShowHistory(true)}
          className="flex items-center hover:scale-105 transition-transform"
          variant="outline"
        >
          <History className="w-4 h-4 mr-2" />
          Historique
        </Button>
      </div>

      <div className="space-y-6">
        {finalRankings.map((ranking, index) => {
          const isSelected = selectedRank === index;
          const traitLabels = personalityTraits.map((trait) => trait.name);
          const traitScores = personalityTraits.map((trait) => ranking.traits[trait.id]);

          const data = {
            labels: traitLabels,
            datasets: [{
              label: ranking.friend,
              data: traitScores,
              backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)',
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1,
            }],
          };

          const options = {
            responsive: true,
            indexAxis: 'y' as const,
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                mode: 'index' as const,
                intersect: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: false,
                },
              },
              x: {
                beginAtZero: true,
                max: 5,
                ticks: {
                  stepSize: 1,
                },
                grid: {
                  display: false,
                },
              },
            },
            maintainAspectRatio: false,
          };

          return (
            <motion.div
              key={ranking.rank}
              className={`bg-white rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md
                ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: ranking.rank * 0.1 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {ranking.avatar ? (
                        <Image
                          src={ranking.avatar ?? ''}
                          alt={ranking.friend}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-semibold">
                          {ranking.friend.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {ranking.rank}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{ranking.friend}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-600 font-medium">
                          Score moyen: {ranking.averageScore}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => toggleGraph(index)}
                    variant="outline"
                    className="hover:bg-blue-50 transition-colors"
                  >
                    {showGraph[index] ? (
                      <>
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Détails
                      </>
                    ) : (
                      <>
                        Graphique
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>

                {ranking.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 my-4">
                    {ranking.badges.map((badgeId, idx) => {
                      const badge = badges[badgeId];
                      if (badge) {
                        return (
                          <motion.div
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm"
                            whileHover={{ scale: 1.05 }}
                          >
                            {badge.icon}
                            <span className="ml-2">{badge.label}</span>
                          </motion.div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}

                <motion.div
                  initial={false}
                  animate={{ height: showGraph[index] ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  {showGraph[index] ? (
                    <div className="mt-4 h-[250px]"> {/* Hauteur ajustée */}
                      <Bar data={data} options={options} />
                    </div>
                  ) : (
                    <div className="grid gap-4 mt-4">
                      {Object.entries(ranking.traits).map(([traitId, score]) => {
                        const trait = personalityTraits.find((t) => t.id === traitId);
                        return (
                          <div key={traitId} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                              <span>{trait?.name}</span>
                              <span>{score}/5</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(score / 5) * 100}%` }}
                                className="h-full bg-blue-500 rounded-full"
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Button
          variant="outline"
          className="group hover:bg-blue-50 transition-colors"
          onClick={onRestartWithSameFriends}
        >
          <RefreshCw className="mr-2 group-hover:rotate-180 transition-transform" />
          Même groupe
        </Button>
        <Button
          className="group bg-blue-500 hover:bg-blue-600 text-white"
          onClick={onRestart}
        >
          <RefreshCw className="mr-2 group-hover:rotate-180 transition-transform" />
          Nouveau groupe
        </Button>
      </div>
    </motion.div>
  );
};

export default FinalRanking;