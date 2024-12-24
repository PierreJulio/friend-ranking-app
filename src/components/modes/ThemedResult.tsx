import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Typography, Button, Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, Share2, Download } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import personalityTraits from '../../data/personalityTraits';

interface Friend {
  id: string;
  name: string;
  avatar: string | null;
}

interface ThemedResultProps {
  friends: Friend[];
  ratings: { [key: string]: number };
  trait: string;
  onRestart: () => void;
}

const ThemedResult: React.FC<ThemedResultProps> = ({
  friends,
  ratings,
  trait,
  onRestart
}) => {
  const currentTrait = personalityTraits.find(t => t.id === trait);
  const sortedFriends = [...friends].sort((a, b) => (ratings[b.id] || 0) - (ratings[a.id] || 0));

  const chartData = {
    labels: sortedFriends.map(friend => friend.name),
    datasets: [
      {
        label: currentTrait?.name,
        data: sortedFriends.map(friend => ratings[friend.id] || 0),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',   // Indigo
          'rgba(239, 68, 68, 0.8)',    // Red
          'rgba(34, 197, 94, 0.8)',    // Green
          'rgba(249, 115, 22, 0.8)',   // Orange
          'rgba(168, 85, 247, 0.8)',   // Purple
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 700,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5, // Change max value to 5
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 1:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 2:
        return <Medal className="w-8 h-8 text-amber-600" />;
      default:
        return <Star className="w-8 h-8 text-blue-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-xl shadow-lg mt-8"
      >
        <Typography variant="h4" className="font-bold text-center mb-2">
          Résultats : {currentTrait?.name}
        </Typography>
        <Typography variant="body1" className="text-center text-blue-50">
          {currentTrait?.description}
        </Typography>
        
        <div className="flex justify-center gap-4 mt-6">
          <Button
            startIcon={<Share2 className="w-4 h-4" />}
            variant="contained"
            className="bg-white/20 hover:bg-white/30"
          >
            Partager
          </Button>
          <Button
            startIcon={<Download className="w-4 h-4" />}
            variant="contained"
            className="bg-white/20 hover:bg-white/30"
          >
            Exporter
          </Button>
        </div>
      </motion.div>

      {/* Chart Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="h-[400px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Rankings Section */}
      <div className="grid gap-4">
        <AnimatePresence>
          {sortedFriends.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="transform transition-all hover:scale-[1.02] bg-gradient-to-r from-white to-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute -top-2 -left-2 z-10">
                          {getMedalIcon(index)}
                        </div>
                        <Avatar
                          src={friend.avatar || undefined}
                          alt={friend.name}
                          className="w-16 h-16 border-4 border-white shadow-lg relative z-0"
                        >
                          {friend.name[0]}
                        </Avatar>
                      </div>
                      <div>
                        <Typography variant="h6" className="font-bold">
                          {friend.name}
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                          {index === 0 ? "🏆 Champion" : `${index + 1}ème position`}
                        </Typography>
                      </div>
                    </div>
                    <div className="text-center bg-blue-50 px-6 py-3 rounded-full">
                      <Typography variant="h4" className="font-bold text-blue-600">
                        {ratings[friend.id]}
                      </Typography>
                      <Typography variant="caption" className="text-blue-400">
                        sur 5 {/* Change text to "sur 5" */}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center pt-6"
      >
        <Button
          variant="contained"
          onClick={onRestart}
          size="large"
          className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform transition-all hover:scale-105 shadow-lg"
        >
          Nouvelle évaluation
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ThemedResult;
