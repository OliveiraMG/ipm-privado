/**
 * RegisterGrupoAtividadeComponent.js - Componente para o formulário de cadastro de grupos de atividades
 */
import { toast } from '/js/Utilities.js';

class RegisterGrupoAtividadeComponent {
  constructor({ onSubmit, onBack }) {
    this.onSubmit = onSubmit || (() => {});
    this.onBack = onBack || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'w-full';

    const form = document.createElement('div');
    form.className = 'p-4';

    form.innerHTML = `
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-1">
          <label for="porcentagem" class="block text-sm font-medium text-gray-700">Porcentagem *</label>
          <input type="text" id="porcentagem" name="porcentagem"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
                 placeholder="Ex: 20%">
        </div>
        <div class="col-span-1">
          <label for="denominacao" class="block text-sm font-medium text-gray-700">Denominação *</label>
          <input type="text" id="denominacao" name="denominacao"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="ativo" class="block text-sm font-medium text-gray-700">Ativo</label>
          <select id="ativo" name="ativo"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </div>
      </div>
      <div class="mt-4">
        <label for="cnaes" class="block text-sm font-medium text-gray-700">CNAEs</label>
        <select id="cnaes" name="cnaes" multiple
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
          <option value="111301">111301 - Cultivo de Arroz</option>
          <option value="111302">111302 - Cultivo de Milho</option>
          <option value="111303">111303 - Cultivo de Trigo</option>
          <option value="111299">111299 - Cultivo de outras fibras de lavoura temporária não especificadas anteriormente</option>
          <option value="114800">114800 - Cultivo de Fumo</option>
        </select>
      </div>
      <div class="flex justify-end space-x-4 mt-6">
        <button id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Voltar
        </button>
        <button id="submit-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
          Cadastrar
        </button>
      </div>
    `;

    container.appendChild(form);
    return container;
  }

  setupEventListeners() {
    const cancelBtn = this.element.querySelector('#cancel-btn');
    const submitBtn = this.element.querySelector('#submit-btn');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        toast.info('Cadastro cancelado.');
        this.onBack();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.submitForm();
      });
    }
  }

  submitForm() {
    const porcentagem = this.element.querySelector('#porcentagem').value;
    const denominacao = this.element.querySelector('#denominacao').value;
    const ativo = this.element.querySelector('#ativo').value;
    const cnaesSelect = this.element.querySelector('#cnaes');
    const cnaes = Array.from(cnaesSelect.selectedOptions).map(option => ({
      id: option.value,
      descricao: option.text
    }));

    // Basic validation
    if (!porcentagem || !denominacao) {
      toast.error('Os campos Porcentagem e Denominação são obrigatórios!');
      return;
    }

    const data = {
      percentualCalculo: porcentagem,
      atividade: denominacao,
      ativo: ativo || 'Sim',
      cnaesCadastradas: cnaes.length.toString(),
      cnaesList: cnaes
    };

    toast.success('Atividade econômica cadastrada com sucesso!');
    this.onSubmit(data);
  }
}

export default RegisterGrupoAtividadeComponent;