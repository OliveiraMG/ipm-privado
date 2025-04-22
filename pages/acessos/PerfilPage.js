/**
 * PerfilPage.js - Página de listagem de perfis
 */
import { Header } from '/components/layout/Header.js';
import { toast } from '/js/Utilities.js';
import RegisterPerfilComponent from '/pages/acessos/register/RegisterPerfilComponent.js';
import EditPerfilComponent from '/pages/acessos/edit/EditPerfilComponent.js';
import SearchPerfilComponent from '/pages/acessos/search/SearchPerfilComponent.js';
import PrintPerfilComponent from '/pages/acessos/print/PrintPerfilComponent.js';
import SincronizarPermissoesPerfilComponent from '/pages/acessos/edit/SincronizarPermissoesPerfilComponent.js';
import ModalComponent from '/components/common/ModalComponent.js';

class PerfilPage {
  constructor() {
    this.tableData = [];
    this.originalTableData = []; // To store the original data for resetting after search
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando PerfilPage...");

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
          <div class="text-gray-500 text-base leading-tight">Acessos | Perfil</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Perfil</div>
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
    tableContainer.id = 'perfis-table';
    tableContainer.className = 'w-full px-2';
    card.appendChild(tableContainer);

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
        toast.info('Abrindo formulário de cadastro...');
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
    const registerComponent = new RegisterPerfilComponent({
      onSubmit: (data) => {
        const newPerfil = {
          id: Math.max(...this.tableData.map(d => d.id), 0) + 1,
          descricao: data.descricao
        };
        this.tableData.unshift(newPerfil);
        this.originalTableData.unshift(newPerfil); // Update original data as well
        this.renderTable();
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de perfis');
      }
    });

    this.modal = new ModalComponent({
      id: 'register-perfil-modal',
      title: 'Cadastrar Perfil',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: registerComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openEditModal(perfilId) {
    const perfilData = this.tableData.find(item => item.id === perfilId);
    if (!perfilData) {
      toast.error('Perfil não encontrado!');
      return;
    }

    const editComponent = new EditPerfilComponent({
      perfilData: perfilData,
      onUpdate: (updatedData) => {
        this.updateData(updatedData);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de perfis');
      },
      onSyncPermissions: () => {
        this.openSincronizarPermissoesModal(perfilId);
      }
    });

    this.modal = new ModalComponent({
      id: 'edit-perfil-modal',
      title: 'Editar Perfil',
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
    const searchComponent = new SearchPerfilComponent({
      onSearch: (filters) => {
        this.filterTableData(filters);
        this.modal.close();
        toast.success('Pesquisa realizada com sucesso!');
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de perfis');
      }
    });

    this.modal = new ModalComponent({
      id: 'search-perfil-modal',
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
    const printComponent = new PrintPerfilComponent({
      onPrint: (filters) => {
        this.printTableData(filters);
        this.modal.close();
        toast.success('Impressão simulada com sucesso! Verifique o console.');
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de perfis');
      }
    });

    this.modal = new ModalComponent({
      id: 'print-perfil-modal',
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

  openSincronizarPermissoesModal(perfilId) {
    const perfilData = this.tableData.find(item => item.id === perfilId);
    if (!perfilData) {
      toast.error('Perfil não encontrado!');
      return;
    }

    const sincronizarPermissoesComponent = new SincronizarPermissoesPerfilComponent({
      perfilName: perfilData.descricao,
      onSync: (data) => {
        console.log(`Permissões sincronizadas para ${perfilData.descricao}:`, data.permissions);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de perfis');
      }
    });

    this.modal = new ModalComponent({
      id: 'sincronizar-permissoes-modal',
      title: 'Sincronizar Permissões',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: sincronizarPermissoesComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  filterTableData(filters) {
    this.tableData = this.originalTableData.filter(perfil => {
      let matches = true;

      if (filters.descricao) {
        const searchTerm = filters.descricao.toLowerCase();
        matches = matches && (perfil.descricao && perfil.descricao.toLowerCase().includes(searchTerm));
      }

      return matches;
    });

    this.renderTable();
  }

  printTableData(filters) {
    let dataToPrint = [...this.originalTableData];

    if (filters.descricao) {
      const searchTerm = filters.descricao.toLowerCase();
      dataToPrint = dataToPrint.filter(perfil =>
        perfil.descricao && perfil.descricao.toLowerCase().includes(searchTerm)
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
    toast.success('Perfil atualizado com sucesso!');
  }

  loadData() {
    console.log("Carregando dados...");
    setTimeout(() => {
      this.tableData = this.getMockData();
      this.originalTableData = [...this.tableData]; // Store a copy of the original data
      console.log("Loaded tableData:", this.tableData);
      this.renderTable();
    }, 300);
  }

  renderTable() {
    const tableContainer = document.getElementById('perfis-table');
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
      let tableHTML = `
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-blue-dark">
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 20%">AÇÕES</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 80%">DESCRIÇÃO</th>
            </tr>
          </thead>
          <tbody>
      `;

      this.tableData.forEach((row, index) => {
        const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        tableHTML += `
          <tr class="${rowClass}">
            <td class="text-center py-2 px-4">
              <div class="flex space-x-2 justify-center">
                <button class="edit-btn bg-blue-dark text-white text-xs rounded px-2 py-1 hover:bg-blue-medium" data-id="${row.id || ''}" style="display: inline-block !important;">
                  <i class="fa-solid fa-pencil-alt"></i>
                  Editar
                </button>
                <button class="permissions-btn bg-blue-dark text-white text-xs rounded px-2 py-1 hover:bg-blue-medium" data-id="${row.id || ''}" style="display: inline-block !important;">
                  <i class="fa-solid fa-search"></i>
                  Permissões
                </button>
              </div>
            </td>
            <td class="text-left py-2 px-4">${row.descricao}</td>
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
    const permissionsButtons = document.querySelectorAll('.permissions-btn');

    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const perfilId = parseInt(button.getAttribute('data-id'));
        toast.info('Abrindo formulário de edição...');
        this.openEditModal(perfilId);
      });
    });

    permissionsButtons.forEach(button => {
      button.addEventListener('click', () => {
        const perfilId = parseInt(button.getAttribute('data-id'));
        this.openSincronizarPermissoesModal(perfilId);
      });
    });
  }

  getMockData() {
    return [
      {
        id: 1,
        descricao: 'Contribuinte'
      },
      {
        id: 2,
        descricao: 'Prefeitura'
      },
      {
        id: 3,
        descricao: 'Contabilista'
      },
      {
        id: 4,
        descricao: 'Administrador'
      },
      {
        id: 5,
        descricao: 'Desenvolvedor'
      }
    ];
  }

  static initialize() {
    return new PerfilPage();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  PerfilPage.initialize();
});

export default PerfilPage;