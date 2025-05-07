/**
 * DeleteExercicioComponent.js - Componente para remoção de exercício
 */
import { toast } from "/js/Utilities.js";

class DeleteExercicioComponent {
  constructor(config) {
    this.exercicioData = config.exercicioData || {};
    this.onDelete = config.onDelete || (() => {});
    this.onBack = config.onBack || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement("div");
    container.className = "p-4";

    const message = document.createElement("div");
    message.className = "space-y-4";

    message.innerHTML = `
      <p class="text-gray-700">Deseja remover esse Exercício?</p>
      <p class="text-gray-700 font-medium">${this.exercicioData.base}</p>
    `;

    const actions = document.createElement("div");
    actions.className = "flex justify-end space-x-4 mt-6";
    actions.innerHTML = `
      <button id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
        Voltar
      </button>
      <button id="delete-btn" class="px-4 py-2 bg-red-600 text-white rounded-full text-sm hover:bg-red-700">
        Excluir
      </button>
    `;

    message.appendChild(actions);
    container.appendChild(message);
    return container;
  }

  setupEventListeners() {
    const backBtn = this.element.querySelector("#back-btn");
    const deleteBtn = this.element.querySelector("#delete-btn");

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        toast.info("Retornando à lista de exercícios...");
        this.onBack();
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        this.onDelete();
      });
    }
  }
}

export default DeleteExercicioComponent;
