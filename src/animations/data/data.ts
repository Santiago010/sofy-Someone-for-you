import {CardSwipe} from '../../interfaces/interfacesApp';

export const data: CardSwipe[] = [
  {
    id: 1,
    biography:
      'Desarrolladora de software apasionada por la inteligencia artificial y el machine learning. Me encanta viajar y conocer nuevas culturas.',
    interest: ['Gaming', 'Music', 'Travel', 'Reading', 'Movies'],
    age: 28,
    color: '#FF6B6B',
    images: [
      require('../assets/l1.jpg'),
      require('../assets/l2.jpeg'),
      require('../assets/l3.jpeg'),
      require('../assets/l4.jpeg'),
      require('../assets/l5.jpeg'),
      require('../assets/l6.jpeg'),
    ],
    firstName: 'Sofia',
    lastName: 'Rodríguez',
  },
  {
    id: 2,
    biography:
      'Fotógrafo profesional especializado en retratos y paisajes urbanos. Busco capturar la esencia de cada momento.',
    interest: ['Photography', 'Travel', 'Art', 'Movies', 'Music'],
    age: 32,
    color: '#4ECDC4',
    images: [
      require('../assets/s.jpeg'),
      require('../assets/s2.jpeg'),
      require('../assets/s3.jpeg'),
      require('../assets/s4.jpeg'),
      require('../assets/s5.jpeg'),
      require('../assets/s6.jpeg'),
    ],
    firstName: 'Carlos',
    lastName: 'Martínez',
  },
  {
    id: 3,
    biography:
      'Chef especializada en cocina mediterránea. Creo experiencias culinarias únicas combinando tradición e innovación.',
    interest: ['Cooking', 'Travel', 'Music', 'Art', 'Reading'],
    age: 29,
    color: '#45B7D1',
    images: [
      require('../assets/d.jpeg'),
      require('../assets/d2.jpeg'),
      require('../assets/d3.jpeg'),
      require('../assets/d4.jpeg'),
      require('../assets/d5.jpeg'),
      require('../assets/d6.jpeg'),
    ],
    firstName: 'Jerry',
    lastName: 'García',
  },
  {
    id: 4,
    biography:
      'Diseñadora gráfica con pasión por el arte digital y la ilustración. Me encanta crear mundos visuales imaginativos.',
    interest: ['Art', 'Photography', 'Movies', 'Music', 'Gaming'],
    age: 26,
    color: '#96CEB4',
    images: [
      require('../assets/e.jpeg'),
      require('../assets/e2.jpeg'),
      require('../assets/e3.jpeg'),
      require('../assets/e4.jpeg'),
      require('../assets/e5.jpeg'),
      require('../assets/e6.jpeg'),
    ],
    firstName: 'Elliot',
    lastName: 'Ortiz',
  },
];
