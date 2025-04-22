/**
 * ConfirmDeleteCNAEComponent.js - Componente para confirmação de exclusão de CNAE
 */
import { toast } from '/js/Utilities.js';

class ConfirmDeleteCNAEComponent {
  constructor({ cnae, onConfirm, onCancel }) {
    this.cnae = cnae || {};
    this.onConfirm = onConfirm || (() => {});
    this.onCancel = onCancel || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'w-full text-center p-4';

    container.innerHTML = `
      <p class="text-lg font-medium text-gray-700 mb-4">Deseja remover esse CNAE?</p>
      <p class="text-base text-gray-600 mb-6">${this.cnae.descricao}</p>
      <div class="flex justify-center space-x-4">
        <button id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Voltar
        </button>
        <button id="confirm-btn" class="px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
          Excluir
        </button>
      </div>
    `;

    return container;
  }

  setupEventListeners() {
    const cancelBtn = this.element.querySelector('#cancel-btn');
    const confirmBtn = this.element.querySelector('#confirm-btn');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        toast.info('Exclusão cancelada.');
        this.onCancel();
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        toast.success('CNAE removido com sucesso!');
        this.onConfirm();
      });
    }
  }
}

export default ConfirmDeleteCNAEComponent;