import * as _ from 'lodash';

export interface Entity {
  name: string;
  relevance: number;
  sentiment?: number;
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
  categories: Entity[];
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
  drivers: string[],
  update: Date
}

export interface View {
  people: string[];
  companies: string[];
  organizations: string[];
  categories: string[];
}

export function filterArticles(articles: Article[], view: View): Article[] {
  const retval = [];  
  let done;
  for(const a of articles) {
    done = false;
    for(const k of _.keys(view)) {
      const datak = getDataKeyFromViewKey(k);
      for(const v of view[k]) {
        if(_.some(a[datak], elem => elem.name === v)) {
          done = true;
          retval.push(a);
          break;
        }
      }
      if(done) { break; }
    }
  }
  return retval;
}

export function filterStorylineArticles(data: StorylineTableElement, view: View): Article[] {
  return filterArticles(data.articles, view);
}

export function filterArticleCount(data: StorylineTableElement, view: View): number {
  return filterArticles(data.articles, view).length;
}

export function getDataKeyFromViewKey(key: string): string {
  return (key === 'people') ? 'persons' : key;
}