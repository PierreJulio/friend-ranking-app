import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Grid, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Users, ArrowLeft, Heart, Star, Lock, Smile, Shield } from 'lucide-react';
import personalityTraits from '../../data/personalityTraits';

const getTraitIcon = (traitId: string) => {
  switch (traitId) {
    case 'emotional-support':
      return <Heart className="w-8 h-8 mb-2 text-pink-500" />;
    case 'fun-adventure':
      return <Star className="w-8 h-8 mb-2 text-yellow-500" />;
    case 'confidentiality':
      return <Lock className="w-8 h-8 mb-2 text-purple-500" />;
    case 'complicity':
      return <Smile className="w-8 h-8 mb-2 text-green-500" />;
    case 'loyalty':
      return <Shield className="w-8 h-8 mb-2 text-blue-500" />;
    default:
      return null;
  }
};

const ThemedMode: React.FC = () => {
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <Paper className="w-full max-w-2xl shadow-2xl">
        <Box className="bg-gradient-to-r from-blue-700 to-purple-700 text-white p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {/* navigation logic */}}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              <Typography variant="h4" className="text-3xl">Mode Thématique</Typography>
            </div>
          </div>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {personalityTraits.map((trait) => (
              <Grid item xs={12} sm={6} md={4} key={trait.id}>
                <Paper
                  elevation={selectedTrait === trait.id ? 4 : 1}
                  onClick={() => setSelectedTrait(trait.id)}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    borderRadius: 2,
                    border: t => selectedTrait === trait.id ? '2px solid' : '1px solid',
                    borderColor: t => selectedTrait === trait.id ? 'primary.main' : 'grey.200',
                    backgroundColor: t => selectedTrait === trait.id ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  {getTraitIcon(trait.id)}
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: selectedTrait === trait.id ? 'primary.dark' : 'text.primary',
                      fontWeight: 600
                    }}
                  >
                    {trait.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 2, 
                      textAlign: 'center',
                      color: selectedTrait === trait.id ? 'text.primary' : 'text.secondary'
                    }}
                  >
                    {trait.description}
                  </Typography>
                  <Button
                    variant={selectedTrait === trait.id ? "contained" : "outlined"}
                    color="primary"
                    sx={{
                      mt: 'auto',
                      borderRadius: 2,
                      textTransform: 'none',
                      minWidth: 140
                    }}
                  >
                    {selectedTrait === trait.id ? 'Sélectionné' : 'Choisir'}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {selectedTrait && (
            <Box sx={{ 
              mt: 4, 
              textAlign: 'center',
              position: 'sticky',
              bottom: { xs: 16, sm: 24 },
              zIndex: 2
            }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                  }
                }}
                onClick={() => {/* Implémenter la logique de démarrage */}}
              >
                Commencer l'évaluation
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </div>
  );
};

export default ThemedMode;
