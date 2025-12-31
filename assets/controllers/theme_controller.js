// assets/controllers/theme_controller.js
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['sun', 'moon'];

  connect() {
    this.html = document.documentElement;
    this.updateIcons();
  }

  toggle() {
    this.html.classList.toggle('dark');

    // Sauvegarde du choix
    localStorage.setItem('theme', this.html.classList.contains('dark') ? 'dark' : 'light');

    this.updateIcons();
  }

  updateIcons() {
    if (!this.hasSunTarget || !this.hasMoonTarget) return;

    if (this.html.classList.contains('dark')) {
      this.sunTarget.classList.remove('hidden'); // montrer le soleil
      this.moonTarget.classList.add('hidden');   // cacher la lune
    } else {
      this.sunTarget.classList.add('hidden');    // cacher le soleil
      this.moonTarget.classList.remove('hidden');// montrer la lune
    }
  }
}
