/**
 * Componente para tabela de repasses do município
 */

// Importação do formatador de números
import { formatNumber } from '../../js/Utilities.js';

/**
 * Classe que representa a tabela de repasses do município
 */
class MunicipalityTable {
  /**
   * Cria uma instância da tabela de repasses
   * @param {Object} config - Configuração da tabela
   * @param {HTMLElement|string} config.container - Container ou seletor para renderização
   * @param {Object} config.data - Dados para a tabela
   * @param {string} config.municipalityName - Nome do município
   */
  constructor({ container, data, municipalityName }) {
    console.log(`Criando MunicipalityTable para ${municipalityName}`);
    
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
      
    this.data = data;
    this.municipalityName = municipalityName;
    
    if (!this.container) {
      console.error('Container não encontrado para MunicipalityTable');
      return;
    }
    
    this.render();
  }
  
  /**
   * Renderiza a tabela no container
   */
  render() {
    console.log("Renderizando MunicipalityTable");
    this.container.className = 'w-full mb-6';
    
    // Verificação de dados
    if (!this.data) {
      this.renderEmptyState();
      return;
    }
    
    // Criar container para tabela
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'overflow-x-auto  rounded-[16px] shadow-[6px_6px_12px_rgba(0,0,0,0.25)]';
    
    // Criar tabela
    const table = document.createElement('table');
    table.className = 'min-w-full border-collapse';
    
    // Cabeçalho da tabela
    const tableHead = document.createElement('thead');
    tableHead.innerHTML = this.renderHeaderRows();
    
    // Corpo da tabela
    const tableBody = document.createElement('tbody');
    tableBody.innerHTML = this.renderBodyRows();
    
    // Montar a tabela
    table.appendChild(tableHead);
    table.appendChild(tableBody);
    tableWrapper.appendChild(table);
    
    // Limpar e popular o container
    this.container.innerHTML = '';
    this.container.appendChild(tableWrapper);
  }
  
  /**
   * Renderiza as linhas do cabeçalho da tabela
   * @returns {string} HTML das linhas do cabeçalho
   */
  renderHeaderRows() {
    const { ano } = this.data;
    return `
      <tr>
        <th colspan="10" class="py-3 px-4 text-center font-bold text-white bg-[#264757] border-b border-gray-200">
          ${ano || '2023'}
        </th>
      </tr>
      <tr>
        <th class="py-3 px-4 text-right font-bold text-dark uppercase text-sm border-b border-gray-200 bg-white">Índice</th>
        <th class="py-3 px-4 text-right font-bold text-dark uppercase text-sm border-b border-gray-200 bg-white">IVA</th>
        <th class="py-3 px-4 text-right font-bold text-dark uppercase text-sm border-b border-gray-200 bg-white">Educação</th>
        <th class="py-3 px-4 text-right font-bold text-dark uppercase text-sm border-b border-gray-200 bg-white">Saúde</th>
        <th class="py-3 px-4 text-right font-bold text-dark uppercase text-sm border-b border-gray-200 bg-white">UCTI</th>
        <th class="py-3 px-4 text-right font-bold text-dark uppercase text-sm border-b border-gray-200 bg-white">TRIB. PRÓPRIA</th>
        <th class="py-3 px-4 text-right font-bold text-dark uppercase text-sm border-b border-gray-200 bg-white">População</th>
        <th class="py-3 px-4 text-right font-bold text-dark uppercase text-sm border-b border-gray-200 bg-white">Área</th>
        <th class="py-3 px-4 text-right font-bold text-dark uppercase text-sm border-b border-gray-200 bg-white">Coef. Local</th>
      </tr>
    `;
  }
  
  /**
   * Renderiza as linhas do corpo da tabela
   * @returns {string} HTML das linhas do corpo
   */
  renderBodyRows() {
    const { indice, iva, educacao, saude, ucti, trib_propria, populacao, area, coef_local } = this.data;
    
    return `
      <tr>
        <td class="py-3 px-4 text-right text-sm border-b border-gray-200 bg-white">${formatNumber(indice)}</td>
        <td class="py-3 px-4 text-right text-sm border-b border-gray-200 bg-white">${formatNumber(iva)}</td>
        <td class="py-3 px-4 text-right text-sm border-b border-gray-200 bg-white">${formatNumber(educacao)}</td>
        <td class="py-3 px-4 text-right text-sm border-b border-gray-200 bg-white">${formatNumber(saude)}</td>
        <td class="py-3 px-4 text-right text-sm border-b border-gray-200 bg-white">${formatNumber(ucti)}</td>
        <td class="py-3 px-4 text-right text-sm border-b border-gray-200 bg-white">${formatNumber(trib_propria)}</td>
        <td class="py-3 px-4 text-right text-sm border-b border-gray-200 bg-white">${formatNumber(populacao)}</td>
        <td class="py-3 px-4 text-right text-sm border-b border-gray-200 bg-white">${formatNumber(area)}</td>
        <td class="py-3 px-4 text-right text-sm border-b border-gray-200 bg-white">${formatNumber(coef_local)}</td>
      </tr>
    `;
  }
  
  /**
   * Renderiza estado vazio quando não há dados
   */
  renderEmptyState() {
    this.container.innerHTML = `
      <div class="text-center py-4">
        <i class="fas fa-info-circle text-blue-light text-2xl mb-2"></i>
        <p class="text-gray-600">Não há dados de repasses disponíveis para este município.</p>
      </div>
    `;
  }
}

// Exportar a classe
export default MunicipalityTable;