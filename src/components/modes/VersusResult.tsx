import React from 'react';
import { motion } from 'framer-motion';
import { Radar } from 'react-chartjs-2';
import Button from '../ui/button';
import { Trophy, RefreshCw, Medal } from 'lucide-react';
import personalityTraits from '../../data/personalityTraits';

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
      data: traits.map(trait => ratings[trait][friend.id] || 0),
      backgroundColor: index === 0 
        ? 'rgba(147, 51, 234, 0.2)' 
        : 'rgba(59, 130, 246, 0.2)',
      borderColor: index === 0 
        ? 'rgb(147, 51, 234)' 
        : 'rgb(59, 130, 246)',
      borderWidth: 2,
      pointBackgroundColor: index === 0 
        ? 'rgb(147, 51, 234)' 
        : 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: index === 0 
        ? 'rgb(147, 51, 234)' 
        : 'rgb(59, 130, 246)',
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  };

  const chartOptions = {
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1 },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 700,
          },
          padding: 20,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center relative pb-16 mt-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="inline-block p-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4 shadow-lg"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
          Résultats de la comparaison
        </h2>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <div className="aspect-square w-full max-w-2xl mx-auto mb-8">
          <Radar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {friends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ x: index === 0 ? -50 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.2, type: "spring" }}
            className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10 transform translate-x-8 -translate-y-8">
              <Medal className="w-full h-full" strokeWidth={1} />
            </div>
            <div className="flex items-center gap-4 mb-6">
              {index === 0 ? (
                <span className="text-4xl">🥇</span>
              ) : (
                <span className="text-4xl">🥈</span>
              )}
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                {friend.name}
              </h3>
            </div>
            <div className="space-y-3">
              {traits.map(trait => (
                <div key={trait} className="flex items-center">
                  <div className="w-full bg-gray-100 rounded-full h-4 mr-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
                      style={{ width: `${(ratings[trait][friend.id] / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-32 text-right">
                    {getTraitName(trait)}: {ratings[trait][friend.id]}/5
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-4 mt-12"
      >
        <Button
          onClick={onNewComparison}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Nouvelle comparaison
        </Button>
        <Button
          onClick={onRestart}
          variant="outline"
          className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 rounded-lg transition-all duration-300"
        >
          Choisir d'autres amis
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default VersusResult;
