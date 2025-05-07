/**
 * EditRemessaComponent.js - Componente para edição de remessa
 */
import { toast } from "/js/Utilities.js";

class EditRemessaComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {Object} config.remessaData - Dados da remessa a ser editada
   * @param {Function} config.onUpdate - Função chamada ao atualizar a remessa
   * @param {Function} config.onBack - Função chamada ao clicar em Voltar
   */
  constructor(config) {
    this.remessaData = config.remessaData || {};
    this.onUpdate = config.onUpdate || (() => {});
    this.onBack = config.onBack || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement("div");
    container.className = "p-4";

    const form = document.createElement("div");
    form.className = "space-y-4";

    form.innerHTML = `
      <div>
        <label for="denominacao" class="block text-sm font-medium text-gray-700">Denominação:</label>
        <input type="text" id="denominacao" name="denominacao"
               value="${this.remessaData.denominacao || ""}"
               class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "flex justify-end space-x-4 mt-6";
    actions.innerHTML = `
      <button id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
        Voltar
      </button>
      <button id="submit-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
        Editar
      </button>
    `;

    form.appendChild(actions);
    container.appendChild(form);
    return container;
  }

  setupEventListeners() {
    const backBtn = this.element.querySelector("#back-btn");
    const submitBtn = this.element.querySelector("#submit-btn");

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        toast.info("Retornando à lista de remessas...");
        this.onBack();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        this.submitForm();
      });
    }
  }

  submitForm() {
    const denominacaoInput = this.element.querySelector("#denominacao");
    const denominacao = denominacaoInput.value.trim();

    if (!denominacao) {
      toast.error("O campo Denominação é obrigatório!");
      return;
    }

    const updatedData = {
      id: this.remessaData.id,
      denominacao: denominacao,
    };

    this.onUpdate(updatedData);
  }
}

export default EditRemessaComponent;
