import { Options, Callback, HttpMethod, HttpStatusCode, ArticlesResponseData, SourcesResponseData } from './types';

class Loader {
  private readonly baseLink: string;
  private readonly options: Options;

  constructor(baseLink: string, options: Options) {
    this.baseLink = baseLink;
    this.options = options;
  }

  public getResp(
    { endpoint, options = {} }: { endpoint: string; options?: Options },
    callback: Callback<SourcesResponseData> | Callback<ArticlesResponseData> = (): void => {
      console.error('No callback for GET response');
    },
  ): void {
    this.load(HttpMethod.GET, endpoint, callback, options);
  }

  public errorHandler(res: Response): Response {
    if (!res.ok) {
      if (res.status === HttpStatusCode.Unauthorized || res.status === HttpStatusCode.NotFound)
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

  private load(
    method: HttpMethod,
    endpoint: string,
    callback: Callback<SourcesResponseData> | Callback<ArticlesResponseData>,
    options: Options = {},
  ): void {
    fetch(this.makeUrl(options, endpoint), { method })
      .then(this.errorHandler)
      .then((res) => res.json())
      .then((data) => callback(data))
      .catch((err) => console.error(err));
  }
}

export default Loader;
