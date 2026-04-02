export interface Subsection {
  id: string;
  title: string;
  content: string;
  connections: string[]; // IDs of other subsections this is connected to
}

export interface Page {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  subsections: Subsection[];
  connections: string[]; // IDs of other pages this is connected to
  category?: string; // New field for custom categories
}

export interface Universe {
  id: string;
  name: string;
  description: string;
  icon?: string; // New field for uploaded icon
  pages: Page[];
  settings?: UniverseSettings;
  categories?: string[];
}

export interface UniverseSettings {
  theme?: string;
  font?: string;
  color?: string;
  worldbuildingDetails?: string;
}

