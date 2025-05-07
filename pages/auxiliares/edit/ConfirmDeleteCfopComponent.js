/**
 * ConfirmDeleteCfopComponent.js - Componente para confirmar a exclusão de um CFOP
 */
import { toast } from "/js/Utilities.js";
import ModalComponent from "/components/common/ModalComponent.js";

class ConfirmDeleteCfopComponent {
  constructor({ cfopData, onConfirm, onCancel }) {
    this.cfopData = cfopData || {};
    this.onConfirm = onConfirm || (() => {});
    this.onCancel = onCancel || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement("div");
    container.className = "w-full";

    const content = document.createElement("div");
    content.className = "p-4 text-center";

    content.innerHTML = `
      <h2 class="text-lg font-semibold text-gray-700 mb-2">Deseja remover esse CFOP?</h2>
      <p class="text-sm text-gray-600">${this.cfopData.cfop}</p>
      <p class="text-sm text-gray-600">${this.cfopData.descricao}</p>
      <div class="flex justify-center space-x-4 mt-6">
        <button id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Voltar
        </button>
        <button id="confirm-btn" class="px-4 py-2 bg-red-600 text-white rounded-full text-sm hover:bg-red-700">
          Excluir
        </button>
      </div>
    `;

    container.appendChild(content);
    return container;
  }

  setupEventListeners() {
    const cancelBtn = this.element.querySelector("#cancel-btn");
    const confirmBtn = this.element.querySelector("#confirm-btn");

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        toast.info("Ação cancelada.");
        this.onCancel();
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        toast.success("CFOP removido com sucesso!");
        this.onConfirm();
      });
    }
  }
}

export default ConfirmDeleteCfopComponent;
