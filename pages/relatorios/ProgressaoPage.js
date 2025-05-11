/**
 * ProgressaoPage.js - Página de Relatorio de Progressão
 */
import { Header } from "../../../components/layout/Header.js";
import ModalComponent from "../../../components/common/ModalComponent.js";

class ProgressaoPage {
  constructor() {
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando ProgressaoPage...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.renderContent();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Relatorios | Progressão</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Progressão</div>
        </div>
      `;
    }
  }

  renderContent() {
    const mainContent = document.querySelector("main");
    if (!mainContent) return;

    mainContent.innerHTML = "";

    const card = document.createElement("div");
    card.className =
      "bg-white rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.25)] mx-24 my-20 p-12";

    const header = document.createElement("div");
    header.className = "flex justify-between items-center mb-6";
    header.innerHTML = `
      <h2 class="text-2xl font-semibold text-blue-dark">Emitir Progressão Anual ao Mês</h2>
    `;
    card.appendChild(header);

    const content = document.createElement("div");
    content.className = "text-gray-700 text-base mb-6";
    content.innerHTML = `
        <form class="imprimir-form flex flex-col gap-6">
          <div class="grid-2 gap-4">
            <select class='select-container' >
              <option value="" disabled selected>
                Contribuintes*
              </option>
            </select>
            <select class='select-container' >
              <option value="" disabled selected>
                Cidades*
              </option>
            </select>

            <div class="grid-3">
              <select class='select-container' >
                <option value="" disabled selected>
                  Situação
                </option>
              </select>
              
          
              <select class='select-container'>
                <option value="" disabled selected>
                  Orientação
                </option>
              </select>
            </div>


            <div class='grid-2'>
              <select class='select-container'>
                <option value="" disabled selected>
                  Portarias*
                </option>
              </select>

              <select class='select-container'>
                <option value="" disabled selected>
                  Atividades*
                </option>
              </select>
            </div>

            </div>
          </div>

          <hr />

        </form>
        
          <button type="button" id="add-exercicio-btn" class="btn-primary px-4 py-2 bg-[#3B657A] text-white rounded-lg mt-6 mb-6">
            Adicionar Exercício para Filtrar?
          </button>
          <div id="filter-exercicio-container" class="mt-6">
          </div>
          
        <div class="submit-section mt-6">
          <button class="btn-primary" id="imprimir-btn"> 
            Imprimir
            <i class="fa-solid fa-print"></i>
          </button>
        </div>
        `;

    card.appendChild(content);

    mainContent.appendChild(card);

    const addExercicioBtn = document.getElementById("add-exercicio-btn");
    if (addExercicioBtn) {
      addExercicioBtn.addEventListener("click", () => {
        this.handleAddExercicio();
      });
    }

    this.addExercicioModal = this.createAddExercicioModal();
  }

  createAddExercicioModal() {
    const modal = document.createElement("div");
    modal.id = "addExercicioModal";
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center hidden z-50";
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl w-[90%] max-w-md relative">
        <div class="p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Adicionar Exercício</h2>
          <div class="space-y-4" id="modal-filter-exercicio-container">
            <div class="grid-2 mt-4">
              <select id="remessa-select" class="select-container">
                <option value="" disabled selected>
                  Remessa
                </option>
              </select>
              <select id="apuracao-select" class="select-container">
                <option value="" disabled selected>
                  Apuração
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-4 p-6 bg-gray-50 rounded-b-2xl">
          <button id="cancelAddExercicio" class="px-6 py-2 bg-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Cancelar
          </button>
          <button id="confirmAddExercicio" class="btn-primary px-4 py-2 bg-[#3B657A] text-white rounded-lg">
            Adicionar
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const cancelButton = document.getElementById("cancelAddExercicio");
    if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        modal.classList.add("hidden");
      });
    }

    const confirmButton = document.getElementById("confirmAddExercicio");
    if (confirmButton) {
      confirmButton.addEventListener("click", () => {
        this.handleAddExercicioConfirm();
        modal.classList.add("hidden");
      });
    }
    return modal;
  }

  handleAddExercicio() {
    this.addExercicioModal.classList.remove("hidden");
  }

  handleAddExercicioConfirm() {
    const mainContainer = document.getElementById("filter-exercicio-container");
    const newGroup = document.createElement("div");
    newGroup.className = "filter-exercicio-group grid-3 gap-4 mb-4";
    newGroup.innerHTML = `
      <label for="remessa-select">Remessa</label>
      <label for="apuracao-select">Apuração</label>
      <label></label>
      <select id="remessa-select" class='select-container'>
        <option value="" disabled selected>
          Remessa
        </option>
      </select>
      <select id="apuracao-select" class='select-container'>
        <option value="" disabled selected>
          Apuração
        </option>
      </select>
      <button type="button" class="remove-filter-btn btn-secondary px-4 py-2 border rounded-lg bg-red-600 text-white self-end max-w-[160px]">
      <div class="flex items-center justify-center gap-2">  
        <i class="fa-solid fa-trash"></i>   
        Remover
      </div>
      </button>
    `;

    mainContainer.appendChild(newGroup);

    const removeButton = newGroup.querySelector(".remove-filter-btn");
    removeButton.addEventListener("click", (event) => {
      this.handleRemoveExercicio(event);
    });
  }

  handleRemoveExercicio(event) {
    const modalContent = document.createElement("div");
    modalContent.innerHTML = `
      <p class="text-gray-700 mb-6">
        Deseja remover esse exercício? Essa ação não pode ser desfeita.
      </p>
      <div class="flex justify-center gap-4">
        <button id="cancelDelete" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
        <button id="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Excluir</button>
      </div>
    `;

    this.modal = new ModalComponent({
      id: "remove-exercicio-modal",
      title: "Remover Exercício",
      content: modalContent,
      onClose: () => (this.modal = null),
    });

    this.modal.open();

    // Eventos dos botões do modal
    modalContent
      .querySelector("#cancelDelete")
      .addEventListener("click", () => {
        this.modal.close();
      });

    modalContent
      .querySelector("#confirmDelete")
      .addEventListener("click", () => {
        event.target.closest(".filter-exercicio-group").remove();
        this.modal.close();
      });
  }

  static initialize() {
    return new ProgressaoPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ProgressaoPage.initialize();
});

export default ProgressaoPage;
