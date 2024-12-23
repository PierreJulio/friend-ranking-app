export interface ImprovementActivity {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: 'short' | 'medium' | 'long';
  category: string;
  impact: string[];
  steps: string[];
  traits: string[];
}

export const improvementActivities: ImprovementActivity[] = [
  {
    title: "Journal de Gratitude Partagé",
    description: "Créez un journal commun où vous notez les moments positifs de votre amitié",
    difficulty: "easy",
    duration: "short",
    category: "Emotional",
    impact: [
      "Renforce la reconnaissance mutuelle",
      "Développe une perspective positive",
      "Crée des souvenirs durables"
    ],
    steps: [
      "Choisissez un format de journal (numérique ou papier)",
      "Notez un moment positif chaque semaine",
      "Partagez vos entrées ensemble mensuellement"
    ],
    traits: ["Soutien Émotionnel", "Complicité"]
  },
  {
    title: "Défi des 30 jours de communication",
    description: "Engagez-vous à avoir une conversation significative chaque jour pendant un mois",
    difficulty: "medium",
    duration: "long",
    category: "Communication",
    impact: [
      "Améliore la qualité des échanges",
      "Approfondit la compréhension mutuelle",
      "Renforce la confiance"
    ],
    steps: [
      "Définissez un moment quotidien pour échanger",
      "Utilisez des questions profondes préparées",
      "Partagez vos réflexions sur l'évolution de vos échanges"
    ],
    traits: ["Confidentialité", "Complicité", "Soutien Émotionnel"]
  },
  {
    title: "Projet Créatif Commun",
    description: "Lancez-vous dans un projet créatif ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Creative",
    impact: [
      "Développe la collaboration",
      "Crée des souvenirs uniques",
      "Renforce le lien par l'accomplissement"
    ],
    steps: [
      "Choisissez un projet qui vous passionne tous les deux",
      "Établissez un planning réaliste",
      "Célébrez chaque étape accomplie"
    ],
    traits: ["Fun & Aventure", "Complicité"]
  },
  {
    title: "Challenge Photo Hebdomadaire",
    description: "Participez à un défi photo hebdomadaire sur un thème différent",
    difficulty: "easy",
    duration: "medium",
    category: "Créativité",
    impact: [
      "Développe votre créativité commune",
      "Crée des souvenirs visuels uniques",
      "Encourage le partage de perspectives"
    ],
    steps: [
      "Choisissez un thème chaque dimanche",
      "Prenez et partagez une photo par jour",
      "Discutez de vos photos préférées en fin de semaine"
    ],
    traits: ["Fun & Aventure", "Complicité"]
  },
  {
    title: "Séances de Questions Profondes",
    description: "Explorez votre relation à travers des questions significatives",
    difficulty: "medium",
    duration: "short",
    category: "Communication",
    impact: [
      "Approfondit la compréhension mutuelle",
      "Renforce la confiance",
      "Développe l'intimité émotionnelle"
    ],
    steps: [
      "Réservez un moment calme sans distractions",
      "Posez-vous mutuellement des questions profondes",
      "Écoutez sans jugement et partagez honnêtement"
    ],
    traits: ["Confidentialité", "Soutien Émotionnel"]
  },
  {
    title: "Bucket List Commune",
    description: "Créez et réalisez une liste de rêves et d'objectifs partagés",
    difficulty: "hard",
    duration: "long",
    category: "Aventure",
    impact: [
      "Crée des objectifs communs",
      "Renforce l'engagement mutuel",
      "Génère des expériences mémorables"
    ],
    steps: [
      "Listez 10 expériences que vous souhaitez vivre ensemble",
      "Planifiez la réalisation d'un objectif par mois",
      "Documentez vos réussites communes"
    ],
    traits: ["Fun & Aventure", "Loyauté"]
  },
  {
    title: "Club de Lecture à Deux",
    description: "Lisez et discutez un livre ensemble chaque mois",
    difficulty: "medium",
    duration: "long",
    category: "Culture",
    impact: [
      "Enrichit vos conversations",
      "Partage de perspectives différentes",
      "Développe votre culture commune"
    ],
    steps: [
      "Choisissez un livre qui vous intéresse tous les deux",
      "Fixez des points de discussion réguliers",
      "Partagez vos passages préférés"
    ],
    traits: ["Complicité", "Confidentialité"]
  },
  {
    title: "Atelier Cuisine du Monde",
    description: "Explorez une nouvelle cuisine ensemble chaque semaine",
    difficulty: "medium",
    duration: "short",
    category: "Gastronomie",
    impact: [
      "Développe la collaboration",
      "Crée des moments de partage",
      "Découverte culturelle commune"
    ],
    steps: [
      "Choisissez un pays différent chaque semaine",
      "Faites les courses ensemble",
      "Cuisinez et dégustez en partageant vos impressions"
    ],
    traits: ["Fun & Aventure", "Complicité"]
  },
  {
    title: "Journal Vidéo Mensuel",
    description: "Créez un mini-documentaire mensuel sur votre amitié",
    difficulty: "hard",
    duration: "long",
    category: "Créativité",
    impact: [
      "Capture les moments importants",
      "Renforce les souvenirs communs",
      "Développe votre créativité"
    ],
    steps: [
      "Filmez des moments de votre quotidien ensemble",
      "Montez une vidéo mensuelle de 3-5 minutes",
      "Regardez et commentez vos anciennes vidéos"
    ],
    traits: ["Fun & Aventure", "Complicité"]
  },
  {
    title: "Séances de Méditation Partagée",
    description: "Pratiquez la pleine conscience ensemble",
    difficulty: "medium",
    duration: "short",
    category: "Bien-être",
    impact: [
      "Renforce la connexion émotionnelle",
      "Développe l'écoute mutuelle",
      "Améliore la compréhension"
    ],
    steps: [
      "Choisissez un moment calme dans la journée",
      "Méditez ensemble pendant 10-15 minutes",
      "Partagez vos ressentis après la séance"
    ],
    traits: ["Soutien Émotionnel", "Confidentialité"]
  },
  {
    title: "Projet Communautaire",
    description: "Engagez-vous ensemble dans une cause qui vous tient à cœur",
    difficulty: "hard",
    duration: "long",
    category: "Social",
    impact: [
      "Renforce les valeurs communes",
      "Crée un impact positif ensemble",
      "Développe la fierté mutuelle"
    ],
    steps: [
      "Identifiez une cause qui vous passionne tous les deux",
      "Engagez-vous régulièrement dans des actions bénévoles",
      "Célébrez vos réussites et impacts"
    ],
    traits: ["Loyauté", "Soutien Émotionnel"]
  },
  {
    title: "Challenge Sportif Commun",
    description: "Fixez-vous un objectif sportif à atteindre ensemble",
    difficulty: "hard",
    duration: "medium",
    category: "Sport",
    impact: [
      "Renforce la motivation mutuelle",
      "Développe la persévérance",
      "Crée des moments de dépassement"
    ],
    steps: [
      "Choisissez un défi sportif réaliste",
      "Établissez un planning d'entraînement",
      "Soutenez-vous mutuellement"
    ],
    traits: ["Fun & Aventure", "Soutien Émotionnel"]
  },
  {
    title: "Cercle de Partage Mensuel",
    description: "Créez un espace de dialogue profond et régulier",
    difficulty: "medium",
    duration: "medium",
    category: "Communication",
    impact: [
      "Approfondit la compréhension",
      "Renforce la confiance",
      "Développe l'empathie"
    ],
    steps: [
      "Fixez une date mensuelle récurrente",
      "Préparez des sujets de discussion profonds",
      "Écoutez sans jugement"
    ],
    traits: ["Confidentialité", "Soutien Émotionnel", "Complicité"]
  }
];

export const getRelevantActivities = (weaknesses: string[], strengths: string[]): ImprovementActivity[] => {
  // Créer un système de score pour chaque activité
  const scoredActivities = improvementActivities.map(activity => {
    let score = 0;
    
    // Score basé sur les faiblesses (prioritaire)
    const weaknessMatches = activity.traits.filter(trait => weaknesses.includes(trait));
    score += weaknessMatches.length * 3; // Plus de poids pour les faiblesses

    // Score basé sur les forces (pour construire dessus)
    const strengthMatches = activity.traits.filter(trait => strengths.includes(trait));
    score += strengthMatches.length;

    // Bonus pour les activités qui combinent forces et faiblesses
    if (weaknessMatches.length > 0 && strengthMatches.length > 0) {
      score += 2;
    }

    // Ajout d'un élément aléatoire pour varier les suggestions
    score += Math.random() * 0.5;

    return { activity, score };
  });

  // Trier par score et prendre les 3 meilleures activités
  return scoredActivities
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.activity);
};
