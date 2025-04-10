/**
 * Gerenciador de tabs - Componente para controlar tabs na interface
 */
class TabsManager {
  /**
   * Cria uma instância do gerenciador de tabs
   * @param {Object} config - Configuração do gerenciador
   * @param {string} config.container - Seletor para o container das tabs
   * @param {Function} config.onTabChange - Callback quando uma tab é alterada
   */
  constructor({ container, onTabChange }) {
    console.log(`Inicializando TabsManager com container: ${container}`);
    this.containerSelector = container;
    this.onTabChange = onTabChange || (() => {
      console.log("Tab alterada (callback padrão)");
    });
    this.activeTab = null;
    
    this.init();
  }
  
  /**
   * Inicializa o gerenciador
   */
  init() {
    this.container = document.querySelector(this.containerSelector);
    if (!this.container) {
      console.error(`Container não encontrado: ${this.containerSelector}`);
      return;
    }
    
    this.tabs = this.container.querySelectorAll('.tab');
    if (!this.tabs.length) {
      console.error('Nenhuma tab encontrada no container');
      return;
    }
    
    console.log(`${this.tabs.length} tabs encontradas`);
    
    // Definir tab ativa inicial
    this.activeTab = this.getActiveTab() || this.tabs[0];
    if (this.activeTab) {
      console.log(`Tab ativa inicial: ${this.activeTab.textContent.trim()}`);
      this.setActiveTab(this.activeTab);
    }
    
    // Adicionar event listeners
    this.attachEventListeners();
  }
  
  /**
   * Anexa os event listeners às tabs
   */
  attachEventListeners() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        console.log(`Tab clicada: ${tab.textContent.trim()}`);
        this.setActiveTab(tab);
      });
    });
    console.log("Event listeners anexados às tabs");
  }
  
  /**
   * Obtém a tab ativa atualmente
   * @returns {HTMLElement} Elemento da tab ativa
   */
  getActiveTab() {
    return this.container.querySelector('.tab.active');
  }
  
  /**
   * Define uma tab como ativa
   * @param {HTMLElement} tab - Tab a ser ativada
   */
  setActiveTab(tab) {
    // Remover classe ativa de todas as tabs
    this.tabs.forEach(t => t.classList.remove('active'));
    
    // Adicionar classe ativa à tab selecionada
    tab.classList.add('active');
    
    // Atualizar referência da tab ativa
    this.activeTab = tab;
    
    const tabName = tab.textContent.trim().toLowerCase();
    console.log(`Tab ativada: ${tabName}`);
    
    // Chamar callback informando a mudança
    this.onTabChange(tabName);
  }
  
  /**
   * Atualiza o estado das tabs com base no nome da tab
   * @param {string} tabName - Nome da tab a ser ativada
   */
  activateByName(tabName) {
    const normalizedName = tabName.toLowerCase();
    console.log(`Buscando tab pelo nome: ${normalizedName}`);
    
    // Encontrar a tab pelo nome
    const matchingTab = Array.from(this.tabs).find(tab => {
      return tab.textContent.trim().toLowerCase() === normalizedName;
    });
    
    if (matchingTab) {
      console.log(`Tab encontrada: ${matchingTab.textContent.trim()}`);
      this.setActiveTab(matchingTab);
    } else {
      console.warn(`Tab não encontrada: ${tabName}`);
    }
  }
}

export default TabsManager;