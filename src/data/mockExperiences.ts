
export interface Experience {
  id: string;
  enabled: boolean;
  images: string[];
  translations: {
    en: {
      title: string;
      description: string;
      content: string;
    };
    it: {
      title: string;
      description: string;
      content: string;
    };
  };
  price: number;
  duration: string;
  location: string;
  rating: number;
  maxPeople: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export const mockExperiences: Experience[] = [
  {
    id: '1',
    enabled: true,
    images: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1534445867742-43195f401b6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'
    ],
    translations: {
      en: {
        title: 'aaaVenice Gondola Ride with Serenade',
        description: 'Experience the romance of Venice with a traditional gondola ride accompanied by live music.',
        content: '<h2>Venice\'s Most Romantic Experience</h2><p>Glide through the canals of Venice on a 30-minute gondola ride while being serenaded with Italian love songs.</p><ul><li>30-minute gondola ride</li><li>Professional gondolier in traditional costume</li><li>Live music serenade</li><li>Pass under the famous Bridge of Sighs</li></ul><p>This <strong>unforgettable experience</strong> takes you through Venice\'s picturesque waterways, under bridges, beside famous mansions and buildings.</p>'
      },
      it: {
        title: 'Giro in Gondola a Venezia con Serenata',
        description: 'Vivi il romanticismo di Venezia con un giro tradizionale in gondola accompagnato da musica dal vivo.',
        content: '<h2>L\'Esperienza Più Romantica di Venezia</h2><p>Scorri attraverso i canali di Venezia in un giro in gondola di 30 minuti mentre vieni accompagnato da canzoni d\'amore italiane.</p><ul><li>Giro in gondola di 30 minuti</li><li>Gondoliere professionista in costume tradizionale</li><li>Serenata dal vivo</li><li>Passa sotto il famoso Ponte dei Sospiri</li></ul><p>Questa <strong>esperienza indimenticabile</strong> ti porta attraverso le pittoresche vie d\'acqua di Venezia, sotto i ponti, accanto a famose dimore ed edifici.</p>'
      }
    },
    price: 80,
    duration: '33 minutes',
    location: 'Venice, Italy',
    rating: 4.8,
    maxPeople: 6,
    reviews: []
  },
  {
    id: '2',
    enabled: true,
    images: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1986&q=80',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1983&q=80'
    ],
    translations: {
      en: {
        title: 'Tuscany Wine Tasting Tour',
        description: 'Sample the best wines of the Tuscany region while enjoying breathtaking countryside views.',
        content: '<h2>Tuscany\'s Finest Vineyards</h2><p>Visit three different wineries and taste more than 10 different types of wine including the famous Chianti Classico.</p><ul><li>Full-day wine tour</li><li>Visit to 3 prestigious wineries</li><li>Professional sommelier guide</li><li>Lunch included</li><li>Round-trip transportation from Florence</li></ul><p>Learn about the <strong>wine-making process</strong> from grape to bottle and discover the secrets of Italian viticulture.</p>'
      },
      it: {
        title: 'Tour di Degustazione Vini in Toscana',
        description: 'Assaggia i migliori vini della regione Toscana godendo di panorami mozzafiato della campagna.',
        content: '<h2>Le Migliori Vigne della Toscana</h2><p>Visita tre diverse cantine e assaggia più di 10 diversi tipi di vino incluso il famoso Chianti Classico.</p><ul><li>Tour del vino di un\'intera giornata</li><li>Visita a 3 prestigiose cantine</li><li>Guida sommelier professionale</li><li>Pranzo incluso</li><li>Trasporto andata e ritorno da Firenze</li></ul><p>Impara il <strong>processo di vinificazione</strong> dall\'uva alla bottiglia e scopri i segreti della viticoltura italiana.</p>'
      }
    },
    price: 150,
    duration: '8 hours',
    location: 'Florence, Italy',
    rating: 4.9,
    maxPeople: 12,
    reviews: []
  },
  {
    id: '3',
    enabled: true,
    images: [
      'https://images.unsplash.com/photo-1587019158091-1416f849dda1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ],
    translations: {
      en: {
        title: 'Colosseum and Roman Forum Skip-the-Line Tour',
        description: 'Explore ancient Rome\'s most iconic landmarks with an expert guide and priority access.',
        content: '<h2>Journey Through Ancient Rome</h2><p>Walk in the footsteps of gladiators and emperors on this comprehensive tour of Rome\'s ancient landmarks.</p><ul><li>3-hour guided tour</li><li>Skip-the-line access to the Colosseum</li><li>Expert historian guide</li><li>Visit to the Roman Forum and Palatine Hill</li><li>Small group of max 15 people</li></ul><p>Discover the <strong>incredible history</strong> and engineering of the Colosseum and hear fascinating stories about the gladiatorial games.</p>'
      },
      it: {
        title: 'Tour Salta-Fila del Colosseo e Foro Romano',
        description: 'Esplora i monumenti più iconici dell\'antica Roma con una guida esperta e accesso prioritario.',
        content: '<h2>Viaggio Attraverso l\'Antica Roma</h2><p>Cammina sulle orme dei gladiatori e degli imperatori in questo tour completo dei monumenti antichi di Roma.</p><ul><li>Tour guidato di 3 ore</li><li>Accesso salta-fila al Colosseo</li><li>Guida storica esperta</li><li>Visita al Foro Romano e al Palatino</li><li>Piccolo gruppo di massimo 15 persone</li></ul><p>Scopri l\'<strong>incredibile storia</strong> e l\'ingegneria del Colosseo e ascolta affascinanti storie sui giochi gladiatori.</p>'
      }
    },
    price: 65,
    duration: '3 hours',
    location: 'Rome, Italy',
    rating: 4.7,
    maxPeople: 15,
    reviews: []
  },
];
