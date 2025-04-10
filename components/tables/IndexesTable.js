/**
 * Componente para tabela de índices
 */

// Importação do formatador de números
import { formatNumber } from '../../js/Utilities.js';

/**
 * Classe que representa a tabela de índices
 */
class IndexesTable {
  /**
   * Cria uma instância da tabela de índices
   * @param {Object} config - Configuração da tabela
   * @param {HTMLElement|string} config.container - Container ou seletor para renderização
   * @param {Array} config.data - Dados para a tabela
   * @param {string} config.title - Título da tabela
   */
  constructor({ container, data, title }) {
    console.log(`Criando IndexesTable: ${title}`);
    
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
      
    this.data = data || [];
    this.title = title || 'Índices';
    
    if (!this.container) {
      console.error('Container não encontrado para IndexesTable');
      return;
    }
    
    this.render();
  }
  
  /**
   * Renderiza a tabela no container
   */
  render() {
    console.log(`Renderizando IndexesTable (${this.title})`);
    this.container.className = 'w-full';
    
    // Verificação de dados
    if (!this.data.length) {
      this.renderEmptyState();
      return;
    }
    
    // Criar o título
    const titleEl = document.createElement('h4');
    titleEl.className = 'text-xl font-medium text-blue-dark mb-4';
    titleEl.textContent = this.title;
    
    // Criar container para tabela
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'overflow-x-auto rounded-[16px] shadow-[6px_6px_12px_rgba(0,0,0,0.25)]';
    
    // Criar tabela
    const table = document.createElement('table');
    table.className = 'min-w-full border-collapse';
    
    // Cabeçalho da tabela
    table.innerHTML = `
      <thead>
        <tr>
          <th class="py-3 px-4 bg-[#264757] text-center text-white font-medium uppercase text-sm border-b border-gray-200">Exercício</th>
          <th class="py-3 px-4 bg-[#264757] text-center text-white font-medium uppercase text-sm border-b border-gray-200">Município</th>
          <th class="py-3 px-4 bg-[#264757] text-right text-white font-medium uppercase text-sm border-b border-gray-200">VAF</th>
          <th class="py-3 px-4 bg-[#264757] text-right text-white font-medium uppercase text-sm border-b border-gray-200">Variação</th>
          <th class="py-3 px-4 bg-[#264757] text-center text-white font-medium uppercase text-sm border-b border-gray-200">Rank</th>
        </tr>
      </thead>
      <tbody>
        ${this.renderRows()}
      </tbody>
    `;
    
    // Montar o componente
    tableWrapper.appendChild(table);
    
    // Limpar e popular o container
    this.container.innerHTML = '';
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
   * Renderiza as linhas da tabela
   * @returns {string} HTML das linhas
   */
  renderRows() {
    return this.data.map(item => {
      const variationClass = item.variacao.startsWith('+') ? 'text-green-600' : 'text-red-600';
      
      return `
        <tr>
          <td class="py-3 px-4 text-center text-sm border-b border-gray-200 bg-white">${item.exercicio}</td>
          <td class="py-3 px-4 text-center text-sm border-b border-gray-200 bg-white">${item.municipio}</td>
          <td class="py-3 px-4 text-right font-bold text-sm border-b border-gray-200 bg-white">${formatNumber(item.vaf)}</td>
          <td class="py-3 px-4 text-right text-sm ${variationClass} border-b border-gray-200 bg-white">${item.variacao}</td>
          <td class="py-3 px-4 text-center text-sm border-b border-gray-200 bg-white">${item.rank}</td>
        </tr>
      `;
    }).join('');
  }
}

// Exportar a classe
export default IndexesTable;