import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, CircularProgress, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ArrowLeft, Target, Lightbulb, ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease-in-out',
}));

interface FriendAnalysis {
  name: string;
  scores: {
    [trait: string]: number;
  };
  strengths: Array<string>;
  weaknesses: Array<string>;
  recommendations: Array<string>;
}

interface RatingHistory {
  timestamp: number;
  scores: {
    [trait: string]: number;
  };
}

interface EnhancedFriendAnalysis extends FriendAnalysis {
  progress: {
    improved: Array<string>;
    declined: Array<string>;
  };
  lastEvaluation: Date;
  overallTrend: 'positive' | 'negative' | 'stable';
}

interface FriendData {
  id: string;
  name: string;
  hasEvaluation: boolean;
}

const AnalysisMode: React.FC = () => {
  const router = useRouter();
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [friendsList, setFriendsList] = useState<FriendData[]>([]);
  const [analysisData, setAnalysisData] = useState<EnhancedFriendAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratingHistory, setRatingHistory] = useState<RatingHistory[]>([]);

  useEffect(() => {
    const loadFriendsWithEvaluations = async () => {
      try {
        setLoading(true);
        console.log("Chargement des évaluations...");

        const friendsRef = collection(db, 'friends');
        const friendsSnapshot = await getDocs(friendsRef);

        const friendsMap = new Map();

        friendsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          friendsMap.set(doc.id, {
            id: doc.id,
            name: data.name,
            hasEvaluation: false
          });
        });

        const ratingsRef = collection(db, 'ratings');
        const ratingsSnapshot = await getDocs(ratingsRef);

        ratingsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.friendId && friendsMap.has(data.friendId)) {
            const friend = friendsMap.get(data.friendId);
            friend.hasEvaluation = true;
            friendsMap.set(data.friendId, friend);
          }
        });

        const uniqueFriends = Array.from(friendsMap.values()).filter(friend => friend.hasEvaluation);
        console.log("Amis trouvés avec des évaluations:", uniqueFriends);

        setFriendsList(uniqueFriends);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setFriendsList([]);
        setLoading(false);
      }
    };

    loadFriendsWithEvaluations();
  }, []);

  useEffect(() => {
    const analyzeData = async () => {
      if (!selectedFriend) return;

      setLoading(true);
      try {
        const ratingsRef = collection(db, 'ratings');
        const q = query(ratingsRef, where('friendId', '==', selectedFriend));
        const snapshot = await getDocs(q);

        const traitScores: { [key: string]: number[] } = {};

        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.traitId && typeof data.score === 'number') {
            if (!traitScores[data.traitId]) {
              traitScores[data.traitId] = [];
            }
            traitScores[data.traitId].push(data.score);
          }
        });

        const averageScores: { [key: string]: number } = {};
        Object.entries(traitScores).forEach(([trait, scores]) => {
          const sum = scores.reduce((a, b) => a + b, 0);
          averageScores[trait] = sum / scores.length;
        });

        console.log("Scores moyens par trait:", averageScores);

        const history = [{
          timestamp: Date.now() / 1000,
          scores: averageScores
        }];

        const analysis: EnhancedFriendAnalysis = {
          name: selectedFriend,
          scores: averageScores,
          strengths: Object.entries(averageScores)
            .filter(([_, score]) => score >= 8)
            .map(([trait, _]) => trait),
          weaknesses: Object.entries(averageScores)
            .filter(([_, score]) => score <= 6)
            .map(([trait, _]) => trait),
          recommendations: [] as Array<string>,
          progress: { 
            improved: [] as Array<string>, 
            declined: [] as Array<string> 
          },
          lastEvaluation: new Date(),
          overallTrend: 'stable'
        };

        analysis.recommendations = generateRecommendations(analysis.weaknesses, analysis.progress.improved);
        setAnalysisData(analysis);
        setRatingHistory(history);
      } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        setAnalysisData(null);
      }
      setLoading(false);
    };

    analyzeData();
  }, [selectedFriend]);

  const generateRecommendations = (weaknesses: string[], improved: string[]): string[] => {
    const recommendations: string[] = [];
    
    weaknesses.forEach(weakness => {
      switch(weakness) {
        case 'emotional-support':
          recommendations.push("Essayez de partager plus de moments émotionnels ensemble");
          break;
        case 'fun-adventure':
          recommendations.push("Planifiez plus d'activités nouvelles et excitantes");
          break;
        // Ajouter d'autres cas selon vos traits
      }
    });

    if (improved.length > 0) {
      recommendations.push("Continuez sur votre lancée, les progrès sont visibles!");
    }

    return recommendations;
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <Paper className="w-full max-w-3xl shadow-2xl" sx={{ borderRadius: 0 }}>
        <Box className="bg-gradient-to-r from-blue-700 to-purple-700 text-white p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6" />
              <Typography variant="h4" className="text-3xl">Analyse Relationnelle</Typography>
            </div>
          </div>
        </Box>

        <Box sx={{ p: 4 }}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>Sélectionner un ami</InputLabel>
            <Select
              value={selectedFriend || ''}
              onChange={(e) => setSelectedFriend(e.target.value)}
              label="Sélectionner un ami"
            >
              {friendsList.length > 0 ? (
                friendsList.map((friend) => (
                  <MenuItem key={friend.id} value={friend.id}>
                    {friend.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  Aucun ami avec des évaluations
                </MenuItem>
              )}
            </Select>
          </FormControl>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : analysisData ? (
            analysisData.recommendations.length === 1 && 
            analysisData.recommendations[0].includes("Aucune évaluation") ? (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  {analysisData.recommendations[0]}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {/* Nouvelle section : Tendances */}
                <Grid item xs={12}>
                  <StyledPaper>
                    <Typography variant="h6" gutterBottom className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      Évolution de la relation
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        Dernière évaluation : {analysisData.lastEvaluation.toLocaleDateString()}
                      </Typography>
                      {analysisData.progress.improved.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="success.main">
                            Points en amélioration :
                          </Typography>
                          {analysisData.progress.improved.map((trait) => (
                            <Chip
                              key={trait}
                              label={trait}
                              color="success"
                              size="small"
                              sx={{ m: 0.5 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </StyledPaper>
                </Grid>

                {/* Points forts */}
                <Grid item xs={12}>
                  <StyledPaper>
                    <Typography variant="h6" gutterBottom className="flex items-center gap-2">
                      <ThumbsUp className="w-5 h-5 text-green-500" />
                      Points forts de la relation
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1,
                      mb: 3 
                    }}>
                      {analysisData.strengths.map((strength, index) => (
                        <Chip
                          key={index}
                          label={strength}
                          color="success"
                          sx={{ 
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            py: 0.5
                          }}
                        />
                      ))}
                    </Box>
                  </StyledPaper>
                </Grid>

                {/* Points à améliorer */}
                <Grid item xs={12}>
                  <StyledPaper>
                    <Typography variant="h6" gutterBottom className="flex items-center gap-2">
                      <ThumbsDown className="w-5 h-5 text-red-500" />
                      Points à améliorer
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1,
                      mb: 3 
                    }}>
                      {analysisData.weaknesses.map((weakness, index) => (
                        <Chip
                          key={index}
                          label={weakness}
                          color="error"
                          variant="outlined"
                          sx={{ 
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            py: 0.5
                          }}
                        />
                      ))}
                    </Box>
                  </StyledPaper>
                </Grid>

                {/* Recommandations */}
                <Grid item xs={12}>
                  <StyledPaper>
                    <Typography variant="h6" gutterBottom className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Recommandations pour améliorer la relation
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {analysisData.recommendations.map((recommendation, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            mb: 2,
                            bgcolor: 'background.default',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            }
                          }}
                        >
                          <Typography variant="body1">
                            {recommendation}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </StyledPaper>
                </Grid>
              </Grid>
            )
          ) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Sélectionnez un ami pour voir son analyse
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </div>
  );
};

export default AnalysisMode;
