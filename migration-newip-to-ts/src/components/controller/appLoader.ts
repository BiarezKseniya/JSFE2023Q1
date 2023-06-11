import Loader from './loader';

class AppLoader extends Loader {
  constructor() {
    super('https://newsapi.org/v2/', {
      apiKey: '3e9ae2059d914db4993d4e693cec9231', // получите свой ключ https://newsapi.org/ 3e9ae2059d914db4993d4e693cec9231
    });
  }
}

export default AppLoader;
