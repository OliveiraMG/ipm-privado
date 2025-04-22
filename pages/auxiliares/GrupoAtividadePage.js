/**
 * GrupoAtividadePage.js - Página de listagem de Grupos de Atividades
 */
import { Header } from '/components/layout/Header.js';
import { toast } from '/js/Utilities.js';
import RegisterGrupoAtividadeComponent from '/pages/auxiliares/register/RegisterGrupoAtividadeComponent.js';
import EditGrupoAtividadeComponent from '/pages/auxiliares/edit/EditGrupoAtividadeComponent.js';
import CadastrarCNAEGrupoAtividadeComponent from '/pages/auxiliares/register/CadastrarCNAEGrupoAtividadeComponent.js';
import SearchGrupoAtividadeComponent from '/pages/auxiliares/search/SearchGrupoAtividadeComponent.js';
import PrintGrupoAtividadeComponent from '/pages/auxiliares/print/PrintGrupoAtividadeComponent.js';
import ModalComponent from '/components/common/ModalComponent.js';

class GrupoAtividadePage {
  constructor() {
    this.tableData = [];
    this.filteredData = [];
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando GrupoAtividadePage...");

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
          <div class="text-gray-500 text-base leading-tight">Auxiliares | Grupo Atividades</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Grupo Atividades</div>
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
    tableContainer.id = 'grupo-atividade-table';
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
    const registerBtn = document.getElementById('register-btn');
    const searchBtn = document.getElementById('search-btn');
    const printBtn = document.getElementById('print-btn');

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

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        this.openPrintModal();
      });
    }
  }

  openRegisterModal() {
    const registerComponent = new RegisterGrupoAtividadeComponent({
      onSubmit: (data) => {
        console.log('Formulário submetido:', data);
        this.tableData.unshift({
          id: Math.max(...this.tableData.map(d => d.id), 0) + 1,
          ...data
        });
        this.filteredData = [...this.tableData];
        this.renderTable();
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de atividades');
      }
    });

    this.modal = new ModalComponent({
      id: 'register-grupo-atividade-modal',
      title: 'Cadastrar Atividade Econômica',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: registerComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openEditModal(atividadeId) {
    const atividadeData = this.tableData.find(item => item.id === atividadeId);
    if (!atividadeData) {
      toast.error('Atividade não encontrada!');
      return;
    }

    const editComponent = new EditGrupoAtividadeComponent({
      atividadeData: atividadeData,
      onUpdate: (updatedData) => {
        this.updateData(updatedData);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de atividades');
      }
    });

    this.modal = new ModalComponent({
      id: 'edit-grupo-atividade-modal',
      title: 'Editar Atividade',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: editComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openCNAEModal(atividadeId) {
    const atividadeData = this.tableData.find(item => item.id === atividadeId);
    if (!atividadeData) {
      toast.error('Atividade não encontrada!');
      return;
    }

    const cnaeComponent = new CadastrarCNAEGrupoAtividadeComponent({
      cnaeData: atividadeData.cnaesList || [],
      onUpdate: (updatedCNAEs) => {
        atividadeData.cnaesList = updatedCNAEs;
        atividadeData.cnaesCadastradas = updatedCNAEs.length.toString();
        this.renderTable();
        this.modal.close();
        toast.success('CNAEs atualizados com sucesso!');
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de atividades');
      }
    });

    this.modal = new ModalComponent({
      id: 'cnae-grupo-atividade-modal',
      title: 'Cadastrar CNAE',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: cnaeComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openSearchModal() {
    const searchComponent = new SearchGrupoAtividadeComponent({
      onSearch: (filters) => {
        this.applyFilters(filters);
        this.modal.close();
      },
      onCancel: () => {
        this.modal.close();
      }
    });

    this.modal = new ModalComponent({
      id: 'search-grupo-atividade-modal',
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
    const printComponent = new PrintGrupoAtividadeComponent({
      onPrint: (filters) => {
        this.handlePrint(filters);
        this.modal.close();
      },
      onCancel: () => {
        this.modal.close();
      }
    });

    this.modal = new ModalComponent({
      id: 'print-grupo-atividade-modal',
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

  applyFilters(filters) {
    const ativo = filters.ativo.toLowerCase();
    const atividade = filters.atividade.toLowerCase();

    this.filteredData = this.tableData.filter(item => {
      const matchesAtivo = !ativo || item.ativo.toLowerCase() === ativo;
      const matchesAtividade = !atividade || item.atividade.toLowerCase().includes(atividade);
      return matchesAtivo && matchesAtividade;
    });

    this.renderTable();
  }

  handlePrint(filters) {
    const ativo = filters.ativo.toLowerCase();
    const atividade = filters.atividade.toLowerCase();
    const imprimirCNAEs = filters.imprimirCNAEs.toLowerCase() === 'sim';

    const dataToPrint = this.tableData.filter(item => {
      const matchesAtivo = !ativo || item.ativo.toLowerCase() === ativo;
      const matchesAtividade = !atividade || item.atividade.toLowerCase().includes(atividade);
      return matchesAtivo && matchesAtividade;
    });

    // Simulate printing (log to console for now)
    console.log('Dados para impressão:', {
      filters: { ativo, atividade, imprimirCNAEs },
      data: dataToPrint.map(item => ({
        id: item.id,
        atividade: item.atividade,
        percentualCalculo: item.percentualCalculo,
        ativo: item.ativo,
        cnaesCadastradas: item.cnaesCadastradas,
        ...(imprimirCNAEs && { cnaesList: item.cnaesList })
      }))
    });

    toast.success('Impressão simulada com sucesso! Verifique o console para os dados.');
  }

  updateData(updatedData) {
    this.tableData = this.tableData.map(item =>
      item.id === updatedData.id ? { ...item, ...updatedData } : item
    );
    this.filteredData = [...this.tableData];
    this.renderTable();
    toast.success('Atividade atualizada com sucesso!');
  }

  loadData() {
    console.log("Carregando dados...");
    setTimeout(() => {
      this.tableData = this.getMockData();
      this.filteredData = [...this.tableData];
      console.log("Loaded tableData:", this.tableData);
      this.renderTable();
    }, 300);
  }

  renderTable() {
    const tableContainer = document.getElementById('grupo-atividade-table');
    if (!tableContainer) {
      console.error("Container da tabela não encontrado!");
      return;
    }

    console.log('filteredData before rendering:', this.filteredData);

    if (!this.filteredData || !this.filteredData.length) {
      tableContainer.innerHTML = '<p class="text-center py-4">Nenhum dado disponível</p>';
      return;
    }

    try {
      let tableHTML = `
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-600">
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">AÇÕES</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 5%">ID</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 35%">ATIVIDADE</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 15%">% PARA CÁLCULO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">ATIVO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 15%">CNAES CADASTRADAS</th>
            </tr>
          </thead>
          <tbody>
      `;

      this.filteredData.forEach(row => {
        console.log('Rendering row:', row);
        tableHTML += `
          <tr class="bg-white">
            <td class="text-center py-2 px-4">
              <div class="flex space-x-2 justify-center">
                <button class="edit-btn bg-blue-dark text-white text-xs rounded px-2 py-1 hover:bg-blue-medium" data-id="${row.id || ''}" style="display: inline-block !important;">
                  <i class="fa-solid fa-edit mr-1"></i> Editar
                </button>
                <button class="cnaes-btn bg-blue-dark text-white text-xs rounded px-2 py-1 hover:bg-blue-medium" data-id="${row.id || ''}" style="display: inline-block !important;">
                  <i class="fa-solid fa-copy mr-1"></i> CNAEs
                </button>
              </div>
            </td>
            <td class="text-center py-2 px-4">${row.id}</td>
            <td class="text-left py-2 px-4">${row.atividade}</td>
            <td class="text-center py-2 px-4">${row.percentualCalculo}</td>
            <td class="text-center py-2 px-4">${row.ativo}</td>
            <td class="text-center py-2 px-4">${row.cnaesCadastradas}</td>
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
    const cnaeButtons = document.querySelectorAll('.cnaes-btn');

    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const atividadeId = parseInt(button.getAttribute('data-id'));
        toast.info('Abrindo formulário de edição...');
        this.openEditModal(atividadeId);
      });
    });

    cnaeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const atividadeId = parseInt(button.getAttribute('data-id'));
        toast.info('Abrindo formulário de gerenciamento de CNAEs...');
        this.openCNAEModal(atividadeId);
      });
    });
  }

  getMockData() {
    return [
      {
        id: 1,
        atividade: 'Pecuária',
        percentualCalculo: '20%',
        ativo: 'Sim',
        cnaesCadastradas: '10',
        cnaesList: [
          { id: '151201', descricao: 'Criação de bovinos para corte' },
          { id: '151202', descricao: 'Criação de bovinos para leite' },
          { id: '151203', descricao: 'Criação de bovinos, exceto para corte e leite' },
          { id: '152101', descricao: 'Criação de bufalinos' },
          { id: '152102', descricao: 'Criação de equinos' },
          { id: '152103', descricao: 'Criação de asininos e muares' },
          { id: '153901', descricao: 'Criação de caprinos' },
          { id: '153902', descricao: 'Criação de ovinos, inclusive para produção de lã' },
          { id: '154900', descricao: 'Criação de suínos' },
          { id: '190801', descricao: 'Apicultura' }
        ]
      },
      {
        id: 2,
        atividade: 'Comércio e Indústria de Telecomunicação',
        percentualCalculo: '35%',
        ativo: 'Sim',
        cnaesCadastradas: '258',
        cnaesList: []
      },
      {
        id: 3,
        atividade: 'Prestadores de Serviços de Transporte e Telecomunicação',
        percentualCalculo: '35%',
        ativo: 'Sim',
        cnaesCadastradas: '49',
        cnaesList: []
      },
      {
        id: 4,
        atividade: 'Outras Atividades',
        percentualCalculo: '35%',
        ativo: 'Sim',
        cnaesCadastradas: '35',
        cnaesList: []
      },
      {
        id: 5,
        atividade: 'Arbitramento de Valores Mínimos de Entrada',
        percentualCalculo: '0%',
        ativo: 'Sim',
        cnaesCadastradas: '3',
        cnaesList: []
      },
      {
        id: 6,
        atividade: 'Agricultura',
        percentualCalculo: '50%',
        ativo: 'Sim',
        cnaesCadastradas: '59',
        cnaesList: []
      },
      {
        id: 7,
        atividade: 'Extração Mineral e Vegetal',
        percentualCalculo: '35%',
        ativo: 'Sim',
        cnaesCadastradas: '39',
        cnaesList: []
      },
      {
        id: 8,
        atividade: 'Construção e Serviços',
        percentualCalculo: '35%',
        ativo: 'Sim',
        cnaesCadastradas: '45',
        cnaesList: []
      }
    ];
  }

  static initialize() {
    return new GrupoAtividadePage();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  GrupoAtividadePage.initialize();
});

export default GrupoAtividadePage;