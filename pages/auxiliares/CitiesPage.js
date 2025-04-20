/**
 * CitiesPage.js - Página de listagem de cidades
 */
import { Header } from '/components/layout/Header.js';
import IndexesTable from '/components/tables/IndexesTable.js';
import { toast } from '/js/Utilities.js';
import RegisterCityComponent from '/pages/auxiliares/register/RegisterCityComponent.js';
import SearchCityComponent from '/pages/auxiliares/search/SearchCityComponent.js';
import PrintCityComponent from '/pages/auxiliares/print/PrintCityComponent.js';
import EditCityComponent from '/pages/auxiliares/edit/EditCityComponent.js';
import ModalComponent from '/components/common/ModalComponent.js';

class CitiesPage {
  constructor() {
    this.currentPage = 1;
    this.totalPages = 42;
    this.pageSize = 10;
    this.tableData = [];
    this.originalData = []; // Armazenar dados originais para restaurar após limpar filtros
    this.modal = null;
    this.initialize();
  }

  /**
   * Inicializa a página
   */
  initialize() {
    console.log("Inicializando CitiesPage...");

    // Renderizar header
    Header.initialize();

    // Configurar breadcrumbs
    this.setupBreadcrumbs();

    // Renderizar conteúdo principal
    this.renderContent();

    // Carregar dados
    this.loadData();
  }

  /**
   * Configura o breadcrumb da página
   */
  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Auxiliares | Cidades</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Cidades</div>
        </div>
      `;
    }
  }

  /**
   * Renderiza a estrutura básica da página
   */
  renderContent() {
    const mainContent = document.querySelector('main');
    if (!mainContent) {
      console.error("Elemento main não encontrado!");
      return;
    }

    // Limpar conteúdo atual
    mainContent.innerHTML = '';

    // Card principal
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.25)] mx-24 my-20 p-12';

    // Título
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-6';
    header.innerHTML = `
      <h2 class="text-2xl font-semibold text-blue-dark">Listagem</h2>
    `;
    card.appendChild(header);

    // Container para a tabela
    const tableContainer = document.createElement('div');
    tableContainer.id = 'cities-table';
    tableContainer.className = 'w-full px-2';
    card.appendChild(tableContainer);

    // Botões abaixo da tabela
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex justify-center space-x-4 mt-6';
    buttonContainer.innerHTML = `
      <button id="print-btn" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
        <i class="fa-solid fa-print mr-2"></i>Imprimir
      </button>
      <button id="register-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
        <i class="fa-solid fa-plus mr-2"></i>Cadastrar
      </button>
      <button id="search-btn" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
        <i class="fa-solid fa-search mr-2"></i>Pesquisar
      </button>
    `;
    card.appendChild(buttonContainer);

    // Adicionar card à página
    mainContent.appendChild(card);

    // Configurar eventos dos botões
    this.setupButtonEvents();

    // Renderizar tabela com dados existentes
    this.renderTable();
  }

  /**
   * Configura os eventos dos botões
   */
  setupButtonEvents() {
    const printBtn = document.getElementById('print-btn');
    const registerBtn = document.getElementById('register-btn');
    const searchBtn = document.getElementById('search-btn');

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        toast.info('Abrindo opções de impressão...');
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
        toast.info('Abrindo pesquisa...');
        this.openSearchModal();
      });
    }
  }

  /**
   * Abre o modal com o formulário de cadastro
   */
  openRegisterModal() {
    const formContainer = document.createElement('div');
    formContainer.id = 'register-city-modal-container';

    const registerComponent = new RegisterCityComponent({
      containerId: 'register-city-modal-container',
      onSubmit: (data) => {
        console.log('Formulário submetido:', data);
        // Adicionar nova cidade aos dados da tabela
        this.tableData.unshift({
          id: Math.max(...this.tableData.map(d => d.id), 0) + 1,
          codigo: data.codigo,
          cidade: data.cidade,
          estado: data.estado,
          ativo: data.ativo,
          brasao: data.brasao
        });
        this.originalData = [...this.tableData]; // Atualizar dados originais
        this.renderTable();
        toast.success('Cidade cadastrada com sucesso!');
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de cidades');
      }
    });

    this.modal = new ModalComponent({
      id: 'register-city-modal',
      title: 'Cadastrar Cidade',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: registerComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  /**
   * Abre o modal com o formulário de pesquisa
   */
  openSearchModal() {
    const formContainer = document.createElement('div');
    formContainer.id = 'search-city-modal-container';

    const searchComponent = new SearchCityComponent({
      containerId: 'search-city-modal-container',
      onSearch: (filters) => {
        this.filterData(filters);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de cidades');
      }
    });

    this.modal = new ModalComponent({
      id: 'search-city-modal',
      title: 'Pesquisar Cidades',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: searchComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  /**
   * Abre o modal com o formulário de impressão
   */
  openPrintModal() {
    const formContainer = document.createElement('div');
    formContainer.id = 'print-city-modal-container';

    const printComponent = new PrintCityComponent({
      containerId: 'print-city-modal-container',
      onPrint: (filters) => {
        this.printData(filters);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de cidades');
      }
    });

    this.modal = new ModalComponent({
      id: 'print-city-modal',
      title: 'Imprimir Cidades',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: printComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  /**
   * Abre o modal com o formulário de edição
   */
  openEditModal(cityId) {
    const cityData = this.tableData.find(item => item.id === cityId);
    if (!cityData) {
      toast.error('Cidade não encontrada!');
      return;
    }

    const formContainer = document.createElement('div');
    formContainer.id = 'edit-city-modal-container';

    const editComponent = new EditCityComponent({
      containerId: 'edit-city-modal-container',
      cityData: cityData,
      onUpdate: (updatedData) => {
        this.updateData(updatedData);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de cidades');
      }
    });

    this.modal = new ModalComponent({
      id: 'edit-city-modal',
      title: 'Editar Cidade',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: editComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  /**
   * Abre o modal para visualizar distritos (placeholder)
   */
  openDistrictsModal(cityId) {
    const cityData = this.tableData.find(item => item.id === cityId);
    if (!cityData) {
      toast.error('Cidade não encontrada!');
      return;
    }

    toast.info(`Visualizando distritos de "${cityData.cidade}"... (Funcionalidade não implementada)`);
    // Aqui você pode implementar a lógica para abrir um modal ou redirecionar para uma página de distritos
  }

  /**
   * Atualiza os dados da tabela com os valores editados
   */
  updateData(updatedData) {
    this.tableData = this.tableData.map(item =>
      item.id === updatedData.id ? updatedData : item
    );
    this.originalData = [...this.tableData]; // Atualizar dados originais
    this.renderTable();
  }

  /**
   * Filtra os dados para impressão
   */
  printData(filters) {
    let filteredData = [...this.originalData];

    if (filters.codigo) {
      filteredData = filteredData.filter(item => item.codigo === filters.codigo);
    }

    if (filters.cidade) {
      filteredData = filteredData.filter(item =>
        item.cidade.toLowerCase().includes(filters.cidade.toLowerCase())
      );
    }

    if (filters.ativo !== null) {
      filteredData = filteredData.filter(item => item.ativo === (filters.ativo ? 'Sim' : 'Não'));
    }

    if (filteredData.length === 0) {
      toast.info('Nenhuma cidade encontrada para impressão.');
      return;
    }

    // Simular impressão
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Impressão de Cidades</title>
          <style>
            body { font-family: 'IBM Plex Sans', sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #264757; color: white; }
          </style>
        </head>
        <body>
          <h1>Impressão de Cidades</h1>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Cidade</th>
                <th>Estado</th>
                <th>Ativo</th>
                <th>Brasão</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map(item => `
                <tr>
                  <td>${item.codigo}</td>
                  <td>${item.cidade}</td>
                  <td>${item.estado}</td>
                  <td>${item.ativo}</td>
                  <td>${item.brasao ? `<img src="${item.brasao}" alt="Brasão" width="32" height="32" />` : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();

    toast.success(`${filteredData.length} cidade(s) preparada(s) para impressão.`);
  }

  /**
   * Filtra os dados com base nos critérios de pesquisa
   */
  filterData(filters) {
    let filteredData = [...this.originalData];

    if (filters.codigo) {
      filteredData = filteredData.filter(item => item.codigo === filters.codigo);
    }

    if (filters.cidade) {
      filteredData = filteredData.filter(item =>
        item.cidade.toLowerCase().includes(filters.cidade.toLowerCase())
      );
    }

    if (filters.ativo !== null) {
      filteredData = filteredData.filter(item => item.ativo === (filters.ativo ? 'Sim' : 'Não'));
    }

    this.tableData = filteredData;
    this.renderTable();

    if (this.tableData.length === 0) {
      toast.info('Nenhuma cidade encontrada com os filtros aplicados.');
    } else {
      toast.success(`${this.tableData.length} cidade(s) encontrada(s).`);
    }
  }

  /**
   * Carrega os dados da tabela
   */
  loadData() {
    console.log("Carregando dados...");
    setTimeout(() => {
      this.tableData = this.getMockData();
      console.log("Loaded tableData:", this.tableData); // Debug log
      this.originalData = [...this.tableData]; // Armazenar dados originais
      this.renderTable();
    }, 300);
  }

  /**
   * Renderiza a tabela com os dados
   */
  renderTable() {
    const tableContainer = document.getElementById('cities-table');
    if (!tableContainer) {
      console.error("Container da tabela não encontrado!");
      return;
    }

    console.log('tableData before rendering:', this.tableData); // Debug log

    if (!this.tableData || !this.tableData.length) {
      tableContainer.innerHTML = '<p class="text-center py-4">Nenhum dado disponível</p>';
      return;
    }

    try {
      // Render the table manually
      let tableHTML = `
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-600">
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">AÇÕES</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 15%">CÓDIGO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 25%">CIDADE</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 15%">ESTADO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 15%">ATIVO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 20%">BRASÃO</th>
            </tr>
          </thead>
          <tbody>
      `;

      this.tableData.forEach(row => {
        console.log('Rendering row:', row); // Debug log
        tableHTML += `
          <tr class="bg-white">
            <td class="text-center py-2 px-4">
              <div class="flex space-x-2 justify-center">
                <button class="edit-btn bg-blue-dark text-white text-xs rounded px-2 py-1" data-id="${row.id || ''}" style="display: inline-block !important;">
                  <i class="fa-solid fa-edit mr-1"></i> Editar
                </button>
                <button class="districts-btn bg-gray-500 text-white text-xs rounded px-2 py-1" data-id="${row.id || ''}" style="display: inline-block !important;">
                  <i class="fa-solid fa-map-marker-alt mr-1"></i> Distritos
                </button>
              </div>
            </td>
            <td class="text-center py-2 px-4">${row.codigo}</td>
            <td class="text-left py-2 px-4">${row.cidade}</td>
            <td class="text-left py-2 px-4">${row.estado}</td>
            <td class="text-center py-2 px-4">${row.ativo}</td>
            <td class="text-center py-2 px-4">
              ${row.brasao ? `<img src="${row.brasao}" alt="Brasão" class="h-8 w-8 mx-auto" />` : '-'}
            </td>
          </tr>
        `;
      });

      tableHTML += `
          </tbody>
        </table>
      `;

      tableContainer.innerHTML = tableHTML;

      // Delay event binding to ensure DOM is updated
      setTimeout(() => {
        this.setupTableButtonEvents();
      }, 100);
    } catch (error) {
      console.error("Erro ao renderizar tabela:", error);
      tableContainer.innerHTML = `<p class="text-center text-red-500 py-4">Erro ao renderizar tabela: ${error.message}</p>`;
    }
  }

  /**
   * Configura os eventos dos botões da tabela (Editar e Distritos)
   */
  setupTableButtonEvents() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const districtsButtons = document.querySelectorAll('.districts-btn');

    console.log('Found edit buttons:', editButtons.length); // Debug log
    console.log('Found districts buttons:', districtsButtons.length); // Debug log

    editButtons.forEach(button => {
      console.log('Binding event to edit button with data-id:', button.getAttribute('data-id')); // Debug log
      button.addEventListener('click', () => {
        const cityId = parseInt(button.getAttribute('data-id'));
        toast.info('Abrindo formulário de edição...');
        this.openEditModal(cityId);
      });
    });

    districtsButtons.forEach(button => {
      console.log('Binding event to districts button with data-id:', button.getAttribute('data-id')); // Debug log
      button.addEventListener('click', () => {
        const cityId = parseInt(button.getAttribute('data-id'));
        this.openDistrictsModal(cityId);
      });
    });
  }

  /**
   * Gera dados simulados para a tabela
   */
  getMockData() {
    const cidades = [
      { codigo: 50002, cidade: 'ACORIZAL', estado: 'Mato Grosso', ativo: 'Não', brasao: '/images/brasao-acorizal.png' },
      { codigo: 10006, cidade: 'ÁGUA BOA', estado: 'Mato Grosso', ativo: 'Não', brasao: '/images/brasao-agua-boa.png' },
      { codigo: 15008, cidade: 'ALTA FLORESTA', estado: 'Mato Grosso', ativo: 'Não', brasao: '/images/brasao-alta-floresta.png' },
      { codigo: 20001, cidade: 'ALTO ARAGUAIA', estado: 'Mato Grosso', ativo: 'Não', brasao: '/images/brasao-alto-araguaia.png' },
      { codigo: 23000, cidade: 'ALTO BOA VISTA', estado: 'Mato Grosso', ativo: 'Não', brasao: '/images/brasao-alto-boa-vista.png' },
      { codigo: 25003, cidade: 'ALTO GARÇAS', estado: 'Mato Grosso', ativo: 'Não', brasao: '/images/brasao-alto-garcas.png' },
      { codigo: 30007, cidade: 'ALTO PARAGUAI', estado: 'Mato Grosso', ativo: 'Não', brasao: '/images/brasao-alto-paraguai.png' },
      { codigo: 32000, cidade: 'ALTO TAQUARI', estado: 'Mato Grosso', ativo: 'Não', brasao: '/images/brasao-alto-taquari.png' },
      { codigo: 33006, cidade: 'APIACÁS', estado: 'Mato Grosso', ativo: 'Não', brasao: '/images/brasao-apiacas.png' },
      { codigo: 34002, cidade: 'ARAGUAINHA', estado: 'Mato Grosso', ativo: 'Não', brasao: '/images/brasao-araguainha.png' }
    ];

    return cidades.map((item, index) => ({
      id: index + 1,
      ...item
    }));
  }

  /**
   * Inicializa a página
   */
  static initialize() {
    return new CitiesPage();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  CitiesPage.initialize();
});

export default CitiesPage;