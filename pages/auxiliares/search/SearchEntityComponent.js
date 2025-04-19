/**
 * SearchEntityComponent.js - Componente para a página de pesquisa de entidade
 */
import { toast } from '/js/Utilities.js';

class SearchEntityComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {string} config.containerId - ID do elemento onde o componente será renderizado
   * @param {Function} config.onSearch - Função chamada ao realizar a pesquisa
   * @param {Function} config.onBack - Função chamada ao clicar em Voltar
   */
  constructor(config) {
    this.containerId = config.containerId || 'search-entity-container';
    this.onSearch = config.onSearch || (() => {});
    this.onBack = config.onBack || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  /**
   * Renderiza o componente
   * @returns {HTMLElement} - Elemento do componente
   */
  render() {
    const container = document.createElement('div');
    container.className = 'flex-1 bg-gray-light w-full';
    container.id = this.containerId;

    // Card principal
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.25)] p-12';

    // Título
    card.innerHTML = `
      <h2 class="text-xl font-semibold text-blue-dark mb-6">Pesquisar</h2>
    `;

    // Formulário de pesquisa
    const form = document.createElement('div');
    form.className = 'grid grid-cols-3 gap-4 mb-6';
    form.innerHTML = `
      <div class="col-span-1">
        <label for="codigo" class="block text-sm font-medium text-gray-700">Código:</label>
        <input type="text" id="codigo" name="codigo"
               class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-light focus:border-blue-light">
      </div>
      <div class="col-span-1">
        <label for="cidade" class="block text-sm font-medium text-gray-700">Cidade:</label>
        <input type="text" id="cidade" name="cidade"
               class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-light focus:border-blue-light">
      </div>
      <div class="col-span-1">
        <label for="ativo" class="block text-sm font-medium text-gray-700">Ativo:</label>
        <select id="ativo" name="ativo"
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-light focus:border-blue-light">
          <option value="">Selecione</option>
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </select>
      </div>
    `;
    card.appendChild(form);

    // Botões de ação
    const actions = document.createElement('div');
    actions.className = 'flex justify-end space-x-4';
    actions.innerHTML = `
      <button id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100">
        Voltar
      </button>
      <button id="clear-btn" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
        Limpar Filtros
      </button>
      <button id="search-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
        Pesquisar
      </button>
    `;
    card.appendChild(actions);

    container.appendChild(card);
    return container;
  }

  /**
   * Configura os eventos dos botões
   */
  setupEventListeners() {
    const backBtn = this.element.querySelector('#back-btn');
    const clearBtn = this.element.querySelector('#clear-btn');
    const searchBtn = this.element.querySelector('#search-btn');

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        toast.info('Retornando à lista de entidades...');
        this.onBack();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const formInputs = this.element.querySelectorAll('input, select');
        formInputs.forEach(input => {
          input.value = '';
        });
        toast.info('Filtros limpos.');
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const codigo = this.element.querySelector('#codigo').value;
        const cidade = this.element.querySelector('#cidade').value;
        const ativo = this.element.querySelector('#ativo').value;

        const filters = {
          codigo: codigo ? parseInt(codigo) : null,
          cidade: cidade || null,
          ativo: ativo ? ativo === 'true' : null
        };

        toast.info('Pesquisando entidades...');
        this.onSearch(filters);
      });
    }
  }
}

export default SearchEntityComponent;