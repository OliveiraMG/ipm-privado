/**
 * ModalComponent.js - Componente para exibir um modal
 */
class ModalComponent {
    /**
     * @param {Object} config - Configuração do componente
     * @param {string} config.id - ID do modal
     * @param {string} config.title - Título do modal
     * @param {Function} config.onClose - Função chamada ao fechar o modal
     * @param {HTMLElement} config.content - Elemento de conteúdo a ser exibido no modal
     */
    constructor(config) {
      this.id = config.id || 'modal';
      this.title = config.title || 'Modal';
      this.onClose = config.onClose || (() => {});
      this.content = config.content || document.createElement('div');
  
      this.element = this.render();
      this.setupEventListeners();
    }
  
    /**
     * Renderiza o componente
     * @returns {HTMLElement} - Elemento do modal
     */
    render() {
      const container = document.createElement('div');
      container.id = this.id;
      container.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
  
      // Card do modal
      const card = document.createElement('div');
      card.className = 'bg-white rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.25)] w-full max-w-4xl max-h-[80vh] overflow-y-auto relative';
  
      // Cabeçalho
      const header = document.createElement('div');
      header.className = 'flex justify-between items-center p-6 border-b border-gray-200';
      header.innerHTML = `
        <h2 class="text-2xl font-semibold text-blue-dark">${this.title}</h2>
        <button id="${this.id}-close-btn" class="text-gray-500 hover:text-gray-700">
          <i class="fa-solid fa-times text-xl"></i>
        </button>
      `;
      card.appendChild(header);
  
      // Conteúdo
      const contentArea = document.createElement('div');
      contentArea.className = 'p-6';
      contentArea.appendChild(this.content);
      card.appendChild(contentArea);
  
      container.appendChild(card);
      return container;
    }
  
    /**
     * Configura os eventos
     */
    setupEventListeners() {
      const closeBtn = this.element.querySelector(`#${this.id}-close-btn`);
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.close();
        });
      }
  
      // Fechar ao clicar no backdrop
      this.element.addEventListener('click', (e) => {
        if (e.target === this.element) {
          this.close();
        }
      });
    }
  
    /**
     * Abre o modal
     */
    open() {
      document.body.appendChild(this.element);
      document.body.style.overflow = 'hidden';
    }
  
    /**
     * Fecha o modal
     */
    close() {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      document.body.style.overflow = '';
      this.onClose();
    }
  }
  
  export default ModalComponent;