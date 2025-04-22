/**
 * RegisterExercicioComponent.js - Componente para cadastro de exercício
 */
import { toast } from '/js/Utilities.js';

class RegisterExercicioComponent {
  constructor(config) {
    this.onSubmit = config.onSubmit || (() => {});
    this.onBack = config.onBack || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'p-4';

    const form = document.createElement('div');
    form.className = 'space-y-4';

    form.innerHTML = `
      <div>
        <label for="exercicio" class="block text-sm font-medium text-gray-700">Exercício:</label>
        <input type="number" id="exercicio" name="exercicio"
               class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
      </div>
    `;

    const actions = document.createElement('div');
    actions.className = 'flex justify-end space-x-4 mt-6';
    actions.innerHTML = `
      <button id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
        Voltar
      </button>
      <button id="submit-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
        Cadastrar
      </button>
    `;

    form.appendChild(actions);
    container.appendChild(form);
    return container;
  }

  setupEventListeners() {
    const backBtn = this.element.querySelector('#back-btn');
    const submitBtn = this.element.querySelector('#submit-btn');

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        toast.info('Retornando à lista de exercícios...');
        this.onBack();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.submitForm();
      });
    }
  }

  submitForm() {
    const exercicioInput = this.element.querySelector('#exercicio');
    const exercicio = exercicioInput.value.trim();

    if (!exercicio) {
      toast.error('O campo Exercício é obrigatório!');
      return;
    }

    const data = {
      exercicio: parseInt(exercicio)
    };

    this.onSubmit(data);
  }
}

export default RegisterExercicioComponent;