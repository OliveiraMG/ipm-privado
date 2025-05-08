/**
 * RegisterPublicacaoComponent.js - Componente para cadastro de publicação
 */
import { toast } from "../../../js/Utilities.js";

class RegisterPublicacaoComponent {
  constructor(config) {
    this.onSubmit = config.onSubmit || (() => {});
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
               class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
      </div>
      <div>
        <label for="sigla" class="block text-sm font-medium text-gray-700">Sigla:</label>
        <input type="text" id="sigla" name="sigla"
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
        toast.info("Retornando à lista de publicações...");
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
    const siglaInput = this.element.querySelector("#sigla");
    const descricao = descricaoInput.value.trim();
    const sigla = siglaInput.value.trim();

    if (!descricao || !sigla) {
      toast.error("Os campos Descrição e Sigla são obrigatórios!");
      return;
    }

    const data = {
      descricao: descricao,
      sigla: sigla,
    };

    this.onSubmit(data);
  }
}

export default RegisterPublicacaoComponent;
