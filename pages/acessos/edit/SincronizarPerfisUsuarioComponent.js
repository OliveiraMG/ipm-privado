/**
 * SincronizarPerfisUsuarioComponent.js - Componente para sincronizar perfis de usuário
 */
class SincronizarPerfisUsuarioComponent {
    constructor(config) {
      this.userName = config.userName || 'Usuário';
      this.onSync = config.onSync || (() => {});
      this.onBack = config.onBack || (() => {});
      this.selectedProfile = null;
  
      this.element = this.render();
      this.setupEventListeners();
    }
  
    render() {
      const container = document.createElement('div');
      container.className = 'p-6';
  
      // Título
      const title = document.createElement('h3');
      title.className = 'text-lg font-semibold text-blue-dark mb-4';
      title.textContent = `Sincronizar perfis para: ${this.userName}`;
      container.appendChild(title);
  
      // Opções de perfil (radio buttons)
      const profilesContainer = document.createElement('div');
      profilesContainer.className = 'flex flex-wrap gap-4 mb-6';
      const profiles = [
        'Desenvolvedor',
        'Contabilista',
        'Contribuinte',
        'Administrador',
        'Prefeitura'
      ];
  
      profiles.forEach(profile => {
        const label = document.createElement('label');
        label.className = 'flex items-center space-x-2';
        label.innerHTML = `
          <input type="radio" name="profile" value="${profile}" class="form-radio h-5 w-5 text-blue-dark">
          <span class="text-gray-700">${profile}</span>
        `;
        profilesContainer.appendChild(label);
      });
      container.appendChild(profilesContainer);
  
      // Botões
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'flex justify-end space-x-4';
      buttonContainer.innerHTML = `
        <button id="back-btn" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
          Voltar
        </button>
        <button id="select-all-btn" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
          Marcar Todos
        </button>
        <button id="sync-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
          Sincronizar
        </button>
      `;
      container.appendChild(buttonContainer);
  
      return container;
    }
  
    setupEventListeners() {
      const backBtn = this.element.querySelector('#back-btn');
      const selectAllBtn = this.element.querySelector('#select-all-btn');
      const syncBtn = this.element.querySelector('#sync-btn');
      const radioButtons = this.element.querySelectorAll('input[name="profile"]');
  
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          this.onBack();
        });
      }
  
      if (selectAllBtn) {
        selectAllBtn.addEventListener('click', () => {
          // Como é um radio button, "Marcar Todos" não faz sentido, mas mantemos o botão para seguir o layout
          console.log('Funcionalidade "Marcar Todos" não aplicável para radio buttons.');
        });
      }
  
      if (syncBtn) {
        syncBtn.addEventListener('click', () => {
          this.selectedProfile = this.element.querySelector('input[name="profile"]:checked')?.value || null;
          if (this.selectedProfile) {
            this.onSync({ profile: this.selectedProfile });
          } else {
            console.log('Nenhum perfil selecionado.');
          }
        });
      }
  
      radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
          this.selectedProfile = e.target.value;
        });
      });
    }
  }
  
  export default SincronizarPerfisUsuarioComponent;