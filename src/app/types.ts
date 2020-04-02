export interface Concept {
  name: string;
  relevance: number;
  sentiment: number;
  count: number;
}

export interface Article {
  id: string;
  title: string;
  doc_abstract: string;
  score: number;
  date: string;
  url: string;
  country?: string;
  categories: {[key: string]: any};
  persons: Concept[];
  companies: Concept[];
  organizations: Concept[];
  locations: Concept[];
  drivers: string[];
  scores: number[];
  clusterRelevance: number;
}

export interface Storyline {
  articles: Article[];
}

export interface Filter {
  persons: Set<string>;
  companies: Set<string>;
  organizations: Set<string>;
  locations: Set<string>;
}

export interface StorylineTableElement {
  position: number;
  articles: Article[],
  concepts: string[],
  drivers: string[]
}

export interface View {
  persons: Set<string>;
  companies: Set<string>;
  organizations: Set<string>;
  locations: Set<string>;
}
