/**
 * EntitiesPage.js - Página de listagem de entidades
 */
import { Header } from '/components/layout/Header.js';
import IndexesTable from '/components/tables/IndexesTable.js';
import { toast } from '/js/Utilities.js';
import RegisterEntityComponent from '/pages/auxiliares/register/RegisterEntityComponent.js';
import SearchEntityComponent from '/pages/auxiliares/search/SearchEntityComponent.js';
import ModalComponent from '/components/common/ModalComponent.js';

class EntitiesPage {
  constructor() {
    this.currentPage = 1;
    this.totalPages = 10;
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
    console.log("Inicializando EntitiesPage...");

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
          <div class="text-gray-500 text-base leading-tight">Auxiliares | Entidades</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Entidades</div>
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
    tableContainer.id = 'entities-table';
    tableContainer.className = 'w-full px-2';
    card.appendChild(tableContainer);

    // Botões abaixo da tabela
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex justify-center space-x-4 mt-6';
    buttonContainer.innerHTML = `
      <button id="print-btn" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
        <i class="fa-solid fa-print mr-2"></i>Imprimir
      </button>
      <button id="register-btn" class="px-4 py-2 bg-blue-dark text-white rounded-md hover:bg-blue-medium">
        <i class="fa-solid fa-plus mr-2"></i>Cadastrar
      </button>
      <button id="search-btn" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
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
        toast.info('Iniciando impressão...');
        setTimeout(() => toast.success('Impressão concluída!'), 1000);
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
    formContainer.id = 'register-entity-modal-container';

    const registerComponent = new RegisterEntityComponent({
      containerId: 'register-entity-modal-container',
      onSubmit: (data) => {
        console.log('Formulário submetido:', data);
        if (data.entidade) {
          this.tableData.unshift({
            id: Math.max(...this.tableData.map(d => d.id), 0) + 1,
            entidade: data.entidade,
            responsavel: '',
            setor: '',
            cargo: '',
            matricula: '',
            cidade: data.cidade || ''
          });
          this.originalData = [...this.tableData]; // Atualizar dados originais
          this.renderTable();
          toast.success('Entidade cadastrada com sucesso!');
        }
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de entidades');
      }
    });

    this.modal = new ModalComponent({
      id: 'register-entity-modal',
      title: 'Cadastrar Entidade',
      content: registerComponent.element,
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
    formContainer.id = 'search-entity-modal-container';

    const searchComponent = new SearchEntityComponent({
      containerId: 'search-entity-modal-container',
      onSearch: (filters) => {
        this.filterData(filters);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de entidades');
      }
    });

    this.modal = new ModalComponent({
      id: 'search-entity-modal',
      title: 'Pesquisar Entidades',
      content: searchComponent.element,
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  /**
   * Filtra os dados com base nos critérios de pesquisa
   */
  filterData(filters) {
    let filteredData = [...this.originalData];

    if (filters.codigo) {
      filteredData = filteredData.filter(item => item.id === filters.codigo);
    }

    if (filters.cidade) {
      filteredData = filteredData.filter(item =>
        item.cidade.toLowerCase().includes(filters.cidade.toLowerCase())
      );
    }

    if (filters.ativo !== null) {
      // Considerando que "ativo" não está nos dados simulados, podemos adicionar um campo "ativo" nos dados mock
      // Para este exemplo, vamos assumir que todas as entidades estão ativas
      filteredData = filteredData.filter(() => filters.ativo); // Simulação simples
    }

    this.tableData = filteredData;
    this.renderTable();

    if (this.tableData.length === 0) {
      toast.info('Nenhuma entidade encontrada com os filtros aplicados.');
    } else {
      toast.success(`${this.tableData.length} entidade(s) encontrada(s).`);
    }
  }

  /**
   * Carrega os dados da tabela
   */
  loadData() {
    console.log("Carregando dados...");

    setTimeout(() => {
      this.tableData = this.getMockData();
      this.originalData = [...this.tableData]; // Armazenar dados originais
      this.totalPages = 10;
      this.renderTable();
    }, 300);
  }

  /**
   * Renderiza a tabela com os dados
   */
  renderTable() {
    const tableContainer = document.getElementById('entities-table');
    if (!tableContainer) {
      console.error("Container da tabela não encontrado!");
      return;
    }

    if (!this.tableData || !this.tableData.length) {
      tableContainer.innerHTML = '<p class="text-center py-4">Nenhum dado disponível</p>';
      return;
    }

    try {
      const columns = [
        {
          key: 'acoes',
          title: 'AÇÕES',
          align: 'center',
          width: '10%',
          format: (value, row) => {
            if (!row) return '';
            return `
              <div class="flex space-x-2 justify-center">
                <button class="layout-btn bg-blue-dark text-white text-xs rounded px-2 py-1" data-id="${row.id || ''}">
                  <i class="fa-solid fa-eye mr-1"></i> Layout
                </button>
                <button class="edit-btn bg-blue-dark text-white text-xs rounded px-2 py-1" data-id="${row.id || ''}">
                  <i class="fa-solid fa-edit mr-1"></i> Editar
                </button>
              </div>
            `;
          }
        },
        { key: 'entidade', title: 'ENTIDADE', align: 'left', width: '25%' },
        { key: 'responsavel', title: 'RESPONSÁVEL', align: 'left', width: '20%' },
        { key: 'setor', title: 'SETOR', align: 'left', width: '15%' },
        { key: 'cargo', title: 'CARGO', align: 'left', width: '15%' },
        { key: 'matricula', title: 'MATRÍCULA', align: 'center', width: '10%' },
        { key: 'cidade', title: 'CIDADE', align: 'left', width: '15%' }
      ];

      const safeData = this.tableData.map(item => ({
        ...item,
        id: item.id || Math.floor(Math.random() * 1000)
      }));

      new IndexesTable({
        container: tableContainer,
        data: safeData,
        title: '',
        columns: columns,
        options: {
          headerBgClass: 'bg-[#264757]',
          headerTextClass: 'text-white font-medium text-xs uppercase tracking-wider',
          rowBgClass: 'bg-white',
          evenRowBgClass: 'bg-slate-50',
          tableClass: 'min-w-full border-collapse'
        }
      });

      setTimeout(() => {
        document.querySelectorAll('.layout-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            toast.info(`Visualizando layout da entidade ID: ${id}`);
          });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            toast.info(`Editando entidade ID: ${id}`);
          });
        });
      }, 100);
    } catch (error) {
      console.error("Erro ao renderizar tabela:", error);
      tableContainer.innerHTML = `<p class="text-center text-red-500 py-4">Erro ao renderizar tabela: ${error.message}</p>`;
    }
  }

  /**
   * Gera dados simulados para a tabela
   */
  getMockData() {
    const entidades = [
      'Prefeitura Municipal de Pontes e Lacerda',
      'Prefeitura Municipal de Várzea Grande'
    ];
    const responsaveis = ['José Medeiros Vieira', 'Jorge Lima Souza'];
    const setores = ['TRIBUTOS'];
    const cargos = ['Fiscal do Tributo Municipal'];
    const matriculas = ['0522', '0321'];
    const cidades = ['Pontes e Lacerda', 'Várzea Grande'];

    return Array.from({ length: 10 }, (_, i) => {
      const id = (125 - i) - ((this.currentPage - 1) * 10);
      return {
        id: id,
        entidade: entidades[Math.floor(Math.random() * entidades.length)],
        responsavel: responsaveis[Math.floor(Math.random() * responsaveis.length)],
        setor: setores[Math.floor(Math.random() * setores.length)],
        cargo: cargos[Math.floor(Math.random() * cargos.length)],
        matricula: matriculas[Math.floor(Math.random() * matriculas.length)],
        cidade: cidades[Math.floor(Math.random() * cidades.length)]
      };
    });
  }

  /**
   * Inicializa a página
   */
  static initialize() {
    return new EntitiesPage();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  EntitiesPage.initialize();
});

export default EntitiesPage;