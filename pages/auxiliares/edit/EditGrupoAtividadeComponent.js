/**
 * EditGrupoAtividadeComponent.js - Componente para o formulário de edição de grupos de atividades
 */
import { toast } from "/js/Utilities.js";

class EditGrupoAtividadeComponent {
  constructor({ atividadeData, onUpdate, onBack }) {
    this.atividadeData = atividadeData || {};
    this.onUpdate = onUpdate || (() => {});
    this.onBack = onBack || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement("div");
    container.className = "w-full";

    const form = document.createElement("div");
    form.className = "p-4";

    form.innerHTML = `
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-1">
          <label for="porcentagem" class="block text-sm font-medium text-gray-700">Porcentagem</label>
          <input type="text" id="porcentagem" name="porcentagem"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
                 value="${this.atividadeData.percentualCalculo || ""}">
        </div>
        <div class="col-span-1">
          <label for="denominacao" class="block text-sm font-medium text-gray-700">Denominação</label>
          <input type="text" id="denominacao" name="denominacao"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
                 value="${this.atividadeData.atividade || ""}">
        </div>
        <div class="col-span-1">
          <label for="ativo" class="block text-sm font-medium text-gray-700">Ativo?</label>
          <select id="ativo" name="ativo"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="Sim" ${
              this.atividadeData.ativo === "Sim" ? "selected" : ""
            }>Sim</option>
            <option value="Não" ${
              this.atividadeData.ativo === "Não" ? "selected" : ""
            }>Não</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end space-x-4 mt-6">
        <button id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Voltar
        </button>
        <button id="submit-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
          Editar
        </button>
      </div>
    `;

    container.appendChild(form);
    return container;
  }

  setupEventListeners() {
    const cancelBtn = this.element.querySelector("#cancel-btn");
    const submitBtn = this.element.querySelector("#submit-btn");

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        toast.info("Edição cancelada.");
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
    const porcentagem = this.element.querySelector("#porcentagem").value;
    const denominacao = this.element.querySelector("#denominacao").value;
    const ativo = this.element.querySelector("#ativo").value;

    // Basic validation
    if (!porcentagem || !denominacao) {
      toast.error("Os campos Porcentagem e Denominação são obrigatórios!");
      return;
    }

    const updatedData = {
      id: this.atividadeData.id,
      percentualCalculo: porcentagem,
      atividade: denominacao,
      ativo: ativo || "Sim",
      cnaesCadastradas: this.atividadeData.cnaesCadastradas,
      cnaesList: this.atividadeData.cnaesList || [],
    };

    toast.success("Atividade econômica atualizada com sucesso!");
    this.onUpdate(updatedData);
  }
}

export default EditGrupoAtividadeComponent;
