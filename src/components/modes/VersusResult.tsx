import React from 'react';
import { motion } from 'framer-motion';
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
import Button from '../ui/button';
import { ChartOptions, TooltipItem } from 'chart.js';
import { Trophy, RefreshCw } from 'lucide-react';
import personalityTraits from '../../data/personalityTraits';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Friend {
  id: string;
  name: string;
}

interface VersusResultProps {
  friends: Friend[];
  ratings: { [key: string]: { [key: string]: number } };
  onRestart: () => void;
  onNewComparison: () => void;
}

const getComparisonResult = (victories: number) => {
  switch (victories) {
    case 3:
      return {
        text: "Victoire absolue",
        color: "from-green-500 to-emerald-500",
        description: "A gagné toutes les comparaisons"
      };
    case 2:
      return {
        text: "Avantage",
        color: "from-blue-500 to-cyan-500",
        description: "A gagné la majorité des comparaisons"
      };
    case 1:
      return {
        text: "Léger avantage",
        color: "from-yellow-500 to-orange-500",
        description: "A gagné une comparaison sur trois"
      };
    default:
      return {
        text: "N&#39;a pas dominé",
        color: "from-red-400 to-red-500",
        description: "N'a gagné aucune comparaison"
      };
  }
};

const VersusResult: React.FC<VersusResultProps> = ({
  friends,
  ratings,
  onRestart,
  onNewComparison,
}) => {
  const [winner, runnerUp] = friends;
  const traits = Object.keys(ratings);

  const getTraitName = (traitId: string) => {
    const trait = personalityTraits.find(t => t.id === traitId);
    return trait ? trait.name : traitId;
  };

  const chartData = {
    labels: traits.map(trait => getTraitName(trait)),
    datasets: friends.map((friend, index) => ({
      label: friend.name,
      data: traits.map(trait => {
        const victories = ratings[trait][friend.id] || 0;
        return (victories / 3) * 100; // Convertir en pourcentage
      }),
      backgroundColor: index === 0 
        ? 'rgba(147, 51, 234, 0.8)' 
        : 'rgba(59, 130, 246, 0.8)',
      borderColor: index === 0 
        ? 'rgb(147, 51, 234)' 
        : 'rgb(59, 130, 246)',
      borderWidth: 2,
      borderRadius: 8,
      barPercentage: 0.8,
    })),
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (tickValue: string | number) {
            return `${tickValue}%`;
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 600,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const victories = Math.round((context.parsed.y * 3) / 100);
            return `${context.dataset.label}: ${victories}/3 victoires`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    animation: {
      duration: 2000,
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Titre et trophée */}
      <div className="text-center relative pb-8 mt-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="inline-block p-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4 shadow-lg"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
          Résultats du Duel
        </h2>
      </div>

      {/* Nouveau graphique en barres */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
        <div className="h-[400px]"> {/* Hauteur fixe pour le graphique */}
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Résultats détaillés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {friends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ x: index === 0 ? -50 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.2, type: "spring" }}
            className="relative bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden"
          >
            {/* En-tête avec médaille */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{index === 0 ? '🥇' : '🥈'}</span>
                <div>
                  <h3 className="text-2xl font-bold">{friend.name}</h3>
                  <p className="text-sm opacity-90">
                    {index === 0 ? 'Premier' : 'Second'} - {
                      traits.reduce((total, trait) => total + (ratings[trait][friend.id] || 0), 0)
                    } victoires au total
                  </p>
                </div>
              </div>
            </div>

            {/* Stats par trait */}
            <div className="divide-y divide-gray-100">
              {traits.map(trait => {
                const victories = ratings[trait][friend.id] || 0;
                const result = getComparisonResult(victories);
                const trait_info = personalityTraits.find(t => t.id === trait);
                
                return (
                  <div key={trait} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {getTraitName(trait)}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {trait_info?.description}
                        </p>
                      </div>
                      <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${result.color}`}>
                        {victories}/3
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(victories / 3) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`absolute h-full rounded-full bg-gradient-to-r ${result.color}`}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {result.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Résumé des forces */}
            <div className="p-6 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">Points forts</h4>
              <div className="flex flex-wrap gap-2">
                {traits
                  .filter(trait => (ratings[trait][friend.id] || 0) >= 2)
                  .map(trait => (
                    <span
                      key={trait}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {getTraitName(trait)}
                    </span>
                  ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Boutons d'action */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
      >
        <Button
          onClick={onNewComparison}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                   text-white px-8 py-4 rounded-xl shadow-lg transition-all duration-300 
                   flex items-center gap-2 font-semibold"
        >
          <RefreshCw className="w-5 h-5" />
          Nouvelle comparaison
        </Button>
        <Button
          onClick={onRestart}
          variant="outline"
          className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 
                   rounded-xl transition-all duration-300 font-semibold"
        >
          Choisir d'autres amis
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default VersusResult;
