import { startStimulusApp } from '@symfony/stimulus-bridge';
import hello_controller from './controllers/hello_controller.js';
import theme_controller from './controllers/theme_controller.js';

const app = startStimulusApp();
// register any custom, 3rd party controllers here
app.register('hello', hello_controller);
app.register('theme', theme_controller);
