/**
 * SearchCNAEGrupoAtividadeComponent.js - Componente para pesquisa de CNAEs
 */
import { toast } from '/js/Utilities.js';

class SearchCNAEGrupoAtividadeComponent {
  constructor({ onSearch, onCancel }) {
    this.onSearch = onSearch || (() => {});
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
        <label for="cnaesCadastrados" class="block text-sm font-medium text-gray-700">CNAEs Cadastrados</label>
        <input type="text" id="cnaesCadastrados" name="cnaesCadastrados"
               class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
               placeholder="Digite o código ou descrição do CNAE">
      </div>
      <div class="flex justify-end space-x-4 mt-6">
        <button id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Voltar
        </button>
        <button id="clear-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Limpar Filtros
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
    const clearBtn = this.element.querySelector('#clear-btn');
    const searchBtn = this.element.querySelector('#search-btn');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        toast.info('Pesquisa cancelada.');
        this.onCancel();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearForm();
        toast.info('Filtros limpos.');
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.submitForm();
      });
    }
  }

  clearForm() {
    this.element.querySelector('#cnaesCadastrados').value = '';
    this.onSearch({ cnaesCadastrados: '' });
  }

  submitForm() {
    const cnaesCadastrados = this.element.querySelector('#cnaesCadastrados').value;

    const filters = {
      cnaesCadastrados: cnaesCadastrados || ''
    };

    toast.success('Pesquisa realizada com sucesso!');
    this.onSearch(filters);
  }
}

export default SearchCNAEGrupoAtividadeComponent;