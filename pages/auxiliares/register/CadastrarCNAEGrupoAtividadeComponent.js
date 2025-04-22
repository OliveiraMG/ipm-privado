/**
 * CadastrarCNAEGrupoAtividadeComponent.js - Componente para gerenciamento de CNAEs de uma atividade
 */
import { toast } from '/js/Utilities.js';
import ConfirmDeleteCNAEComponent from '/pages/auxiliares/edit/ConfirmDeleteCNAEComponent.js';
import SearchCNAEGrupoAtividadeComponent from '/pages/auxiliares/search/SearchCNAEGrupoAtividadeComponent.js';
import ModalComponent from '/components/common/ModalComponent.js';

class CadastrarCNAEGrupoAtividadeComponent {
  constructor({ cnaeData, onUpdate, onBack }) {
    this.cnaeData = cnaeData || [];
    this.filteredCNAEs = [...this.cnaeData];
    this.onUpdate = onUpdate || (() => {});
    this.onBack = onBack || (() => {});
    this.modal = null;
    this.availableCNAEs = [
      { id: '111301', descricao: 'Cultivo de Arroz' },
      { id: '111302', descricao: 'Cultivo de Milho' },
      { id: '111303', descricao: 'Cultivo de Trigo' },
      { id: '111299', descricao: 'Cultivo de outras fibras de lavoura temporária não especificadas anteriormente' },
      { id: '114800', descricao: 'Cultivo de Fumo' },
      { id: '151201', descricao: 'Criação de bovinos para corte' },
      { id: '151202', descricao: 'Criação de bovinos para leite' },
      { id: '151203', descricao: 'Criação de bovinos, exceto para corte e leite' },
      { id: '152101', descricao: 'Criação de bufalinos' },
      { id: '152102', descricao: 'Criação de equinos' },
      { id: '152103', descricao: 'Criação de asininos e muares' },
      { id: '153901', descricao: 'Criação de caprinos' },
      { id: '153902', descricao: 'Criação de ovinos, inclusive para produção de lã' },
      { id: '154900', descricao: 'Criação de suínos' },
      { id: '155501', descricao: 'Criação de frangos para corte' },
      { id: '155502', descricao: 'Produção de pintos de um dia' },
      { id: '155503', descricao: 'Criação de outros galináceos, exceto para corte' },
      { id: '155504', descricao: 'Criação de aves, exceto galináceos' },
      { id: '155505', descricao: 'Produção de ovos' },
      { id: '190801', descricao: 'Apicultura' }
    ];
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
        <label for="cnaes" class="block text-sm font-medium text-gray-700">CNAEs</label>
        <select id="cnaes" name="cnaes"
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
          <option value="">Selecione um CNAE para adicionar</option>
          ${this.availableCNAEs.map(cnae => `<option value="${cnae.id}">${cnae.id} - ${cnae.descricao}</option>`).join('')}
        </select>
      </div>
      <div class="mt-4">
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-blue-dark">
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">AÇÕES</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 20%">CÓDIGO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 70%">ATIVIDADE</th>
            </tr>
          </thead>
          <tbody id="cnae-table-body">
            ${this.renderCNAETable()}
          </tbody>
        </table>
      </div>
      <div class="flex justify-center space-x-2 mt-4">
        <span class="px-2 py-1 border rounded">1</span>
        <span class="px-2 py-1 border rounded">2</span>
        <span class="px-2 py-1">...</span>
        <span class="px-2 py-1 border rounded">9</span>
        <span class="px-2 py-1 border rounded">10</span>
      </div>
      <div class="flex justify-end space-x-4 mt-6">
        <button id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Voltar
        </button>
        <button id="search-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
          Pesquisar
        </button>
        <button id="submit-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm opacity-50 cursor-not-allowed" disabled>
          Cadastrar
        </button>
      </div>
    `;

    container.appendChild(form);
    return container;
  }

  renderCNAETable() {
    if (!this.filteredCNAEs || !this.filteredCNAEs.length) {
      return '<tr><td colspan="3" class="text-center py-4">Nenhum CNAE associado</td></tr>';
    }

    return this.filteredCNAEs.map((cnae, index) => `
      <tr class="bg-white">
        <td class="text-center py-2 px-4">
          <button class="delete-btn bg-red-500 text-white text-xs rounded px-2 py-1 hover:bg-red-600" data-index="${index}">
            <i class="fa-solid fa-trash mr-1"></i> Excluir
          </button>
        </td>
        <td class="text-center py-2 px-4">${cnae.id}</td>
        <td class="text-left py-2 px-4">${cnae.descricao}</td>
      </tr>
    `).join('');
  }

  setupEventListeners() {
    const cancelBtn = this.element.querySelector('#cancel-btn');
    const searchBtn = this.element.querySelector('#search-btn');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        toast.info('Gerenciamento de CNAEs cancelado.');
        this.onBack();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.openSearchModal();
      });
    }

    this.setupDeleteButtons();
  }

  openSearchModal() {
    const searchComponent = new SearchCNAEGrupoAtividadeComponent({
      onSearch: (filters) => {
        this.applyFilters(filters);
        this.modal.close();
      },
      onCancel: () => {
        this.modal.close();
      }
    });

    this.modal = new ModalComponent({
      id: 'search-cnae-modal',
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

  applyFilters(filters) {
    const searchTerm = filters.cnaesCadastrados.toLowerCase();
    if (!searchTerm) {
      this.filteredCNAEs = [...this.cnaeData];
    } else {
      this.filteredCNAEs = this.cnaeData.filter(cnae =>
        cnae.id.toLowerCase().includes(searchTerm) ||
        cnae.descricao.toLowerCase().includes(searchTerm)
      );
    }
    this.updateTable();
  }

  setupDeleteButtons() {
    const deleteButtons = this.element.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        const cnaeToDelete = this.filteredCNAEs[index];
        this.openConfirmDeleteModal(index, cnaeToDelete);
      });
    });
  }

  openConfirmDeleteModal(index, cnae) {
    const confirmComponent = new ConfirmDeleteCNAEComponent({
      cnae: cnae,
      onConfirm: () => {
        this.cnaeData.splice(this.cnaeData.findIndex(item => item.id === cnae.id), 1);
        this.filteredCNAEs.splice(index, 1);
        this.updateTable();
        this.modal.close();
      },
      onCancel: () => {
        this.modal.close();
      }
    });

    this.modal = new ModalComponent({
      id: 'confirm-delete-cnae-modal',
      title: 'Remover',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: confirmComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  updateTable() {
    const tableBody = this.element.querySelector('#cnae-table-body');
    tableBody.innerHTML = this.renderCNAETable();
    this.setupDeleteButtons();
  }
}

export default CadastrarCNAEGrupoAtividadeComponent;