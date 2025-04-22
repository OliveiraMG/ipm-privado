/**
 * UpdateRepercuteComponent.js - Componente para atualizar o campo Repercute de um CFOP
 */
import { toast } from '/js/Utilities.js';
import ModalComponent from '/components/common/ModalComponent.js';

class UpdateRepercuteComponent {
  constructor({ cfopData, onUpdate, onCancel }) {
    this.cfopData = cfopData || {};
    this.onUpdate = onUpdate || (() => {});
    this.onCancel = onCancel || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'w-full';

    const form = document.createElement('div');
    form.className = 'p-4';

    form.innerHTML = `
      <div class="mb-4">
        <label for="repercute" class="block text-sm font-medium text-gray-700">CFOP repercute no cálculo do Demonstrativo? (Relatório)</label>
        <select id="repercute" name="repercute"
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
          <option value="Sim" ${this.cfopData.repercute ? 'selected' : ''}>Sim</option>
          <option value="Não" ${!this.cfopData.repercute ? 'selected' : ''}>Não</option>
        </select>
      </div>
      <div class="flex justify-end space-x-4 mt-6">
        <button id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Voltar
        </button>
        <button id="search-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
          Pesquisar
        </button>
      </div>
    `;

    container.appendChild(form);
    return container;
  }

  setupEventListeners() {
    const cancelBtn = this.element.querySelector('#cancel-btn');
    const searchBtn = this.element.querySelector('#search-btn');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        toast.info('Ação cancelada.');
        this.onCancel();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.submitForm();
      });
    }
  }

  submitForm() {
    const repercute = this.element.querySelector('#repercute').value === 'Sim';
    const updatedData = {
      ...this.cfopData,
      repercute: repercute
    };
    toast.success('Repercute atualizado com sucesso!');
    this.onUpdate(updatedData);
  }
}

export default UpdateRepercuteComponent;