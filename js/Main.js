/**
 * Main.js - Módulo principal da aplicação IPM-e
 */

// Importações
import { Header } from '../components/layout/Header.js';
import StatsSection from '../components/layout/StatsSection.js';
import TabsManager from '../components/layout/TabsManager.js';
import MunicipalityTable from '../components/tables/MunicipalityTable.js';
import IndexesTable from '../components/tables/IndexesTable.js';
import { getMunicipality } from '../services/MunicipalityService.js';
import { toast, formatNumber } from './Utilities.js';

// Inicialização ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM carregado, inicializando aplicação");
  App.init();
});

/**
 * Aplicação principal
 */
const App = {
  // Estado da aplicação
  state: {
    selectedMunicipality: null,
    activeTab: 'município'
  },
  
  // Inicialização da aplicação
  init() {
    console.log("Inicializando App");
    this.renderHeader();
    this.initEventListeners();
    this.setupComponents();
  },
  
  // Renderiza o cabeçalho
  renderHeader() {
    console.log("Renderizando header");
    try {
      Header.initialize();
    } catch (error) {
      console.error("Erro ao renderizar header:", error);
    }
  },
  
  // Inicializa os componentes da aplicação
  setupComponents() {
    console.log("Configurando componentes");
    
    // Verificar se existem tabs na página
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) {
      console.warn("Container de tabs não encontrado");
      return;
    }
    
    // Inicializar gerenciador de tabs
    try {
      this.tabsManager = new TabsManager({
        container: '.tabs',
        onTabChange: (tabName) => {
          console.log(`Tab alterada para: ${tabName}`);
          this.state.activeTab = tabName;
          this.renderTabContent();
        }
      });
    } catch (error) {
      console.error("Erro ao inicializar TabsManager:", error);
    }
  },
  
  // Configura os event listeners
  initEventListeners() {
    console.log("Configurando event listeners");
    
    // Botão de busca
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
      searchButton.addEventListener('click', () => {
        console.log("Botão de busca clicado");
        this.handleSearch();
      });
    } else {
      console.warn("Botão de busca não encontrado");
    }
    
    // Navegação do menu principal
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (!link.getAttribute('aria-current')) {
          console.log('Navegação para:', link.textContent.trim());
          // Implementação futura de roteamento entre módulos
        }
      });
    });
  },
  
  // Manipula a busca de município
  async handleSearch() {
    const select = document.getElementById('municipality-select');
    if (!select || !select.value || select.value === select.options[0].value) {
      console.warn("Nenhum município selecionado");
      
      // Verificar se o toast está disponível
      if (typeof toast !== 'undefined' && toast.warning) {
        toast.warning('Por favor, selecione um município');
      } else {
        alert('Por favor, selecione um município');
      }
      return;
    }
    
    // Salvar o município selecionado
    this.state.selectedMunicipality = select.value;
    console.log(`Município selecionado: ${this.state.selectedMunicipality}`);
    
    // Atualizar o título
    this.updateTitle(select.value);
    
    // Buscar e renderizar os dados
    try {
      console.log(`Buscando dados para: ${select.value}`);
      const data = await getMunicipality(select.value);
      this.renderMunicipalityData(data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      
      // Verificar se o toast está disponível
      if (typeof toast !== 'undefined' && toast.error) {
        toast.error('Erro ao buscar dados do município');
      } else {
        alert(`Erro: ${error.message}`);
      }
    }
  },
  
  // Atualiza o título da página
  updateTitle(municipalityName) {
    const titleElement = document.getElementById('municipality-title');
    if (titleElement) {
      titleElement.textContent = municipalityName;
      console.log(`Título atualizado para: ${municipalityName}`);
    } else {
      console.warn("Elemento de título não encontrado");
    }
  },
  
  // Renderiza os dados do município
  renderMunicipalityData(data) {
    console.log("Renderizando dados do município");
    
    // Renderizar os cards de estatísticas
    this.renderStats(data);
    
    // Renderizar o conteúdo da tab ativa
    this.renderTabContent(data);
  },
  
  // Renderiza os cards de estatísticas
  renderStats(data) {
    console.log("Renderizando estatísticas");
    
    const container = document.getElementById('stats-container');
    if (!container || !data.contribuintes) {
      console.warn("Container de stats não encontrado ou dados incompletos");
      return;
    }
    
    try {
      StatsSection.renderWithData(container, {
        title: 'Quantidade de Contribuintes do ICMS',
        data: data.contribuintes
      });
      console.log("Estatísticas renderizadas com sucesso");
    } catch (error) {
      console.error("Erro ao renderizar estatísticas:", error);
    }
  },
  
  // Renderiza o conteúdo da tab ativa
  renderTabContent(data = null) {
    // Se não há dados e não há município selecionado, não fazer nada
    if (!data && !this.state.selectedMunicipality) {
      console.log("Sem dados para renderizar conteúdo da tab");
      return;
    }
    
    // Se não recebeu dados, tentar buscar novamente
    if (!data) {
      console.log(`Tentando buscar dados para ${this.state.selectedMunicipality}`);
      getMunicipality(this.state.selectedMunicipality)
        .then(municipalityData => this.renderTabContent(municipalityData))
        .catch(error => {
          console.error('Erro ao buscar dados para tab:', error);
          this.renderEmptyTabContent();
        });
      return;
    }
    
    console.log(`Renderizando conteúdo da tab: ${this.state.activeTab}`);
    
    // Renderizar o conteúdo com base na tab ativa
    switch (this.state.activeTab) {
      case 'município':
        this.renderMunicipalityTab(data);
        break;
      case 'gráficos':
        this.renderGraphicsTab(data);
        break;
      case 'estado':
        this.renderStateTab(data);
        break;
      default:
        console.log(`Tab desconhecida: ${this.state.activeTab}, usando município como padrão`);
        this.renderMunicipalityTab(data);
    }
  },
  
  // Renderiza a tab de município
  renderMunicipalityTab(data) {
    console.log("Renderizando tab de município");
    const container = document.querySelector('.tab-content');
    if (!container) {
      console.warn("Container de conteúdo de tab não encontrado");
      return;
    }
    
    // Definir o título
    container.innerHTML = '<h3 class="text-xl font-medium text-blue-dark mb-4">Repasses ao Município</h3>';
    
    try {
      // Renderizar tabela de repasses
      if (data.repasses) {
        console.log("Renderizando tabela de repasses");
        const tableContainer = document.createElement('div');
        container.appendChild(tableContainer);
        
        try {
          new MunicipalityTable({
            container: tableContainer,
            data: data.repasses,
            municipalityName: this.state.selectedMunicipality
          });
        } catch (error) {
          console.error("Erro ao renderizar tabela de repasses:", error);
          tableContainer.innerHTML = '<p class="text-red-500">Erro ao renderizar tabela de repasses</p>';
        }
      } else {
        console.warn("Dados de repasses não encontrados");
      }
      
      // Renderizar seção de índices
      if (data.indices && data.indices.length > 0) {
        console.log("Renderizando tabelas de índices");
        // Título da seção
        const indicesTitle = document.createElement('h3');
        indicesTitle.className = 'text-xl font-medium text-blue-dark mb-4 mt-16';
        indicesTitle.textContent = 'Índices';
        container.appendChild(indicesTitle);
        
        // Grid para as tabelas
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';
        container.appendChild(grid);
        
        // Tabela 01
        const positionContainer = document.createElement('div');
        grid.appendChild(positionContainer);
        
        try {
          new IndexesTable({
            container: positionContainer,
            data: data.indices,
            title: 'Tablea 01'
          });
        } catch (error) {
          console.error("Erro ao renderizar tabela de índices:", error);
          positionContainer.innerHTML = '<p class="text-red-500">Erro ao renderizar tabela de índices</p>';
        }
        
        // Tabela 02
        if (data.execucao && data.execucao.length > 0) {
          const executionContainer = document.createElement('div');
          grid.appendChild(executionContainer);
          
          try {
            new IndexesTable({
              container: executionContainer,
              data: data.execucao,
              title: 'Tabela 02'
            });
          } catch (error) {
            console.error("Erro ao renderizar tabela de execução:", error);
            executionContainer.innerHTML = '<p class="text-red-500">Erro ao renderizar tabela de execução</p>';
          }
        }
        
        // Adicionar gráfico VAF abaixo das tabelas de índices
        if (data.vaf && data.vaf.length > 0) {
          console.log("Renderizando gráfico VAF abaixo das tabelas de índices");
          
          // Título da seção VAF
          const vafTitle = document.createElement('h3');
          vafTitle.className = 'text-xl font-medium text-blue-dark mb-4 mt-16';
          vafTitle.textContent = `Visão do Valor Adicionado Fiscal de ${this.state.selectedMunicipality}`;
          container.appendChild(vafTitle);
          
          // Container para o gráfico
          const vafChartContainer = document.createElement('div');
          container.appendChild(vafChartContainer);
          
          // Importar e usar o componente de gráfico
          import('../components/layout/ChartComponent.js')
            .then(module => {
              const ChartComponent = module.default;
              
              // Preparar dados para o gráfico
              const chartData = this.prepareVafChartData(data.vaf);
              
              // Criar o gráfico
              new ChartComponent({
                container: vafChartContainer,
                title: '', // Título já adicionado separadamente acima
                type: 'bar',
                data: chartData,
                options: {
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return value >= 1000 ? (value / 1000) + 'k' : value;
                        }
                      }
                    }
                  },
                  plugins: {
                    title: {
                      display: false // Não mostrar título no gráfico
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const value = context.raw;
                          return `${context.dataset.label}: R$ ${value.toLocaleString('pt-BR')}`;
                        }
                      }
                    }
                  }
                }
              });
            })
            .catch(error => {
              console.error("Erro ao carregar componente de gráfico:", error);
              vafChartContainer.innerHTML = `
                <div class="bg-white rounded-[16px] shadow-[6px_6px_12px_rgba(0,0,0,0.25)] p-6">
                  <p class="text-red-500">Erro ao carregar gráfico: ${error.message}</p>
                </div>
              `;
            });
        }
      } else {
        console.warn("Dados de índices não encontrados");
      }
    } catch (error) {
      console.error("Erro ao renderizar tab de município:", error);
      container.innerHTML += `
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <p class="text-red-500">Erro ao renderizar conteúdo: ${error.message}</p>
        </div>
      `;
    }
  },
  
  // Renderiza a tab de gráficos
  renderGraphicsTab(data) {
    console.log("Renderizando tab de gráficos");
    const container = document.querySelector('.tab-content');
    if (!container) return;
    
    // Limpar o container
    container.innerHTML = '';
    
    // Criar título da página
    const title = document.createElement('h3');
    title.className = 'text-xl font-medium text-blue-dark mb-6';
    title.textContent = 'Gráficos';
    container.appendChild(title);
    
    try {
      // Importar o componente de gráfico
      import('../components/layout/ChartComponent.js')
        .then(module => {
          const ChartComponent = module.default;
          
          // 1. Gráfico de Valor Adicionado Fiscal
          if (data.vaf && data.vaf.length > 0) {
            const vafContainer = document.createElement('div');
            container.appendChild(vafContainer);
            
            new ChartComponent({
              container: vafContainer,
              title: `Valor Adicionado Fiscal de ${this.state.selectedMunicipality}`,
              type: 'bar',
              data: this.prepareVafChartData(data.vaf),
              options: {
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: R$ ${context.raw.toLocaleString('pt-BR')}`;
                      }
                    }
                  }
                }
              }
            });
          }
          
          // 2. Gráfico de Indicadores do Município
          if (data.indicadores_serie && data.indicadores_serie.length > 0) {
            const indicadoresContainer = document.createElement('div');
            container.appendChild(indicadoresContainer);
            
            new ChartComponent({
              container: indicadoresContainer,
              title: 'Indicadores do Município',
              type: 'line',
              data: this.prepareIndicadoresChartData(data.indicadores_serie),
              options: {
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5
              }
            });
          }

          // 3. Gráfico de Repasses
          if (data.repasses_serie && data.repasses_serie.length > 0) {
            const repassesContainer = document.createElement('div');
            container.appendChild(repassesContainer);
            
            new ChartComponent({
              container: repassesContainer,
              title: 'Repasses ao Município',
              type: 'line',
              data: this.prepareRepassesChartData(data.repasses_serie),
              options: {
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5
              }
            });
          }
        })
        .catch(error => {
          console.error("Erro ao carregar componente de gráfico:", error);
          container.innerHTML += `
            <div class="bg-white rounded-[16px] shadow-[6px_6px_12px_rgba(0,0,0,0.25)] p-6 mb-6">
              <p class="text-red-500">Erro ao carregar componente de gráfico: ${error.message}</p>
            </div>
          `;
        });
    } catch (error) {
      console.error("Erro ao renderizar tab de gráficos:", error);
      container.innerHTML += `
        <div class="bg-white rounded-[16px] shadow-[6px_6px_12px_rgba(0,0,0,0.25)] p-6 mb-6">
          <p class="text-red-500">Erro ao renderizar gráficos: ${error.message}</p>
        </div>
      `;
    }
  },
  
  // Renderiza a tab de estado
  renderStateTab(data) {
    console.log("Renderizando tab de estado");
    const container = document.querySelector('.tab-content');
    if (!container) return;
    
    container.innerHTML = `
      <h3 class="text-xl font-medium text-blue-dark mb-4">Comparativo com o Estado</h3>
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <p class="text-gray-600 mb-4">Comparativo estadual para ${this.state.selectedMunicipality}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div id="map-container" class="h-48 bg-gray-50 rounded flex items-center justify-center">
            <div class="text-center text-gray-400">
              <i class="fa-solid fa-map-location-dot text-3xl mb-2"></i>
              <p>Mapa comparativo</p>
            </div>
          </div>
          <div id="state-stats" class="h-48 bg-gray-50 rounded flex items-center justify-center">
            <div class="text-center text-gray-400">
              <i class="fa-solid fa-chart-pie text-3xl mb-2"></i>
              <p>Estatísticas comparativas</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  // Renderiza conteúdo vazio para as tabs
  renderEmptyTabContent() {
    console.log("Renderizando conteúdo vazio para tab");
    const container = document.querySelector('.tab-content');
    if (!container) return;
    
    container.innerHTML = `
      <h3 class="text-xl font-medium text-blue-dark mb-4">Dados Indisponíveis</h3>
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="text-center py-8">
          <i class="fas fa-exclamation-circle text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">Não foi possível carregar os dados para a visualização selecionada.</p>
        </div>
      </div>
    `;
  },
  
  // Método para preparar dados do gráfico VAF
  prepareVafChartData(vafData) {
    if (!Array.isArray(vafData) || vafData.length === 0) {
      console.warn("Dados de VAF inválidos");
      return { labels: [], datasets: [] };
    }
    
    // Ordenar dados por ano (do mais antigo para o mais recente)
    const sortedData = [...vafData].sort((a, b) => a.ano - b.ano);
    
    // Extrair anos e valores
    const anos = sortedData.map(item => item.ano.toString());
    const anterior = sortedData.map(item => parseFloat(item.vaf_anterior) || 0);
    const atual = sortedData.map(item => parseFloat(item.vaf_atual) || 0);
    
    return {
      labels: anos,
      datasets: [
        {
          label: 'VAF Anterior',
          data: anterior,
          backgroundColor: 'rgba(92, 172, 209, 0.8)',
          borderColor: 'rgba(92, 172, 209, 1)',
          borderWidth: 1
        },
        {
          label: 'VAF Atual',
          data: atual,
          backgroundColor: 'rgba(59, 101, 122, 0.8)',
          borderColor: 'rgba(59, 101, 122, 1)',
          borderWidth: 1
        }
      ]
    };
  },
  
  // Função para preparar dados do gráfico de Indicadores
  prepareIndicadoresChartData(data) {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Dados de indicadores inválidos");
      return { labels: [], datasets: [] };
    }
    
    // Ordenar dados por ano
    const sortedData = [...data].sort((a, b) => a.ano - b.ano);
    
    // Extrair anos para rótulos
    const anos = sortedData.map(item => item.ano.toString());
    
    // Definir cores para as séries
    const colors = [
      { color: 'rgba(92, 172, 209, 1)', bg: 'rgba(92, 172, 209, 0.1)' },  // Azul claro
      { color: 'rgba(155, 89, 182, 1)', bg: 'rgba(155, 89, 182, 0.1)' },  // Roxo
      { color: 'rgba(46, 204, 113, 1)', bg: 'rgba(46, 204, 113, 0.1)' },  // Verde
      { color: 'rgba(231, 76, 60, 1)', bg: 'rgba(231, 76, 60, 0.1)' },    // Vermelho
      { color: 'rgba(241, 196, 15, 1)', bg: 'rgba(241, 196, 15, 0.1)' },  // Amarelo
      { color: 'rgba(52, 152, 219, 1)', bg: 'rgba(52, 152, 219, 0.1)' },  // Azul
      { color: 'rgba(230, 126, 34, 1)', bg: 'rgba(230, 126, 34, 0.1)' },  // Laranja
      { color: 'rgba(149, 165, 166, 1)', bg: 'rgba(149, 165, 166, 0.1)' } // Cinza
    ];
    
    // Criar datasets para cada indicador
    const indicators = ['iva', 'educacao', 'saude', 'ucti', 'trib_propria', 'populacao', 'area', 'indice_final'];
    const labels = ['IVA', 'Educação', 'Saúde', 'UCTI', 'Trib. Própria', 'População', 'Área', 'Índice Final'];
    
    const datasets = indicators.map((indicator, index) => {
      return {
        label: labels[index],
        data: sortedData.map(item => item[indicator]),
        borderColor: colors[index].color,
        backgroundColor: colors[index].bg,
        borderWidth: 2,
        fill: false,
        tension: 0.4
      };
    });
    
    return {
      labels: anos,
      datasets: datasets
    };
  },
  
  // Função para preparar dados do gráfico de Repasses
  prepareRepassesChartData(data) {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Dados de repasses inválidos");
      return { labels: [], datasets: [] };
    }
    
    // Ordenar dados por ano
    const sortedData = [...data].sort((a, b) => a.ano - b.ano);
    
    // Extrair anos para rótulos
    const anos = sortedData.map(item => item.ano.toString());
    
    // Definir cores para as séries
    const colors = [
      { color: 'rgba(92, 172, 209, 1)', bg: 'rgba(92, 172, 209, 0.1)' },  // Azul claro
      { color: 'rgba(155, 89, 182, 1)', bg: 'rgba(155, 89, 182, 0.1)' },  // Roxo
      { color: 'rgba(46, 204, 113, 1)', bg: 'rgba(46, 204, 113, 0.1)' },  // Verde
      { color: 'rgba(231, 76, 60, 1)', bg: 'rgba(231, 76, 60, 0.1)' },    // Vermelho
      { color: 'rgba(241, 196, 15, 1)', bg: 'rgba(241, 196, 15, 0.1)' },  // Amarelo
      { color: 'rgba(52, 152, 219, 1)', bg: 'rgba(52, 152, 219, 0.1)' },  // Azul
      { color: 'rgba(230, 126, 34, 1)', bg: 'rgba(230, 126, 34, 0.1)' },  // Laranja
      { color: 'rgba(149, 165, 166, 1)', bg: 'rgba(149, 165, 166, 0.1)' } // Cinza
    ];
    
    // Criar datasets para cada indicador
    const indicators = ['iva', 'educacao', 'saude', 'ucti', 'trib_propria', 'populacao', 'area', 'indice_final'];
    const labels = ['IVA', 'Educação', 'Saúde', 'UCTI', 'Trib. Própria', 'População', 'Área', 'Índice Final'];
    
    const datasets = indicators.map((indicator, index) => {
      return {
        label: labels[index],
        data: sortedData.map(item => item[indicator]),
        borderColor: colors[index].color,
        backgroundColor: colors[index].bg,
        borderWidth: 2,
        fill: false,
        tension: 0.4
      };
    });
    
    return {
      labels: anos,
      datasets: datasets
    };
  }
};

export default App;