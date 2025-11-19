
export enum UserRole {
  Student = 'student',
  Educator = 'educator',
}

export interface User {
  name: string;
  role: UserRole;
}

export type View = 'dashboard' | 'feedback' | 'modules' | 'meditate' | 'journal';

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

export interface ChakraDefinition {
  name: ChakraName;
  color: string;
  videoUrl: string; // Path to the WEBM/MP4 video file
  description: string;
}

// The shape of the data returned by the API
export interface ChakraAnalysis {
  name: ChakraName;
  status: ChakraStatus;
  recommendations: string[];
}

// The combined shape used by the UI
export interface ChakraUI extends ChakraDefinition, ChakraAnalysis {
  icon: any; // Add icon property, using 'any' to avoid React dependency here
}

export interface MoodLog {
  mood: number;
  journal: string;
}