/**
 * PublicacoesPage.js - Página de listagem de publicações
 */
import { Header } from "../../components/layout/Header.js";
import { toast } from "../../js/Utilities.js";
import RegisterPublicacaoComponent from "../../pages/imports/register/RegisterPublicacaoComponent.js";
import EditPublicacaoComponent from "../../pages/imports/edit/EditPublicacaoComponent.js";
import DeletePublicacaoComponent from "../../pages/imports/edit/DeletePublicacaoComponent.js";
import SearchPublicacaoComponent from "../../pages/imports/search/SearchPublicacaoComponent.js";
import PrintPublicacaoComponent from "../../pages/imports/print/PrintPublicacaoComponent.js";
import ModalComponent from "../../components/common/ModalComponent.js";

class PublicacoesPage {
  constructor() {
    this.tableData = [];
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando PublicacoesPage...");

    Header.initialize();

    this.setupBreadcrumbs();

    this.renderContent();

    this.loadData();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Importação | Publicações</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Publicações</div>
        </div>
      `;
    }
  }

  renderContent() {
    const mainContent = document.querySelector("main");
    if (!mainContent) {
      console.error("Elemento main não encontrado!");
      return;
    }

    mainContent.innerHTML = "";

    const card = document.createElement("div");
    card.className =
      "bg-white rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.25)] mx-24 my-20 p-12";

    const header = document.createElement("div");
    header.className = "flex justify-between items-center mb-6";
    header.innerHTML = `
      <h2 class="text-2xl font-semibold text-blue-dark">Listagem</h2>
    `;
    card.appendChild(header);

    const tableContainer = document.createElement("div");
    tableContainer.id = "publicacoes-table";
    tableContainer.className = "w-full px-2";
    card.appendChild(tableContainer);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "flex justify-center space-x-4 mt-6";
    buttonContainer.innerHTML = `
      <button id="print-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100">
        <i class="fa-solid fa-print mr-2"></i>Imprimir
      </button>
      <button id="register-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
        <i class="fa-solid fa-plus mr-2"></i>Cadastrar
      </button>
      <button id="search-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
        <i class="fa-solid fa-search mr-2"></i>Pesquisar
      </button>
    `;
    card.appendChild(buttonContainer);

    mainContent.appendChild(card);

    this.setupButtonEvents();

    this.renderTable();
  }

  setupButtonEvents() {
    const registerBtn = document.getElementById("register-btn");
    const searchBtn = document.getElementById("search-btn");
    const printBtn = document.getElementById("print-btn");

    if (registerBtn) {
      registerBtn.addEventListener("click", () => {
        this.openRegisterModal();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        this.openSearchModal();
      });
    }

    if (printBtn) {
      printBtn.addEventListener("click", () => {
        this.openPrintModal();
      });
    }
  }

  openRegisterModal() {
    const registerComponent = new RegisterPublicacaoComponent({
      onSubmit: (data) => {
        const newPublicacao = {
          id: Math.max(...this.tableData.map((d) => d.id), 0) + 1,
          descricao: data.descricao,
          sigla: data.sigla,
        };
        this.tableData.unshift(newPublicacao);
        this.renderTable();
        this.modal.close();
        toast.success("Publicação cadastrada com sucesso!");
      },
      onBack: () => {
        this.modal.close();
        toast.info("Retornado à lista de publicações");
      },
    });

    this.modal = new ModalComponent({
      id: "register-publicacao-modal",
      title: "Cadastrar Publicações",
      titleClass: "text-blue-dark font-semibold text-xl",
      content: registerComponent.element,
      contentClass: "p-0",
      onClose: () => {
        this.modal = null;
      },
    });
    this.modal.open();
  }

  openEditModal(publicacaoId) {
    const publicacaoData = this.tableData.find(
      (item) => item.id === publicacaoId
    );
    if (!publicacaoData) {
      toast.error("Publicação não encontrada!");
      return;
    }

    const editComponent = new EditPublicacaoComponent({
      publicacaoData: publicacaoData,
      onUpdate: (updatedData) => {
        this.updateData(updatedData);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info("Retornado à lista de publicações");
      },
    });

    this.modal = new ModalComponent({
      id: "edit-publicacao-modal",
      title: "Editar Publicações",
      titleClass: "text-blue-dark font-semibold text-xl",
      content: editComponent.element,
      contentClass: "p-0",
      onClose: () => {
        this.modal = null;
      },
    });
    this.modal.open();
  }

  openDeleteModal(publicacaoId) {
    const publicacaoData = this.tableData.find(
      (item) => item.id === publicacaoId
    );
    if (!publicacaoData) {
      toast.error("Publicação não encontrada!");
      return;
    }

    const deleteComponent = new DeletePublicacaoComponent({
      publicacaoData: publicacaoData,
      onDelete: () => {
        this.deleteData(publicacaoId);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info("Retornado à lista de publicações");
      },
    });

    this.modal = new ModalComponent({
      id: "delete-publicacao-modal",
      title: "Remover",
      titleClass: "text-blue-dark font-semibold text-xl",
      content: deleteComponent.element,
      contentClass: "p-0",
      onClose: () => {
        this.modal = null;
      },
    });
    this.modal.open();
  }

  openSearchModal() {
    const searchComponent = new SearchPublicacaoComponent({
      onSearch: (filters) => {
        this.applyFilters(filters);
        this.modal.close();
      },
      onClear: () => {
        this.loadData();
        this.modal.close();
        toast.info("Filtros limpos");
      },
      onBack: () => {
        this.modal.close();
        toast.info("Retornado à lista de publicações");
      },
    });

    this.modal = new ModalComponent({
      id: "search-publicacao-modal",
      title: "Pesquisar",
      titleClass: "text-blue-dark font-semibold text-xl",
      content: searchComponent.element,
      contentClass: "p-0",
      onClose: () => {
        this.modal = null;
      },
    });
    this.modal.open();
  }

  openPrintModal() {
    const printComponent = new PrintPublicacaoComponent({
      onPrint: (filters) => {
        this.handlePrint(filters);
        this.modal.close();
      },
      onClear: () => {
        toast.info("Filtros de impressão limpos");
      },
      onBack: () => {
        this.modal.close();
        toast.info("Retornado à lista de publicações");
      },
    });

    this.modal = new ModalComponent({
      id: "print-publicacao-modal",
      title: "Imprimir",
      titleClass: "text-blue-dark font-semibold text-xl",
      content: printComponent.element,
      contentClass: "p-0",
      onClose: () => {
        this.modal = null;
      },
    });
    this.modal.open();
  }

  applyFilters(filters) {
    const originalData = this.getMockData();
    this.tableData = originalData.filter((item) => {
      const matchesDescricao = filters.descricao
        ? item.descricao.toLowerCase().includes(filters.descricao.toLowerCase())
        : true;
      return matchesDescricao;
    });
    this.renderTable();
    toast.success("Filtros aplicados com sucesso!");
  }

  handlePrint(filters) {
    const filteredData = this.tableData.filter((item) => {
      const matchesDescricao = filters.descricao
        ? item.descricao.toLowerCase().includes(filters.descricao.toLowerCase())
        : true;
      return matchesDescricao;
    });

    if (filteredData.length === 0) {
      toast.error("Nenhum dado para imprimir com os filtros aplicados!");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Publicações</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #003087; color: white; }
          </style>
        </head>
        <body>
          <h2>Lista de Publicações</h2>
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Sigla</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData
                .map(
                  (item) => `
                <tr>
                  <td>${item.descricao}</td>
                  <td>${item.sigla}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  updateData(updatedData) {
    this.tableData = this.tableData.map((item) =>
      item.id === updatedData.id ? { ...item, ...updatedData } : item
    );
    this.renderTable();
    toast.success("Publicação atualizada com sucesso!");
  }

  deleteData(publicacaoId) {
    this.tableData = this.tableData.filter((item) => item.id !== publicacaoId);
    this.renderTable();
    toast.success("Publicação excluída com sucesso!");
  }

  loadData() {
    console.log("Carregando dados...");
    setTimeout(() => {
      this.tableData = this.getMockData();
      console.log("Loaded tableData:", this.tableData);
      this.renderTable();
    }, 300);
  }

  renderTable() {
    const tableContainer = document.getElementById("publicacoes-table");
    if (!tableContainer) {
      console.error("Container da tabela não encontrado!");
      return;
    }

    console.log("tableData before rendering:", this.tableData);

    if (!this.tableData || !this.tableData.length) {
      tableContainer.innerHTML =
        '<p class="text-center py-4">Nenhum dado disponível</p>';
      return;
    }

    try {
      let tableHTML = `
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-blue-dark">
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 15%">AÇÕES</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 70%">DESCRIÇÃO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 15%">SIGLA</th>
            </tr>
          </thead>
          <tbody>
      `;

      this.tableData.forEach((row, index) => {
        const rowClass = index % 2 === 0 ? "bg-white" : "bg-gray-50";
        tableHTML += `
          <tr class="${rowClass}">
            <td class="text-center py-2 px-4">
              <div class="flex space-x-2 justify-center">
                <button class="edit-btn bg-blue-dark text-white text-xs rounded px-2 py-1 hover:bg-blue-medium" data-id="${
                  row.id || ""
                }" style="display: inline-block !important;">
                  <i class="fa-solid fa-pencil-alt"></i>Editar
                </button>
                <button class="delete-btn bg-red-600 text-white text-xs rounded px-2 py-1 hover:bg-red-700" data-id="${
                  row.id || ""
                }" style="display: inline-block !important;">
                  <i class="fa-solid fa-trash"></i>Excluir
                </button>
              </div>
            </td>
            <td class="text-left py-2 px-4">${row.descricao}</td>
            <td class="text-left py-2 px-4">${row.sigla}</td>
          </tr>
        `;
      });

      tableHTML += `
          </tbody>
        </table>
      `;

      tableContainer.innerHTML = tableHTML;

      this.setupTableButtonEvents();
    } catch (error) {
      console.error("Erro ao renderizar tabela:", error);
      tableContainer.innerHTML = `<p class="text-center text-red-500 py-4">Erro ao renderizar tabela: ${error.message}</p>`;
    }
  }

  setupTableButtonEvents() {
    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");

    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const publicacaoId = parseInt(button.getAttribute("data-id"));
        this.openEditModal(publicacaoId);
      });
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const publicacaoId = parseInt(button.getAttribute("data-id"));
        this.openDeleteModal(publicacaoId);
      });
    });
  }

  getMockData() {
    return [
      {
        id: 1,
        descricao:
          "NFE-Eletrônica: Relatório de Notas Fiscais de entrada eletrônicas",
        sigla: "ACGPT109",
      },
      {
        id: 2,
        descricao:
          "NFE-EFD: Relatório de Notas Fiscais de entrada eletrônicas EFD",
        sigla: "ACGPT415",
      },
      { id: 3, descricao: "EFD - OMISSO", sigla: "ACGPT420" },
      { id: 4, descricao: "EFD - SEM MOVIMENTO", sigla: "ACGPT425" },
      {
        id: 5,
        descricao: "EFD-ESCRITURAÇÃO FISCAL DIGITAL – registros por CFOPs",
        sigla: "ACGPT430",
      },
      {
        id: 6,
        descricao: "Notas de Produtor e Avulsa (NFPA) – eletrônicas",
        sigla: "ACGPR812",
      },
      {
        id: 7,
        descricao: "Receitas dos contribuintes Simples Nacional",
        sigla: "PGDAS",
      },
      {
        id: 8,
        descricao: "Valores adicionados por contribuinte (positivos)",
        sigla: "DHRPR555",
      },
      {
        id: 9,
        descricao: "Valores adicionados por contribuinte (negativos e nulos)",
        sigla: "DHRPR557",
      },
      {
        id: 10,
        descricao: "Catálogo de contribuintes (CAP)",
        sigla: "ACDPR535 ou ACDPR552",
      },
      {
        id: 11,
        descricao: "Catálogo de contribuintes (CCI)",
        sigla: "ACEPR572",
      },
      { id: 12, descricao: "IEs Simples Nacional", sigla: "MEI" },
      {
        id: 13,
        descricao: "GIA-ICMS Sem movimento (entradas e saídas zeradas)",
        sigla: "DHRPR098",
      },
      { id: 14, descricao: "GIA-ICMS Omissos", sigla: "DHRPR278" },
      {
        id: 15,
        descricao: "GIA-ICMS – Registros por CFOPs (entradas e saídas)",
        sigla: "DHRPR296",
      },
    ];
  }

  static initialize() {
    return new PublicacoesPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  PublicacoesPage.initialize();
});

export default PublicacoesPage;
