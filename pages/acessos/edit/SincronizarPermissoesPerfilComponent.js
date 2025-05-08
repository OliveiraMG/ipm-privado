/**
 * SincronizarPermissoesPerfilComponent.js - Componente para sincronizar permissões de perfil
 */
import { toast } from "../../../js/Utilities.js";

class SincronizarPermissoesPerfilComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {string} config.perfilName - Nome do perfil
   * @param {Function} config.onSync - Função chamada ao sincronizar as permissões
   * @param {Function} config.onBack - Função chamada ao clicar em Voltar
   */
  constructor(config) {
    this.perfilName = config.perfilName || "Perfil";
    this.onSync = config.onSync || (() => {});
    this.onBack = config.onBack || (() => {});
    this.permissions = config.permissions || [];
    this.selectedPermissions = [];

    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement("div");
    container.className = "p-6";

    // Título
    const title = document.createElement("h3");
    title.className = "text-lg font-semibold text-blue-dark mb-4";
    title.textContent = `Sincronizar permissões para: ${this.perfilName}`;
    container.appendChild(title);

    // Opções de permissões (checkboxes)
    const permissionsContainer = document.createElement("div");
    permissionsContainer.className = "flex flex-wrap gap-4 mb-6";
    const permissionOptions = [
      "Importação",
      "Estatísticas",
      "Malha Fiscal",
      "Monitoramento",
      "ICMS Cota Parte",
      "Cadastro",
      "Relatórios",
      "Atividades Econômicas",
      "Auxiliares",
      "Acessos",
      "Configurações",
      "Importar",
      "Importados",
      "Visualizar Remessas",
      "Cadastrar Remessas",
      "Editar Remessas",
      "Remover Remessas",
      "Visualizar Publicações",
      "Cadastrar Publicações",
      "Editar Publicações",
      "Visualizar Exercícios",
      "Cadastrar Exercícios",
      "Editar Exercícios",
      "Remover Exercícios",
      "Visualizar Filas",
      "Visualizar Falhas",
    ];

    permissionOptions.forEach((permission) => {
      const label = document.createElement("label");
      label.className = "flex items-center space-x-2 w-1/4";
      label.innerHTML = `
          <input type="checkbox" value="${permission}" class="form-checkbox h-5 w-5 text-blue-dark">
          <span class="text-gray-700">${permission}</span>
        `;
      permissionsContainer.appendChild(label);
    });
    container.appendChild(permissionsContainer);

    // Botões
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "flex justify-end space-x-4";
    buttonContainer.innerHTML = `
        <button id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Voltar
        </button>
        <button id="select-all-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Marcar Todos
        </button>
        <button id="sync-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
          Sincronizar
        </button>
      `;
    container.appendChild(buttonContainer);

    return container;
  }

  setupEventListeners() {
    const backBtn = this.element.querySelector("#back-btn");
    const selectAllBtn = this.element.querySelector("#select-all-btn");
    const syncBtn = this.element.querySelector("#sync-btn");
    const checkboxes = this.element.querySelectorAll('input[type="checkbox"]');

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        toast.info("Retornando à lista de perfis...");
        this.onBack();
      });
    }

    if (selectAllBtn) {
      selectAllBtn.addEventListener("click", () => {
        checkboxes.forEach((checkbox) => {
          checkbox.checked = true;
        });
        this.selectedPermissions = Array.from(checkboxes).map((cb) => cb.value);
      });
    }

    if (syncBtn) {
      syncBtn.addEventListener("click", () => {
        this.selectedPermissions = Array.from(checkboxes)
          .filter((cb) => cb.checked)
          .map((cb) => cb.value);
        toast.success(
          `Permissões de ${this.perfilName} sincronizadas com sucesso!`
        );
        this.onSync({ permissions: this.selectedPermissions });
      });
    }

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const value = e.target.value;
        if (e.target.checked) {
          this.selectedPermissions.push(value);
        } else {
          this.selectedPermissions = this.selectedPermissions.filter(
            (p) => p !== value
          );
        }
      });
    });
  }
}

export default SincronizarPermissoesPerfilComponent;
