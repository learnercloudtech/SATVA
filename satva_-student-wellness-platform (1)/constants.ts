
import { ChakraName, ChakraStatus, Chakra } from './types';
import { RootChakraIcon, SacralChakraIcon, SolarPlexusChakraIcon, HeartChakraIcon, ThroatChakraIcon, ThirdEyeChakraIcon, CrownChakraIcon } from './components/icons/ChakraIcons';

export const CHAKRAS: Omit<Chakra, 'status' | 'recommendations'>[] = [
  { name: ChakraName.Root, color: '#EF4444', icon: RootChakraIcon },
  { name: ChakraName.Sacral, color: '#F97316', icon: SacralChakraIcon },
  { name: ChakraName.SolarPlexus, color: '#EAB308', icon: SolarPlexusChakraIcon },
  { name: ChakraName.Heart, color: '#22C55E', icon: HeartChakraIcon },
  { name: ChakraName.Throat, color: '#3B82F6', icon: ThroatChakraIcon },
  { name: ChakraName.ThirdEye, color: '#6366F1', icon: ThirdEyeChakraIcon },
  { name: ChakraName.Crown, color: '#8B5CF6', icon: CrownChakraIcon },
];

export const INITIAL_CHAKRA_STATE: Chakra[] = CHAKRAS.map(chakra => ({
    ...chakra,
    status: ChakraStatus.Balanced,
    recommendations: ["Maintain your current practices. You are in a great state of balance."]
}));
