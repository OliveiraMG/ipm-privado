/**
 * EditMotivoComponent.js - Componente para edição de Motivos de Notificações
 */
class EditSituacaoContribuinteComponent {
  constructor({ motivosData, onUpdate, onBack }) {
    this.motivosData = motivosData;
    this.onUpdate = onUpdate;
    this.onBack = onBack;
    this.element = document.createElement("div");
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.element.innerHTML = `
      <div class="p-6">
        <form id="edit-motivo-form" class="space-y-4">
          <div>
            <label for="sigla" class="block text-sm font-medium text-gray-700">Sigla*</label>
            <input type="text" id="sigla" name="sigla" value="${
              this.motivosData.sigla || ""
            }" class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm" required>
          </div>
          <div>
            <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição*</label>
            <textarea id="descricao" name="descricao" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm" required>${
              this.motivosData.descricao || ""
            }</textarea>
          </div>
          <div>
            <label for="modulo" class="block text-sm font-medium text-gray-700">Módulo*</label>
            <input type="text" id="modulo" name="modulo" value="${
              this.motivosData.modulo || ""
            }" class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm" required>
          </div>
          <div>
            <label for="ativo" class="block text-sm font-medium text-gray-700">Ativo*</label>
            <select id="ativo" name="ativo" class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm">
              <option value="Sim" ${
                this.motivosData.ativo === "Sim" ? "selected" : ""
              }>Sim</option>
              <option value="Não" ${
                this.motivosData.ativo === "Não" ? "selected" : ""
              }>Não</option>
            </select>
          </div>
          <div class="flex justify-end space-x-4 mt-6">
            <button type="button" id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100">
              Voltar
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    `;
  }

  setupEventListeners() {
    const form = this.element.querySelector("#edit-motivo-form");
    const backBtn = this.element.querySelector("#back-btn");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const updatedData = {
          id: this.motivosData.id,
          sigla: formData.get("sigla"),
          descricao: formData.get("descricao"),
          modulo: formData.get("modulo"),
          ativo: formData.get("ativo"),
        };
        this.onUpdate(updatedData);
      });
    }

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        this.onBack();
      });
    }
  }
}

export default EditSituacaoContribuinteComponent;
