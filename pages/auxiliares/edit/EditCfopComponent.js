/**
 * EditCfopComponent.js - Componente para edição de CFOP
 */
class EditCfopComponent {
    constructor({ cfopData, onUpdate, onBack }) {
      this.cfopData = cfopData;
      this.onUpdate = onUpdate;
      this.onBack = onBack;
      this.element = document.createElement('div');
      this.render();
      this.setupEventListeners();
    }
  
    render() {
      this.element.innerHTML = `
        <div class="p-6">
          <form id="edit-cfop-form" class="space-y-4">
            <div class="grid grid-cols-3 gap-4">
              <div class="col-span-1">
                <label for="cfop" class="block text-sm font-medium text-gray-700">CFOP</label>
                <input type="text" id="cfop" name="cfop" value="${this.cfopData.cfop || ''}" class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm" required>
              </div>
              <div class="col-span-2">
                <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição*</label>
                <textarea id="descricao" name="descricao" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm" required>${this.cfopData.descricao || ''}</textarea>
              </div>
            </div>
            <div>
              <label for="aplicacao" class="block text-sm font-medium text-gray-700">Aplicação*</label>
              <textarea id="aplicacao" name="aplicacao" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm" required>${this.cfopData.aplicacao || ''}</textarea>
            </div>
            <div class="flex justify-end space-x-4 mt-6">
              <button type="button" id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100">
                Voltar
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      `;
    }
  
    setupEventListeners() {
      const form = this.element.querySelector('#edit-cfop-form');
      const backBtn = this.element.querySelector('#back-btn');
  
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const updatedData = {
            id: this.cfopData.id,
            cfop: formData.get('cfop'),
            descricao: formData.get('descricao'),
            aplicacao: formData.get('aplicacao')
          };
          this.onUpdate(updatedData);
        });
      }
  
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          this.onBack();
        });
      }
    }
  }
  
  export default EditCfopComponent;