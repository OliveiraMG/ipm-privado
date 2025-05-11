/**
 * RegisterPermissaoComponent.js - Componente para cadastro de permissão
 */
import { toast } from "../../../../js/Utilities.js";

class RegisterMotivosNotificacoesComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {Function} config.onSubmit - Função chamada ao submeter o formulário
   * @param {Function} config.onBack - Função chamada ao clicar em Voltar
   */
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
        <select id="sigla" name="sigla" class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
          <option value="" disabled selected>Selecione a Sigla</option>
          <option value="VANAP">VANAP</option>
          <option value="CVAPA">CVAPA</option>
          <option value="AVULS">AVULS</option>
          <option value="CNTSM">CNTSM</option>
        </select>
      </div>
      <div>
        <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição:</label>
        <input type="text" id="descricao" name="descricao"
               class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
      </div>
      <div>
        <select id="modulo" name="modulo" class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
          <option value="" disabled selected>Selecione o Modulo</option>
          <option value="IMPORTAÇÃO">Importação</option>
          <option value="GERENCIAR">Gerenciar</option>
          <option value="CADASTRO">Cadastro</option>
          <option value="RELATÓRIOS">Relatórios</option>
          <option value="AUXILIARES">Auxiliares</option>
          <option value="ACESSOS">Acessos</option>
        </select>
      </div>
      <div>
        <select id='ativo' name='ativo' class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
          <option value="" disabled selected>Ativo?</option>
          <option value="SIM">Sim</option>
          <option value="NAO">Não</option>
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
    const siglaInput = this.element.querySelector("#sigla");
    const ativoInput = this.element.querySelector("#ativo");

    const descricao = descricaoInput.value.trim();
    const modulo = moduloInput.value;
    const sigla = siglaInput.value;
    const ativo = ativoInput.value;

    if (!sigla) {
      toast.error("O campo Sigla é obrigatório!");
      return;
    }

    if (!descricao) {
      toast.error("O campo Descrição é obrigatório!");
      return;
    }

    if (!modulo) {
      toast.error("O campo Módulo é obrigatório!");
      return;
    }

    if (!ativo) {
      toast.error("O campo Ativo é obrigatório!");
      return;
    }

    const data = {
      sigla: sigla,
      descricao: descricao,
      modulo: modulo,
      ativo: ativo
    };

    toast.success("Permissão cadastrada com sucesso!");
    this.onSubmit(data);
  }
}

export default RegisterMotivosNotificacoesComponent;
