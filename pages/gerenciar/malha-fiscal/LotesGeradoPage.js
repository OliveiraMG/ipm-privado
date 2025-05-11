/**
 * LotesGeradoPage.js - Página de Lotes gGerados
 */ 
import { Header } from "../../../components/layout/Header.js";

class LotesGeradosPage {
  constructor() {
    this.tableData = [];
    this.modal = null;
    this.currentPage = 1;
    this.itemsPerPage = 13;
    this.selectedItem = null;
    this.notificationPage = 1;
    this.notificationsPerPage = 5;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando LotesGeradosPage...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.loadData();
    this.renderContent();
    this.modal = this.createNotificationModal();
    this.deleteModal = this.createDeleteModal();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Gerenciar | Malha Fiscal | Lotes Gerados</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Lotes Gerados</div>
        </div>
      `;
    }
  }

  loadData() {
    this.tableData = this.getMockData();
    this.totalPages = Math.ceil(this.tableData.length / this.itemsPerPage);
  }

  getPaginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.tableData.slice(start, end);
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
    header.innerHTML = `<h2 class="text-2xl font-semibold text-blue-dark">Listagem</h2>`;
    card.appendChild(header);

    const content = document.createElement("div");
    content.id = "table-container";
    content.className = "text-gray-700 text-base mb-6";
    card.appendChild(content);

    const pagination = document.createElement("div");
    pagination.id = "pagination-container";
    pagination.className = "flex justify-center mt-4";
    card.appendChild(pagination);

    mainContent.appendChild(card);

    this.renderTable();
    this.renderPagination();
  }

  renderTable() {
    const container = document.getElementById("table-container");
    if (!container) return;

    const data = this.getPaginatedData();

    const tableHTML = `
    <table class="w-full table-auto border-collapse">
      <thead class="bg-[#23424A] text-white">
        <tr>
          <th class="px-4 py-2 text-left border-2">Ações</th>
          <th class="px-4 py-2 text-left border-2">Token</th>
          <th class="px-4 py-2 text-left border-2">Cidade</th>
          <th class="px-4 py-2 text-left border-2">Atividade Econômica</th>
          <th class="px-4 py-2 text-left border-2">Usuário</th>
          <th class="px-4 py-2 text-left border-2">Data</th>
          <th class="px-4 py-2 text-left border-2">Quantidade</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map((item, index) => {
            const globalIndex =
              (this.currentPage - 1) * this.itemsPerPage + index;
            return `
              <tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-2 border-2 flex gap-2">
                  <button class="notificar-btn flex items-center gap-1 bg-[#264757] hover:opacity-60 text-white px-3 py-1 rounded transition-all duration-300 ease-in-out" data-index="${globalIndex}">
                    <i class="fas fa-bell"></i> Notificações
                  </button>                  
                  
                  <button class="flex items-center gap-1 bg-[#3C7A89] hover:opacity-60 text-white px-3 py-1 rounded transition-all duration-300 ease-in-out">
                    <i class="fas fa-print"></i>
                    Imprimir
                  </button>

                  <button class="excluir-btn flex items-center gap-1 bg-[#9F3A3A] hover:opacity-60 text-white px-3 py-1 rounded transition-all duration-300 ease-in-out" data-index="${globalIndex}">
                    <i class="fas fa-trash-alt"></i> Excluir
                  </button>
                </td>
                <td class="px-4 py-2 border-2">${item.token}</td>
                <td class="px-4 py-2 border-2">${item.cidade}</td>
                <td class="px-4 py-2 border-2">${item.atividadeEconomica}</td>
                <td class="px-4 py-2 border-2">${item.usuario}</td>
                <td class="px-4 py-2 border-2">${item.data}</td>
                <td class="px-4 py-2 border-2">${item.quantidade} Notificações Geradas</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;

    container.innerHTML = tableHTML;
    // Após container.innerHTML = tableHTML;
    container.innerHTML = tableHTML;

    // Adicionar eventos aos botões de notificação
    container.querySelectorAll(".notificar-btn").forEach((btn) => {
      btn.onclick = (e) => {
        const index = parseInt(e.currentTarget.dataset.index, 10);
        this.showNotifications(index);
      };
    });

    // Adicionar eventos aos botões de exclusão
    container.querySelectorAll(".excluir-btn").forEach((btn) => {
      btn.onclick = (e) => {
        const index = parseInt(e.currentTarget.dataset.index, 10);
        this.showDeleteModal(index);
      };
    });
  }

  showNotifications(index) {
    this.selectedItem = this.tableData[index];
    this.updateNotificationModal();
    this.modal.classList.remove("hidden");
  }
  showDeleteModal(index) {
    this.selectedItemIndex = index;
    const item = this.tableData[index];

    this.deleteModal.querySelector("p.font-bold").innerText = item.token;
    this.deleteModal.classList.remove("hidden");

    const confirmBtn = document.getElementById("confirmDelete");
    confirmBtn.onclick = () => {
      this.tableData.splice(this.selectedItemIndex, 1);
      this.totalPages = Math.ceil(this.tableData.length / this.itemsPerPage);
      if (this.currentPage > this.totalPages)
        this.currentPage = this.totalPages || 1;
      this.renderTable();
      this.renderPagination();
      this.deleteModal.classList.add("hidden");
    };
  }

  updateNotificationModal() {
    const modal = document.getElementById("notificationModal");
    const tbody = modal.querySelector("tbody");

    const notificacoes = this.selectedItem?.notificacoes || [];
    const start = (this.notificationPage - 1) * this.notificationsPerPage;
    const end = start + this.notificationsPerPage;
    const paginated = notificacoes.slice(start, end);

    tbody.innerHTML = paginated
      .map(
        (item) => `
      <tr class="bg-white border-t">
        <td class="px-4 py-2 flex gap-2">
          <button class="flex items-center gap-1 bg-[#9F3A3A] hover:opacity-60 text-white px-3 py-1 rounded">
            Excluir 
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
        <td class="px-4 py-2">${item.cfop}</td>
        <td class="px-4 py-2">${item.descricao}</td>
        <td class="px-4 py-2">
          <button class="flex items-center gap-1 bg-[#3C7A89] hover:opacity-60 text-white px-3 py-1 rounded">
            <i class="fas fa-random"></i>
            ${item.repercute}
          </button>
        </td>
      </tr>
    `
      )
      .join("");

    this.renderNotificationPagination(notificacoes.length);
  }

  renderNotificationPagination(totalItems) {
    const container = document.getElementById("notification-pagination");
    if (!container) return;

    const totalPages = Math.ceil(totalItems / this.notificationsPerPage);
    if (totalPages <= 1) {
      container.innerHTML = "";
      return;
    }

    let html = `
    <button class="px-3 py-1 border rounded ${
      this.notificationPage === 1
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-white text-blue-dark"
    }"
      ${
        this.notificationPage === 1 ? "disabled" : ""
      } id="noti-prev">&lt;</button>
  `;

    for (let i = 1; i <= totalPages; i++) {
      html += `
      <button class="px-3 py-1 border rounded ${
        this.notificationPage === i
          ? "bg-blue-dark text-white"
          : "bg-white text-blue-dark"
      }"
        data-page="${i}">${i}</button>
    `;
    }

    html += `
    <button class="px-3 py-1 border rounded ${
      this.notificationPage === totalPages
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-white text-blue-dark"
    }"
      ${
        this.notificationPage === totalPages ? "disabled" : ""
      } id="noti-next">&gt;</button>
  `;

    container.innerHTML = html;

    container.querySelectorAll("button[data-page]").forEach((btn) => {
      btn.onclick = () => {
        this.notificationPage = parseInt(btn.dataset.page);
        this.updateNotificationModal();
      };
    });

    document.getElementById("noti-prev").onclick = () => {
      if (this.notificationPage > 1) {
        this.notificationPage--;
        this.updateNotificationModal();
      }
    };
    document.getElementById("noti-next").onclick = () => {
      if (this.notificationPage < totalPages) {
        this.notificationPage++;
        this.updateNotificationModal();
      }
    };
  }

  createNotificationModal() {
    const modal = document.createElement("div");
    modal.id = "notificationModal";
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center hidden z-50";
    modal.innerHTML = `
    <div class="bg-white p-8 rounded-2xl w-[80%] max-w-4xl shadow-lg relative">
      <h2 class="text-2xl font-bold mb-4 text-blue-dark">Notificações</h2>
      <button class="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-xl" id="closeNotificationModal">&times;</button>
      <div class="overflow-x-auto max-h-96">
        <table class="table-auto w-full border-collapse">
          <thead>
            <tr class="bg-[#23424A] text-white">
              <th class="px-4 py-2 text-left">Ação</th>
              <th class="px-4 py-2 text-left">CFOP</th>
              <th class="px-4 py-2 text-left">Descrição</th>
              <th class="px-4 py-2 text-left">Repercute no Cálculo Demonstrativo?</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div id="notification-pagination" class="flex justify-center mt-4 gap-2"></div>
      <div class="mt-6 flex justify-between">
        <button id="voltarModal" class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Voltar</button>
        <button id="editarModal" class="bg-blue-dark hover:bg-blue-800 text-white px-4 py-2 rounded">Editar</button>
      </div>
    </div>
  `;

    document.getElementById("closeNotificationModal").onclick = () => {
      modal.classList.add("hidden");
    };
    document.getElementById("voltarModal").onclick = () => {
      modal.classList.add("hidden");
    };
    document.getElementById("editarModal").onclick = () => {
      alert("Função de edição ainda não implementada.");
    };

    document.body.appendChild(modal);
    document.getElementById("closeNotificationModal").onclick = () => {
      modal.classList.add("hidden");
    };
    return modal;
  }

  createDeleteModal() {
    const modal = document.createElement("div");
    modal.id = "deleteModal";
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center hidden z-50";
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md relative text-center">
        <h2 class="text-xl font-bold mb-4">Excluir</h2>
        <p class="text-gray-700 mb-6">Deseja remover esse lote e todas as suas notificações? Essa ação não pode ser desfeita.</p>
        <p class='font-bold mb-6'>N212202400001</p>
        <div class="flex justify-center gap-4">
          <button id="cancelDelete" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
          <button id="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Excluir</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("cancelDelete").onclick = () => {
      modal.classList.add("hidden");
    };
    document.getElementById("confirmDelete").onclick = () => {
      modal.classList.add("hidden");
    };
    return modal;
  }

  renderPagination() {
    const paginationContainer = document.getElementById("pagination-container");
    if (!paginationContainer) return;

    let paginationHTML = `
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
        <button class="px-3 py-1 border rounded ${
          this.currentPage === i
            ? "bg-blue-dark text-white"
            : "bg-white text-blue-dark"
        }" data-page="${i}">
          ${i}
        </button>
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
    `;

    paginationContainer.innerHTML = paginationHTML;

    paginationContainer.querySelectorAll("button[data-page]").forEach((btn) => {
      btn.onclick = () => {
        this.currentPage = parseInt(btn.dataset.page);
        this.renderTable();
        this.renderPagination();
      };
    });

    document.getElementById("prev-page").onclick = () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderTable();
        this.renderPagination();
      }
    };

    document.getElementById("next-page").onclick = () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.renderTable();
        this.renderPagination();
      }
    };
  }

  getMockData() {
    return [
      {
        token: "N12122024095738",
        cidade: "PORTO ESPERIDIAO",
        atividadeEconomica: "PECUÁRIA",
        usuario: "DESENVOLVEDOR",
        data: "12/12/2024",
        quantidade: 192,
        notificacoes: [
          {
            cfop: "5.101",
            descricao: "Venda de produção conforme o solicitado do cliente",
            repercute: "Sim",
          },
          { cfop: "5.102", descricao: "Venda terceiro", repercute: "Sim" },
          { cfop: "5.102", descricao: "Venda terceiro", repercute: "Sim" },
          { cfop: "5.102", descricao: "Venda terceiro", repercute: "Sim" },
          { cfop: "5.102", descricao: "Venda terceiro", repercute: "Sim" },
          { cfop: "5.103", descricao: "Venda de Proudutos", repercute: "Não" },
          { cfop: "5.104", descricao: "Venda terceiro", repercute: "Não" },
        ],
      },
      {
        token: "N12122024095738",
        cidade: "ACORIZAL",
        atividadeEconomica: "PECUÁRIA",
        usuario: "DESENVOLVEDORA",
        data: "15/12/2024",
        quantidade: 192,
        notificacoes: [
          { cfop: "5.101", descricao: "Venda de produção", repercute: "Sim" },
          { cfop: "5.101", descricao: "Venda de produção", repercute: "Sim" },
          { cfop: "5.101", descricao: "Venda de produção", repercute: "Sim" },
          { cfop: "5.102", descricao: "Venda terceiro", repercute: "Não" },
          { cfop: "5.102", descricao: "Venda terceiro", repercute: "Não" },
        ],
      },
      {
        token: "N12122024095738",
        cidade: "PORTO ESPERIDIAO",
        atividadeEconomica: "PECUÁRIA",
        usuario: "DESENVOLVEDOR",
        data: "12/12/2024",
        quantidade: 192,
        notificacoes: [
          { cfop: "5.102", descricao: "Venda de produção", repercute: "Sim" },
          { cfop: "5.104", descricao: "Venda terceiro", repercute: "Sim" },
          { cfop: "5.104", descricao: "Venda terceiro", repercute: "Sim" },
          { cfop: "5.104", descricao: "Venda terceiro", repercute: "Sim" },
          {
            cfop: "5.103",
            descricao: "Venda de Modelo de Apresentação Estruturado",
            repercute: "Não",
          },
        ],
      },
    ];
  }
}

// Instanciar globalmente
window.lotesPage = new LotesGeradosPage();
