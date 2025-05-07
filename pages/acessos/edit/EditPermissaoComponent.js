/**
 * EditPermissaoComponent.js - Componente para edição de permissão
 */
import { toast } from "/js/Utilities.js";

class EditPermissaoComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {Object} config.permissaoData - Dados da permissão a ser editada
   * @param {Function} config.onUpdate - Função chamada ao atualizar a permissão
   * @param {Function} config.onBack - Função chamada ao clicar em Voltar
   */
  constructor(config) {
    this.permissaoData = config.permissaoData || {};
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
        <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição:</label>
        <input type="text" id="descricao" name="descricao"
               value="${this.permissaoData.descricao || ""}"
               class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
      </div>
      <div>
        <label for="modulo" class="block text-sm font-medium text-gray-700">Módulo:</label>
        <select id="modulo" name="modulo"
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
          <option value="">Selecione</option>
          <option value="IMPORTAÇÃO" ${
            this.permissaoData.modulo === "IMPORTAÇÃO" ? "selected" : ""
          }>Importação</option>
          <option value="GERENCIAR" ${
            this.permissaoData.modulo === "GERENCIAR" ? "selected" : ""
          }>Gerenciar</option>
          <option value="CADASTRO" ${
            this.permissaoData.modulo === "CADASTRO" ? "selected" : ""
          }>Cadastro</option>
          <option value="RELATÓRIOS" ${
            this.permissaoData.modulo === "RELATÓRIOS" ? "selected" : ""
          }>Relatórios</option>
          <option value="AUXILIARES" ${
            this.permissaoData.modulo === "AUXILIARES" ? "selected" : ""
          }>Auxiliares</option>
          <option value="ACESSOS" ${
            this.permissaoData.modulo === "ACESSOS" ? "selected" : ""
          }>Acessos</option>
        </select>
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "flex justify-end space-x-4 mt-6";
    actions.innerHTML = `
      <button id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
        Voltar
      </button>
      <button id="submit-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
        Cadastrar
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
        toast.info("Retornando à lista de permissões...");
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
    const descricaoInput = this.element.querySelector("#descricao");
    const moduloInput = this.element.querySelector("#modulo");

    const descricao = descricaoInput.value.trim();
    const modulo = moduloInput.value;

    if (!descricao) {
      toast.error("O campo Descrição é obrigatório!");
      return;
    }

    if (!modulo) {
      toast.error("O campo Módulo é obrigatório!");
      return;
    }

    const updatedData = {
      id: this.permissaoData.id,
      descricao: descricao,
      modulo: modulo,
    };

    toast.success("Permissão atualizada com sucesso!");
    this.onUpdate(updatedData);
  }
}

export default EditPermissaoComponent;
