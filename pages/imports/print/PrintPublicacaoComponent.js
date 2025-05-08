/**
 * PrintPublicacaoComponent.js - Componente para impressão de publicações
 */
import { toast } from "../../../js/Utilities.js";

class PrintPublicacaoComponent {
  constructor(config) {
    this.onPrint = config.onPrint || (() => {});
    this.onClear = config.onClear || (() => {});
    this.onBack = config.onBack || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement("div");
    container.className = "p-4";

    const form = document.createElement("div");
    form.className = "space-y-4";

    form.innerHTML = `
      <div>
        <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição:</label>
        <input type="text" id="descricao" name="descricao"
               class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
      </div>
    `;

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

  setupEventListeners() {
    const backBtn = this.element.querySelector("#back-btn");
    const clearBtn = this.element.querySelector("#clear-btn");
    const printBtn = this.element.querySelector("#print-btn");

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        toast.info("Retornando à lista de publicações...");
        this.onBack();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.element.querySelector("#descricao").value = "";
        this.onClear();
      });
    }

    if (printBtn) {
      printBtn.addEventListener("click", () => {
        this.submitForm();
      });
    }
  }

  submitForm() {
    const descricaoInput = this.element.querySelector("#descricao");
    const descricao = descricaoInput.value.trim();

    const filters = {
      descricao: descricao,
    };

    this.onPrint(filters);
  }
}

export default PrintPublicacaoComponent;
