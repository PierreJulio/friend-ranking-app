interface Recommendation {
  recommendation: string;
  examples: string[];
}

interface Recommendations {
  [key: string]: Recommendation[] | { [key: string]: Recommendation[] };
}

const recommendations: Recommendations = {
  'Soutien Émotionnel': [
    {
      recommendation: "Essayez de partager plus de moments émotionnels ensemble.",
      examples: [
        "Organisez une soirée où vous partagez vos souvenirs d'enfance.",
        "Prenez le temps de discuter de vos émotions après une journée difficile."
      ]
    },
    {
      recommendation: "Prenez le temps d'écouter activement et de montrer de l'empathie.",
      examples: [
        "Lorsque votre ami parle, écoutez sans interrompre et posez des questions pour montrer votre intérêt.",
        "Exprimez votre compréhension en reformulant ce que votre ami a dit."
      ]
    },
    {
      recommendation: "Planifiez des activités qui favorisent l'ouverture émotionnelle.",
      examples: [
        "Participez à des ateliers de développement personnel ensemble.",
        "Faites des promenades où vous pouvez parler librement de vos sentiments."
      ]
    }
  ],
  'Fun & Aventure': [
    {
      recommendation: "Planifiez plus d'activités nouvelles et excitantes.",
      examples: [
        "Essayez un nouveau sport ou une activité de plein air.",
        "Organisez un week-end surprise dans une ville que vous n'avez jamais visitée."
      ]
    },
    {
      recommendation: "Essayez de nouvelles expériences ensemble.",
      examples: [
        "Inscrivez-vous à un cours de cuisine ou d'art.",
        "Participez à des événements locaux ou des festivals."
      ]
    },
    {
      recommendation: "Organisez des sorties spontanées pour ajouter du fun.",
      examples: [
        "Faites une sortie improvisée pour un pique-nique ou une randonnée.",
        "Surprenez votre ami avec des billets pour un concert ou un spectacle."
      ]
    }
  ],
  'Confidentialité': [
    {
      recommendation: "Assurez-vous de respecter la confidentialité des discussions.",
      examples: [
        "Ne partagez pas les informations personnelles de votre ami sans son consentement.",
        "Créez un environnement sûr où votre ami se sent à l'aise de parler."
      ]
    },
    {
      recommendation: "Montrez que vous êtes digne de confiance en gardant les secrets.",
      examples: [
        "Ne divulguez jamais les secrets de votre ami, même sous pression.",
        "Rassurez votre ami que ses confidences sont en sécurité avec vous."
      ]
    },
    {
      recommendation: "Évitez de parler des affaires privées de votre ami à d'autres.",
      examples: [
        "Changez de sujet si quelqu'un essaie de vous faire parler des affaires privées de votre ami.",
        "Soyez discret et respectueux des limites de votre ami."
      ]
    }
  ],
  'Complicité': [
    {
      recommendation: "Passez plus de temps à discuter de vos intérêts communs.",
      examples: [
        "Organisez des soirées jeux ou des marathons de films.",
        "Partagez des livres ou des articles sur des sujets qui vous passionnent."
      ]
    },
    {
      recommendation: "Faites des activités qui renforcent votre connexion.",
      examples: [
        "Participez à des projets créatifs ensemble.",
        "Faites du bénévolat pour une cause qui vous tient à cœur."
      ]
    },
    {
      recommendation: "Soyez attentif aux besoins et aux envies de votre ami.",
      examples: [
        "Surprenez votre ami avec des petites attentions qui montrent que vous pensez à lui.",
        "Prenez le temps de demander à votre ami comment il se sent et ce dont il a besoin."
      ]
    }
  ],
  'Loyauté': [
    {
      recommendation: "Montrez votre soutien même dans les moments difficiles.",
      examples: [
        "Soyez présent pour votre ami lors de ses moments de besoin.",
        "Offrez votre aide sans attendre quelque chose en retour."
      ]
    },
    {
      recommendation: "Soyez constant dans votre comportement et vos engagements.",
      examples: [
        "Tenez vos promesses et soyez fiable.",
        "Montrez que votre amitié est une priorité en étant là régulièrement."
      ]
    },
    {
      recommendation: "Défendez votre ami en son absence.",
      examples: [
        "Ne laissez pas les autres parler négativement de votre ami.",
        "Montrez que vous êtes un allié fidèle en défendant votre ami."
      ]
    }
  ],
  'Activities': {
    'Sports': [
      {
        recommendation: "Pratiquez une activité sportive ensemble",
        examples: [
          "Cours de yoga en duo",
          "Partie de tennis hebdomadaire",
          "Randonnée en montagne"
        ]
      }
    ],
    'Culture': [
      {
        recommendation: "Partagez des expériences culturelles",
        examples: [
          "Visite de musée avec audio-guide",
          "Concert de votre genre musical préféré",
          "Cours de peinture en duo"
        ]
      }
    ],
    // ... ajoutez d'autres catégories selon vos besoins
  }
};

export default recommendations;
