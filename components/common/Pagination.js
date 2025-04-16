/**
 * Componente de Paginação
 * Implementa controles de paginação reutilizáveis com design baseado no Figma
 */

class Pagination {
  /**
   * Cria uma instância do componente de paginação
   * @param {Object} config - Configuração do componente
   * @param {HTMLElement|string} config.container - Container ou seletor para renderização
   * @param {number} config.currentPage - Página atual
   * @param {number} config.totalPages - Total de páginas
   * @param {Function} config.onPageChange - Callback para mudança de página
   * @param {Object} config.options - Opções adicionais (opcional)
   */
  constructor({ container, currentPage = 1, totalPages = 1, onPageChange, options = {} }) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
      
    this.currentPage = currentPage;
    this.totalPages = Math.max(1, totalPages);
    this.onPageChange = onPageChange;
    this.options = {
      showFirstLast: false,
      maxVisiblePages: 5,
      ...options
    };
    
    if (!this.container) {
      console.error('Container não encontrado para Pagination');
      return;
    }
    
    this.render();
  }
  
  /**
   * Renderiza o componente de paginação exatamente como no design do Figma
   */
  render() {
    this.container.innerHTML = '';
    
    // Wrapper de paginação 
    const paginationWrapper = document.createElement('div');
    paginationWrapper.className = 'flex items-center';
    
    // Botão anterior
    const prevButton = document.createElement('button');
    prevButton.className = 'px-2 py-1 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-l-md';
    prevButton.innerHTML = '<i class="fa-solid fa-chevron-left text-xs"></i>';
    prevButton.disabled = this.currentPage <= 1;
    if (!prevButton.disabled) {
      prevButton.addEventListener('click', () => this.changePage(this.currentPage - 1));
    }
    paginationWrapper.appendChild(prevButton);
    
    // Decidir quais páginas mostrar
    const pagesToShow = this.decidePagesToShow();
    
    // Adicionar botões de página
    pagesToShow.forEach((page, index) => {
      if (page === '...') {
        // Ellipsis
        const ellipsis = document.createElement('button');
        ellipsis.className = 'px-3 py-1 border-t border-b border-r border-gray-300 text-gray-600';
        ellipsis.textContent = '...';
        ellipsis.disabled = true;
        paginationWrapper.appendChild(ellipsis);
      } else {
        // Botão de página
        const pageButton = document.createElement('button');
        const isCurrent = page === this.currentPage;
        
        // Estilo baseado no estado (atual ou não)
        const isFirst = index === 0 && page !== 1; // Primeiro botão, mas não página 1
        const borderLeftClass = isFirst ? '' : 'border-l-0';
        
        pageButton.className = isCurrent 
          ? `px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 font-medium ${borderLeftClass}` 
          : `px-3 py-1 border-t border-b border-r border-gray-300 text-gray-600 hover:bg-gray-50 ${borderLeftClass}`;
        
        // Se for o primeiro botão e não for a primeira página (1)
        if (index === 0 && pageButton.className.includes('border-l-0')) {
          pageButton.className = pageButton.className.replace('border-l-0', '');
        }
        
        pageButton.textContent = page;
        
        if (!isCurrent) {
          pageButton.addEventListener('click', () => this.changePage(page));
        }
        paginationWrapper.appendChild(pageButton);
      }
    });
    
    // Botão próximo
    const nextButton = document.createElement('button');
    nextButton.className = 'px-2 py-1 text-gray-600 hover:text-gray-900 border border-gray-300 border-l-0 rounded-r-md';
    nextButton.innerHTML = '<i class="fa-solid fa-chevron-right text-xs"></i>';
    nextButton.disabled = this.currentPage >= this.totalPages;
    if (!nextButton.disabled) {
      nextButton.addEventListener('click', () => this.changePage(this.currentPage + 1));
    }
    paginationWrapper.appendChild(nextButton);
    
    this.container.appendChild(paginationWrapper);
  }
  
  /**
   * Determina quais páginas mostrar na paginação
   * @returns {Array} Array de páginas a serem mostradas
   */
  decidePagesToShow() {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const result = [];
    
    // Sempre mostrar a página 1
    result.push(1);
    
    // Total de páginas menor ou igual a 5, mostrar todas
    if (totalPages <= 5) {
      for (let i = 2; i <= totalPages; i++) {
        result.push(i);
      }
      return result;
    }
    
    // Mostrar página 2 se estamos nas primeiras páginas
    if (currentPage <= 3) {
      result.push(2);
    } else {
      result.push('...');
    }
    
    // Páginas do meio
    if (currentPage > 3 && currentPage < totalPages - 2) {
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 2 && i < totalPages) {
          result.push(i);
        }
      }
    }
    
    // Mostrar penúltima página se estamos nas últimas páginas
    if (currentPage >= totalPages - 2) {
      if (totalPages > 3) {
        result.push(totalPages - 1);
      }
    } else {
      result.push('...');
    }
    
    // Sempre mostrar a última página
    if (totalPages > 1) {
      result.push(totalPages);
    }
    
    // Simplificar paginação quando tiver poucos elementos
    return this.simplifyPagination(result);
  }
  
  /**
   * Simplifica o resultado da paginação para remover duplicatas e ellipsis desnecessários
   * @param {Array} pages - Páginas originalmente selecionadas
   * @returns {Array} Páginas simplificadas
   */
  simplifyPagination(pages) {
    const result = [];
    const seen = new Set();
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      
      // Pular duplicatas
      if (page !== '...' && seen.has(page)) continue;
      
      // Adicionar página única
      if (page !== '...') seen.add(page);
      
      // Não adicionar ellipsis consecutivos
      if (page === '...' && result[result.length - 1] === '...') continue;
      
      // Não adicionar ellipsis se os números estão próximos
      if (page === '...' && i < pages.length - 1 && 
          typeof pages[i-1] === 'number' && 
          typeof pages[i+1] === 'number' && 
          pages[i+1] - pages[i-1] <= 2) {
        // Adicionar números intermediários em vez de ellipsis
        for (let j = pages[i-1] + 1; j < pages[i+1]; j++) {
          result.push(j);
          seen.add(j);
        }
      } else {
        result.push(page);
      }
    }
    
    return result;
  }
  
  /**
   * Processa a mudança de página
   * @param {number} page - Nova página
   */
  changePage(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    
    this.currentPage = page;
    this.render();
    
    if (typeof this.onPageChange === 'function') {
      this.onPageChange(page);
    }
  }
  
  /**
   * Atualiza o componente com novos valores
   * @param {Object} config - Nova configuração parcial
   */
  update(config = {}) {
    if (config.currentPage !== undefined) {
      this.currentPage = config.currentPage;
    }
    
    if (config.totalPages !== undefined) {
      this.totalPages = Math.max(1, config.totalPages);
    }
    
    if (config.options) {
      this.options = { ...this.options, ...config.options };
    }
    
    this.render();
  }
  
  /**
   * Método estático para criar uma nova instância
   * @param {Object} config - Configuração
   * @returns {Pagination} Nova instância
   */
  static create(config) {
    return new Pagination(config);
  }
}

export default Pagination;