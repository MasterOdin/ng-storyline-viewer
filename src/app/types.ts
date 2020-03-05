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
  country: string;
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