export interface Options {
  readonly [key: string]: string;
}

export interface Source {
  readonly id: string;
  readonly name: string;
  readonly language?: string;
  readonly category?: string;
  readonly country?: string;
  readonly description?: string;
  readonly url?: string;
}

export interface Article {
  readonly author: string;
  readonly content: string;
  readonly description: string;
  readonly publishedAt: string;
  readonly source: Source;
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly url: string;
  readonly urlToImage: string;
}

export interface ResponseData {
  readonly status: string;
  readonly sources?: Source[];
  readonly articles?: Article[];
  readonly totalResults: number;
}

export type Callback = (data: ResponseData) => void;

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

class Loader {
  private readonly baseLink: string;
  private readonly options: Options;

  constructor(baseLink: string, options: Options) {
    this.baseLink = baseLink;
    this.options = options;
  }

  public getResp(
    { endpoint, options = {} }: { endpoint: string; options?: Options },
    callback: Callback = (): void => {
      console.error('No callback for GET response');
    },
  ): void {
    this.load(HttpMethod.GET, endpoint, callback, options);
  }

  public errorHandler(res: Response): Response {
    if (!res.ok) {
      if (res.status === 401 || res.status === 404)
        console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
      throw Error(res.statusText);
    }

    return res;
  }

  public makeUrl(options: Options, endpoint: string): string {
    const urlOptions = { ...this.options, ...options };
    let url = `${this.baseLink}${endpoint}?`;

    Object.keys(urlOptions).forEach((key) => {
      url += `${key}=${urlOptions[key]}&`;
    });

    return url.slice(0, -1);
  }

  private load(method: HttpMethod, endpoint: string, callback: Callback, options: Options = {}): void {
    fetch(this.makeUrl(options, endpoint), { method })
      .then(this.errorHandler)
      .then((res) => res.json())
      .then((data) => callback(data))
      .catch((err) => console.error(err));
  }
}

export default Loader;
