import StatCard from "./StatCard.js";

/**
 * StatsSection Component - Displays a section with statistical information cards
 * @param {string} title - The title of the section
 * @param {Array} stats - Array of stat objects with title, value, and details
 * @param {string} stats[].title - The title of each stat card
 * @param {string|number} stats[].value - The value to display for each card
 * @param {Object} stats[].details - Details for each card (mei, simplesNacional, simplificada)
 */
class StatsSection {
  constructor(title, stats = []) {
    this.title = title;
    this.stats = stats;
  }

  render() {
    const cards = this.stats
      .map((stat) => {
        const card = new StatCard(stat.title, stat.value, stat.details);
        return card.render();
      })
      .join("");

    return `
      <div class="bg-white rounded-3xl  shadow-[6px_6px_12px_rgba(0,0,0,0.25)] p-10 mb-6">
        <h3 class="text-2xl font-medium text-gray-700 mb-10">${this.title}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${cards}
        </div>
      </div>
    `;
  }

  // Método para inicializar a seção de estatísticas no DOM
  static initialize(containerId, title, stats) {
    const container = document.getElementById(containerId);
    if (container) {
      const section = new StatsSection(title, stats);
      container.innerHTML = section.render();
    }
  }

  // Método adaptador para renderizar com o formato de dados da aplicação
  static renderWithData(container, options) {
    // Adaptar do formato de dados esperado para o formato da classe
    let statsArray = [];

    if (options.data) {
      // Para o formato {total: {valor, mei, ...}, baixados: {valor, mei, ...}}
      if (options.data.total) {
        statsArray.push({
          title: "TOTAIS",
          value: options.data.total.valor,
          details: {
            mei: options.data.total.mei,
            simplesNacional: options.data.total.simplesNacional,
            simplificada: options.data.total.simplificado,
          },
        });
      }

      if (options.data.baixados) {
        statsArray.push({
          title: "BAIXADOS",
          value: options.data.baixados.valor,
          details: {
            mei: options.data.baixados.mei,
            simplesNacional: options.data.baixados.simplesNacional,
            simplificada: options.data.baixados.simplificado,
          },
        });
      }

      if (options.data.ativos) {
        statsArray.push({
          title: "ATIVOS",
          value: options.data.ativos.valor,
          details: {
            mei: options.data.ativos.mei,
            simplesNacional: options.data.ativos.simplesNacional,
            simplificada: options.data.ativos.simplificado,
          },
        });
      }

      if (options.data.suspensos) {
        statsArray.push({
          title: "SUSPENSO",
          value: options.data.suspensos.valor,
          details: {
            mei: options.data.suspensos.mei,
            simplesNacional: options.data.suspensos.simplesNacional,
            simplificada: options.data.suspensos.simplificado,
          },
        });
      }
    } else if (Array.isArray(options.stats)) {
      // Se já está no formato de array
      statsArray = options.stats;
    }

    // Criar a seção e renderizar
    const section = new StatsSection(options.title, statsArray);

    // Se container for string, tratar como seletor
    if (typeof container === "string") {
      const element = document.querySelector(container);
      if (element) {
        element.innerHTML = section.render();
        return element;
      }
    }
    // Senão, assumir que é um elemento DOM
    else if (container instanceof Element) {
      container.innerHTML = section.render();
      return container;
    }
  }
}

export default StatsSection;
