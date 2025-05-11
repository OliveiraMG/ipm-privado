/**
 * VaRecBrutaPage.js - Página de VA, Receita Bruta, População e Área
 */
import ModalComponent from "../../../components/common/ModalComponent.js";
import { Header } from "../../../components/layout/Header.js";

class VaRecBrutaPage {
  constructor() {
    this.tableData = [];
    this.modal = null;
    this.currentPage = 1;
    this.itemsPerPage = 13;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando VaRecBrutaPage...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.loadData();
    this.renderContent();
    this.modal = this.createMunicipioModal();
    this.deleteModal = this.createDeleteModal();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Gerenciar | Estatisticas | VA, Rec. Bruta, População e Área</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">VA, Rec. Bruta, População e Área</div>
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

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "button-container";
    buttonContainer.className =
      "flex flex-wrap items-center justify-center mt-4 gap-4 md:gap-5";
    card.appendChild(buttonContainer);

    mainContent.appendChild(card);

    this.renderTable();
    this.renderButtons();
    this.renderPagination();
  }

  renderTable() {
    const container = document.getElementById("table-container");
    if (!container) return;

    const data = this.getPaginatedData();

    const tableHTML = `
    <table class="w-full table-auto border-collapse">
      <thead class="bg-[#23424A] text-white ">
        <tr>
          <th class="px-4 py-2 text-left">Apuração</th>
          <th class="px-4 py-2 text-left">Município</th>
          <th class="px-4 py-2 text-left">VR Adic. Anterior</th>
          <th class="px-4 py-2 text-left">VR Adic. Atual</th>
          <th class="px-4 py-2 text-left">Receita Bruta</th>
          <th class="px-4 py-2 text-left">População</th>
          <th class="px-4 py-2 text-left">Área</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (item) => `
            <tr class="border-b hover:bg-gray-50">
              <td class="px-4 py-2 border-2">${item.apuracao}</td>
              <td class="px-4 py-2 border-2">${item.municipio}</td>
              <td class="px-4 py-2 border-2">${item.vrAdicAnterior}</td>
              <td class="px-4 py-2 border-2">${item.vrAdicAtual}</td>
              <td class="px-4 py-2 border-2">${item.receuta}</td>
              <td class="px-4 py-2 border-2">${item.populacao}</td>
              <td class="px-4 py-2 border-2">${item.area}</td>
            </tr>
          `
          )
          .join("")}
      </tbody>
    </table>
    
  `;

    container.innerHTML = tableHTML;
  }

  renderButtons() {
    const container = document.getElementById("button-container");
    if (!container) return;

    const buttonsHTML = `
      <button class="btn-primary hover:opacity-60 transition-all duration-300 ease-in-out text-white px-4 py-2 rounded flex justify-center items-center gap-2 md:gap-3 text-sm md:text-base" id="imprimir-btn">
        Imprimir
        <i class="fa-solid fa-print"></i>
      </button>
      <button class="btn-primary hover:opacity-60 transition-all duration-300 ease-in-out text-white px-4 py-2 rounded flex justify-center items-center gap-2 md:gap-3 text-sm md:text-base" id="importados-btn">
        Importados
        <i class="fa-solid fa-cloud-arrow-up"></i>
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
    document
      .getElementById("importados-btn")
      .addEventListener("click", () => this.openImportadosModal());
  }

  renderPagination() {
    const paginationContainer = document.getElementById("pagination-container");
    if (!paginationContainer) {
      console.error("Container de paginação não encontrado!");
      return;
    }

    let paginationHTML = `
      <nav class="flex space-x-2">
        <button id="prev-page" class="px-3 py-1 border rounded ${
          this.currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white text-blue-dark hover:bg-blue-light"
        }" ${this.currentPage === 1 ? "disabled" : ""}>
          <
        </button>
    `;

    for (let i = 1; i <= this.totalPages; i++) {
      paginationHTML += `
        <button class="page-btn px-3 py-1 border rounded ${
          this.currentPage === i
            ? "bg-blue-dark text-white"
            : "bg-white text-blue-dark hover:bg-blue-light"
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
          >
        </button>
      </nav>
    `;

    paginationContainer.innerHTML = paginationHTML;

    this.setupPaginationEvents();
  }

  setupPaginationEvents() {
    const pageButtons = document.querySelectorAll(".page-btn");
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    pageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const page = parseInt(button.getAttribute("data-page"));
        this.currentPage = page;
        this.renderTable();
        this.renderPagination();
      });
    });

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderTable();
          this.renderPagination();
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.renderTable();
          this.renderPagination();
        }
      });
    }
  }
  createMunicipioModal() {
    const modalContent = document.createElement("div");
    modalContent.className = "overflow-x-auto max-h-96";
    modalContent.innerHTML = `
        <table class="table-auto w-full border-collapse">
          <thead>
            <tr class="bg-[#23424A] text-white">
              <th class="px-4 py-2 text-left">Ação</th>
              <th class="px-4 py-2 text-left">CFOP</th>
              <th class="px-4 py-2 text-left">Descrição</th>
              <th class="px-4 py-2 text-left">Repercute no Cálculo?</th>
            </tr>
          </thead>
          <tbody>
            ${(this.tableData.notificacoes || [])
              .map(
                (item) => `
                <tr class="bg-white border-t">
                  <td class="px-4 py-2 flex gap-2">
                    <button class="flex items-center gap-1 bg-[#3C7A89] hover:bg-[#336674] text-white px-3 py-1 rounded">
                      Apagar <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                  <td class="px-4 py-2">${item.cfop}</td>
                  <td class="px-4 py-2">${item.descricao}</td>
                  <td class="px-4 py-2">${item.repercute}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      `;

    this.municipioModalComponent = new ModalComponent({
      id: "MunicipioModal",
      title: "Notificações",
      content: modalContent,
      onClose: () => (this.municipioModalComponent = null),
    });

    const modalElement = document.getElementById("MunicipioModal");
    if (!modalElement) {
      document.body.appendChild(this.municipioModalComponent.modalElement);
    }
    return this.municipioModalComponent;
  }

  openSearchModal() {
    const modalContent = document.createElement("div");
    modalContent.className = "text-gray-700 text-base space-y-6";

    modalContent.innerHTML = `
      <div class="grid grid-cols-2 gap-4">
        <select id="filter-type-select-1" class="w-full border border-gray-300 rounded-lg h-12 px-3">
          <option disabled selected>Selecione</option>
          <option value="situacao">Situação</option>
          <option value="atividade">Atividade Econômica</option>
          <option value="contador">Contabilista</option>
          <option value="contribuinte">Contribuinte</option>
        </select>
        <select id="filter-exercicio-select-1" class="w-full border border-gray-300 rounded-lg h-12 px-3">
          <option disabled selected>Exercícios</option>
          <option>Exercício 1</option>
          <option>Exercício 2</option>
          <option>Exercício 3</option>
        </select>
      </div>
      <div class="flex justify-end gap-4 mt-6">
        <button type="button" id="back-filter" class="btn-secondary px-6 py-2 border rounded-lg text-gray-700">Voltar</button>
        <button type="button" id="clear-filter" class="btn-secondary px-6 py-2 border rounded-lg text-gray-700">Limpar Filtro</button>
        <button type="button" id="apply-filter-btn" class="btn-primary px-6 py-2 text-white rounded-lg">
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

  openImportadosModal() {
    const data = this.getMockImportadosData();

    const tableRows = data
      .map(
        (item, index) => `
          <tr class="border-b hover:bg-gray-100 border">
            <td class="px-4 py-2 border text-sm whitespace-nowrap">
              <div class="flex gap-2">
                <button
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1 delete-importado-btn"
                  data-index="${index}"
                >
                  <i class="fas fa-trash-alt"></i> Apagar
                </button>
                <button
                  class="btn-primary hover:opacity-60 transition-all duration-300 ease-in-out text-white px-3 py-1 rounded flex items-center gap-1 print-importado-btn"
                  data-index="${index}"
                >
                  <i class="fas fa-print"></i> Imprimir
                </button>
              </div>
            </td>
            <td class="px-4 py-2 border text-sm font-medium whitespace-nowrap">
              ${item.protocologo}
            </td>
            <td class="px-4 py-2 border text-sm">${item.anoBase}</td>
            <td class="px-4 py-2 border text-sm">${item.anoApuracao}</td>
            <td class="px-4 py-2 border text-sm">${item.sigla}</td>
            <td class="px-4 py-2 border text-sm">${item.usuario}</td>
            <td class="px-4 py-2 border text-sm">${item.tipo}</td>
            <td class="px-4 py-2 border text-sm">${item.inclusao}</td>
            <td class="px-4 py-2 border text-sm">${item.arquivo}</td>
          </tr>
        `
      )
      .join("");

    const modalContent = document.createElement("div");
    modalContent.className = "text-gray-700 text-base space-y-6";

    modalContent.innerHTML = `
      <div class="overflow-x-auto" style="max-height: calc(100vh - 150px);">
        <table class="w-full table-auto border-collapse">
          <thead class="bg-[#23424A] text-white sticky top-0">
            <tr>
              <th class="px-4 py-2 text-left">Ações</th>
              <th class="px-4 py-2 text-left">Protocolo</th>
              <th class="px-4 py-2 text-left">Ano Base</th>
              <th class="px-4 py-2 text-left">Ano Apuração</th>
              <th class="px-4 py-2 text-left">Sigla</th>
              <th class="px-4 py-2 text-left">Usuário</th>
              <th class="px-4 py-2 text-left">Tipo</th>
              <th class="px-4 py-2 text-left">Inclusão</th>
              <th class="px-4 py-2 text-left">Arquivo</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>

      <div class="flex justify-end gap-4 pt-4">
        <button type="button" id="back-importados" class="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Voltar
        </button>
      </div>
    `;

    this.modal = new ModalComponent({
      id: "importados-modal",
      title: "Importados",
      content: modalContent,
      onClose: () => (this.modal = null),
    });

    this.modal.open();

    setTimeout(() => {
      const backBtn = document.getElementById("back-importados");
      if (backBtn) {
        backBtn.addEventListener("click", () => this.closeModal());
      }

      const deleteButtons = document.querySelectorAll(".delete-importado-btn");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          const index = event.target.dataset.index;
          const item = data[index];
          this.openDeleteImportadoModal(item, index, data);
        });
      });

      const printButtons = document.querySelectorAll(".print-importado-btn");
      printButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          const index = event.target.dataset.index;
          const item = data[index];
          this.openPrintImportadoModal(item);
        });
      });
    }, 0);
  }

  openDeleteImportadoModal(item, index, data) {
    const modalContent = document.createElement("div");
    modalContent.className = "text-gray-700 text-base space-y-6 text-center";
    modalContent.innerHTML = `
        <h2 class="text-xl font-bold mb-4">Excluir</h2>
        <p class="text-gray-700 mb-6">Deseja realmente apagar o item de protocolo ${item.protocologo}?</p>
        <div class="flex justify-center gap-4">
          <button id="cancel-delete-importado" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
          <button id="confirm-delete-importado" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Excluir</button>
        </div>
      `;

    this.modal = new ModalComponent({
      id: "delete-importado-modal",
      title: "Excluir",
      content: modalContent,
      onClose: () => (this.modal = null),
    });
    this.modal.open();

    setTimeout(() => {
      const cancelBtn = document.getElementById("cancel-delete-importado");
      const confirmBtn = document.getElementById("confirm-delete-importado");

      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          this.closeModal();
        });
      }

      if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
          data.splice(index, 1);
          this.closeModal();
        });
      }
    }, 0);
  }

  openPrintImportadoModal(item) {
    const printContent = `
        <div>
          <h2>Protocolo: ${item.protocologo}</h2>
          <p>Ano Base: ${item.anoBase}</p>
          <p>Ano Apuração: ${item.anoApuracao}</p>
          <p>Sigla: ${item.sigla}</p>
          <p>Usuário: ${item.usuario}</p>
          <p>Tipo: ${item.tipo}</p>
          <p>Inclusão: ${item.inclusao}</p>
          <p>Arquivo: ${item.arquivo}</p>
        </div>
      `;

    const modalContent = document.createElement("div");
    modalContent.className = "text-gray-700 text-base space-y-6";
    modalContent.innerHTML = printContent;

    this.printModalComponent = new ModalComponent({
      id: "print-modal",
      title: "Imprimir",
      content: modalContent,
      showCloseButton: false,
    });
    this.printModalComponent.open();

    setTimeout(() => {
      const printWindow = document.getElementById("print-modal");

      if (printWindow) {
        const style = document.createElement("style");
        style.innerHTML = `
          @media print {
            body * {
              visibility: hidden;
            }
            #print-modal * {
              visibility: visible;
              display: block;
            }
            #print-modal {
              position: absolute;
              left: 0;
              top: 0;
            }
          }
        `;
        document.head.appendChild(style);
        window.print();
        document.body.removeChild(printWindow);
        this.printModalComponent = null;
      } else {
        console.error(
          "Não foi possível encontrar o elemento do modal de impressão."
        );
      }
    }, 1000);
  }

  openImprimirModal() {
    const modalContent = document.createElement("div");
    modalContent.className = "text-gray-700 text-base space-y-6";

    modalContent.innerHTML = `<div class="grid grid-cols-2 gap-4">
        <select id="city-select" class="w-full border border-gray-300 rounded-lg h-12 px-3">
          <option disabled selected>Cidade</option>
          <option>Cidade A</option>
          <option>Cidade B</option>
          <option>Cidade C</option>
        </select>
        <select id="exercicio-select" class="w-full border border-gray-300 rounded-lg h-12 px-3">
          <option disabled selected>Exercício</option>
          <option>Exercício 1</option>
          <option>Exercício 2</option>
          <option>Exercício 3</option>
        </select>
      </div>
      <div class="flex justify-end gap-4 mt-6">
        <button type="button" id="back-filter-print" class="btn-secondary px-6 py-2 border rounded-lg text-gray-700">Voltar</button>
        <button type="button" id="clear-filter-print" class="btn-secondary px-6 py-2 border rounded-lg text-gray-700">Limpar Filtro</button>
        <button type="button" id="apply-filter-imprimir-btn" class="btn-primary px-6 py-2 text-white rounded-lg">
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

  applyFilter() {
    // Implementar lógica de filtro
  }

  closeModal() {
    if (this.modal && typeof this.modal.close === "function") {
      this.modal.close();
    }
  }

  createDeleteModal() {
    const modalContent = document.createElement("div");
    modalContent.className = "text-gray-700 text-base space-y-6 text-center";
    modalContent.innerHTML = `
        <h2 class="text-xl font-bold mb-4">Excluir</h2>
        <p class="text-gray-700 mb-6">Deseja remover esse lote e todas as suas notificações? Essa ação não pode ser desfeita.</p>
        <p class='font-bold mb-6'>N212202400001</p>
        <div class="flex justify-center gap-4">
          <button id="cancelDelete" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
          <button id="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Excluir</button>
        </div>
      `;

    this.deleteModalComponent = new ModalComponent({
      id: "deleteModal",
      title: "Excluir",
      content: modalContent,
      onClose: () => (this.deleteModalComponent = null),
    });

    const modalElement = document.getElementById("deleteModal");
    if (!modalElement) {
      document.body.appendChild(this.deleteModalComponent.modalElement);
    }
    return this.deleteModalComponent;
  }

  getMockImportadosData() {
    return [
      {
        protocologo: "N212202400001",
        anoBase: "2017",
        anoApuracao: "2014",
        sigla: "II-ACYPR540",
        usuario: "Desenvolvedor",
        tipo: "Definitivo",
        inclusao: "15/10/2024 09:03",
        arquivo: "540 definitivo 2013.xlsx",
      },
      {
        protocologo: "N212202400002",
        anoBase: "2018",
        anoApuracao: "2015",
        sigla: "II-BXYPR541",
        usuario: "Desenvolvedor2",
        tipo: "Provisório",
        inclusao: "16/10/2024 10:03",
        arquivo: "541 provisorio 2014.xlsx",
      },
      {
        protocologo: "N212202400003",
        anoBase: "2019",
        anoApuracao: "2016",
        sigla: "II-CZYPR542",
        usuario: "Desenvolvedor3",
        tipo: "Definitivo",
        inclusao: "17/10/2024 11:03",
        arquivo: "542 definitivo 2015.xlsx",
      },
      {
        protocologo: "N212202400004",
        anoBase: "2020",
        anoApuracao: "2017",
        sigla: "II-DZYPR543",
        usuario: "Desenvolvedor4",
        tipo: "Provisório",
        inclusao: "18/10/2024 12:03",
        arquivo: "543 provisorio 2016.xlsx",
      },
      {
        protocologo: "N212202400005",
        anoBase: "2021",
        anoApuracao: "2018",
        sigla: "II-EZYPR544",
        usuario: "Desenvolvedor5",
        tipo: "Definitivo",
        inclusao: "19/10/2024 13:03",
        arquivo: "544 definitivo 2017.xlsx",
      },
    ];
  }

  getMockData() {
    const municipios = [
      "CUIABÁ",
      "VÁRZEA GRANDE",
      "RONDONÓPOLIS",
      "SINOP",
      "TANGARÁ DA SERRA",
      "BARRA DO GARÇAS",
      "CÁCERES",
      "PRIMAVERA DO LESTE",
      "LUCAS DO RIO VERDE",
      "SAPEZAL",
      "PORTO ESPERIDIÃO",
    ];

    const items = [];
    for (let i = 1; i <= 42; i++) {
      const vrAdicAnterior = parseFloat((Math.random() * 5).toFixed(2));
      const vrAdicAtual = parseFloat(
        (vrAdicAnterior + Math.random() * 2 - 1).toFixed(2)
      );
      const area = parseFloat((Math.random() * 5).toFixed(2));

      items.push({
        apuracao: `2024`,
        municipio: municipios[i % municipios.length],
        vrAdicAnterior,
        vrAdicAtual,
        receita: ((vrAdicAtual - vrAdicAnterior) / vrAdicAnterior).toFixed(4),
        populacao: ((vrAdicAtual - vrAdicAnterior) / vrAdicAnterior).toFixed(2),
        area: area,
      });
    }

    return items;
  }

  static initialize() {
    return new VaRecBrutaPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  VaRecBrutaPage.initialize();
});

export default VaRecBrutaPage;
