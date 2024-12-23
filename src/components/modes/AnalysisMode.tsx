import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, CircularProgress, Chip, Select, MenuItem, FormControl, Avatar, Button, IconButton } from '@mui/material';
import { ArrowLeft, Target, Lightbulb, ThumbsUp, Star, X, ListChecks, Play, Shuffle } from 'lucide-react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import personalityTraits from '../../data/personalityTraits';
import recommendations from '../../data/recommendations';
import { getRelevantActivities, ImprovementActivity } from '../../data/relationshipImprovements';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease-in-out',
  borderRadius: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
}));

const RecommendationCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.18)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
}));

const CompactModal = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: '500px',
  maxHeight: '85vh',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: '#fff',
  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

interface FriendAnalysis {
  name: string;
  scores: {
    [trait: string]: number;
  };
  strengths: Array<string>;
  weaknesses: Array<string>;
  recommendations: Array<{ recommendation: string; examples: string[] }>;
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
  avatar: string | null;
  hasEvaluation: boolean;
}

const AnalysisMode: React.FC = () => {
  const router = useRouter();
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [friendsList, setFriendsList] = useState<FriendData[]>([]);
  const [analysisData, setAnalysisData] = useState<EnhancedFriendAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ImprovementActivity | null>(null);

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
            avatar: data.avatar || null,
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

        const analysis: EnhancedFriendAnalysis = {
          name: selectedFriend,
          scores: averageScores,
          strengths: Object.entries(averageScores)
            .filter(([_, score]) => score > 2.5) // Ajustez le seuil pour les points forts
            .map(([trait]) => personalityTraits.find(t => t.id === trait)?.name || trait),
          weaknesses: Object.entries(averageScores)
            .filter(([_, score]) => score <= 2.5) // Ajustez le seuil pour les points faibles
            .map(([trait]) => personalityTraits.find(t => t.id === trait)?.name || trait),
          recommendations: [] as Array<{ recommendation: string; examples: string[] }>,
          progress: { 
            improved: [] as Array<string>, 
            declined: [] as Array<string> 
          },
          lastEvaluation: new Date(),
          overallTrend: 'stable'
        };

        analysis.recommendations = generateRecommendations(analysis.weaknesses, analysis.progress.improved);
        setAnalysisData(analysis);
      } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        setAnalysisData(null);
      }
      setLoading(false);
    };

    analyzeData();
  }, [selectedFriend]);

  const generateRecommendations = (weaknesses: string[], improved: string[]): Array<{ recommendation: string; examples: string[] }> => {
    let recommendationsList: Array<{ recommendation: string; examples: string[] }> = [];
    
    // Si nous avons des points à améliorer, ajouter leurs recommandations
    weaknesses.forEach(weakness => {
      if (recommendations[weakness] && Array.isArray(recommendations[weakness])) {
        recommendationsList.push(...recommendations[weakness]);
      }
    });

    // Si nous n'avons pas de points faibles, générer des recommandations basées sur les forces
    if (weaknesses.length === 0) {
      recommendationsList = [
        {
          recommendation: "Continuez à renforcer votre excellente relation !",
          examples: [
            "Maintenez vos habitudes positives",
            "Continuez à communiquer ouvertement",
            "Passez du temps de qualité ensemble"
          ]
        }
      ];
    }

    if (improved.length > 0) {
      recommendationsList.push({
        recommendation: "Continuez sur votre lancée, les progrès sont visibles!",
        examples: ["Continuez à faire ce qui fonctionne bien et à renforcer vos points forts."]
      });
    }

    return recommendationsList;
  };

  const handleStartGame = () => {
    if (!analysisData) return;
    
    const relevantActivities = getRelevantActivities(
      analysisData.weaknesses,
      analysisData.strengths
    );
    
    if (relevantActivities.length > 0) {
      const randomIndex = Math.floor(Math.random() * relevantActivities.length);
      setSelectedActivity(relevantActivities[randomIndex]);
      setShowActivityModal(true);
    }
  };
  
  // Remplacez le renderActivityModal existant par celui-ci
  const renderActivityModal = () => (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bgcolor: 'rgba(0,0,0,0.7)',
      zIndex: 1000,
      p: { xs: 2, sm: 4 },
      overflow: 'auto',
    }}>
      <CompactModal>
        {/* Header avec gradient */}
        <Box sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          p: 3,
          color: 'white',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
              {selectedActivity?.title}
            </Typography>
            <IconButton 
              onClick={() => setShowActivityModal(false)}
              sx={{ color: 'white', mt: -1, mr: -1 }}
            >
              <X size={20} />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              label={selectedActivity?.difficulty === 'easy' ? 'Facile' : 
                     selectedActivity?.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
              sx={{
                bgcolor: selectedActivity?.difficulty === 'easy' ? '#4CAF50' :
                        selectedActivity?.difficulty === 'medium' ? '#FF9800' : '#f44336',
                color: 'white',
                fontSize: '0.75rem',
              }}
            />
            <Chip
              size="small"
              label={selectedActivity?.duration === 'short' ? 'Court terme' :
                     selectedActivity?.duration === 'medium' ? 'Moyen terme' : 'Long terme'}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.75rem' }}
            />
          </Box>
        </Box>
  
        {/* Contenu scrollable */}
        <Box sx={{ p: 2, overflow: 'auto' }}>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            {selectedActivity?.description}
          </Typography>
  
          {/* Impact */}
          <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Target size={16} />
            Impact
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {selectedActivity?.impact.map((impact, index) => (
              <Chip
                key={index}
                size="small"
                icon={<Star size={14} />}
                label={impact}
                sx={{ bgcolor: 'primary.50' }}
              />
            ))}
          </Box>
  
          {/* Steps */}
          <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ListChecks size={16} />
            Étapes
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {selectedActivity?.steps.map((step, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start',
                  p: 1.5,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                }}
              >
                <Box sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  flexShrink: 0,
                }}>
                  {index + 1}
                </Box>
                <Typography variant="body2">{step}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
  
        {/* Actions fixes en bas */}
        <Box sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 1,
        }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Play size={18} />}
            onClick={() => {
              setShowActivityModal(false);
            }}
            sx={{
              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
            }}
          >
            Je me lance
          </Button>
          <Button
            variant="outlined"
            startIcon={<Shuffle size={18} />}
            onClick={() => {
              const newActivities = getRelevantActivities(
                analysisData?.weaknesses || [],
                analysisData?.strengths || []
              ).filter(activity => activity.title !== selectedActivity?.title);
              
              if (newActivities.length > 0) {
                const randomIndex = Math.floor(Math.random() * newActivities.length);
                setSelectedActivity(newActivities[randomIndex]);
              }
            }}
          >
            Autre
          </Button>
        </Box>
      </CompactModal>
    </Box>
  );
  
  return (
    <div className="min-h-screen min-w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <Paper className="w-full max-w-4xl shadow-2xl" 
        sx={{ 
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}>
        
        {/* En-tête */}
        <Box className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <Typography variant="h4" sx={{ fontWeight: '600' }}>
                Analyse de la Relation
              </Typography>
            </div>
          </div>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Sélecteur d'ami */}
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Select
              value={selectedFriend || ''}
              onChange={(e) => setSelectedFriend(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: '12px',
                height: '56px'
              }}
            >
              <MenuItem disabled value="">
                <em>Sélectionnez un ami à analyser</em>
              </MenuItem>
              {friendsList.map((friend) => (
                <MenuItem key={friend.id} value={friend.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar>{friend.name.charAt(0)}</Avatar>
                    <Typography>{friend.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : analysisData ? (
            <Grid container spacing={3}>
              {/* Score Global */}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Box sx={{ 
                  position: 'relative', 
                  width: 200, 
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CircularProgress
                    variant="determinate"
                    value={Object.values(analysisData.scores).reduce((a, b) => a + b, 0) / Object.keys(analysisData.scores).length * 20}
                    size={200}
                    thickness={3}
                    sx={{
                      color: 'primary.main',
                      position: 'absolute',
                      '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                      },
                    }}
                  />
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
                      {Math.round(Object.values(analysisData.scores).reduce((a, b) => a + b, 0) / Object.keys(analysisData.scores).length * 20)}%
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Score Global
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Forces et Points à Améliorer */}
              <Grid item xs={12} md={6}>
                <StyledPaper>
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ThumbsUp size={20} color="#4CAF50" />
                    Points Forts
                  </Typography>
                  {analysisData.strengths.length > 0 ? (
                    analysisData.strengths.map((strength, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Star size={16} color="#4CAF50" />
                          {strength}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      bgcolor: 'error.light', 
                      borderRadius: 2,
                      color: 'white'
                    }}>
                      <Typography variant="body1">
                        Aucun point fort identifié pour le moment. Continuez à travailler sur votre relation pour développer vos forces.
                      </Typography>
                    </Box>
                  )}
                </StyledPaper>
              </Grid>

              <Grid item xs={12} md={6}>
                <StyledPaper>
                  <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Target size={20} color="#f44336" />
                    Points à Améliorer
                  </Typography>
                  {analysisData.weaknesses.length > 0 ? (
                    analysisData.weaknesses.map((weakness, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Target size={16} color="#f44336" />
                          {weakness}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      bgcolor: 'success.light', 
                      borderRadius: 2,
                      color: 'white'
                    }}>
                      <Typography variant="body1">
                        Félicitations ! Aucun point majeur à améliorer n'a été identifié. Continuez sur cette lancée !
                      </Typography>
                    </Box>
                  )}
                </StyledPaper>
              </Grid>

              {/* Recommandations Principales */}
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                  Recommandations Personnalisées
                </Typography>
                <Grid container spacing={2}>
                  {analysisData.recommendations.slice(0, 3).map((rec, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <RecommendationCard
                        sx={{
                          background: index === 0 
                            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                            : index === 1
                            ? 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)'
                            : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                        }}
                      >
                        <Box sx={{ mb: 2 }}>
                          <Lightbulb
                            size={32}
                            color="white"
                            style={{ marginBottom: '8px' }}
                          />
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                            {rec.recommendation}
                          </Typography>
                        </Box>
                        <Box sx={{
                          p: 2,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          borderRadius: 2,
                        }}>
                          {rec.examples.map((example, idx) => (
                            <Typography
                              key={idx}
                              variant="body2"
                              sx={{
                                color: 'white',
                                opacity: 0.9,
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <Star size={16} />
                              {example}
                            </Typography>
                          ))}
                        </Box>
                      </RecommendationCard>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Bouton d'action */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => handleStartGame()}
                  sx={{
                    mt: 4,
                    py: 2,
                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                    },
                  }}
                >
                  Trouver une activité à faire ensemble
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Sélectionnez un ami pour voir l'analyse de votre relation
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
      {showActivityModal && renderActivityModal()}
    </div>
  );
};

export default AnalysisMode;
