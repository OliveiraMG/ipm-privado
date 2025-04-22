/**
 * ExerciciosPage.js - Página de listagem de exercícios
 */
import { Header } from '/components/layout/Header.js';
import { toast } from '/js/Utilities.js';
import RegisterExercicioComponent from '/pages/imports/register/RegisterExercicioComponent.js';
import EditExercicioComponent from '/pages/imports/edit/EditExercicioComponent.js';
import DeleteExercicioComponent from '/pages/imports/edit/DeleteExercicioComponent.js';
import ModalComponent from '/components/common/ModalComponent.js';

class ExerciciosPage {
  constructor() {
    this.tableData = [];
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando ExerciciosPage...");

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
          <div class="text-gray-500 text-base leading-tight">Importação | Exercícios</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Exercícios</div>
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
    tableContainer.id = 'exercicios-table';
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
    const registerComponent = new RegisterExercicioComponent({
      onSubmit: (data) => {
        const newExercicio = {
          id: Math.max(...this.tableData.map(d => d.id), 0) + 1,
          base: data.exercicio,
          apuracao: data.exercicio,
          aplicacao: data.exercicio
        };
        this.tableData.unshift(newExercicio);
        this.renderTable();
        this.modal.close();
        toast.success('Exercício cadastrado com sucesso!');
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de exercícios');
      }
    });

    this.modal = new ModalComponent({
      id: 'register-exercicio-modal',
      title: 'Cadastrar Exercícios',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: registerComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openEditModal(exercicioId) {
    const exercicioData = this.tableData.find(item => item.id === exercicioId);
    if (!exercicioData) {
      toast.error('Exercício não encontrado!');
      return;
    }

    const editComponent = new EditExercicioComponent({
      exercicioData: exercicioData,
      onUpdate: (updatedData) => {
        this.updateData(updatedData);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de exercícios');
      }
    });

    this.modal = new ModalComponent({
      id: 'edit-exercicio-modal',
      title: 'Editar Exercícios',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: editComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openDeleteModal(exercicioId) {
    const exercicioData = this.tableData.find(item => item.id === exercicioId);
    if (!exercicioData) {
      toast.error('Exercício não encontrado!');
      return;
    }

    const deleteComponent = new DeleteExercicioComponent({
      exercicioData: exercicioData,
      onDelete: () => {
        this.deleteData(exercicioId);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de exercícios');
      }
    });

    this.modal = new ModalComponent({
      id: 'delete-exercicio-modal',
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
    toast.success('Exercício atualizado com sucesso!');
  }

  deleteData(exercicioId) {
    this.tableData = this.tableData.filter(item => item.id !== exercicioId);
    this.renderTable();
    toast.success('Exercício excluído com sucesso!');
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
    const tableContainer = document.getElementById('exercicios-table');
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
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 20%">BASE</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 30%">APURAÇÃO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 30%">APLICAÇÃO</th>
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
            <td class="text-left py-2 px-4">${row.base}</td>
            <td class="text-left py-2 px-4">${row.apuracao}</td>
            <td class="text-left py-2 px-4">${row.aplicacao}</td>
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
        const exercicioId = parseInt(button.getAttribute('data-id'));
        this.openEditModal(exercicioId);
      });
    });

    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const exercicioId = parseInt(button.getAttribute('data-id'));
        this.openDeleteModal(exercicioId);
      });
    });
  }

  getMockData() {
    return [
      { id: 1, base: '2025', apuracao: '2026', aplicacao: '2027' },
      { id: 2, base: '2024', apuracao: '2025', aplicacao: '2026' },
      { id: 3, base: '2023', apuracao: '2024', aplicacao: '2025' },
      { id: 4, base: '2022', apuracao: '2023', aplicacao: '2024' },
      { id: 5, base: '2021', apuracao: '2022', aplicacao: '2023' },
      { id: 6, base: '2020', apuracao: '2021', aplicacao: '2022' },
      { id: 7, base: '2019', apuracao: '2020', aplicacao: '2021' },
      { id: 8, base: '2018', apuracao: '2019', aplicacao: '2020' },
      { id: 9, base: '2017', apuracao: '2018', aplicacao: '2019' },
      { id: 10, base: '2016', apuracao: '2017', aplicacao: '2018' },
      { id: 11, base: '2015', apuracao: '2016', aplicacao: '2017' },
      { id: 12, base: '2014', apuracao: '2015', aplicacao: '2016' },
      { id: 13, base: '2013', apuracao: '2014', aplicacao: '2015' },
      { id: 14, base: '2012', apuracao: '2013', aplicacao: '2014' },
      { id: 15, base: '2011', apuracao: '2012', aplicacao: '2013' }
    ];
  }

  static initialize() {
    return new ExerciciosPage();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ExerciciosPage.initialize();
});

export default ExerciciosPage;