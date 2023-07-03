import './global.css';
import './components/styles/svg.css';
import './components/styles/custom-elements.css';
import './components/styles/code-highlight.css';
import './components/styles/code-mirror.css';
import { Controller } from './components/controller/controller';

const controller = new Controller();
controller.start();
