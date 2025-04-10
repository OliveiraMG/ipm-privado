/**
 * Componente Button
 * Botão reutilizável com suporte a ícones
 */
class Button {
    /**
     * Cria um botão
     * @param {Object} config - Configuração do botão
     * @param {string} config.text - Texto do botão
     * @param {string} config.icon - Nome do ícone (FontAwesome)
     * @param {string} config.type - Tipo do botão (primary, secondary, etc)
     * @param {Function} config.onClick - Função de clique
     * @param {string} config.id - ID do botão
     * @param {string} config.className - Classes adicionais
     */
    static render(config) {
      // Estilos padrão por tipo
      const styles = {
        primary: 'bg-blue-medium hover:bg-blue-dark text-white',
        secondary: 'bg-gray-300 hover:bg-gray-400 text-gray-800',
        outline: 'bg-transparent border border-blue-medium text-blue-medium hover:bg-blue-medium hover:text-white'
      };
      
      const buttonStyle = styles[config.type || 'primary'];
      const iconHtml = config.icon ? `<i class="fa-solid fa-${config.icon} ml-1 text-sm"></i>` : '';
      
      const button = document.createElement('button');
      button.id = config.id || '';
      button.className = `${buttonStyle} font-medium px-4 py-2 rounded-lg flex-shrink-0 transition-colors duration-200 flex items-center justify-center ${config.className || ''}`;
      button.innerHTML = `${config.text || ''} ${iconHtml}`;
      
      if (config.onClick) {
        button.addEventListener('click', config.onClick);
      }
      
      return button;
    }
  }
  
  export default Button;