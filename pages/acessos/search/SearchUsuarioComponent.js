/**
 * SearchUsuarioComponent.js - Componente para a página de pesquisa de usuários
 */
import { Header } from '/components/layout/Header.js';
import { toast } from '/js/Utilities.js';
import ModalComponent from '/components/common/ModalComponent.js';

class SearchUsuarioComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {string} config.containerId - ID do elemento onde o componente será renderizado
   * @param {Function} config.onSearch - Função chamada ao realizar a pesquisa
   * @param {Function} config.onBack - Função chamada ao clicar em Voltar
   */
  constructor(config) {
    this.containerId = config.containerId || 'search-usuario-container';
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
    container.className = 'w-full';
    container.id = this.containerId;

    // Formulário
    const form = document.createElement('div');
    form.className = 'p-4';

    // Campos do formulário
    form.innerHTML = `
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-1">
          <label for="nomeOuEmail" class="block text-sm font-medium text-gray-700">Nome ou E-mail:</label>
          <input type="text" id="nomeOuEmail" name="nomeOuEmail"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="crcContabilista" class="block text-sm font-medium text-gray-700">Crc Contabilista:</label>
          <input type="text" id="crcContabilista" name="crcContabilista"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="situacao" class="block text-sm font-medium text-gray-700">Situação:</label>
          <select id="situacao" name="situacao"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="">Selecione</option>
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
      </div>
    `;

    // Botões de ação
    const actions = document.createElement('div');
    actions.className = 'flex justify-end space-x-4 mt-6';
    actions.innerHTML = `
      <button id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
        Voltar
      </button>
      <button id="clear-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
        Limpar Filtros
      </button>
      <button id="search-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
        Pesquisar
      </button>
    `;

    form.appendChild(actions);
    container.appendChild(form);
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
        toast.info('Retornando à lista de usuários...');
        this.onBack();
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

  /**
   * Limpa o formulário
   */
  clearForm() {
    const nomeOuEmailInput = this.element.querySelector('#nomeOuEmail');
    const crcContabilistaInput = this.element.querySelector('#crcContabilista');
    const situacaoInput = this.element.querySelector('#situacao');

    nomeOuEmailInput.value = '';
    crcContabilistaInput.value = '';
    situacaoInput.value = '';
  }

  /**
   * Processa o envio do formulário
   */
  submitForm() {
    const nomeOuEmailInput = this.element.querySelector('#nomeOuEmail');
    const crcContabilistaInput = this.element.querySelector('#crcContabilista');
    const situacaoInput = this.element.querySelector('#situacao');

    const filters = {
      nomeOuEmail: nomeOuEmailInput.value || null,
      crcContabilista: crcContabilistaInput.value || null,
      situacao: situacaoInput.value ? situacaoInput.value === 'true' : null
    };

    toast.info('Pesquisando...');
    setTimeout(() => {
      this.onSearch(filters);
    }, 500);
  }

  /**
   * Inicializa o componente
   * @param {Object} config - Configuração do componente
   */
  static initialize(config) {
    const container = document.getElementById(config.containerId);
    if (!container) {
      console.error(`Container com ID "${config.containerId}" não encontrado!`);
      return;
    }
    // Renderizar header fora do componente
    Header.initialize();
    // Configurar breadcrumb
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Acessos | Usuários</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Pesquisar Usuários</div>
        </div>
      `;
    }
    // Instanciar e renderizar o componente
    const component = new SearchUsuarioComponent(config);
    container.appendChild(component.element);
    return component;
  }
}

export default SearchUsuarioComponent;