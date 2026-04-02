import { World } from '../types';
import { saveWorlds } from './storage';

export const initializeSeedData = () => {
  const existingWorlds = localStorage.getItem('architect_worlds');
  
  // Only seed if no data exists
  if (!existingWorlds) {
    const seedWorld: World = {
      id: '1',
      name: 'Aethelgard',
      description: 'High Fantasy Setting',
      pages: [
        {
          id: '1',
          title: 'The Kingdom of Eldoria',
          description: 'A bastion of magic and stone rising from the Shattered Coast, defined by its eternal twilight and the Great Spires.',
          subsections: [
            {
              id: '1',
              title: 'History of the First Dawn',
              content: 'Founded in the wake of the Great Convergence, Eldoria was originally a collection of scattered fishing villages. It was the discovery of Aetherite crystals in the deep caverns of the Iron Mountains that transformed it into the continental superpower it is today.\n\nUnder the reign of King Alaric the Wise, the first of the Great Spires was constructed, bridging the gap between earth and sky. This monument stands as a testament to what is possible when magic and mortal will combine.',
              connections: ['2']
            },
            {
              id: '2',
              title: 'Political Structure',
              content: 'The Council of Seven Spires oversees the daily operations of the kingdom. Each Councilor represents a specific school of magic and a major city district.',
              connections: ['1']
            }
          ],
          connections: ['2', '3']
        },
        {
          id: '2',
          title: 'The Outer Realm',
          description: 'A mysterious dimension that exists parallel to the material world, accessible only through ancient portals.',
          subsections: [
            {
              id: '3',
              title: 'Geography',
              content: 'The Outer Realm is characterized by floating landmasses and inverted gravity fields. Time flows differently here.',
              connections: []
            }
          ],
          connections: ['1', '4']
        },
        {
          id: '3',
          title: 'Valenwood',
          description: 'An ancient forest where magic flows like water through the roots of the eldest trees.',
          subsections: [
            {
              id: '4',
              title: 'The Elder Trees',
              content: 'Some trees in Valenwood are said to be thousands of years old, housing the spirits of ancient druids.',
              connections: []
            }
          ],
          connections: ['1']
        },
        {
          id: '4',
          title: 'Shadowspire',
          description: 'A dark tower that appears and disappears at will, home to the Shadow Council.',
          subsections: [],
          connections: ['2']
        }
      ]
    };

    saveWorlds([seedWorld]);
  }
};
