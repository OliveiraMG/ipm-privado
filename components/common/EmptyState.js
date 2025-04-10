/**
 * Componente para exibir estados vazios de forma consistente
 */

/**
 * Classe para renderizar estados vazios na aplicação
 */
class EmptyState {
    /**
     * Renderiza um estado vazio padronizado
     * @param {Object} config - Configuração do estado vazio
     * @param {HTMLElement} config.container - Container onde o estado vazio será renderizado
     * @param {string} config.message - Mensagem de erro ou aviso (opcional)
     * @param {string} config.icon - Ícone a ser exibido (opcional)
     * @param {string} config.title - Título do estado vazio (opcional)
     * @returns {HTMLElement} Container com o estado vazio renderizado
     */
    static render({ 
      container, 
      message = 'Não foi possível carregar os dados para a visualização selecionada.',
      icon = 'exclamation-circle',
      title = 'Dados Indisponíveis'
    }) {
      if (!container) {
        console.error('Container não fornecido para EmptyState');
        return null;
      }
      
      // Limpar o container
      container.innerHTML = '';
      
      // Criar cabeçalho se o título for fornecido
      if (title) {
        const headerEl = document.createElement('h3');
        headerEl.className = 'text-xl font-medium text-blue-dark mb-4';
        headerEl.textContent = title;
        container.appendChild(headerEl);
      }
      
      // Criar o card de estado vazio
      const card = document.createElement('div');
      card.className = 'bg-white rounded-lg shadow-sm p-6 mb-6';
      
      // Conteúdo do card
      const contentDiv = document.createElement('div');
      contentDiv.className = 'text-center py-8';
      
      // Ícone
      const iconEl = document.createElement('i');
      iconEl.className = `fas fa-${icon} text-4xl text-gray-400 mb-4`;
      contentDiv.appendChild(iconEl);
      
      // Mensagem
      const messageEl = document.createElement('p');
      messageEl.className = 'text-gray-600';
      messageEl.textContent = message;
      contentDiv.appendChild(messageEl);
      
      // Montar o card
      card.appendChild(contentDiv);
      container.appendChild(card);
      
      return container;
    }
  }
  
  export default EmptyState;