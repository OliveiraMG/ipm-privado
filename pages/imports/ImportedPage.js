/**
 * ImportedPage.js - Página de listagem de arquivos importados
 */
import { Header } from '/components/layout/Header.js';
import IndexesTable from '/components/tables/IndexesTable.js';
import { toast } from '/js/Utilities.js';

class ImportedPage {
  constructor() {
    this.currentPage = 1;
    this.totalPages = 10;
    this.pageSize = 10;
    this.tableData = [];
    this.initialize();
  }

  /**
   * Inicializa a página
   */
  initialize() {
    console.log("Inicializando ImportedPage...");
    
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
          <div class="text-gray-500 text-base leading-tight">Importação | Importados</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Importados</div>
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
    card.className = 'bg-white rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.25)] mx-24 my-20 p-12 ';

    // Container para a tabela
    const tableContainer = document.createElement('div');
    tableContainer.id = 'importados-table';
    tableContainer.className = 'w-full px-2';
    card.appendChild(tableContainer);

    // Container para paginação
    const paginationContainer = document.createElement('div');
    paginationContainer.id = 'pagination-container';
    paginationContainer.className = 'flex justify-center items-center py-10 mb-2';
    card.appendChild(paginationContainer);

    // Adicionar card à página
    mainContent.appendChild(card);

    // Adicionar modal de confirmação de estorno (oculto inicialmente)
    this.createEstornoModal();
  }

  /**
   * Cria o modal de confirmação de estorno
   */
  createEstornoModal() {
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modal-overlay';
    modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';

    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-xl shadow-lg p-6 max-w-md w-full';

    // Cabeçalho do modal
    const modalHeader = document.createElement('div');
    modalHeader.className = 'flex justify-between items-center mb-4';
    modalHeader.innerHTML = `
      <h3 class="text-xl font-medium text-blue-dark">Confirmar Estorno</h3>
      <button id="close-modal" class="text-gray-500 hover:text-gray-700">
        <i class="fa-solid fa-times"></i>
      </button>
    `;

    // Corpo do modal
    const modalBody = document.createElement('div');
    modalBody.className = 'mb-6';
    modalBody.innerHTML = `
      <p class="text-gray-600">Você está prestes a estornar o registro <span id="estorno-id" class="font-bold"></span>.</p>
      <p class="text-gray-600 mt-2">Esta ação não pode ser desfeita. Deseja continuar?</p>
    `;

    // Rodapé do modal com botões
    const modalFooter = document.createElement('div');
    modalFooter.className = 'flex justify-end space-x-3';

    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancel-estorno';
    cancelButton.className = 'px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100';
    cancelButton.textContent = 'Cancelar';

    const confirmButton = document.createElement('button');
    confirmButton.id = 'confirm-estorno';
    confirmButton.className = 'px-4 py-2 bg-blue-dark text-white rounded-md hover:bg-blue-medium';
    confirmButton.textContent = 'Confirmar';

    modalFooter.appendChild(cancelButton);
    modalFooter.appendChild(confirmButton);

    // Montar o modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalOverlay.appendChild(modalContent);

    // Adicionar ao documento
    document.body.appendChild(modalOverlay);

    // Configurar eventos
    document.getElementById('close-modal').addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('cancel-estorno').addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('confirm-estorno').addEventListener('click', () => {
      const idElement = document.getElementById('estorno-id');
      const id = idElement ? idElement.getAttribute('data-id') : null;
      if (id) {
        this.processEstorno(id);
      }
      this.closeModal();
    });
  }

  /**
   * Abre o modal para confirmar estorno
   * @param {string} id - ID do registro a ser estornado
   */
  openEstornoModal(id) {
    const modalOverlay = document.getElementById('modal-overlay');
    const idElement = document.getElementById('estorno-id');
    
    if (modalOverlay && idElement) {
      idElement.textContent = id;
      idElement.setAttribute('data-id', id);
      modalOverlay.classList.remove('hidden');
    }
  }

  /**
   * Fecha o modal de confirmação
   */
  closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.add('hidden');
    }
  }

  /**
   * Processa o estorno após confirmação
   * @param {string} id - ID do registro a ser estornado
   */
  processEstorno(id) {
    toast.info(`Iniciando estorno do arquivo ID: ${id}`);
    
    // Simulação de estorno bem-sucedido
    setTimeout(() => {
      toast.success(`Estorno do arquivo ID: ${id} realizado com sucesso`);
      // Recarregar dados após estorno
      this.loadData();
    }, 1500);
  }

  /**
   * Carrega os dados da tabela
   */
  loadData() {
    console.log("Carregando dados...");
    
    // Simular carregamento com um pequeno delay
    setTimeout(() => {
      // Dados simulados para a tabela
      this.tableData = this.getMockData();
      this.totalPages = 10; // Simulando um total de 10 páginas
      
      this.renderTable();
      this.renderPagination();
    }, 300);
  }

  /**
   * Renderiza a tabela com os dados
   */
  renderTable() {
    const tableContainer = document.getElementById('importados-table');
    if (!tableContainer) {
      console.error("Container da tabela não encontrado!");
      return;
    }
    
    // Verificar se temos dados para exibir
    if (!this.tableData || !this.tableData.length) {
      tableContainer.innerHTML = '<p class="text-center py-4">Nenhum dado disponível</p>';
      return;
    }
    
    try {
      // Definição das colunas para corresponder exatamente ao Figma
      const columns = [
        {
          key: 'acoes',
          title: 'AÇÕES',
          align: 'center',
          width: '8%',
          format: function(value, row) {
            // Verificação de segurança para evitar o erro
            if (!row) return '';
            
            return `
              <button class="estornar-btn bg-[#264757] text-white text-xs rounded flex items-center justify-center mx-auto px-2 py-1" data-id="${row.id || ''}">
                <i class="fa-solid fa-rotate-left mr-1"></i> Estornar
              </button>
            `;
          }
        },
        { key: 'id', title: 'ID', align: 'center', width: '5%' },
        { key: 'remessa', title: 'REMESSA', align: 'center', width: '7%' },
        { key: 'publicacao', title: 'PUBLICAÇÃO', align: 'center', width: '15%' },
        { key: 'usuario', title: 'USUÁRIO', align: 'center', width: '8%' },
        { key: 'protocolo', title: 'PROTOCOLO', align: 'center', width: '12%' },
        { key: 'ano', title: 'ANO (BASE/APURAÇÃO)', align: 'center', width: '12%' },
        { key: 'inclusao', title: 'INCLUSÃO', align: 'center', width: '9%' },
        { key: 'arquivo', title: 'ARQUIVO', align: 'center', width: '6%' },
        { key: 'quantidade', title: 'QUANTIDADE', type: 'number', align: 'center', width: '6%' },
        {
          key: 'baixar',
          title: 'BAIXAR PROTOCOLO',
          align: 'center',
          width: '8%',
          format: function(value, row) {
            // Verificação de segurança para evitar o erro
            if (!row) return '';
            
            if ((row.id || 0) % 3 === 0) {
              return `<span class="text-gray-400">Gerando PDF...</span>`;
            } else {
              return `<a href="#" class="text-blue-light hover:underline baixar-link" data-id="${row.id || ''}">Baixar</a>`;
            }
          }
        }
      ];

      // Criar os dados da tabela com estrutura garantida
      const safeData = this.tableData.map(item => {
        return {
          ...item,
          id: item.id || Math.floor(Math.random() * 1000) // Garantir que id existe
        };
      });
    
      // Renderizar a tabela usando o componente IndexesTable
      new IndexesTable({
        container: tableContainer,
        data: safeData,
        title: '', // Removido para evitar duplicação do título
        columns: columns,
        options: {
          headerBgClass: 'bg-[#264757]',
          headerTextClass: 'text-white font-medium text-xs uppercase tracking-wider',
          rowBgClass: 'bg-white',
          evenRowBgClass: 'bg-slate-50',
          tableClass: 'min-w-full border-collapse'
        }
      });

      // Adicionar event listeners aos botões
      setTimeout(() => {
        // Event listeners para botões de estornar
        document.querySelectorAll('.estornar-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            this.openEstornoModal(id);
          });
        });

        // Event listeners para links de baixar
        document.querySelectorAll('.baixar-link').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.target.getAttribute('data-id');
            this.handleDownload(id);
          });
        });
      }, 100);
    } catch (error) {
      console.error("Erro ao renderizar tabela:", error);
      tableContainer.innerHTML = `<p class="text-center text-red-500 py-4">Erro ao renderizar tabela: ${error.message}</p>`;
    }
  }

  /**
   * Renderiza a paginação conforme o print do figma
   */
  renderPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    // Criar elemento para o botão anterior (<)
    const prevButton = document.createElement('a');
    prevButton.href = "#";
    prevButton.className = 'px-2 py-1 border border-gray-300 rounded-l text-gray-600 hover:bg-gray-100';
    prevButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    if (this.currentPage > 1) {
      prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.currentPage--;
        this.loadData();
      });
    } else {
      prevButton.classList.add('opacity-50', 'cursor-not-allowed');
      prevButton.href = "javascript:void(0)";
    }
    paginationContainer.appendChild(prevButton);

    // Criação dos botões de página (1, 2, ... 9, 10)
    // Página 1
    const page1Button = document.createElement('a');
    page1Button.href = "#";
    page1Button.className = this.currentPage === 1 
      ? 'px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 font-medium border-l-0' 
      : 'px-3 py-1 border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-100';
    page1Button.textContent = "1";
    if (this.currentPage !== 1) {
      page1Button.addEventListener('click', (e) => {
        e.preventDefault();
        this.currentPage = 1;
        this.loadData();
      });
    }
    paginationContainer.appendChild(page1Button);

    // Página 2
    const page2Button = document.createElement('a');
    page2Button.href = "#";
    page2Button.className = this.currentPage === 2 
      ? 'px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 font-medium border-l-0' 
      : 'px-3 py-1 border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-100';
    page2Button.textContent = "2";
    if (this.currentPage !== 2) {
      page2Button.addEventListener('click', (e) => {
        e.preventDefault();
        this.currentPage = 2;
        this.loadData();
      });
    }
    paginationContainer.appendChild(page2Button);

    // Ellipsis (...)
    const ellipsis = document.createElement('a');
    ellipsis.href = "javascript:void(0)";
    ellipsis.className = 'px-3 py-1 border border-l-0 border-gray-300 text-gray-600';
    ellipsis.textContent = "...";
    paginationContainer.appendChild(ellipsis);

    // Página 9
    const page9Button = document.createElement('a');
    page9Button.href = "#";
    page9Button.className = this.currentPage === 9 
      ? 'px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 font-medium border-l-0' 
      : 'px-3 py-1 border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-100';
    page9Button.textContent = "9";
    if (this.currentPage !== 9) {
      page9Button.addEventListener('click', (e) => {
        e.preventDefault();
        this.currentPage = 9;
        this.loadData();
      });
    }
    paginationContainer.appendChild(page9Button);

    // Página 10
    const page10Button = document.createElement('a');
    page10Button.href = "#";
    page10Button.className = this.currentPage === 10 
      ? 'px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 font-medium border-l-0' 
      : 'px-3 py-1 border border-l-0 border-gray-300 text-gray-600 hover:bg-gray-100';
    page10Button.textContent = "10";
    if (this.currentPage !== 10) {
      page10Button.addEventListener('click', (e) => {
        e.preventDefault();
        this.currentPage = 10;
        this.loadData();
      });
    }
    paginationContainer.appendChild(page10Button);

    // Criar elemento para o botão próximo (>)
    const nextButton = document.createElement('a');
    nextButton.href = "#";
    nextButton.className = 'px-2 py-1 border border-l-0 border-gray-300 rounded-r text-gray-600 hover:bg-gray-100';
    nextButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    if (this.currentPage < this.totalPages) {
      nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.currentPage++;
        this.loadData();
      });
    } else {
      nextButton.classList.add('opacity-50', 'cursor-not-allowed');
      nextButton.href = "javascript:void(0)";
    }
    paginationContainer.appendChild(nextButton);
  }

  /**
   * Manipula o clique no link de download
   * @param {string} id - ID do item
   */
  handleDownload(id) {
    // Feedback visual para o usuário
    toast.info(`Iniciando download do arquivo ID: ${id}`);
    
    // Simulação de download bem-sucedido
    setTimeout(() => {
      toast.success(`Download do arquivo ID: ${id} concluído com sucesso`);
    }, 1500);
  }

  /**
   * Gera dados simulados para a tabela
   */
  getMockData() {
    const remessas = ['Avulsos', 'Receita Federal', 'Prefeitura'];
    const publicacoes = [
      'EFD-ESCRITURAÇÃO FISCAL DIGITAL – registros por CFOPs',
      'GIA-ICMS LANÇAMENTOS',
      'PGDAS-D'
    ];
    const usuarios = ['Desenvolvedor', 'Administrador', 'Fiscal'];
    const arquivos = ['PDF', 'XLSX', 'CSV'];
    
    // Gerar 10 linhas de dados simulados
    return Array.from({ length: 10 }, (_, i) => {
      const id = (125 - i) - ((this.currentPage - 1) * 10);
      const date = new Date(2024, 9, 15, 14, Math.floor(Math.random() * 59));
      
      return {
        id: id,
        remessa: remessas[Math.floor(Math.random() * remessas.length)],
        publicacao: publicacoes[Math.floor(Math.random() * publicacoes.length)],
        usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
        protocolo: `ID0241015021${id}P${Math.floor(Math.random() * 1000000)}`,
        ano: '2024-2025',
        inclusao: date.toLocaleString('pt-BR', {
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', ''),
        arquivo: arquivos[Math.floor(Math.random() * arquivos.length)],
        quantidade: Math.floor(Math.random() * 150)
      };
    });
  }

  /**
   * Inicializa a página
   */
  static initialize() {
    return new ImportedPage();
  }
}

// Inicializar a página quando o documento carregar
document.addEventListener('DOMContentLoaded', () => {
  ImportedPage.initialize();
});

export default ImportedPage;