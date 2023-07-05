import './global.css';
import './styles/svg.css';
import './styles/custom-elements.css';
import './styles/code-highlight.css';
import './styles/code-mirror.css';
import { Controller } from './controller/controller';

const controller = new Controller();
controller.start();
