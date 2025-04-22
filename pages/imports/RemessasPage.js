/**
 * RemessasPage.js - Página de listagem de remessas
 */
import { Header } from '/components/layout/Header.js';
import { toast } from '/js/Utilities.js';
import RegisterRemessaComponent from '/pages/imports/register/RegisterRemessaComponent.js';
import EditRemessaComponent from '/pages/imports/edit/EditRemessaComponent.js';
import DeleteRemessaComponent from '/pages/imports/edit/DeleteRemessaComponent.js';
import ModalComponent from '/components/common/ModalComponent.js';

class RemessasPage {
  constructor() {
    this.tableData = [];
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando RemessasPage...");

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
          <div class="text-gray-500 text-base leading-tight">Importação | Remessas</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Remessas</div>
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
    tableContainer.id = 'remessas-table';
    tableContainer.className = 'w-full px-2';
    card.appendChild(tableContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex justify-center space-x-4 mt-6';
    buttonContainer.innerHTML = `
      <button id="register-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
        <i class="fa-solid fa-plus mr-2"></i>Cadastrar
      </button>
    `;
    card.appendChild(buttonContainer);

    mainContent.appendChild(card);

    this.setupButtonEvents();

    this.renderTable();
  }

  setupButtonEvents() {
    const registerBtn = document.getElementById('register-btn');

    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        this.openRegisterModal();
      });
    }
  }

  openRegisterModal() {
    const registerComponent = new RegisterRemessaComponent({
      onSubmit: (data) => {
        const newRemessa = {
          id: Math.max(...this.tableData.map(d => d.id), 0) + 1,
          denominacao: data.denominacao
        };
        this.tableData.unshift(newRemessa);
        this.renderTable();
        this.modal.close();
        toast.success('Remessa cadastrada com sucesso!');
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de remessas');
      }
    });

    this.modal = new ModalComponent({
      id: 'register-remessa-modal',
      title: 'Cadastrar Remessas',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: registerComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openEditModal(remessaId) {
    const remessaData = this.tableData.find(item => item.id === remessaId);
    if (!remessaData) {
      toast.error('Remessa não encontrada!');
      return;
    }

    const editComponent = new EditRemessaComponent({
      remessaData: remessaData,
      onUpdate: (updatedData) => {
        this.updateData(updatedData);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de remessas');
      }
    });

    this.modal = new ModalComponent({
      id: 'edit-remessa-modal',
      title: 'Editar Remessas',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: editComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openDeleteModal(remessaId) {
    const remessaData = this.tableData.find(item => item.id === remessaId);
    if (!remessaData) {
      toast.error('Remessa não encontrada!');
      return;
    }

    const deleteComponent = new DeleteRemessaComponent({
      remessaData: remessaData,
      onDelete: () => {
        this.deleteData(remessaId);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de remessas');
      }
    });

    this.modal = new ModalComponent({
      id: 'delete-remessa-modal',
      title: 'Remover',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: deleteComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  updateData(updatedData) {
    this.tableData = this.tableData.map(item =>
      item.id === updatedData.id ? { ...item, ...updatedData } : item
    );
    this.renderTable();
    toast.success('Remessa atualizada com sucesso!');
  }

  deleteData(remessaId) {
    this.tableData = this.tableData.filter(item => item.id !== remessaId);
    this.renderTable();
    toast.success('Remessa excluída com sucesso!');
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
    const tableContainer = document.getElementById('remessas-table');
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
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 80%">DENOMINAÇÃO</th>
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
                  <i class="fa-solid fa-pencil-alt"></i>Editar
                </button>
                <button class="delete-btn bg-red-600 text-white text-xs rounded px-2 py-1 hover:bg-red-700" data-id="${row.id || ''}" style="display: inline-block !important;">
                  <i class="fa-solid fa-trash"></i>Excluir
                </button>
              </div>
            </td>
            <td class="text-left py-2 px-4">${row.denominacao}</td>
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
    const deleteButtons = document.querySelectorAll('.delete-btn');

    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const remessaId = parseInt(button.getAttribute('data-id'));
        this.openEditModal(remessaId);
      });
    });

    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const remessaId = parseInt(button.getAttribute('data-id'));
        this.openDeleteModal(remessaId);
      });
    });
  }

  getMockData() {
    return [
      { id: 1, denominacao: 'AVULSOS' },
      { id: 2, denominacao: 'R7 - PRELIMINAR' },
      { id: 3, denominacao: 'R6 - PRELIMINAR' },
      { id: 4, denominacao: 'R5 - PRELIMINAR' },
      { id: 5, denominacao: 'R4 - PRELIMINAR' },
      { id: 6, denominacao: 'R3 - PRELIMINAR' },
      { id: 7, denominacao: 'R2 - PRELIMINAR' },
      { id: 8, denominacao: 'R1 - PRELIMINAR' },
      { id: 9, denominacao: 'DEFINITIVO' }
    ];
  }

  static initialize() {
    return new RemessasPage();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  RemessasPage.initialize();
});

export default RemessasPage;