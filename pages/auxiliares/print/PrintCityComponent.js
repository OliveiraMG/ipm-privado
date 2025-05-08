/**
 * PrintCityComponent.js - Componente para a página de impressão de cidades
 */
import { Header } from "../../../components/layout/Header.js";
import { toast } from "../../../js/Utilities.js";

class PrintCityComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {string} config.containerId - ID do elemento onde o componente será renderizado
   * @param {Function} config.onPrint - Função chamada ao realizar a impressão
   * @param {Function} config.onBack - Função chamada ao clicar em Voltar
   */
  constructor(config) {
    this.containerId = config.containerId || "print-city-container";
    this.onPrint = config.onPrint || (() => {});
    this.onBack = config.onBack || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  /**
   * Renderiza o componente
   * @returns {HTMLElement} - Elemento do componente
   */
  render() {
    const container = document.createElement("div");
    container.className = "w-full";
    container.id = this.containerId;

    // Formulário
    const form = document.createElement("div");
    form.className = "p-4";

    // Campos do formulário
    form.innerHTML = `
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-1">
          <label for="codigo" class="block text-sm font-medium text-gray-700">Código:</label>
          <input type="text" id="codigo" name="codigo"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="cidade" class="block text-sm font-medium text-gray-700">Cidade:</label>
          <input type="text" id="cidade" name="cidade"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="ativo" class="block text-sm font-medium text-gray-700">Ativo:</label>
          <select id="ativo" name="ativo"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="">Selecione</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>
      </div>
    `;

    // Botões de ação
    const actions = document.createElement("div");
    actions.className = "flex justify-end space-x-4 mt-6";
    actions.innerHTML = `
      <button id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
        Voltar
      </button>
      <button id="clear-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
        Limpar Filtros
      </button>
      <button id="print-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
        Imprimir
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
    const backBtn = this.element.querySelector("#back-btn");
    const clearBtn = this.element.querySelector("#clear-btn");
    const printBtn = this.element.querySelector("#print-btn");

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        toast.info("Retornando à lista de cidades...");
        this.onBack();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.clearForm();
        toast.info("Filtros limpos.");
      });
    }

    if (printBtn) {
      printBtn.addEventListener("click", () => {
        this.submitForm();
      });
    }
  }

  /**
   * Limpa o formulário
   */
  clearForm() {
    const codigoInput = this.element.querySelector("#codigo");
    const cidadeInput = this.element.querySelector("#cidade");
    const ativoInput = this.element.querySelector("#ativo");

    codigoInput.value = "";
    cidadeInput.value = "";
    ativoInput.value = "";
  }

  /**
   * Processa o envio do formulário
   */
  submitForm() {
    const codigoInput = this.element.querySelector("#codigo");
    const cidadeInput = this.element.querySelector("#cidade");
    const ativoInput = this.element.querySelector("#ativo");

    const filters = {
      codigo: codigoInput.value ? parseInt(codigoInput.value) : null,
      cidade: cidadeInput.value || null,
      ativo: ativoInput.value ? ativoInput.value === "true" : null,
    };

    toast.info("Preparando impressão...");
    setTimeout(() => {
      this.onPrint(filters);
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
          <div class="text-gray-500 text-base leading-tight">Auxiliares | Cidades</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Imprimir Cidades</div>
        </div>
      `;
    }
    // Instanciar e renderizar o componente
    const component = new PrintCityComponent(config);
    container.appendChild(component.element);
    return component;
  }
}

export default PrintCityComponent;
