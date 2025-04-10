/**
 * Componente Select
 * Select reutilizável com suporte a opções dinâmicas
 */
class Select {
    /**
     * Cria um select
     * @param {Object} config - Configuração do select
     * @param {string} config.id - ID do select
     * @param {string} config.placeholder - Texto do placeholder
     * @param {Array} config.options - Opções do select [{value, text}]
     * @param {Function} config.onChange - Função de mudança
     * @param {string} config.className - Classes adicionais
     */
    static render(config) {
      const container = document.createElement('div');
      container.className = 'relative flex-grow';
      
      const select = document.createElement('select');
      select.id = config.id || '';
      select.className = `border border-gray-200 text-gray-700 py-2 px-4 pr-10 rounded-lg focus:ring-1 focus:ring-blue-light w-full ${config.className || ''}`;
      
      // Adicionar placeholder
      if (config.placeholder) {
        const placeholderOption = document.createElement('option');
        placeholderOption.selected = true;
        placeholderOption.disabled = true;
        placeholderOption.textContent = config.placeholder;
        select.appendChild(placeholderOption);
      }
      
      // Adicionar opções
      if (config.options && Array.isArray(config.options)) {
        config.options.forEach(option => {
          const optionEl = document.createElement('option');
          optionEl.value = option.value || option.text;
          optionEl.textContent = option.text;
          select.appendChild(optionEl);
        });
      }
      
      // Adicionar evento de mudança
      if (config.onChange) {
        select.addEventListener('change', config.onChange);
      }
      
      container.appendChild(select);
      
      // Adicionar ícone
      const iconContainer = document.createElement('div');
      iconContainer.className = 'pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2';
      iconContainer.innerHTML = '<i class="fa-solid fa-chevron-down text-sm"></i>';
      container.appendChild(iconContainer);
      
      return container;
    }
  }
  
  export default Select;