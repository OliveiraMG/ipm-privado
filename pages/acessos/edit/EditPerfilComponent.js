/**
 * EditPerfilComponent.js - Componente para edição de perfil
 */
import { toast } from '/js/Utilities.js';

class EditPerfilComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {Object} config.perfilData - Dados do perfil a ser editado
   * @param {Function} config.onUpdate - Função chamada ao atualizar o perfil
   * @param {Function} config.onBack - Função chamada ao clicar em Voltar
   * @param {Function} config.onSyncPermissions - Função chamada ao clicar em Sincronizar Permissões
   */
  constructor(config) {
    this.perfilData = config.perfilData || {};
    this.onUpdate = config.onUpdate || (() => {});
    this.onBack = config.onBack || (() => {});
    this.onSyncPermissions = config.onSyncPermissions || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'p-4';

    const form = document.createElement('div');
    form.className = 'space-y-4';

    form.innerHTML = `
      <div>
        <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição:</label>
        <input type="text" id="descricao" name="descricao"
               value="${this.perfilData.descricao || ''}"
               class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
      </div>
    `;

    const actions = document.createElement('div');
    actions.className = 'flex justify-between items-center mt-6';
    actions.innerHTML = `
      <button id="sync-permissions-btn" class="text-blue-dark text-sm hover:underline">
        Sincronizar Permissões
      </button>
      <div class="flex space-x-4">
        <button id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Voltar
        </button>
        <button id="submit-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
          Cadastrar
        </button>
      </div>
    `;

    form.appendChild(actions);
    container.appendChild(form);
    return container;
  }

  setupEventListeners() {
    const backBtn = this.element.querySelector('#back-btn');
    const submitBtn = this.element.querySelector('#submit-btn');
    const syncPermissionsBtn = this.element.querySelector('#sync-permissions-btn');

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        toast.info('Retornando à lista de perfis...');
        this.onBack();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.submitForm();
      });
    }

    if (syncPermissionsBtn) {
      syncPermissionsBtn.addEventListener('click', () => {
        toast.info('Funcionalidade de sincronizar permissões será implementada.');
        this.onSyncPermissions();
      });
    }
  }

  submitForm() {
    const descricaoInput = this.element.querySelector('#descricao');
    const descricao = descricaoInput.value.trim();

    if (!descricao) {
      toast.error('O campo Descrição é obrigatório!');
      return;
    }

    const updatedData = {
      id: this.perfilData.id,
      descricao: descricao
    };

    toast.success('Perfil atualizado com sucesso!');
    this.onUpdate(updatedData);
  }
}

export default EditPerfilComponent;