/**
 * RegisterPortariaComponent.js - Componente para o formulário de cadastro de portarias
 */
import { toast } from "/js/Utilities.js";
import ModalComponent from "/components/common/ModalComponent.js";

class RegisterPortariaComponent {
  constructor({ onSubmit, onBack }) {
    this.onSubmit = onSubmit || (() => {});
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
      <div class="grid grid-cols-5 gap-4">
        <div class="col-span-1">
          <label for="emVigor" class="block text-sm font-medium text-gray-700">Em vigor?</label>
          <select id="emVigor" name="emVigor"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="numero" class="block text-sm font-medium text-gray-700">Número*</label>
          <input type="text" id="numero" name="numero"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="ano" class="block text-sm font-medium text-gray-700">Ano*</label>
          <input type="text" id="ano" name="ano"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="dataAssinatura" class="block text-sm font-medium text-gray-700">Data Assinatura*</label>
          <input type="text" id="dataAssinatura" name="dataAssinatura" placeholder="DD/MM/YYYY"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="dataPublicacao" class="block text-sm font-medium text-gray-700">Data Publicação*</label>
          <input type="text" id="dataPublicacao" name="dataPublicacao" placeholder="DD/MM/YYYY"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
      </div>
      <div class="mt-4">
        <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição*</label>
        <input type="text" id="descricao" name="descricao"
               class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
      </div>
      <div class="mt-4 grid grid-cols-2 gap-4">
        <div class="col-span-1">
          <label for="cfopSelect" class="block text-sm font-medium text-gray-700">CFOP</label>
          <select id="cfopSelect" name="cfopSelect"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="">Selecione</option>
            <option value="repercute">repercute no cálculo do Demonstrativo (Relatório)</option>
          </select>
        </div>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-4">
        <div class="col-span-1">
          <label for="ementa" class="block text-sm font-medium text-gray-700">Ementa*</label>
          <textarea id="ementa" name="ementa" rows="4"
                    class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"></textarea>
        </div>
        <div class="col-span-1">
          <label for="cfop" class="block text-sm font-medium text-gray-700">Cfop*</label>
          <textarea id="cfop" name="cfop" rows="4"
                    class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"></textarea>
          <p class="text-xs text-gray-500 mt-1">*informe os cfops separados por ;</p>
        </div>
      </div>
      <div class="flex justify-end space-x-4 mt-6">
        <button id="back-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
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
    const backBtn = this.element.querySelector("#back-btn");
    const submitBtn = this.element.querySelector("#submit-btn");

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        toast.info("Retornando à lista de portarias...");
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
    const emVigor = this.element.querySelector("#emVigor").value;
    const numero = this.element.querySelector("#numero").value;
    const ano = this.element.querySelector("#ano").value;
    const dataAssinatura = this.element.querySelector("#dataAssinatura").value;
    const dataPublicacao = this.element.querySelector("#dataPublicacao").value;
    const descricao = this.element.querySelector("#descricao").value;
    const cfopSelect = this.element.querySelector("#cfopSelect").value;
    const ementa = this.element.querySelector("#ementa").value;
    const cfop = this.element.querySelector("#cfop").value;

    if (
      !numero ||
      !ano ||
      !dataAssinatura ||
      !dataPublicacao ||
      !descricao ||
      !ementa ||
      !cfop
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    const formData = {
      vigente: emVigor,
      numeroAno: `${numero}/${ano}`,
      portaria: `PORTARIA N° ${numero}/${ano}-SEFAZ`,
      assinatura: dataAssinatura,
      publicacao: dataPublicacao,
      descricao: descricao,
      cfopSelect: cfopSelect || null,
      ementa: ementa,
      cfop: cfop,
    };

    toast.success("Portaria cadastrada com sucesso!");
    this.onSubmit(formData);
  }
}

export default RegisterPortariaComponent;
