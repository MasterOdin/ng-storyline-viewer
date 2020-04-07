export interface Entity {
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
  persons: Entity[];
  companies: Entity[];
  organizations: Entity[];
  locations: Entity[];
  drivers: string[];
  scores: number[];
  clusterRelevance: number;
}

export interface Storylines {
  articles: Article[];
  shortClusters: string[][];
}

export interface Storyline {
  articles: Article[];
  shortCluster: string[];
}

export interface StorylineTableElement {
  position: number;
  articles: Article[],
  concepts: string[],
  drivers: string[]
}

export interface View {
  people: Set<string>;
  companies: Set<string>;
  organizations: Set<string>;
}
