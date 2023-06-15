export interface Options {
  readonly [key: string]: string;
}

export interface Source {
  readonly id: string;
  readonly name: string;
  readonly language: string;
  readonly category: string;
  readonly country: string;
  readonly description: string;
  readonly url: string;
}

export interface Article {
  readonly author: string;
  readonly content: string;
  readonly description: string;
  readonly publishedAt: string;
  readonly source: Pick<Source, 'id' | 'name'>;
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly url: string;
  readonly urlToImage: string;
}

export interface ResponseData {
  readonly status: string;
  sources: Source[];
  readonly articles: Article[];
  readonly totalResults: number;
}

export type Callback = (data: Partial<ResponseData>) => void;

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum HttpStatusCode {
  Unauthorized = 401,
  NotFound = 404,
}
