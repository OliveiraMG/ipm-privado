/**
 * PrintPortariaComponent.js - Componente para o formulário de impressão de portarias
 */
import { toast } from "../../../js/Utilities.js";

class PrintPortariaComponent {
  constructor({ onPrint, onCancel }) {
    this.onPrint = onPrint || (() => {});
    this.onCancel = onCancel || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement("div");
    container.className = "w-full";

    const form = document.createElement("div");
    form.className = "p-4";

    form.innerHTML = `
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-1">
          <label for="vigente" class="block text-sm font-medium text-gray-700">Vigente</label>
          <select id="vigente" name="vigente"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="">Selecione</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="numero" class="block text-sm font-medium text-gray-700">Número</label>
          <input type="text" id="numero" name="numero"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="ano" class="block text-sm font-medium text-gray-700">Ano</label>
          <input type="text" id="ano" name="ano"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
      </div>
      <div class="flex justify-end space-x-4 mt-6">
        <button id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Voltar
        </button>
        <button id="clear-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Limpar Filtros
        </button>
        <button id="print-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
          Imprimir
        </button>
      </div>
    `;

    container.appendChild(form);
    return container;
  }

  setupEventListeners() {
    const cancelBtn = this.element.querySelector("#cancel-btn");
    const clearBtn = this.element.querySelector("#clear-btn");
    const printBtn = this.element.querySelector("#print-btn");

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        toast.info("Impressão cancelada.");
        this.onCancel();
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

  clearForm() {
    this.element.querySelector("#vigente").value = "";
    this.element.querySelector("#numero").value = "";
    this.element.querySelector("#ano").value = "";
    this.onPrint({ vigente: "", numero: "", ano: "" });
  }

  submitForm() {
    const vigente = this.element.querySelector("#vigente").value;
    const numero = this.element.querySelector("#numero").value;
    const ano = this.element.querySelector("#ano").value;

    const filters = {
      vigente: vigente || "",
      numero: numero || "",
      ano: ano || "",
    };

    toast.success("Impressão solicitada com sucesso!");
    this.onPrint(filters);
  }
}

export default PrintPortariaComponent;
