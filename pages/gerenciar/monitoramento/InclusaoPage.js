import { Header } from "../../../components/layout/Header.js";
import { toast } from "../../../js/Utilities.js";

class InclusaoPage {
  constructor() {
    this.tableData = [];
    this.originalTableData = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.totalPages = 1;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando InclusaoPage...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.renderContent();
    this.loadData();
    this.setupEventListeners(); // Chamando a função que configura os eventos corretamente
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
          <div class="text-gray-500 text-base leading-tight">Gerenciar | Monitoramento | Inclusão</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Inclusão</div>
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
      <form class="notificar-form">
        <div class="grid grid-cols-3 gap-4 mb-4">
          <select class='select-container' id="contribuinte-select">
            <option value="" disabled selected>Contribuintes a Monitorar</option>
            <option value="João da Silva">João da Silva</option>
            <option value="Empresa XYZ">Empresa XYZ</option>
          </select>

          <select class='select-container' id="motivo-select">
            <option value="" disabled selected>Motivos Monitoramento</option>
            <option value="Dívida Ativa">Dívida Ativa</option>
            <option value="Pendência Fiscal">Pendência Fiscal</option>
          </select>

          <button type="button" class='inclusao-button w-[170px]' id="monitorar">
            Monitorar <i class="fa-solid fa-tv"></i>
          </button>
        </div>

        <h2 class="text-2xl font-semibold text-blue-dark mt-6 mb-4">Contribuintes em Monitoramento</h2>
      </form>

      <div id="permissoes-table" class="mt-4"></div>
      <div id="pagination-container" class="mt-4"></div>
    `;
    card.appendChild(content);
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
      <table class="min-w-full border-collapse">
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
            <button class="delete-btn text-xs bg-red-600 text-white px-2 py-1 rounded" data-id="${row.id}">
              <i class="fa-solid fa-trash-alt"></i> Excluir
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
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        this.showDeleteModal(index);
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

  openImprimirModal() {}

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

  showDeleteModal(index) {
    this.selectedItemIndex = index;
    const item = this.tableData[index];

    this.deleteModal.querySelector("span.font-bold").innerText =
      item.contribuinte;
    this.deleteModal.classList.remove("hidden");

    const confirmBtn = document.getElementById("confirmDelete");
    const cancelBtn = document.getElementById("cancelDelete");

    confirmBtn.onclick = () => {
      this.tableData.splice(this.selectedItemIndex, 1);
      this.totalPages = Math.ceil(this.tableData.length / this.itemsPerPage);
      if (this.currentPage > this.totalPages)
        this.currentPage = this.totalPages || 1;
      this.renderTable();
      this.renderPagination();
      this.deleteModal.classList.add("hidden");
      toast.success("Contribuinte deletado com sucesso!");
    };

    cancelBtn.onclick = () => {
      this.deleteModal.classList.add("hidden");
    };
  }

  static initialize() {
    return new InclusaoPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  InclusaoPage.initialize();
});

export default InclusaoPage;
