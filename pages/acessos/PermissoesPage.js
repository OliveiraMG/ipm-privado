/**
 * PermissoesPage.js - Página de listagem de permissões
 */
import { Header } from '/components/layout/Header.js';
import { toast } from '/js/Utilities.js';
import RegisterPermissaoComponent from '/pages/acessos/register/RegisterPermissaoComponent.js';
import EditPermissaoComponent from '/pages/acessos/edit/EditPermissaoComponent.js';
import SearchPermissaoComponent from '/pages/acessos/search/SearchPermissaoComponent.js';
import PrintPermissaoComponent from '/pages/acessos/print/PrintPermissaoComponent.js';
import ModalComponent from '/components/common/ModalComponent.js';

class PermissoesPage {
  constructor() {
    this.tableData = [];
    this.originalTableData = []; // To store the original data for resetting after search
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.totalPages = 1;
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando PermissoesPage...");

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
          <div class="text-gray-500 text-base leading-tight">Acessos | Permissões</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Permissões</div>
        </div>
      `;
    }
  }

  renderContent() {
    const mainContent = document.querySelector('main');
    if (!mainContent) {
      console.error("Elemento main não encontrado!");
      return;
    }

    mainContent.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.25)] mx-24 my-20 p-12';

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-6';
    header.innerHTML = `
      <h2 class="text-2xl font-semibold text-blue-dark">Listagem</h2>
    `;
    card.appendChild(header);

    const tableContainer = document.createElement('div');
    tableContainer.id = 'permissoes-table';
    tableContainer.className = 'w-full px-2';
    card.appendChild(tableContainer);

    const paginationContainer = document.createElement('div');
    paginationContainer.id = 'pagination-container';
    paginationContainer.className = 'flex justify-center mt-4';
    card.appendChild(paginationContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex justify-center space-x-4 mt-6';
    buttonContainer.innerHTML = `
      <button id="print-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
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
    const printBtn = document.getElementById('print-btn');
    const registerBtn = document.getElementById('register-btn');
    const searchBtn = document.getElementById('search-btn');

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        this.openPrintModal();
      });
    }

    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        this.openRegisterModal();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.openSearchModal();
      });
    }
  }

  openRegisterModal() {
    const registerComponent = new RegisterPermissaoComponent({
      onSubmit: (data) => {
        const newPermissao = {
          id: Math.max(...this.tableData.map(d => d.id), 0) + 1,
          descricao: data.descricao,
          modulo: data.modulo
        };
        this.tableData.unshift(newPermissao);
        this.originalTableData.unshift(newPermissao);
        this.totalPages = Math.ceil(this.tableData.length / this.itemsPerPage);
        this.currentPage = 1; // Reset to first page
        this.renderTable();
        this.renderPagination();
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de permissões');
      }
    });

    this.modal = new ModalComponent({
      id: 'register-permissao-modal',
      title: 'Cadastrar Permissão',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: registerComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openEditModal(permissaoId) {
    const permissaoData = this.tableData.find(item => item.id === permissaoId);
    if (!permissaoData) {
      toast.error('Permissão não encontrada!');
      return;
    }

    const editComponent = new EditPermissaoComponent({
      permissaoData: permissaoData,
      onUpdate: (updatedData) => {
        this.updateData(updatedData);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de permissões');
      }
    });

    this.modal = new ModalComponent({
      id: 'edit-permissao-modal',
      title: 'Editar Permissão',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: editComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openSearchModal() {
    const searchComponent = new SearchPermissaoComponent({
      onSearch: (filters) => {
        this.filterTableData(filters);
        this.currentPage = 1; // Reset to first page
        this.totalPages = Math.ceil(this.tableData.length / this.itemsPerPage);
        this.renderTable();
        this.renderPagination();
        this.modal.close();
        toast.success('Pesquisa realizada com sucesso!');
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de permissões');
      }
    });

    this.modal = new ModalComponent({
      id: 'search-permissao-modal',
      title: 'Pesquisar',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: searchComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openPrintModal() {
    const printComponent = new PrintPermissaoComponent({
      onPrint: (filters) => {
        this.printTableData(filters);
        this.modal.close();
        toast.success('Impressão simulada com sucesso! Verifique o console.');
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de permissões');
      }
    });

    this.modal = new ModalComponent({
      id: 'print-permissao-modal',
      title: 'Imprimir',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: printComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  filterTableData(filters) {
    this.tableData = this.originalTableData.filter(permissao => {
      let matches = true;

      if (filters.descricao) {
        const searchTerm = filters.descricao.toLowerCase();
        matches = matches && (permissao.descricao && permissao.descricao.toLowerCase().includes(searchTerm));
      }

      return matches;
    });
  }

  printTableData(filters) {
    let dataToPrint = [...this.originalTableData];

    if (filters.descricao) {
      const searchTerm = filters.descricao.toLowerCase();
      dataToPrint = dataToPrint.filter(permissao =>
        permissao.descricao && permissao.descricao.toLowerCase().includes(searchTerm)
      );
    }

    console.log('Dados para impressão:', dataToPrint);
  }

  updateData(updatedData) {
    this.tableData = this.tableData.map(item =>
      item.id === updatedData.id ? { ...item, ...updatedData } : item
    );
    this.originalTableData = this.originalTableData.map(item =>
      item.id === updatedData.id ? { ...item, ...updatedData } : item
    );
    this.renderTable();
    this.renderPagination();
    toast.success('Permissão atualizada com sucesso!');
  }

  loadData() {
    console.log("Carregando dados...");
    setTimeout(() => {
      this.tableData = this.getMockData();
      this.originalTableData = [...this.tableData];
      this.totalPages = Math.ceil(this.tableData.length / this.itemsPerPage);
      console.log("Loaded tableData:", this.tableData);
      this.renderTable();
      this.renderPagination();
    }, 300);
  }

  renderTable() {
    const tableContainer = document.getElementById('permissoes-table');
    if (!tableContainer) {
      console.error("Container da tabela não encontrado!");
      return;
    }

    console.log('tableData before rendering:', this.tableData);

    if (!this.tableData || !this.tableData.length) {
      tableContainer.innerHTML = '<p class="text-center py-4">Nenhum dado disponível</p>';
      return;
    }

    try {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const paginatedData = this.tableData.slice(startIndex, endIndex);

      let tableHTML = `
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-blue-dark">
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 15%">AÇÕES</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">ID</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 50%">DESCRIÇÃO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 25%">MÓDULO</th>
            </tr>
          </thead>
          <tbody>
      `;

      paginatedData.forEach((row, index) => {
        const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        tableHTML += `
          <tr class="${rowClass}">
            <td class="text-center py-2 px-4">
              <div class="flex space-x-2 justify-center">
                <button class="edit-btn bg-blue-dark text-white text-xs rounded px-2 py-1 hover:bg-blue-medium" data-id="${row.id || ''}" style="display: inline-block !important;">
                  <i class="fa-solid fa-pencil-alt"></i>Editar
                </button>
              </div>
            </td>
            <td class="text-center py-2 px-4">${row.id}</td>
            <td class="text-left py-2 px-4">${row.descricao}</td>
            <td class="text-left py-2 px-4">${row.modulo}</td>
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
    const editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const permissaoId = parseInt(button.getAttribute('data-id'));
        this.openEditModal(permissaoId);
      });
    });
  }

  renderPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) {
      console.error("Container de paginação não encontrado!");
      return;
    }

    let paginationHTML = `
      <nav class="flex space-x-2">
        <button id="prev-page" class="px-3 py-1 border rounded ${this.currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-dark hover:bg-blue-light'}" ${this.currentPage === 1 ? 'disabled' : ''}>
          <
        </button>
    `;

    for (let i = 1; i <= this.totalPages; i++) {
      paginationHTML += `
        <button class="page-btn px-3 py-1 border rounded ${this.currentPage === i ? 'bg-blue-dark text-white' : 'bg-white text-blue-dark hover:bg-blue-light'}" data-page="${i}">
          ${i}
        </button>
      `;
    }

    paginationHTML += `
        <button id="next-page" class="px-3 py-1 border rounded ${this.currentPage === this.totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-dark hover:bg-blue-light'}" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
          >
        </button>
      </nav>
    `;

    paginationContainer.innerHTML = paginationHTML;

    this.setupPaginationEvents();
  }

  setupPaginationEvents() {
    const pageButtons = document.querySelectorAll('.page-btn');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    pageButtons.forEach(button => {
      button.addEventListener('click', () => {
        const page = parseInt(button.getAttribute('data-page'));
        this.currentPage = page;
        this.renderTable();
        this.renderPagination();
      });
    });

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderTable();
          this.renderPagination();
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.renderTable();
          this.renderPagination();
        }
      });
    }
  }

  getMockData() {
    return [
      { id: 115, descricao: 'VISUALIZAR REMESSAS', modulo: 'IMPORTAÇÃO' },
      { id: 102, descricao: 'REMOVER REMESSAS', modulo: 'IMPORTAÇÃO' },
      { id: 103, descricao: 'VISUALIZAR FILAS', modulo: 'IMPORTAÇÃO' },
      { id: 101, descricao: 'CADASTRAR PUBLICAÇÕES', modulo: 'IMPORTAÇÃO' },
      { id: 104, descricao: 'VISUALIZAR FILAS', modulo: 'IMPORTAÇÃO' },
      { id: 106, descricao: 'VISUALIZAR EXERCÍCIOS', modulo: 'IMPORTAÇÃO' },
      { id: 99, descricao: 'CADASTRAR REMESSAS', modulo: 'IMPORTAÇÃO' },
      { id: 98, descricao: 'EDITAR EXERCÍCIOS', modulo: 'IMPORTAÇÃO' },
      { id: 100, descricao: 'REMOVER PUBLICAÇÕES', modulo: 'IMPORTAÇÃO' },
      { id: 96, descricao: 'EDITAR REMESSAS', modulo: 'IMPORTAÇÃO' },
      { id: 97, descricao: 'CADASTRAR EXERCÍCIOS', modulo: 'IMPORTAÇÃO' },
      { id: 93, descricao: 'IMPORTAR', modulo: 'IMPORTAÇÃO' },
      { id: 94, descricao: 'REMOVER EXERCÍCIOS', modulo: 'IMPORTAÇÃO' }
    ];
  }

  static initialize() {
    return new PermissoesPage();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  PermissoesPage.initialize();
});

export default PermissoesPage;