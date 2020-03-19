import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash';

const defaultMaxAge = 30000;

export class CachedResult {
  response: HttpResponse<any>;
  date: Date;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequestCacheService {

  cache = new Map<string, CachedResult>();

  private isAcceptable(res: CachedResult): boolean {
    const cacheControl = res.response.headers.getAll('Cache-Control');
    let maxAge = defaultMaxAge;
    for (const ccelem of cacheControl) {
      if (_.startsWith(ccelem.trim().toLowerCase(), 'max-age')) {
        maxAge = _.parseInt(_.trim(_.replace(ccelem.trim(), 'max-age=', '')));
        break;
      }
    }
    const expires = res.response.headers.get('Expires');
    const expired = expires ? (Date.parse(expires) > Date.now()) : (Date.now() - maxAge > res.date.getDate());

    return !expired && !_.includes(cacheControl, 'no-cache') && !_.includes(cacheControl, 'no-store');
  }

  private cleanExpired() {
    this.cache.forEach(entry => {
      if (!this.isAcceptable(entry)) {
        this.cache.delete(entry.url);
      }
    });
  }

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);
    if (!cached) {
      return undefined;
    }
    if (this.isAcceptable(cached)) {
      return cached.response;
    } else {
      return undefined;
    }
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>) {
    const cacheControl = res.headers.getAll('Cache-Control');
    if (!_.includes(cacheControl, 'no-cache') && !_.includes(cacheControl, 'no-store')) {
      const entry: CachedResult = {
        url: req.urlWithParams,
        date: new Date(),
        response: res
      };
      this.cache.set(entry.url, entry);
    }
    this.cleanExpired();
  }
}
