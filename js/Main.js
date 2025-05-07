/**
 * Main.js - Módulo principal da aplicação IPM-e
 * Versão refatorada com melhor organização, performance e manutenção
 */

// Importações
import { Header } from "../components/layout/Header.js";
import StatsSection from "../components/layout/StatsSection.js";
import TabsManager from "../components/layout/TabsManager.js";
import MunicipalityTable from "../components/tables/MunicipalityTable.js";
import IndexesTable from "../components/tables/IndexesTable.js";
import EmptyState from "../components/common/EmptyState.js";
import Button from "../components/common/Button.js";
import Select from "../components/common/Select.js";
import { getMunicipality } from "../services/MunicipalityService.js";
import { toast, formatNumber } from "./Utilities.js";

// Inicialização ao carregar o DOM
document.addEventListener("DOMContentLoaded", () => App.init());

/**
 * Helper para manipulação do DOM
 * @private
 */
const DOMHelper = {
  /**
   * Obtém o container para o conteúdo da tab
   * @returns {HTMLElement|null}
   */
  getTabContainer() {
    return document.querySelector(".tab-content");
  },

  /**
   * Cria um elemento h3 de título
   * @param {string} text - Texto do título
   * @param {string} className - Classes adicionais
   * @returns {HTMLElement}
   */
  createTitle(text, className = "") {
    const title = document.createElement("h3");
    title.className = `text-xl font-medium text-blue-dark mb-4 ${className}`;
    title.textContent = text;
    return title;
  },

  /**
   * Cria um container para gráfico ou tabela
   * @returns {HTMLElement}
   */
  createContainer() {
    return document.createElement("div");
  },
};

/**
 * Formatador de dados para gráficos
 * @private
 */
const ChartFormatter = {
  // Paleta de cores para gráficos
  colors: [
    { color: "rgba(92, 172, 209, 1)", bg: "rgba(92, 172, 209, 0.1)" }, // Azul claro
    { color: "rgba(155, 89, 182, 1)", bg: "rgba(155, 89, 182, 0.1)" }, // Roxo
    { color: "rgba(46, 204, 113, 1)", bg: "rgba(46, 204, 113, 0.1)" }, // Verde
    { color: "rgba(231, 76, 60, 1)", bg: "rgba(231, 76, 60, 0.1)" }, // Vermelho
    { color: "rgba(241, 196, 15, 1)", bg: "rgba(241, 196, 15, 0.1)" }, // Amarelo
    { color: "rgba(52, 152, 219, 1)", bg: "rgba(52, 152, 219, 0.1)" }, // Azul
    { color: "rgba(230, 126, 34, 1)", bg: "rgba(230, 126, 34, 0.1)" }, // Laranja
    { color: "rgba(149, 165, 166, 1)", bg: "rgba(149, 165, 166, 0.1)" }, // Cinza
  ],

  /**
   * Prepara dados para o gráfico VAF
   * @param {Array} vafData - Dados do VAF
   * @returns {Object} Dados formatados para Chart.js
   */
  prepareVafChartData(vafData) {
    if (!Array.isArray(vafData) || vafData.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Ordenar dados por ano (do mais antigo para o mais recente)
    const sortedData = [...vafData].sort((a, b) => a.ano - b.ano);

    // Extrair anos e valores
    const anos = sortedData.map((item) => item.ano.toString());
    const anterior = sortedData.map(
      (item) => parseFloat(item.vaf_anterior) || 0
    );
    const atual = sortedData.map((item) => parseFloat(item.vaf_atual) || 0);

    return {
      labels: anos,
      datasets: [
        {
          label: "VAF Anterior",
          data: anterior,
          backgroundColor: "rgba(92, 172, 209, 0.8)",
          borderColor: "rgba(92, 172, 209, 1)",
          borderWidth: 1,
        },
        {
          label: "VAF Atual",
          data: atual,
          backgroundColor: "rgba(59, 101, 122, 0.8)",
          borderColor: "rgba(59, 101, 122, 1)",
          borderWidth: 1,
        },
      ],
    };
  },

  /**
   * Prepara dados para gráficos de série temporal
   * @param {Array} data - Dados da série
   * @param {Array} indicators - Nomes dos indicadores nos dados
   * @param {Array} labels - Rótulos para exibição
   * @returns {Object} Dados formatados para Chart.js
   */
  prepareTimeSeriesData(data, indicators, labels) {
    if (!Array.isArray(data) || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Ordenar dados por ano
    const sortedData = [...data].sort((a, b) => a.ano - b.ano);

    // Extrair anos para rótulos
    const anos = sortedData.map((item) => item.ano.toString());

    // Criar datasets para cada indicador
    const datasets = indicators.map((indicator, index) => {
      return {
        label: labels[index],
        data: sortedData.map((item) => item[indicator]),
        borderColor: this.colors[index % this.colors.length].color,
        backgroundColor: this.colors[index % this.colors.length].bg,
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      };
    });

    return { labels: anos, datasets };
  },

  /**
   * Prepara dados para o gráfico de indicadores
   * @param {Array} data - Dados dos indicadores
   * @returns {Object} Dados formatados para Chart.js
   */
  prepareIndicadoresChartData(data) {
    const indicators = [
      "iva",
      "educacao",
      "saude",
      "ucti",
      "trib_propria",
      "populacao",
      "area",
      "indice_final",
    ];
    const labels = [
      "IVA",
      "Educação",
      "Saúde",
      "UCTI",
      "Trib. Própria",
      "População",
      "Área",
      "Índice Final",
    ];

    return this.prepareTimeSeriesData(data, indicators, labels);
  },

  /**
   * Prepara dados para o gráfico de repasses
   * @param {Array} data - Dados dos repasses
   * @returns {Object} Dados formatados para Chart.js
   */
  prepareRepassesChartData(data) {
    const indicators = [
      "iva",
      "educacao",
      "saude",
      "ucti",
      "trib_propria",
      "populacao",
      "area",
      "indice_final",
    ];
    const labels = [
      "IVA",
      "Educação",
      "Saúde",
      "UCTI",
      "Trib. Própria",
      "População",
      "Área",
      "Índice Final",
    ];

    return this.prepareTimeSeriesData(data, indicators, labels);
  },
};

/**
 * Aplicação principal
 */
const App = {
  // Estado da aplicação
  state: {
    selectedMunicipality: null,
    activeTab: "município",
    cachedData: {}, // Cache para evitar requisições repetidas
  },

  /**
   * Inicializa a aplicação
   */
  init() {
    this.renderHeader();
    this.initFormElements();
    this.initEventListeners();
    this.setupComponents();
  },

  /**
   * Renderiza o cabeçalho
   */
  renderHeader() {
    try {
      Header.initialize();
    } catch (error) {
      console.error("Erro ao renderizar header:", error);
    }
  },

  /**
   * Inicializa os componentes da aplicação
   */
  setupComponents() {
    const tabsContainer = document.querySelector(".tabs");
    if (!tabsContainer) return;

    try {
      this.tabsManager = new TabsManager({
        container: ".tabs",
        onTabChange: (tabName) => {
          this.state.activeTab = tabName;
          this.renderTabContent();
        },
      });
    } catch (error) {
      console.error("Erro ao inicializar TabsManager:", error);
    }
  },

  /**
   * Configura o select de municípios e botão de busca
   * */
  initFormElements() {
    const searchContainer = document.querySelector(".search-container");
    if (!searchContainer) return;

    // Mostrar um indicador de carregamento
    searchContainer.innerHTML =
      '<div class="text-center py-2"><i class="fas fa-spinner fa-spin text-blue-500"></i></div>';

    try {
      // Buscar municípios da API (ou usar lista estática para testes)
      const municipalityOptions = [
        { value: "", text: "Município", disabled: true, selected: true },
        { value: "Pontes e Lacerda", text: "Pontes e Lacerda" },
        { value: "Cuiabá", text: "Cuiabá" },
        { value: "Várzea Grande", text: "Várzea Grande" },
        { value: "Rondonópolis", text: "Rondonópolis" },
        { value: "Sinop", text: "Sinop" },
      ];

      // Limpar o container
      searchContainer.innerHTML = "";

      // Criar e adicionar o select
      const selectContainer = Select.render({
        id: "municipality-select",
        options: municipalityOptions,
      });
      searchContainer.appendChild(selectContainer);

      // Criar e adicionar o botão com a função de clique
      const searchButton = Button.render({
        id: "search-button",
        text: "Buscar",
        icon: "magnifying-glass",
        type: "primary",
        className: "ml-4",
        onClick: () => {
          // Lógica para alternar a visibilidade
          const select = document.getElementById("municipality-select");
          const initialState = document.getElementById("initial-state");
          const municipalityContent = document.getElementById(
            "municipality-content"
          );

          if (
            select &&
            select.value &&
            select.value !== select.options[0].value
          ) {
            // Município selecionado - mostrar conteúdo e ocultar estado inicial
            if (initialState) initialState.classList.add("hidden");
            if (municipalityContent)
              municipalityContent.classList.remove("hidden");

            // Chamar o método de busca
            this.handleSearch();
          } else {
            // Nenhum município selecionado - mostrar estado inicial e ocultar conteúdo
            if (initialState) initialState.classList.remove("hidden");
            if (municipalityContent)
              municipalityContent.classList.add("hidden");

            // Mostrar mensagem de aviso
            if (toast?.warning) {
              toast.warning("Por favor, selecione um município");
            } else {
              alert("Por favor, selecione um município");
            }
          }
        },
      });
      searchContainer.appendChild(searchButton);
    } catch (error) {
      console.error("Erro ao carregar elementos do formulário:", error);
      searchContainer.innerHTML =
        '<p class="text-red-500 text-center">Erro ao carregar formulário</p>';
    }
  },

  /**
   * Configura os event listeners
   */
  initEventListeners() {
    // Botão de busca
    const searchButton = document.getElementById("search-button");
    if (searchButton) {
      searchButton.addEventListener("click", () => this.handleSearch());
    }

    // Navegação do menu principal
    document.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (!link.getAttribute("aria-current")) {
          // Implementação futura de roteamento entre módulos
        }
      });
    });
  },

  /**
   * Manipula a busca de município
   */
  async handleSearch() {
    const select = document.getElementById("municipality-select");
    if (!select || !select.value || select.value === select.options[0].value) {
      if (toast?.warning) {
        toast.warning("Por favor, selecione um município");
      } else {
        alert("Por favor, selecione um município");
      }
      return;
    }

    // Salvar o município selecionado
    this.state.selectedMunicipality = select.value;

    // Atualizar o título
    this.updateTitle(select.value);

    // Verificar cache primeiro
    if (this.state.cachedData[select.value]) {
      this.renderMunicipalityData(this.state.cachedData[select.value]);
      return;
    }

    // Limpar conteúdo atual e mostrar estado de carregamento
    const statsContainer = document.getElementById("stats-container");
    if (statsContainer) {
      statsContainer.innerHTML =
        '<div class="text-center py-4"><i class="fas fa-spinner fa-spin text-blue-500 text-2xl"></i></div>';
    }

    // Limpar o container de tab
    const tabContainer = document.querySelector(".tab-content");
    if (tabContainer) {
      tabContainer.innerHTML =
        '<div class="text-center py-4"><i class="fas fa-spinner fa-spin text-blue-500 text-2xl"></i></div>';
    }

    // Buscar e renderizar os dados
    try {
      const data = await getMunicipality(select.value);
      // Armazenar em cache
      this.state.cachedData[select.value] = data;
      this.renderMunicipalityData(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);

      // Mostrar EmptyState nos containers
      if (statsContainer) {
        EmptyState.render({
          container: statsContainer,
          title: "Estatísticas Indisponíveis",
          message: "Não foi possível carregar os dados estatísticos",
          icon: "chart-bar",
        });
      }

      if (tabContainer) {
        EmptyState.render({
          container: tabContainer,
          title: "Dados Indisponíveis",
          message:
            "Não foi possível carregar os dados para a visualização selecionada",
          icon: "exclamation-circle",
        });
      }

      if (toast?.error) {
        toast.error("Erro ao buscar dados do município");
      } else {
        alert(`Erro: ${error.message}`);
      }
    }
  },

  /**
   * Atualiza o título da página
   * @param {string} municipalityName - Nome do município
   */
  updateTitle(municipalityName) {
    const titleElement = document.getElementById("municipality-title");
    if (titleElement) {
      titleElement.textContent = municipalityName;
    }
  },

  /**
   * Renderiza os dados do município
   * @param {Object} data - Dados do município
   */
  renderMunicipalityData(data) {
    // Renderizar os cards de estatísticas
    this.renderStats(data);

    // Renderizar o conteúdo da tab ativa
    this.renderTabContent(data);
  },

  /**
   * Renderiza os cards de estatísticas
   * @param {Object} data - Dados do município
   */
  renderStats(data) {
    const container = document.getElementById("stats-container");
    if (!container || !data.contribuintes) return;

    try {
      StatsSection.renderWithData(container, {
        title: "Quantidade de Contribuintes do ICMS",
        data: data.contribuintes,
      });
    } catch (error) {
      console.error("Erro ao renderizar estatísticas:", error);
    }
  },

  /**
   * Renderiza o conteúdo da tab ativa
   * @param {Object} data - Dados do município
   */
  renderTabContent(data = null) {
    // Se não há dados e não há município selecionado, não fazer nada
    if (!data && !this.state.selectedMunicipality) return;

    // Se não recebeu dados, tentar buscar novamente do cache ou da API
    if (!data) {
      // Verificar cache primeiro
      if (this.state.cachedData[this.state.selectedMunicipality]) {
        this.renderTabContent(
          this.state.cachedData[this.state.selectedMunicipality]
        );
        return;
      }

      getMunicipality(this.state.selectedMunicipality)
        .then((municipalityData) => {
          // Atualizar cache
          this.state.cachedData[this.state.selectedMunicipality] =
            municipalityData;
          this.renderTabContent(municipalityData);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados para tab:", error);
          this.renderEmptyTabContent();
        });
      return;
    }

    // Mapa de renderizadores para cada tab
    const renderers = {
      município: () => this.renderMunicipalityTab(data),
      gráficos: () => this.renderGraphicsTab(data),
      estado: () => this.renderStateTab(data),
    };

    // Executar o renderizador correspondente ou o padrão
    (renderers[this.state.activeTab] || renderers["município"])();
  },

  /**
   * Renderiza a tab de município
   * @param {Object} data - Dados do município
   */
  renderMunicipalityTab(data) {
    const container = DOMHelper.getTabContainer();
    if (!container) return;

    // Definir o título
    container.innerHTML =
      '<h3 class="text-xl font-medium text-blue-dark mb-4">Repasses ao Município</h3>';

    try {
      // Renderizar tabela de repasses
      if (data.repasses) {
        const tableContainer = document.createElement("div");
        container.appendChild(tableContainer);

        try {
          new MunicipalityTable({
            container: tableContainer,
            data: data.repasses,
            municipalityName: this.state.selectedMunicipality,
          });
        } catch (error) {
          console.error("Erro ao renderizar tabela de repasses:", error);
          this.renderErrorMessage(
            tableContainer,
            "Erro ao renderizar tabela de repasses"
          );
        }
      }

      // Renderizar seção de índices
      if (data.indices?.length > 0) {
        // Título da seção
        const indicesTitle = DOMHelper.createTitle("Índices", "mt-16");
        container.appendChild(indicesTitle);

        // Grid para as tabelas
        const grid = document.createElement("div");
        grid.className = "grid grid-cols-1 md:grid-cols-2 gap-6";
        container.appendChild(grid);

        // Tabela 01
        const positionContainer = document.createElement("div");
        grid.appendChild(positionContainer);

        try {
          new IndexesTable({
            container: positionContainer,
            data: data.indices,
            title: "Tabela 01",
          });
        } catch (error) {
          console.error("Erro ao renderizar tabela de índices:", error);
          this.renderErrorMessage(
            positionContainer,
            "Erro ao renderizar tabela de índices"
          );
        }

        // Tabela 02
        if (data.execucao?.length > 0) {
          const executionContainer = document.createElement("div");
          grid.appendChild(executionContainer);

          try {
            new IndexesTable({
              container: executionContainer,
              data: data.execucao,
              title: "Tabela 02",
            });
          } catch (error) {
            console.error("Erro ao renderizar tabela de execução:", error);
            this.renderErrorMessage(
              executionContainer,
              "Erro ao renderizar tabela de execução"
            );
          }
        }

        // Adicionar gráfico VAF
        this.renderVafChartSection(container, data);
      }
    } catch (error) {
      console.error("Erro ao renderizar tab de município:", error);
      this.renderErrorMessage(
        container,
        `Erro ao renderizar conteúdo: ${error.message}`
      );
    }
  },

  /**
   * Renderiza a seção de gráfico VAF
   * @param {HTMLElement} container - Container para o gráfico
   * @param {Object} data - Dados do município
   */
  renderVafChartSection(container, data) {
    if (!data.vaf?.length) return;

    // Título da seção VAF
    const vafTitle = DOMHelper.createTitle(
      `Visão do Valor Adicionado Fiscal de ${this.state.selectedMunicipality}`,
      "mt-16"
    );
    container.appendChild(vafTitle);

    // Container para o gráfico
    const vafChartContainer = document.createElement("div");
    container.appendChild(vafChartContainer);

    // Importar e usar o componente de gráfico
    import("../components/layout/ChartComponent.js")
      .then((module) => {
        const ChartComponent = module.default;

        // Criar o gráfico
        new ChartComponent({
          container: vafChartContainer,
          title: "", // Título já adicionado separadamente acima
          type: "bar",
          data: ChartFormatter.prepareVafChartData(data.vaf),
          options: {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return value >= 1000 ? value / 1000 + "k" : value;
                  },
                },
              },
            },
            plugins: {
              title: {
                display: false, // Não mostrar título no gráfico
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const value = context.raw;
                    return `${context.dataset.label}: R$ ${value.toLocaleString(
                      "pt-BR"
                    )}`;
                  },
                },
              },
            },
          },
        });
      })
      .catch((error) => {
        console.error("Erro ao carregar componente de gráfico:", error);
        this.renderErrorMessage(
          vafChartContainer,
          `Erro ao carregar gráfico: ${error.message}`
        );
      });
  },

  /**
   * Renderiza a tab de gráficos
   * @param {Object} data - Dados do município
   */
  renderGraphicsTab(data) {
    const container = DOMHelper.getTabContainer();
    if (!container) return;

    // Limpar o container
    container.innerHTML = "";

    // Criar título da página
    const title = DOMHelper.createTitle("Gráficos", "mb-6");
    container.appendChild(title);

    try {
      // Importar o componente de gráfico
      import("../components/layout/ChartComponent.js")
        .then((module) => {
          const ChartComponent = module.default;

          // 1. Gráfico de Valor Adicionado Fiscal
          if (data.vaf?.length > 0) {
            const vafContainer = document.createElement("div");
            container.appendChild(vafContainer);

            new ChartComponent({
              container: vafContainer,
              title: `Valor Adicionado Fiscal de ${this.state.selectedMunicipality}`,
              type: "bar",
              data: ChartFormatter.prepareVafChartData(data.vaf),
              options: {
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${
                          context.dataset.label
                        }: R$ ${context.raw.toLocaleString("pt-BR")}`;
                      },
                    },
                  },
                },
              },
            });
          }

          // 2. Gráfico de Indicadores do Município
          if (data.indicadores_serie?.length > 0) {
            const indicadoresContainer = document.createElement("div");
            container.appendChild(indicadoresContainer);

            new ChartComponent({
              container: indicadoresContainer,
              title: "Indicadores do Município",
              type: "line",
              data: ChartFormatter.prepareIndicadoresChartData(
                data.indicadores_serie
              ),
              options: {
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5,
              },
            });
          }

          // 3. Gráfico de Repasses
          if (data.repasses_serie?.length > 0) {
            const repassesContainer = document.createElement("div");
            container.appendChild(repassesContainer);

            new ChartComponent({
              container: repassesContainer,
              title: "Repasses ao Município",
              type: "line",
              data: ChartFormatter.prepareRepassesChartData(
                data.repasses_serie
              ),
              options: {
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5,
              },
            });
          }
        })
        .catch((error) => {
          console.error("Erro ao carregar componente de gráfico:", error);
          this.renderErrorMessage(
            container,
            `Erro ao carregar componente de gráfico: ${error.message}`
          );
        });
    } catch (error) {
      console.error("Erro ao renderizar tab de gráficos:", error);
      this.renderErrorMessage(
        container,
        `Erro ao renderizar gráficos: ${error.message}`
      );
    }
  },

  /**
   * Renderiza a tab de estado
   * @param {Object} data - Dados do município
   */
  renderStateTab(data) {
    const container = DOMHelper.getTabContainer();
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

  /**
   * Renderiza conteúdo vazio para as tabs
   */
  renderEmptyTabContent() {
    const container = DOMHelper.getTabContainer();
    if (!container) return;

    EmptyState.render({
      container,
      title: "Dados Indisponíveis",
      message:
        "Não foi possível carregar os dados para a visualização selecionada.",
      icon: "exclamation-circle",
    });
  },

  /**
   * Renderiza uma mensagem de erro
   * @param {HTMLElement} container - Container para a mensagem
   * @param {string} message - Mensagem de erro
   */
  renderErrorMessage(container, message) {
    EmptyState.render({
      container,
      title: "Erro",
      message: message,
      icon: "times-circle",
    });
  },
};

// Manter compatibilidade com código existente
// Expor os métodos de preparação de dados de gráficos como originalmente
App.prepareVafChartData = ChartFormatter.prepareVafChartData;
App.prepareIndicadoresChartData = ChartFormatter.prepareIndicadoresChartData;
App.prepareRepassesChartData = ChartFormatter.prepareRepassesChartData;

export default App;
