/**
 * RegisterEntityComponent.js - Componente para a página de cadastro de entidade
 */
import { Header } from '/components/layout/Header.js';
import { toast } from '/js/Utilities.js';
import RichTextEditorComponent from '/components/forms/RichTextEditorComponent.js';

class RegisterEntityComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {string} config.containerId - ID do elemento onde o componente será renderizado
   * @param {Function} config.onSubmit - Função chamada ao submeter o formulário
   * @param {Function} config.onBack - Função chamada ao clicar em Voltar
   */
  constructor(config) {
    this.containerId = config.containerId || 'register-entity-container';
    this.onSubmit = config.onSubmit || (() => {});
    this.onBack = config.onBack || (() => {});
    this.currentTab = 'entidade';
    this.richTextEditor = null;

    this.element = this.render();
    this.setupEventListeners();
  }

  /**
   * Renderiza o componente
   * @returns {HTMLElement} - Elemento do componente
   */
  render() {
    const container = document.createElement('div');
    container.className = 'flex-1 bg-white w-full';
    container.id = this.containerId;

    // Título
    const title = document.createElement('div');
    title.className = 'p-4';
    title.innerHTML = `

    `;
    container.appendChild(title);

    // Abas
    const tabs = document.createElement('div');
    tabs.className = 'flex space-x-4 mb-6 px-4';
    tabs.innerHTML = `
      <button data-tab="entidade" class="tab-btn px-4 py-2 rounded-full text-white bg-blue-dark">Entidade</button>
      <button data-tab="responsavel" class="tab-btn px-4 py-2 rounded-full text-gray-700 bg-gray-200">Responsável</button>
      <button data-tab="imagens" class="tab-btn px-4 py-2 rounded-full text-gray-700 bg-gray-200">Imagens</button>
      <button data-tab="relatorio" class="tab-btn px-4 py-2 rounded-full text-gray-700 bg-gray-200">Conteúdo do Relatório</button>
      <button data-tab="auxiliares" class="tab-btn px-4 py-2 rounded-full text-gray-700 bg-gray-200">Auxiliares</button>
    `;
    container.appendChild(tabs);

    // Container do formulário
    const formContainer = document.createElement('div');
    formContainer.id = 'form-container';
    formContainer.className = 'px-4';
    formContainer.innerHTML = this.renderEntityForm();
    container.appendChild(formContainer);

    // Botões de ação
    const actions = document.createElement('div');
    actions.className = 'flex justify-end space-x-4 mt-6 px-4';
    actions.innerHTML = `
      <button id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100">
        Voltar
      </button>
      <button id="submit-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
        Cadastrar
      </button>
    `;
    container.appendChild(actions);

    return container;
  }

  /**
   * Renderiza o formulário da aba Entidade
   * @returns {string} - HTML do formulário
   */
  renderEntityForm() {
    return `
      <form id="entity-form" class="grid grid-cols-2 gap-4">
        <div class="col-span-1">
          <label for="entidade" class="block text-sm font-medium text-gray-700">Entidade*:</label>
          <input type="text" id="entidade" name="entidade" required
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="cnpj" class="block text-sm font-medium text-gray-700">CNPJ*:</label>
          <input type="text" id="cnpj" name="cnpj" required
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="telefone" class="block text-sm font-medium text-gray-700">Telefone*:</label>
          <input type="tel" id="telefone" name="telefone" required
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="fax" class="block text-sm font-medium text-gray-700">Fax:</label>
          <input type="tel" id="fax" name="fax"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="cidade" class="block text-sm font-medium text-gray-700">Cidade*:</label>
          <select id="cidade" name="cidade" required
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="">Selecione uma cidade</option>
            <option value="Pontes e Lacerda">Pontes e Lacerda</option>
            <option value="Várzea Grande">Várzea Grande</option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="endereco" class="block text-sm font-medium text-gray-700">Endereço*:</label>
          <input type="text" id="endereco" name="endereco" required
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="email" class="block text-sm font-medium text-gray-700">E-mail*:</label>
          <input type="email" id="email" name="email" required
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="site" class="block text-sm font-medium text-gray-700">Site:</label>
          <input type="url" id="site" name="site"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
      </form>
    `;
  }

  /**
   * Configura os eventos dos botões e abas
   */
  setupEventListeners() {
    // Abas
    const tabButtons = this.element.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.getAttribute('data-tab'));
      });
    });

    // Botão Voltar
    const backBtn = this.element.querySelector('#back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        toast.info('Retornando à lista de entidades...');
        this.onBack();
      });
    }

    // Botão Cadastrar
    const submitBtn = this.element.querySelector('#submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.submitForm();
      });
    }
  }

  /**
   * Alterna entre abas
   * @param {string} tab - Nome da aba
   */
  switchTab(tab) {
    if (this.currentTab === tab) return;

    // Atualizar estilo dos botões de aba
    const tabButtons = this.element.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === tab) {
        btn.classList.remove('text-gray-700', 'bg-gray-200');
        btn.classList.add('text-white', 'bg-blue-dark');
      } else {
        btn.classList.remove('text-white', 'bg-blue-dark');
        btn.classList.add('text-gray-700', 'bg-gray-200');
      }
    });

    // Atualizar conteúdo do formulário
    const formContainer = this.element.querySelector('#form-container');
    if (formContainer) {
      formContainer.innerHTML = '';
      if (tab === 'entidade') {
        formContainer.innerHTML = this.renderEntityForm();
      } else if (tab === 'relatorio') {
        this.richTextEditor = new RichTextEditorComponent({
          id: 'report-content',
          onChange: (data) => {
            console.log('Conteúdo atualizado:', data);
          }
        });
        formContainer.appendChild(this.richTextEditor.element);
      } else {
        formContainer.innerHTML = `
          <p class="text-gray-600">Conteúdo da aba "${tab}" ainda não implementado.</p>
        `;
      }
    }

    this.currentTab = tab;
    toast.info(`Aba "${tab}" selecionada`);
  }

  /**
   * Processa o envio do formulário
   */
  submitForm() {
    if (this.currentTab === 'entidade') {
      const form = this.element.querySelector('#entity-form');
      if (!form) return;

      if (form.checkValidity()) {
        const formData = new FormData(form);
        const data = {
          entidade: formData.get('entidade'),
          cnpj: formData.get('cnpj'),
          telefone: formData.get('telefone'),
          fax: formData.get('fax'),
          cidade: formData.get('cidade'),
          endereco: formData.get('endereco'),
          email: formData.get('email'),
          site: formData.get('site')
        };

        toast.info('Processando cadastro...');
        setTimeout(() => {
          toast.success(`Entidade "${data.entidade}" cadastrada com sucesso!`);
          form.reset();
          this.onSubmit(data);
        }, 1000);
      } else {
        toast.error('Por favor, preencha todos os campos obrigatórios.');
        form.reportValidity();
      }
    } else if (this.currentTab === 'relatorio') {
      if (!this.richTextEditor) return;

      const data = this.richTextEditor.getFormData();
      if (data.conteudoSuperior && data.conteudoInferior) {
        toast.info('Processando conteúdo do relatório...');
        setTimeout(() => {
          toast.success('Conteúdo do relatório salvo com sucesso!');
          this.richTextEditor.reset();
          this.onSubmit(data);
        }, 1000);
      } else {
        toast.error('Por favor, preencha ambos os campos de conteúdo.');
        const form = this.element.querySelector('#report-content-form');
        if (form) form.reportValidity();
      }
    } else {
      toast.error('Aba não suportada para cadastro.');
    }
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
          <div class="text-gray-500 text-base leading-tight">Auxiliares | Entidades</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Cadastrar Entidade</div>
        </div>
      `;
    }
    // Instanciar e renderizar o componente
    const component = new RegisterEntityComponent(config);
    container.appendChild(component.element);
    return component;
  }
}

export default RegisterEntityComponent;