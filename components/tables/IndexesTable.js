/**
 * Componente genérico para tabelas
 */

// Importação do formatador de números
import { formatNumber } from "../../js/Utilities.js";

/**
 * Classe que representa uma tabela dinâmica
 */
class IndexesTable {
  /**
   * Cria uma instância da tabela
   * @param {Object} config - Configuração da tabela
   * @param {HTMLElement|string} config.container - Container ou seletor para renderização
   * @param {Array} config.data - Dados para a tabela
   * @param {string} config.title - Título da tabela
   * @param {Array} config.columns - Configuração das colunas (opcional)
   * @param {Object} config.options - Opções adicionais (opcional)
   */
  constructor({ container, data, title, columns, options = {} }) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;

    this.data = data || [];
    this.title = title || "Tabela";
    this.options = {
      headerBgClass: "bg-[#264757]",
      headerTextClass: "text-white",
      rowBgClass: "bg-white",
      evenRowBgClass: "bg-slate-50",
      useAlternatingRowColors: true,
      tableClass: "min-w-full border-collapse",
      ...options,
    };

    // Se as colunas não foram definidas, tentamos inferir dos dados
    this.columns = columns || this.inferColumns();

    if (!this.container) {
      console.error("Container não encontrado para IndexesTable");
      return;
    }

    this.render();
  }

  /**
   * Infere configuração de colunas com base nos dados
   * @returns {Array} Configuração de colunas
   */
  inferColumns() {
    if (!this.data.length) return [];

    // Obter todas as chaves do primeiro item
    const keys = Object.keys(this.data[0]);

    return keys.map((key) => {
      // Inferir tipo e alinhamento
      let type = "text";
      let align = "center";
      const sample = this.data[0][key];

      if (typeof sample === "number") {
        type = "number";
        align = "center";
      } else if (typeof sample === "string") {
        // Tentar identificar se é um número formatado ou uma variação
        if (sample.match(/^[+-]?\d/)) {
          type =
            sample.startsWith("+") || sample.startsWith("-")
              ? "variation"
              : "number";
          align = "center";
        }
      }

      // Criar título formatado (capitalizado)
      const title =
        key.charAt(0).toUpperCase() +
        key
          .slice(1)
          .replace(/([A-Z])/g, " $1") // Adicionar espaço antes de letra maiúscula
          .replace(/_/g, " "); // Substituir underscores por espaços

      return {
        key,
        title,
        type,
        align,
        format: (value) => {
          if (type === "number" && typeof value === "number") {
            return formatNumber(value);
          }
          return value;
        },
      };
    });
  }

  /**
   * Renderiza a tabela no container
   */
  render() {
    this.container.className = "w-full";

    // Verificação de dados
    if (!this.data.length || !this.columns.length) {
      this.renderEmptyState();
      return;
    }

    // Criar o título
    const titleEl = document.createElement("h4");
    titleEl.className = "text-xl font-medium text-blue-dark mb-4";
    titleEl.textContent = this.title;

    // Criar container para tabela
    const tableWrapper = document.createElement("div");
    tableWrapper.className =
      "overflow-x-auto rounded-[16px] shadow-[6px_6px_12px_rgba(0,0,0,0.25)]";

    // Criar tabela
    const table = document.createElement("table");
    table.className = this.options.tableClass;

    // Cabeçalho da tabela
    table.innerHTML = `
      <thead>
        <tr>
          ${this.renderHeaders()}
        </tr>
      </thead>
      <tbody>
        ${this.renderRows()}
      </tbody>
    `;

    // Montar o componente
    tableWrapper.appendChild(table);

    // Limpar e popular o container
    this.container.innerHTML = "";
    this.container.appendChild(titleEl);
    this.container.appendChild(tableWrapper);
  }

  /**
   * Renderiza o estado vazio (sem dados)
   */
  renderEmptyState() {
    this.container.innerHTML = `
      <h4 class="text-xl font-medium text-blue-dark mb-4">${this.title}</h4>
      <p class="text-gray-500 text-center py-4">Não há dados disponíveis</p>
    `;
  }

  /**
   * Renderiza os cabeçalhos da tabela
   * @returns {string} HTML dos cabeçalhos
   */
  renderHeaders() {
    return this.columns
      .map((column) => {
        const alignClass =
          column.align === "right"
            ? "text-right"
            : column.align === "center"
            ? "text-center"
            : "text-left";

        return `
        <th class="py-3 px-4 ${this.options.headerBgClass} ${alignClass} ${this.options.headerTextClass} font-medium uppercase text-sm border-b border-gray-200">
          ${column.title}
        </th>
      `;
      })
      .join("");
  }

  /**
   * Renderiza as linhas da tabela
   * @returns {string} HTML das linhas
   */
  renderRows() {
    return this.data
      .map((item, index) => {
        // Determinar classe de background (alternando ou não)
        const bgClass =
          this.options.useAlternatingRowColors && index % 2 !== 0
            ? this.options.evenRowBgClass
            : this.options.rowBgClass;

        const cells = this.columns
          .map((column) => {
            const value = item[column.key];
            const formattedValue = column.format ? column.format(value) : value;

            // Estilo para variação
            let specialClass = "";
            if (column.type === "variation" && typeof value === "string") {
              specialClass = value.startsWith("+")
                ? "text-green-600"
                : value.startsWith("-")
                ? "text-red-600"
                : "";
            }

            // Determinar alinhamento
            const alignClass =
              column.align === "right"
                ? "text-right"
                : column.align === "center"
                ? "text-center"
                : "text-left";

            // Adicionar classe de destaque para valores principais
            const emphasisClass = column.emphasis ? "font-bold" : "";

            return `
          <td class="py-3 px-4 ${alignClass} ${specialClass} ${emphasisClass} text-sm border-b border-gray-200 ${bgClass}">
            ${formattedValue}
          </td>
        `;
          })
          .join("");

        return `<tr>${cells}</tr>`;
      })
      .join("");
  }
}

// Exportar a classe
export default IndexesTable;
