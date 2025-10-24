// Fix: Import React to resolve 'Cannot find namespace React' error.
import React from 'react';

export enum UserRole {
  Student = 'student',
  Educator = 'educator',
}

export enum ChakraName {
  Root = 'Root',
  Sacral = 'Sacral',
  SolarPlexus = 'Solar Plexus',
  Heart = 'Heart',
  Throat = 'Throat',
  ThirdEye = 'Third Eye',
  Crown = 'Crown',
}

export enum ChakraStatus {
  Balanced = 'Balanced',
  Blocked = 'Blocked',
  Overactive = 'Overactive',
}

export interface Chakra {
  name: ChakraName;
  status: ChakraStatus;
  recommendations: string[];
  color: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface MoodLog {
  mood: number;
  journal: string;
}
