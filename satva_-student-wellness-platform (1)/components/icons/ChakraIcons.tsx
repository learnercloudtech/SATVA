
import React from 'react';

// Fix: Explicitly type commonProps to match SVG attributes, resolving type inference issues.
const commonProps: React.SVGAttributes<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const RootChakraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...commonProps} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </svg>
);

export const SacralChakraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...commonProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

export const SolarPlexusChakraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...commonProps} {...props}>
    <path d="M12 2 L19 22 H5 Z" />
  </svg>
);

export const HeartChakraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...commonProps} {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const ThroatChakraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...commonProps} {...props}>
    <path d="M12 2 L22 12 L12 22 L2 12 Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const ThirdEyeChakraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...commonProps} {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const CrownChakraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...commonProps} {...props}>
    <path d="M12 2 C16 2 20 6 20 12 S16 22 12 22 4 18 4 12 8 2 12 2z" />
    <path d="M12 2 L12 6" />
    <path d="M12 18 L12 22" />
    <path d="M4.93 4.93 L7.05 7.05" />
    <path d="M16.95 16.95 L19.07 19.07" />
    <path d="M2 12 L6 12" />
    <path d="M18 12 L22 12" />
    <path d="M4.93 19.07 L7.05 16.95" />
    <path d="M16.95 7.05 L19.07 4.93" />
  </svg>
);
