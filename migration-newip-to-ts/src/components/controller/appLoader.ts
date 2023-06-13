import Loader from './loader';

class AppLoader extends Loader {
  constructor() {
    super('https://rss-news-api.onrender.com/', {
      apiKey: '49df89171f2841a9995068b7b7023a08',
    });
  }
}

export default AppLoader;
