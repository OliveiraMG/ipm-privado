/**
 * RegisterCityComponent.js - Componente para a página de cadastro de cidade
 */
import { Header } from "../../../components/layout/Header.js";
import { toast } from "../../../js/Utilities.js";

class RegisterCityComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {string} config.containerId - ID do elemento onde o componente será renderizado
   * @param {Function} config.onSubmit - Função chamada ao submeter o formulário
   * @param {Function} config.onBack - Função chamada ao clicar em Voltar
   */
  constructor(config) {
    this.containerId = config.containerId || "register-city-container";
    this.onSubmit = config.onSubmit || (() => {});
    this.onBack = config.onBack || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  /**
   * Renderiza o componente
   * @returns {HTMLElement} - Elemento do componente
   */
  render() {
    const container = document.createElement("div");
    container.className = "w-full";
    container.id = this.containerId;

    // Formulário (sem card extra para evitar camadas desnecessárias)
    const form = document.createElement("div");
    form.className = "p-4";

    // Campos do formulário
    form.innerHTML = `
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-1">
          <label for="codigo" class="block text-sm font-medium text-gray-700">Código*:</label>
          <input type="text" id="codigo" name="codigo" required
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição*:</label>
          <input type="text" id="descricao" name="descricao" required
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="estado" class="block text-sm font-medium text-gray-700">Estado*:</label>
          <select id="estado" name="estado" required
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="">Selecione um estado</option>
            <option value="Mato Grosso">Mato Grosso</option>
            <option value="Rondônia">Rondônia</option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="ativo" class="block text-sm font-medium text-gray-700">Ativo*:</label>
          <select id="ativo" name="ativo" required
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="">Selecione</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>
        <div class="col-span-2 flex items-center space-x-4">
          <div class="flex-1">
            <label for="brasao" class="block text-sm font-medium text-gray-700">Brasão:</label>
            <div class="flex items-center mt-1">
              <span id="brasao-file-name" class="text-gray-500 text-sm mr-4">Escolher Brasão</span>
              <input type="file" id="brasao" name="brasao" accept="image/*" class="hidden" />
              <button id="choose-brasao-btn" type="button"
                      class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
                Escolher Arquivo
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Botões de ação
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

  /**
   * Configura os eventos dos botões
   */
  setupEventListeners() {
    const backBtn = this.element.querySelector("#back-btn");
    const submitBtn = this.element.querySelector("#submit-btn");
    const chooseBrasaoBtn = this.element.querySelector("#choose-brasao-btn");
    const brasaoInput = this.element.querySelector("#brasao");
    const brasaoFileName = this.element.querySelector("#brasao-file-name");

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        toast.info("Retornando à lista de cidades...");
        this.onBack();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        this.submitForm();
      });
    }

    if (chooseBrasaoBtn && brasaoInput) {
      chooseBrasaoBtn.addEventListener("click", () => {
        brasaoInput.click();
      });

      brasaoInput.addEventListener("change", () => {
        if (brasaoInput.files && brasaoInput.files.length > 0) {
          brasaoFileName.textContent = brasaoInput.files[0].name;
        } else {
          brasaoFileName.textContent = "Escolher Brasão";
        }
      });
    }
  }

  /**
   * Processa o envio do formulário
   */
  submitForm() {
    const codigoInput = this.element.querySelector("#codigo");
    const descricaoInput = this.element.querySelector("#descricao");
    const estadoInput = this.element.querySelector("#estado");
    const ativoInput = this.element.querySelector("#ativo");
    const brasaoInput = this.element.querySelector("#brasao");

    if (
      codigoInput.checkValidity() &&
      descricaoInput.checkValidity() &&
      estadoInput.checkValidity() &&
      ativoInput.checkValidity()
    ) {
      const data = {
        codigo: parseInt(codigoInput.value),
        cidade: descricaoInput.value,
        estado: estadoInput.value,
        ativo: ativoInput.value === "true" ? "Sim" : "Não",
        brasao:
          brasaoInput.files && brasaoInput.files.length > 0
            ? URL.createObjectURL(brasaoInput.files[0])
            : "",
      };

      toast.info("Processando cadastro...");
      setTimeout(() => {
        toast.success(`Cidade "${data.cidade}" cadastrada com sucesso!`);
        this.onSubmit(data);
      }, 1000);
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      codigoInput.reportValidity();
      descricaoInput.reportValidity();
      estadoInput.reportValidity();
      ativoInput.reportValidity();
    }
  }

  /**
   * Inicializa o componente
   * @param {Object} config - Configuração do componente
   */
  static initialize(config) {
    const container = document.getElementById(config.containerId);
    if (!container) {
      console.error(`Container com ID "${config.containerId}" não encontrado!`);
      return;
    }
    // Renderizar header fora do componente
    Header.initialize();
    // Configurar breadcrumb
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Auxiliares | Cidades</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Cadastrar</div>
        </div>
      `;
    }
    // Instanciar e renderizar o componente
    const component = new RegisterCityComponent(config);
    container.appendChild(component.element);
    return component;
  }
}

export default RegisterCityComponent;
