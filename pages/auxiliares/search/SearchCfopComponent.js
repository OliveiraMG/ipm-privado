/**
 * SearchCfopComponent.js - Componente para a página de pesquisa de CFOPs
 */
import { toast } from "../../../js/Utilities.js";
class SearchCfopComponent {
  constructor({ onSearch, onBack }) {
    this.onSearch = onSearch || (() => {});
    this.onBack = onBack || (() => {});
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

    // Formulário
    const form = document.createElement("div");
    form.className = "p-4";

    // Campos do formulário
    form.innerHTML = `
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-1">
            <label for="tipo" class="block text-sm font-medium text-gray-700">Tipo:</label>
            <select id="tipo" name="tipo"
                    class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
              <option value="">Selecione</option>
              <option value="cfop">CFOP</option>
              <option value="descricao">Descrição</option>
              <option value="aplicacao">Aplicação</option>
            </select>
          </div>
          <div class="col-span-1">
            <label for="cfop" class="block text-sm font-medium text-gray-700">CFOP:</label>
            <input type="text" id="cfop" name="cfop"
                   class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
          </div>
          <div class="col-span-1">
            <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição:</label>
            <input type="text" id="descricao" name="descricao"
                   class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
          </div>
        </div>
        <div class="mt-4">
          <label for="aplicacao" class="block text-sm font-medium text-gray-700">Aplicação:</label>
          <input type="text" id="aplicacao" name="aplicacao"
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
    const backBtn = this.element.querySelector("#back-btn");
    const clearBtn = this.element.querySelector("#clear-btn");
    const searchBtn = this.element.querySelector("#search-btn");

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        toast.info("Retornando à lista de CFOPs...");
        this.onBack();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.clearForm();
        toast.info("Filtros limpos.");
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        this.submitForm();
      });
    }
  }

  /**
   * Limpa o formulário
   */
  clearForm() {
    const tipoInput = this.element.querySelector("#tipo");
    const cfopInput = this.element.querySelector("#cfop");
    const descricaoInput = this.element.querySelector("#descricao");
    const aplicacaoInput = this.element.querySelector("#aplicacao");

    tipoInput.value = "";
    cfopInput.value = "";
    descricaoInput.value = "";
    aplicacaoInput.value = "";
  }

  /**
   * Processa o envio do formulário
   */
  submitForm() {
    const tipoInput = this.element.querySelector("#tipo");
    const cfopInput = this.element.querySelector("#cfop");
    const descricaoInput = this.element.querySelector("#descricao");
    const aplicacaoInput = this.element.querySelector("#aplicacao");

    const filters = {
      tipo: tipoInput.value || null,
      cfop: cfopInput.value ? parseInt(cfopInput.value) : null,
      descricao: descricaoInput.value || null,
      aplicacao: aplicacaoInput.value || null,
    };

    toast.info("Pesquisando...");
    setTimeout(() => {
      this.onSearch(filters);
    }, 500);
  }
}

export default SearchCfopComponent;
