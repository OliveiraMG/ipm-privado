/**
 * ChartComponent.js - Componente genérico para gráficos usando Chart.js
 */

class ChartComponent {
  /**
   * Cria uma instância do gráfico
   * @param {Object} config - Configuração do gráfico
   * @param {HTMLElement|string} config.container - Container ou seletor para renderização
   * @param {string} config.title - Título do gráfico
   * @param {string} config.type - Tipo do gráfico (bar, line, etc)
   * @param {Object} config.data - Dados para o gráfico
   * @param {Object} config.options - Opções adicionais do gráfico
   */
  constructor({ container, title, type, data, options = {} }) {
    console.log(`Criando gráfico ${type}: ${title}`);

    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;

    this.title = title;
    this.type = type || "bar";
    this.data = data || {};
    this.options = options;
    this.chartId = `chart-${Math.random().toString(36).substring(2, 9)}`;

    if (!this.container) {
      console.error("Container não encontrado para o gráfico");
      return;
    }

    this.render();
  }

  /**
   * Renderiza o gráfico
   */
  render() {
    console.log(`Renderizando gráfico: ${this.title}`);

    // Verificar se há dados
    if (!this.data || !this.data.labels || !this.data.datasets) {
      this.renderEmptyState();
      return;
    }

    // Criar container do gráfico
    this.container.innerHTML = `
        <div class="mb-6">
          ${
            this.title
              ? `<h3 class="text-xl font-medium text-blue-dark mb-4 mt-20">${this.title}</h3>`
              : ""
          }
          <div class="bg-white rounded-[16px] shadow-[6px_6px_12px_rgba(0,0,0,0.25)] p-6">
            <canvas id="${this.chartId}" height="300"></canvas>
          </div>
        </div>
      `;

    const ctx = document.getElementById(this.chartId).getContext("2d");

    // Configurações padrão que podem ser sobrescritas pelas opções
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          titleColor: "#333",
          bodyColor: "#666",
          borderColor: "#ddd",
          borderWidth: 1,
          padding: 10,
          displayColors: true,
        },
      },
    };

    // Mesclar opções padrão com as opções fornecidas
    const chartOptions = this.mergeDeep(defaultOptions, this.options);

    // Criar o gráfico
    this.chart = new Chart(ctx, {
      type: this.type,
      data: this.data,
      options: chartOptions,
    });
  }

  /**
   * Renderiza estado vazio quando não há dados
   */
  renderEmptyState() {
    this.container.innerHTML = `
        <div class="mb-6">
          ${
            this.title
              ? `<h3 class="text-xl font-medium text-blue-dark mb-4">${this.title}</h3>`
              : ""
          }
          <div class="bg-white rounded-[16px] shadow-[6px_6px_12px_rgba(0,0,0,0.25)] p-6">
            <div class="text-center py-8">
              <i class="fas fa-chart-${
                this.type === "line" ? "line" : "bar"
              } text-4xl text-gray-300 mb-4"></i>
              <p class="text-gray-600">Não há dados disponíveis para visualização.</p>
            </div>
          </div>
        </div>
      `;
  }

  /**
   * Mescla profundamente dois objetos
   * @param {Object} target - Objeto alvo
   * @param {Object} source - Objeto fonte
   * @returns {Object} Objeto mesclado
   */
  mergeDeep(target, source) {
    const output = Object.assign({}, target);

    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.mergeDeep(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }

    return output;
  }

  /**
   * Verifica se o valor é um objeto
   * @param {*} item - Valor a ser verificado
   * @returns {boolean} Verdadeiro se for um objeto
   */
  isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  }

  /**
   * Atualiza os dados do gráfico
   * @param {Object} newData - Novos dados para o gráfico
   */
  updateData(newData) {
    if (!this.chart) return;

    this.chart.data = newData;
    this.chart.update();
  }

  /**
   * Destroi o gráfico
   */
  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}

export default ChartComponent;
