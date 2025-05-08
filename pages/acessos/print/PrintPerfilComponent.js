/**
 * PrintPerfilComponent.js - Componente para a página de impressão de perfis
 */
import { toast } from "../../../js/Utilities.js";

class PrintPerfilComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {Function} config.onPrint - Função chamada ao realizar a impressão
   * @param {Function} config.onBack - Função chamada ao clicar em Voltar
   */
  constructor(config) {
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
    container.className = "p-4";

    // Formulário
    const form = document.createElement("div");
    form.className = "space-y-4";

    // Campo do formulário
    form.innerHTML = `
      <div>
        <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição:</label>
        <input type="text" id="descricao" name="descricao"
               class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
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
        toast.info("Retornando à lista de perfis...");
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
    const descricaoInput = this.element.querySelector("#descricao");
    descricaoInput.value = "";
  }

  /**
   * Processa o envio do formulário
   */
  submitForm() {
    const descricaoInput = this.element.querySelector("#descricao");
    const filters = {
      descricao: descricaoInput.value || null,
    };

    toast.info("Preparando impressão...");
    setTimeout(() => {
      this.onPrint(filters);
    }, 500);
  }
}

export default PrintPerfilComponent;
