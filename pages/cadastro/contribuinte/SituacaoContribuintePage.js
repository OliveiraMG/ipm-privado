import ModalComponent from "../../../components/common/ModalComponent.js";
import { Header } from "../../../components/layout/Header.js";
import { toast } from "../../../js/Utilities.js";

class SituacaoContribuintePage {
  constructor() {
    this.tableData = [];
    this.originalTableData = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.totalPages = 1;
    this.editModal = null; // Alterado para armazenar a instância do modal de edição
    this.registerModal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando SituacaoContribuintePage...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.renderContent();
    this.loadData();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const monitorarButton = document.getElementById("monitorar");
    if (monitorarButton) {
      monitorarButton.addEventListener("click", (event) => {
        event.preventDefault();
        this.adicionarContribuinte();
      });
    }
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Cadastro | Contribuintes | Situação Contribuinte</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Situação Contribuinte</div>
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
    header.innerHTML = `<h2 class="text-2xl font-semibold text-blue-dark">Inclusão</h2>`;
    card.appendChild(header);

    const content = document.createElement("div");
    content.className = "text-gray-700 text-base mb-6";
    content.innerHTML = `
      <div id="permissoes-table" class="mt-4"></div>
      <div id="pagination-container" class="mt-4"></div>
    `;
    card.appendChild(content);

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "button-container";
    buttonContainer.className =
      "flex flex-wrap items-center justify-center mt-4 gap-4 md:gap-5";
    card.appendChild(buttonContainer);

    mainContent.appendChild(card);
    const modalHTML = `
  <div id="deleteModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center hidden z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold text-red-600 mb-4">Confirmar Exclusão</h2>
      <p class="text-gray-700 mb-4">Tem certeza que deseja excluir o contribuinte <span class="font-bold"></span>?</p>
      <div class="flex justify-end space-x-2">
        <button id="cancelDelete" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
        <button id="confirmDelete" class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Confirmar</button>
      </div>
    </div>
  </div>
`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    this.deleteModal = document.getElementById("deleteModal");
  }

  loadData() {
    setTimeout(() => {
      this.tableData = this.getMockData();
      this.originalTableData = [...this.tableData];
      this.totalPages = Math.ceil(this.tableData.length / this.itemsPerPage);
      this.renderTable();
      this.renderPagination();
      this.renderButtons();
    }, 300);
  }

  getMockData() {
    const items = [];
    for (let i = 1; i <= 42; i++) {
      items.push({
        id: Date.now() + i,
        inscricao: `130001040${i}`,
        contribuinte: i % 2 === 0 ? "ADELINO FERRARO" : "PORTO ESPERIDIAO",
        dataInclusao: i % 2 === 0 ? "10/11/2024" : "20/12/2024",
        motivo: i % 2 === 0 ? "VANAP CPAMR CNTOM" : "CVAPA CNTSM CDNFL",
      });
    }
    return items;
  }

  renderTable() {
    const tableContainer = document.getElementById("permissoes-table");
    if (!tableContainer) {
      console.error(
        "Elemento com ID 'permissoes-table' não encontrado no DOM."
      );
      return;
    }

    if (!this.tableData.length) {
      tableContainer.innerHTML =
        '<p class="text-center py-4">Nenhum dado disponível</p>';
      return;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedData = this.tableData.slice(startIndex, endIndex);

    let tableHTML = `
      <table class="min-w-full border-collapse rounded-xl overflow-hidden">
        <thead>
          <tr class="bg-blue-dark">
            <th class="text-white text-sm text-center py-2 px-4">AÇÕES</th>
            <th class="text-white text-sm text-center py-2 px-4">INSCRIÇÃO</th>
            <th class="text-white text-sm text-left py-2 px-4">CONTRIBUINTE</th>
            <th class="text-white text-sm text-left py-2 px-4">DATA DE INCLUSÃO</th>
            <th class="text-white text-sm text-left py-2 px-4">MOTIVO</th>
          </tr>
        </thead>
        <tbody>
    `;

    paginatedData.forEach((row, index) => {
      const rowClass = index % 2 === 0 ? "bg-white" : "bg-gray-50";
      tableHTML += `
        <tr class="${rowClass}">
          <td class="text-center py-2 px-4 border-2">
            <button id='editar-btn editar-btn-${row.id}' class="btn-primary delete-btn text-xs text-white px-2 py-1 rounded" data-id="${row.id}">
              <i class='fa-solid fa-pen'></i>
              Editar
            </button>
          </td>
          <td class="text-center py-2 px-4 border-2">${row.inscricao}</td>
          <td class="text-left py-2 px-4 border-2">${row.contribuinte}</td>
          <td class="text-left py-2 px-4 border-2">${row.dataInclusao}</td>
          <td class="text-left py-2 px-4 border-2">${row.motivo}</td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;
    tableContainer.innerHTML = tableHTML;
    this.setupTableButtonEvents();
  }

  setupTableButtonEvents() {
    const editButtons = document.getElementById("editar-btn");

    editButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const id = parseInt(button.dataset.id);
        this.openEditModal(id);
      });
    });
  }

  deleteItem(id) {
    this.tableData = this.tableData.filter((item) => item.id !== id);
    this.totalPages = Math.ceil(this.tableData.length / this.itemsPerPage);
    this.renderTable();
    this.renderPagination();
    toast.success("Contribuinte deletado com sucesso!");
  }

  updateData(updatedData) {
    const index = this.tableData.findIndex(
      (item) => item.id === updatedData.id
    );
    if (index !== -1) {
      this.tableData[index] = {
        ...this.tableData[index],
        inscricao: updatedData.inscricao,
        contribuinte: updatedData.contribuinte,
        dataInclusao: updatedData.dataInclusao,
        motivo: updatedData.motivo,
      };
      this.renderTable();
      toast.success("Dados atualizados com sucesso!");
    } else {
      toast.error("Erro: Contribuinte não encontrado para atualização.");
    }
  }

  renderButtons() {
    const container = document.getElementById("button-container");
    if (!container) return;

    const buttonsHTML = `
      <button class="btn-primary hover:opacity-60 transition-all duration-300 ease-in-out text-white px-4 py-2 rounded flex justify-center items-center gap-2 md:gap-3 text-sm md:text-base" id="imprimir-btn">
        Imprimir
        <i class="fa-solid fa-print"></i>
      </button>
      <button class="btn-primary hover:opacity-60 transition-all duration-300 ease-in-out text-white px-4 py-2 rounded flex justify-center items-center gap-2 md:gap-3 text-sm md:text-base" id="cadastrar-btn">
        Cadastrar
        <i class="fa-solid fa-plus"></i>
      </button>
      <button class="btn-primary hover:opacity-60 transition-all duration-300 ease-in-out text-white px-4 py-2 rounded flex justify-center items-center gap-2 md:gap-3 text-sm md:text-base" id="search-btn">
        Pesquisar
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    `;
    container.innerHTML = buttonsHTML;

    document
      .getElementById("imprimir-btn")
      .addEventListener("click", () => this.openImprimirModal());
    document
      .getElementById("search-btn")
      .addEventListener("click", () => this.openSearchModal());
    document.getElementById("cadastrar-btn").addEventListener("click", () => {
      this.openRegisterModal();
    });
  }

  renderPagination() {
    const paginationContainer = document.getElementById("pagination-container");
    if (!paginationContainer) {
      console.error(
        "Elemento com ID 'pagination-container' não encontrado no DOM."
      );
      return;
    }

    let paginationHTML = `
      <nav class="flex justify-center space-x-2">
        <button id="prev-page" class="px-3 py-1 border rounded ${
          this.currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white text-blue-dark hover:bg-blue-light"
        }" ${this.currentPage === 1 ? "disabled" : ""}>
          &lt;
        </button>
    `;

    for (let i = 1; i <= this.totalPages; i++) {
      paginationHTML += `
        <button class="page-btn px-3 py-1 border rounded ${
          this.currentPage === i
            ? "bg-blue-dark text-white"
            : "bg-white text-blue-dark hover:bg-blue-light"
        }" data-page="${i}">${i}</button>
      `;
    }

    paginationHTML += `
        <button id="next-page" class="px-3 py-1 border rounded ${
          this.currentPage === this.totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white text-blue-dark hover:bg-blue-light"
        }" ${this.currentPage === this.totalPages ? "disabled" : ""}>
          &gt;
        </button>
      </nav>
    `;

    paginationContainer.innerHTML = paginationHTML;
    this.setupPaginationEvents();
  }

  setupPaginationEvents() {
    document.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentPage = parseInt(btn.dataset.page);
        this.renderTable();
        this.renderPagination();
      });
    });

    const prev = document.getElementById("prev-page");
    const next = document.getElementById("next-page");

    if (prev) {
      prev.addEventListener("click", () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderTable();
          this.renderPagination();
        }
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.renderTable();
          this.renderPagination();
        }
      });
    }
  }

  openSearchModal() {
    const modalContent = document.createElement("div");
    modalContent.className = "text-gray-700 text-base space-y-6";

    modalContent.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select id="filter-type-select-1" class="w-full border border-gray-300 rounded-lg h-10 md:h-12 px-3">
          <option disabled selected>Selecione</option>
          <option value="situacao">Situação</option>
          <option value="atividade">Atividade Econômica</option>
          <option value="contador">Contabilista</option>
          <option value="contribuinte">Contribuinte</option>
        </select>
        <select id="filter-exercicio-select-1" class="w-full border border-gray-300 rounded-lg h-10 md:h-12 px-3">
          <option disabled selected>Exercícios</option>
          <option>Exercício 1</option>
          <option>Exercício 2</option>
          <option>Exercício 3</option>
        </select>
      </div>
      <div class="flex flex-col sm:flex-row justify-end gap-4 mt-6">
        <button type="button" id="back-filter" class="btn-secondary px-4 md:px-6 py-2 border rounded-lg text-gray-700 w-full sm:w-auto">Voltar</button>
        <button type="button" id="clear-filter" class="btn-secondary px-4 md:px-6 py-2 border rounded-lg text-gray-700 w-full sm:w-auto">Limpar Filtro</button>
        <button type="button" id="apply-filter-btn" class="btn-primary px-4 md:px-6 py-2 text-white rounded-lg w-full sm:w-auto">
          <i class="fa-solid fa-filter mr-2"></i>Aplicar Filtro
        </button>
      </div>
    `;

    this.modal = new ModalComponent({
      id: "search-modal",
      title: "Pesquisar",
      content: modalContent,
      onClose: () => (this.modal = null),
    });

    this.modal.open();

    setTimeout(() => {
      const applyFilterBtn = document.getElementById("apply-filter-btn");
      const backFilterBtn = document.getElementById("back-filter");
      if (applyFilterBtn) {
        applyFilterBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.applyFilter();
          this.closeModal();
        });
      }
      if (backFilterBtn) {
        backFilterBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.closeModal();
        });
      }
    }, 0);
  }

  openRegisterModal() {
    const registerComponent = new RegisterExercicioComponent({
      onSubmit: (data) => {
        const newExercicio = {
          id: Math.max(...this.tableData.map((d) => d.id), 0) + 1,
          inscricao: data.exercicio, // Ajuste nos nomes dos campos para corresponder à tabela
          contribuinte: data.exercicio,
          dataInclusao: data.exercicio,
          motivo: data.exercicio,
        };
        this.tableData.unshift(newExercicio);
        this.totalPages = Math.ceil(this.tableData.length / this.itemsPerPage); // Recalcular total de páginas
        this.currentPage = 1; // Resetar para a primeira página após adicionar
        this.renderTable();
        this.renderPagination();
        this.registerModal.close();
        toast.success("Exercício cadastrado com sucesso!");
      },
      onBack: () => {
        this.registerModal.close();
        toast.info("Retornado à lista de exercícios");
      },
    });

    this.registerModal = new ModalComponent({
      id: "register-exercicio-modal",
      title: "Cadastrar Exercícios",
      titleClass: "text-blue-dark font-semibold text-xl",
      content: registerComponent.element,
      contentClass: "p-0",
      onClose: () => {
        this.registerModal = null;
      },
    });
    this.registerModal.open();
  }

  openEditModal(exercicioId) {
    // Logic here
  }

  openImprimirModal() {
    const modalContent = document.createElement("div");
    modalContent.className = "text-gray-700 text-base space-y-6";

    modalContent.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select id="city-select" class="w-full border border-gray-300 rounded-lg h-10 md:h-12 px-3">
          <option disabled selected>Cidade</option>
          <option>Cidade A</option>
          <option>Cidade B</option>
          <option>Cidade C</option>
        </select>
        <select id="exercicio-select" class="w-full border border-gray-300 rounded-lg h-10 md:h-12 px-3">
          <option disabled selected>Exercício</option>
          <option>Exercício 1</option>
          <option>Exercício 2</option>
          <option>Exercício 3</option>
        </select>
      </div>
      <div class="flex flex-col sm:flex-row justify-end gap-4 mt-6">
        <button type="button" id="back-filter-print" class="btn-secondary px-4 md:px-6 py-2 border rounded-lg text-gray-700 w-full sm:w-auto">Voltar</button>
        <button type="button" id="clear-filter-print" class="btn-secondary px-4 md:px-6 py-2 border rounded-lg text-gray-700 w-full sm:w-auto">Limpar Filtro</button>
        <button type="button" id="apply-filter-imprimir-btn" class="btn-primary px-4 md:px-6 py-2 text-white rounded-lg w-full sm:w-auto">
          <i class="fa-solid fa-filter mr-2"></i>Aplicar Filtro
        </button>
      </div>
    `;

    this.modal = new ModalComponent({
      id: "imprimir-modal",
      title: "Imprimir",
      content: modalContent,
      onClose: () => (this.modal = null),
    });

    this.modal.open();

    setTimeout(() => {
      const applyFilterImprimirBtn = document.getElementById(
        "apply-filter-imprimir-btn"
      );
      const backFilterPrintBtn = document.getElementById("back-filter-print");

      if (applyFilterImprimirBtn) {
        applyFilterImprimirBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.applyFilter();
          this.closeModal();
        });
      }
      if (backFilterPrintBtn) {
        backFilterPrintBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.closeModal();
        });
      }
    }, 0);
  }

  setupPaginationEvents() {
    document.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentPage = parseInt(btn.dataset.page);
        this.renderTable();
        this.renderPagination();
      });
    });

    const prev = document.getElementById("prev-page");
    const next = document.getElementById("next-page");

    if (prev) {
      prev.addEventListener("click", () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderTable();
          this.renderPagination();
        }
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.renderTable();
          this.renderPagination();
        }
      });
    }
  }

  static initialize() {
    return new SituacaoContribuintePage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  SituacaoContribuintePage.initialize();
});

export default SituacaoContribuintePage;
