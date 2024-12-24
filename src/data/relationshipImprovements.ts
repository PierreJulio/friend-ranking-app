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
    title: "Soirée Cinéma",
    description: "Aller voir un film au cinéma ensemble",
    difficulty: "easy",
    duration: "short",
    category: "Loisirs",
    impact: [
      "Partage d'un moment de détente",
      "Sujet de discussion commun",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un film qui plaît aux deux",
      "Réserver les places",
      "Prévoir un moment pour en discuter après"
    ],
    traits: ["Fun & Aventure", "Complicité"]
  },
  {
    title: "Pizza entre amis",
    description: "Partager une pizza dans un restaurant ou à la maison",
    difficulty: "easy",
    duration: "short",
    category: "Gastronomie",
    impact: [
      "Moment de convivialité",
      "Discussion détendue",
      "Plaisir partagé"
    ],
    steps: [
      "Choisir un restaurant ou commander",
      "Se retrouver pour manger",
      "Prendre le temps de discuter"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Balade en ville",
    description: "Se promener ensemble en ville ou dans un parc",
    difficulty: "easy",
    duration: "short",
    category: "Extérieur",
    impact: [
      "Exercice léger",
      "Conversations naturelles",
      "Découverte commune"
    ],
    steps: [
      "Choisir un lieu de balade",
      "Se retrouver à un point de rendez-vous",
      "Marcher et discuter"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Café et discussion",
    description: "Prendre un café ensemble dans un lieu agréable",
    difficulty: "easy",
    duration: "short",
    category: "Social",
    impact: [
      "Moment de pause partagé",
      "Échange détendu",
      "Renforcement du lien"
    ],
    steps: [
      "Choisir un café sympa",
      "Se retrouver pour une boisson",
      "Discuter sans pression"
    ],
    traits: ["Confidentialité", "Soutien Émotionnel"]
  },
  {
    title: "Jeux de société",
    description: "Jouer à un jeu de société ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Divertissement",
    impact: [
      "Amusement partagé",
      "Esprit de compétition sain",
      "Rires garantis"
    ],
    steps: [
      "Choisir un jeu qui plaît aux deux",
      "Prévoir des snacks",
      "Jouer dans la bonne humeur"
    ],
    traits: ["Fun & Aventure", "Complicité"]
  },
  {
    title: "Soirée Jeux Vidéo",
    description: "Jouer à des jeux vidéo ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Divertissement",
    impact: [
      "Amusement partagé",
      "Esprit de compétition",
      "Moments de détente"
    ],
    steps: [
      "Choisir un jeu vidéo",
      "Prévoir des snacks",
      "Jouer ensemble"
    ],
    traits: ["Fun & Aventure", "Complicité"]
  },
  {
    title: "Pique-nique",
    description: "Organiser un pique-nique dans un parc",
    difficulty: "easy",
    duration: "medium",
    category: "Extérieur",
    impact: [
      "Moment de détente",
      "Conversations naturelles",
      "Contact avec la nature"
    ],
    steps: [
      "Choisir un parc",
      "Préparer des snacks",
      "Profiter du moment"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Visite de Musée",
    description: "Visiter un musée ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Culture",
    impact: [
      "Enrichissement culturel",
      "Sujet de discussion",
      "Découverte commune"
    ],
    steps: [
      "Choisir un musée",
      "Prévoir une date",
      "Discuter des expositions"
    ],
    traits: ["Complicité", "Culture"]
  },
  {
    title: "Cours de Cuisine",
    description: "Prendre un cours de cuisine ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Gastronomie",
    impact: [
      "Apprentissage partagé",
      "Moment de convivialité",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un cours de cuisine",
      "S'inscrire ensemble",
      "Cuisiner et déguster"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Randonnée",
    description: "Faire une randonnée ensemble",
    difficulty: "medium",
    duration: "long",
    category: "Sport",
    impact: [
      "Exercice physique",
      "Conversations naturelles",
      "Contact avec la nature"
    ],
    steps: [
      "Choisir un sentier",
      "Préparer des provisions",
      "Marcher et discuter"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Atelier de Peinture",
    description: "Participer à un atelier de peinture ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Créativité",
    impact: [
      "Expression artistique",
      "Moment de détente",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un atelier",
      "S'inscrire ensemble",
      "Peindre et partager"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Soirée Karaoke",
    description: "Aller à une soirée karaoke ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Divertissement",
    impact: [
      "Amusement partagé",
      "Expression artistique",
      "Moments de détente"
    ],
    steps: [
      "Choisir un lieu de karaoke",
      "Prévoir une date",
      "Chanter et s'amuser"
    ],
    traits: ["Fun & Aventure", "Complicité"]
  },
  {
    title: "Cours de Danse",
    description: "Prendre un cours de danse ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Sport",
    impact: [
      "Exercice physique",
      "Apprentissage partagé",
      "Moments de détente"
    ],
    steps: [
      "Choisir un cours de danse",
      "S'inscrire ensemble",
      "Danser et s'amuser"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Escape Room",
    description: "Participer à une escape room ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Divertissement",
    impact: [
      "Esprit d'équipe",
      "Résolution de problèmes",
      "Moments de détente"
    ],
    steps: [
      "Choisir une escape room",
      "Réserver une session",
      "Résoudre les énigmes ensemble"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Atelier de Poterie",
    description: "Participer à un atelier de poterie ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Créativité",
    impact: [
      "Expression artistique",
      "Moment de détente",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un atelier",
      "S'inscrire ensemble",
      "Créer et partager"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Soirée Bowling",
    description: "Aller au bowling ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Divertissement",
    impact: [
      "Amusement partagé",
      "Esprit de compétition",
      "Moments de détente"
    ],
    steps: [
      "Choisir un bowling",
      "Réserver une piste",
      "Jouer et s'amuser"
    ],
    traits: ["Fun & Aventure", "Complicité"]
  },
  {
    title: "Cours de Yoga",
    description: "Prendre un cours de yoga ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Bien-être",
    impact: [
      "Exercice physique",
      "Moment de détente",
      "Renforcement du lien"
    ],
    steps: [
      "Choisir un cours de yoga",
      "S'inscrire ensemble",
      "Pratiquer et se détendre"
    ],
    traits: ["Complicité", "Soutien Émotionnel"]
  },
  {
    title: "Soirée Théâtre",
    description: "Aller voir une pièce de théâtre ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Culture",
    impact: [
      "Enrichissement culturel",
      "Sujet de discussion",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir une pièce de théâtre",
      "Réserver des places",
      "Discuter de la pièce après"
    ],
    traits: ["Complicité", "Culture"]
  },
  {
    title: "Cours de Photographie",
    description: "Prendre un cours de photographie ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Créativité",
    impact: [
      "Apprentissage partagé",
      "Expression artistique",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un cours de photographie",
      "S'inscrire ensemble",
      "Prendre des photos et partager"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Soirée Astronomie",
    description: "Observer les étoiles ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Extérieur",
    impact: [
      "Moment de détente",
      "Conversations naturelles",
      "Découverte commune"
    ],
    steps: [
      "Choisir un lieu d'observation",
      "Préparer des provisions",
      "Observer et discuter"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Atelier de Bricolage",
    description: "Participer à un atelier de bricolage ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Créativité",
    impact: [
      "Expression artistique",
      "Moment de détente",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un atelier",
      "S'inscrire ensemble",
      "Créer et partager"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Soirée Quiz",
    description: "Participer à une soirée quiz ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Divertissement",
    impact: [
      "Amusement partagé",
      "Esprit de compétition",
      "Moments de détente"
    ],
    steps: [
      "Choisir un lieu de quiz",
      "Prévoir une date",
      "Participer et s'amuser"
    ],
    traits: ["Fun & Aventure", "Complicité"]
  },
  {
    title: "Cours de Musique",
    description: "Prendre un cours de musique ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Créativité",
    impact: [
      "Apprentissage partagé",
      "Expression artistique",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un cours de musique",
      "S'inscrire ensemble",
      "Jouer et partager"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Soirée Dégustation",
    description: "Participer à une soirée dégustation ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Gastronomie",
    impact: [
      "Moment de convivialité",
      "Découverte de nouvelles saveurs",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir une soirée dégustation",
      "Réserver des places",
      "Déguster et discuter"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Atelier de Jardinage",
    description: "Participer à un atelier de jardinage ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Extérieur",
    impact: [
      "Apprentissage partagé",
      "Moment de détente",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un atelier",
      "S'inscrire ensemble",
      "Jardiner et partager"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Soirée Poker",
    description: "Organiser une soirée poker ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Divertissement",
    impact: [
      "Amusement partagé",
      "Esprit de compétition",
      "Moments de détente"
    ],
    steps: [
      "Choisir un lieu",
      "Préparer des snacks",
      "Jouer et s'amuser"
    ],
    traits: ["Fun & Aventure", "Complicité"]
  },
  {
    title: "Cours de Dessin",
    description: "Prendre un cours de dessin ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Créativité",
    impact: [
      "Apprentissage partagé",
      "Expression artistique",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un cours de dessin",
      "S'inscrire ensemble",
      "Dessiner et partager"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Soirée Théâtre d'Improvisation",
    description: "Aller voir un spectacle d'improvisation ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Divertissement",
    impact: [
      "Amusement partagé",
      "Sujet de discussion",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un spectacle",
      "Réserver des places",
      "Discuter du spectacle après"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Cours de Pâtisserie",
    description: "Prendre un cours de pâtisserie ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Gastronomie",
    impact: [
      "Apprentissage partagé",
      "Moment de convivialité",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un cours de pâtisserie",
      "S'inscrire ensemble",
      "Cuisiner et déguster"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Soirée Jeux de Cartes",
    description: "Organiser une soirée jeux de cartes ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Divertissement",
    impact: [
      "Amusement partagé",
      "Esprit de compétition",
      "Moments de détente"
    ],
    steps: [
      "Choisir un jeu de cartes",
      "Préparer des snacks",
      "Jouer et s'amuser"
    ],
    traits: ["Fun & Aventure", "Complicité"]
  },
  {
    title: "Cours de Langue",
    description: "Prendre un cours de langue ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Culture",
    impact: [
      "Apprentissage partagé",
      "Enrichissement culturel",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un cours de langue",
      "S'inscrire ensemble",
      "Apprendre et pratiquer"
    ],
    traits: ["Complicité", "Culture"]
  },
  {
    title: "Soirée Cinéma à la Maison",
    description: "Regarder un film à la maison ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Divertissement",
    impact: [
      "Moment de détente",
      "Sujet de discussion",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un film",
      "Préparer des snacks",
      "Regarder et discuter"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Atelier de Couture",
    description: "Participer à un atelier de couture ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Créativité",
    impact: [
      "Apprentissage partagé",
      "Expression artistique",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un atelier",
      "S'inscrire ensemble",
      "Coudre et partager"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Soirée Dégustation de Fromages",
    description: "Participer à une soirée dégustation de fromages ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Gastronomie",
    impact: [
      "Moment de convivialité",
      "Découverte de nouvelles saveurs",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir une soirée dégustation",
      "Réserver des places",
      "Déguster et discuter"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Cours de Sculpture",
    description: "Prendre un cours de sculpture ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Créativité",
    impact: [
      "Apprentissage partagé",
      "Expression artistique",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un cours de sculpture",
      "S'inscrire ensemble",
      "Sculpter et partager"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Soirée Dégustation de Vins",
    description: "Participer à une soirée dégustation de vins ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Gastronomie",
    impact: [
      "Moment de convivialité",
      "Découverte de nouvelles saveurs",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir une soirée dégustation",
      "Réserver des places",
      "Déguster et discuter"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Cours de Théâtre",
    description: "Prendre un cours de théâtre ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Créativité",
    impact: [
      "Apprentissage partagé",
      "Expression artistique",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un cours de théâtre",
      "S'inscrire ensemble",
      "Jouer et partager"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Soirée Dégustation de Chocolats",
    description: "Participer à une soirée dégustation de chocolats ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Gastronomie",
    impact: [
      "Moment de convivialité",
      "Découverte de nouvelles saveurs",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir une soirée dégustation",
      "Réserver des places",
      "Déguster et discuter"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Cours de Calligraphie",
    description: "Prendre un cours de calligraphie ensemble",
    difficulty: "medium",
    duration: "medium",
    category: "Créativité",
    impact: [
      "Apprentissage partagé",
      "Expression artistique",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir un cours de calligraphie",
      "S'inscrire ensemble",
      "Écrire et partager"
    ],
    traits: ["Complicité", "Fun & Aventure"]
  },
  {
    title: "Soirée Dégustation de Bières",
    description: "Participer à une soirée dégustation de bières ensemble",
    difficulty: "easy",
    duration: "medium",
    category: "Gastronomie",
    impact: [
      "Moment de convivialité",
      "Découverte de nouvelles saveurs",
      "Création de souvenirs"
    ],
    steps: [
      "Choisir une soirée dégustation",
      "Réserver des places",
      "Déguster et discuter"
    ],
    traits: ["Complicité", "Fun & Aventure"]
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
