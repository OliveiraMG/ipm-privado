/**
 * EditCfopPortariaComponent.js - Componente para o formulário de edição de CFOPs de uma portaria
 */
import { toast } from '/js/Utilities.js';
import ModalComponent from '/components/common/ModalComponent.js';
import ConfirmDeleteCfopComponent from '/pages/auxiliares/edit/ConfirmDeleteCfopComponent.js';
import UpdateRepercuteComponent from '/pages/auxiliares/edit/UpdateRepercuteComponent.js';

class EditCfopPortariaComponent {
  constructor({ cfopData, cfopSelect, onUpdate, onBack }) {
    this.cfopData = cfopData || [];
    this.cfopSelect = cfopSelect || '';
    this.onUpdate = onUpdate || (() => {});
    this.onBack = onBack || (() => {});
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.subModal = null;
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'w-full';

    const form = document.createElement('div');
    form.className = 'p-4';

    form.innerHTML = `
      <div class="mb-4">
        <label for="cfopSelect" class="block text-sm font-medium text-gray-700">CFOP</label>
        <select id="cfopSelect" name="cfopSelect"
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
          <option value="" ${!this.cfopSelect ? 'selected' : ''}>Selecione</option>
          <option value="repercute" ${this.cfopSelect === 'repercute' ? 'selected' : ''}>repercute no cálculo do Demonstrativo (Relatório)</option>
        </select>
      </div>
      <div id="cfop-table" class="w-full px-2 mb-4">
        ${this.renderTable()}
      </div>
      <div class="flex justify-end space-x-4 mt-6">
        <button id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Voltar
        </button>
        <button id="submit-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
          Editar
        </button>
      </div>
    `;

    container.appendChild(form);
    return container;
  }

  renderTable() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedData = this.cfopData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.cfopData.length / this.itemsPerPage);

    if (!paginatedData.length) {
      return '<p class="text-center py-4">Nenhum CFOP disponível</p>';
    }

    let tableHTML = `
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="bg-gray-600">
            <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 15%">AÇÕES</th>
            <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 15%">CFOP</th>
            <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 55%">DESCRIÇÃO</th>
            <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 15%">REPERCUTE NO CÁLCULO DO DEMONSTRATIVO?(RELATÓRIO)</th>
          </tr>
        </thead>
        <tbody>
    `;

    paginatedData.forEach((row, index) => {
      const globalIndex = startIndex + index;
      tableHTML += `
        <tr class="bg-white">
          <td class="text-center py-2 px-4">
            <button class="delete-btn bg-red-600 text-white text-xs rounded px-2 py-1" data-id="${globalIndex}">
              <i class="fa-solid fa-trash mr-1"></i> Excluir
            </button>
          </td>
          <td class="text-center py-2 px-4">${row.cfop}</td>
          <td class="text-left py-2 px-4">${row.descricao}</td>
          <td class="text-center py-2 px-4">
            <span class="repercute-btn cursor-pointer text-blue-600 hover:underline" data-id="${globalIndex}">
              ${row.repercute ? 'Sim' : 'Não'}
            </span>
          </td>
        </tr>
      `;
    });

    tableHTML += `
        </tbody>
      </table>
    `;

    if (totalPages > 1) {
      tableHTML += `
        <div class="flex justify-center mt-4">
          <button id="prev-page" class="px-3 py-1 border rounded-l ${this.currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}" ${this.currentPage === 1 ? 'disabled' : ''}>
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <span class="px-3 py-1 border-t border-b">${this.currentPage} de ${totalPages}</span>
          <button id="next-page" class="px-3 py-1 border rounded-r ${this.currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}" ${this.currentPage === totalPages ? 'disabled' : ''}>
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      `;
    }

    return tableHTML;
  }

  setupEventListeners() {
    const backBtn = this.element.querySelector('#back-btn');
    const submitBtn = this.element.querySelector('#submit-btn');
    const prevPageBtn = this.element.querySelector('#prev-page');
    const nextPageBtn = this.element.querySelector('#next-page');

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        toast.info('Retornando à lista de portarias...');
        this.onBack();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.submitForm();
      });
    }

    if (prevPageBtn) {
      prevPageBtn.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.updateTable();
        }
      });
    }

    if (nextPageBtn) {
      nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(this.cfopData.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.updateTable();
        }
      });
    }

    this.setupTableButtonEvents();
  }

  setupTableButtonEvents() {
    const deleteButtons = this.element.querySelectorAll('.delete-btn');
    const repercuteButtons = this.element.querySelectorAll('.repercute-btn');

    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-id'));
        this.openConfirmDeleteModal(index);
      });
    });

    repercuteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-id'));
        this.openUpdateRepercuteModal(index);
      });
    });
  }

  openConfirmDeleteModal(index) {
    const cfopData = this.cfopData[index];
    if (!cfopData) {
      toast.error('CFOP não encontrado!');
      return;
    }

    const confirmDeleteComponent = new ConfirmDeleteCfopComponent({
      cfopData: cfopData,
      onConfirm: () => {
        this.deleteRow(index);
        this.subModal.close();
      },
      onCancel: () => {
        this.subModal.close();
      }
    });

    this.subModal = new ModalComponent({
      id: 'confirm-delete-cfop-modal',
      title: 'REMOVER',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: confirmDeleteComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.subModal = null;
      }
    });
    this.subModal.open();
  }

  openUpdateRepercuteModal(index) {
    const cfopData = this.cfopData[index];
    if (!cfopData) {
      toast.error('CFOP não encontrado!');
      return;
    }

    const updateRepercuteComponent = new UpdateRepercuteComponent({
      cfopData: cfopData,
      onUpdate: (updatedData) => {
        this.cfopData[index] = updatedData;
        this.updateTable();
        this.subModal.close();
      },
      onCancel: () => {
        this.subModal.close();
      }
    });

    this.subModal = new ModalComponent({
      id: 'update-repercute-modal',
      title: 'ATUALIZAR',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: updateRepercuteComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.subModal = null;
      }
    });
    this.subModal.open();
  }

  deleteRow(index) {
    this.cfopData.splice(index, 1);
    this.currentPage = Math.min(this.currentPage, Math.ceil(this.cfopData.length / this.itemsPerPage) || 1);
    this.updateTable();
    toast.success('CFOP removido com sucesso!');
  }

  updateTable() {
    const tableContainer = this.element.querySelector('#cfop-table');
    if (tableContainer) {
      tableContainer.innerHTML = this.renderTable();
      this.setupTableButtonEvents();
    }
  }

  submitForm() {
    const cfopSelect = this.element.querySelector('#cfopSelect').value;
    const updatedData = {
      cfopSelect: cfopSelect || null,
      cfopList: this.cfopData
    };
    toast.success('CFOPs atualizados com sucesso!');
    this.onUpdate(updatedData);
  }
}

export default EditCfopPortariaComponent;