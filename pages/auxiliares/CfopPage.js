/**
 * CfopPage.js - Página de listagem de CFOPs
 */
import { Header } from '/components/layout/Header.js';
import { toast } from '/js/Utilities.js';
import RegisterCfopComponent from '/pages/auxiliares/register/RegisterCfopComponent.js';
import EditCfopComponent from '/pages/auxiliares/edit/EditCfopComponent.js';
import SearchCfopComponent from '/pages/auxiliares/search/SearchCfopComponent.js';
import PrintCfopComponent from '/pages/auxiliares/print/PrintCfopComponent.js';
import ModalComponent from '/components/common/ModalComponent.js';

class CfopPage {
  constructor() {
    this.tableData = [];
    this.originalData = []; // Armazenar dados originais
    this.modal = null;
    this.initialize();
  }

  /**
   * Inicializa a página
   */
  initialize() {
    console.log("Inicializando CfopPage...");

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
          <div class="text-gray-500 text-base leading-tight">Auxiliares | Cfop</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Cfop</div>
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
    tableContainer.id = 'cfop-table';
    tableContainer.className = 'w-full px-2';
    card.appendChild(tableContainer);

    // Botões abaixo da tabela
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
        toast.info('Abrindo formulário de pesquisa...');
        this.openSearchModal();
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        toast.info('Abrindo formulário de impressão...');
        this.openPrintModal();
      });
    }
  }

  /**
   * Abre o modal com o formulário de cadastro
   */
  openRegisterModal() {
    const registerComponent = new RegisterCfopComponent({
      onSubmit: (data) => {
        console.log('Formulário submetido:', data);
        // Adicionar novo CFOP aos dados da tabela
        this.tableData.unshift({
          id: Math.max(...this.tableData.map(d => d.id), 0) + 1,
          cfop: parseInt(data.cfop),
          descricao: data.descricao,
          aplicacao: data.aplicacao
        });
        this.originalData = [...this.tableData]; // Atualizar dados originais
        this.renderTable();
        toast.success('CFOP cadastrado com sucesso!');
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de CFOPs');
      }
    });

    this.modal = new ModalComponent({
      id: 'register-cfop-modal',
      title: 'Cadastrar CFOP',
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
   * Abre o modal com o formulário de edição
   */
  openEditModal(cfopId) {
    const cfopData = this.tableData.find(item => item.id === cfopId);
    if (!cfopData) {
      toast.error('CFOP não encontrado!');
      return;
    }

    const editComponent = new EditCfopComponent({
      cfopData: cfopData,
      onUpdate: (updatedData) => {
        this.updateData(updatedData);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de CFOPs');
      }
    });

    this.modal = new ModalComponent({
      id: 'edit-cfop-modal',
      title: 'Editar CFOP',
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
   * Abre o modal com o formulário de pesquisa
   */
  openSearchModal() {
    const searchComponent = new SearchCfopComponent({
      onSearch: (filters) => {
        this.applySearchFilters(filters);
        this.modal.close();
      },
      onBack: () => {
        this.tableData = [...this.originalData]; // Restaurar dados originais
        this.renderTable();
        this.modal.close();
        toast.info('Retornado à lista de CFOPs');
      }
    });

    this.modal = new ModalComponent({
      id: 'search-cfop-modal',
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

  /**
   * Aplica os filtros de pesquisa aos dados da tabela
   */
  applySearchFilters(filters) {
    let filteredData = [...this.originalData];

    if (filters.cfop) {
      filteredData = filteredData.filter(item => item.cfop === filters.cfop);
    }

    if (filters.descricao) {
      filteredData = filteredData.filter(item =>
        item.descricao.toLowerCase().includes(filters.descricao.toLowerCase())
      );
    }

    if (filters.aplicacao) {
      filteredData = filteredData.filter(item =>
        item.aplicacao.toLowerCase().includes(filters.aplicacao.toLowerCase())
      );
    }

    this.tableData = filteredData;
    this.renderTable();
    toast.success('Pesquisa concluída!');
  }

  /**
   * Abre o modal com o formulário de impressão
   */
  openPrintModal() {
    const printComponent = new PrintCfopComponent({
      onPrint: (filters) => {
        // Simular impressão (mostrar os filtros aplicados)
        let printMessage = 'Imprimindo CFOPs com os seguintes filtros:\n';
        if (filters.cfop) printMessage += `- CFOP: ${filters.cfop}\n`;
        if (filters.descricao) printMessage += `- Descrição: ${filters.descricao}\n`;
        if (filters.aplicacao) printMessage += `- Aplicação: ${filters.aplicacao}\n`;
        toast.info(printMessage);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de CFOPs');
      }
    });

    this.modal = new ModalComponent({
      id: 'print-cfop-modal',
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

  /**
   * Atualiza os dados da tabela com os valores editados
   */
  updateData(updatedData) {
    this.tableData = this.tableData.map(item =>
      item.id === updatedData.id ? updatedData : item
    );
    this.originalData = [...this.tableData]; // Atualizar dados originais
    this.renderTable();
    toast.success('CFOP atualizado com sucesso!');
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
    const tableContainer = document.getElementById('cfop-table');
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
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">CFOP</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 30%">DESCRIÇÃO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 50%">APLICAÇÃO</th>
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
              </div>
            </td>
            <td class="text-center py-2 px-4">${row.cfop}</td>
            <td class="text-left py-2 px-4">${row.descricao}</td>
            <td class="text-left py-2 px-4">${row.aplicacao}</td>
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
   * Configura os eventos dos botões da tabela (Editar)
   */
  setupTableButtonEvents() {
    const editButtons = document.querySelectorAll('.edit-btn');

    console.log('Found edit buttons:', editButtons.length); // Debug log

    editButtons.forEach(button => {
      console.log('Binding event to edit button with data-id:', button.getAttribute('data-id')); // Debug log
      button.addEventListener('click', () => {
        const cfopId = parseInt(button.getAttribute('data-id'));
        toast.info('Abrindo formulário de edição...');
        this.openEditModal(cfopId);
      });
    });
  }

  /**
   * Gera dados simulados para a tabela
   */
  getMockData() {
    const cfops = [
      { cfop: 7949, descricao: 'Outra saída de mercadoria ou prestação de serviço não especificado.', aplicacao: 'Classifica-se neste código as outras saídas de mercadorias ou prestações de serviços que não tenham sido especificadas nos códigos anteriores.' },
      { cfop: 7930, descricao: 'Lançamento efetuado a título de devolução de bem cuja entrada tenha ocorrido sob amparo de regime especial aduaneiro de admissão temporária.', aplicacao: 'Classifica-se neste código os lançamentos efetuados a título de saída em devolução de bens cuja entrada tenha ocorrido sob amparo de regime especial aduaneiro de admissão temporária.' },
      { cfop: 7667, descricao: 'Venda de combustível ou lubrificante a consumidor ou usuário final.', aplicacao: 'Classifica-se neste código a venda de combustível ou lubrificante a consumidor ou usuário final, cuja operação tenha sido efetuada por estabelecimento distribuidor ou varejista, a partir de 05/2009 - a partir de 01/07/2010 - Decreto nº 34.490/2009). Ajuste SINIEF 05/2009.' },
      { cfop: 7654, descricao: 'Venda de combustível ou lubrificante adquiridos ou recebidos de terceiros.', aplicacao: 'Classifica-se neste código a venda de combustível ou lubrificante adquiridos ou recebidos de terceiros, destinada a comercialização, a partir de 01.01.2004 - Decreto nº 26.174 de 26/11/2003.' },
      { cfop: 7651, descricao: 'Venda de combustível ou lubrificante de produção do estabelecimento.', aplicacao: 'Classifica-se neste código a venda de combustível ou lubrificante de produção do estabelecimento, destinados a comercialização, a partir de 01.01.2004 - Decreto nº 26.174 de 26/11/2003.' },
      { cfop: 7556, descricao: 'Devolução de compra de material de uso ou consumo.', aplicacao: 'Classifica-se neste código as devoluções de mercadorias destinadas ao uso ou consumo do estabelecimento, cuja entrada tenha sido classificada no código 3.556 - Compra de material para uso ou consumo.' },
      { cfop: 7553, descricao: 'Devolução de compra de bem para o ativo imobilizado.', aplicacao: 'Classifica-se neste código as devoluções de bens adquiridos para integrar o ativo imobilizado do estabelecimento, cuja entrada foi classificada no código 3.551 - Compra de bem para o ativo imobilizado.' }
    ];

    return cfops.map((item, index) => ({
      id: index + 1,
      ...item
    }));
  }

  /**
   * Inicializa a página
   */
  static initialize() {
    return new CfopPage();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  CfopPage.initialize();
});

export default CfopPage;