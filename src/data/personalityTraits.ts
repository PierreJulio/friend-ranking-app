import { gameModesQuestions } from './gameModesQuestions';

const personalityTraits = [
    {
      id: 'emotional-support',
      name: 'Soutien Émotionnel',
      description: 'Capacité à être présent et réconfortant dans les moments difficiles',
      questions: {
        friendRankingMode: gameModesQuestions.friendRankingMode['emotional-support'],
        versusMode: gameModesQuestions.versusMode['emotional-support'],
        themedMode: gameModesQuestions.themedMode['emotional-support']
      }
    },
    {
      id: 'fun-adventure',
      name: 'Fun & Aventure',
      description: 'Capacité à rendre les moments ensemble excitants et mémorables',
      questions: {
        friendRankingMode: gameModesQuestions.friendRankingMode['fun-adventure'],
        versusMode: gameModesQuestions.versusMode['fun-adventure'],
        themedMode: gameModesQuestions.themedMode['fun-adventure']
      }
    },
    {
      id: 'confidentiality',
      name: 'Confidentialité',
      description: 'Capacité à garder des secrets et à être digne de confiance',
      questions: {
        friendRankingMode: gameModesQuestions.friendRankingMode['confidentiality'],
        versusMode: gameModesQuestions.versusMode['confidentiality'],
        themedMode: gameModesQuestions.themedMode['confidentiality']
      }
    },
    {
      id: 'complicity',
      name: 'Complicité',
      description: 'Connexion profonde et compréhension mutuelle',
      questions: {
        friendRankingMode: gameModesQuestions.friendRankingMode['complicity'],
        versusMode: gameModesQuestions.versusMode['complicity'],
        themedMode: gameModesQuestions.themedMode['complicity']
      }
    },
    {
      id: 'loyalty',
      name: 'Loyauté',
      description: 'Fidélité et engagement dans l\'amitié',
      questions: {
        friendRankingMode: gameModesQuestions.friendRankingMode['loyalty'],
        versusMode: gameModesQuestions.versusMode['loyalty'],
        themedMode: gameModesQuestions.themedMode['loyalty']
      }
    }
];

export default personalityTraits;
