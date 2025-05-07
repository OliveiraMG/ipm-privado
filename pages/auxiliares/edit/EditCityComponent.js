/**
 * EditCityComponent.js - Componente para a página de edição de cidades
 */
import { Header } from "/components/layout/Header.js";
import { toast } from "/js/Utilities.js";
import ModalComponent from "/components/common/ModalComponent.js";

class EditCityComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {string} config.containerId - ID do elemento onde o componente será renderizado
   * @param {Object} config.cityData - Dados da cidade a ser editada
   * @param {Function} config.onUpdate - Função chamada ao atualizar a cidade
   * @param {Function} config.onBack - Função chamada ao clicar em Voltar
   */
  constructor(config) {
    this.containerId = config.containerId || "edit-city-container";
    this.cityData = config.cityData || {};
    this.onUpdate = config.onUpdate || (() => {});
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

    // Formulário
    const form = document.createElement("div");
    form.className = "p-4";

    // Campos do formulário
    form.innerHTML = `
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-1">
          <label for="codigo" class="block text-sm font-medium text-gray-700">Código:</label>
          <input type="text" id="codigo" name="codigo" value="${
            this.cityData.codigo || ""
          }" readonly
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-100">
        </div>
        <div class="col-span-1">
          <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição:</label>
          <input type="text" id="descricao" name="descricao" value="${
            this.cityData.cidade || ""
          }" required
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="responsavel" class="block text-sm font-medium text-gray-700">Responsável:</label>
          <input type="text" id="responsavel" name="responsavel" value=""
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="setor" class="block text-sm font-medium text-gray-700">Setor:</label>
          <input type="text" id="setor" name="setor" value=""
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
        </div>
        <div class="col-span-1">
          <label for="estado" class="block text-sm font-medium text-gray-700">Estado:</label>
          <select id="estado" name="estado" required
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="Mato Grosso" ${
              this.cityData.estado === "Mato Grosso" ? "selected" : ""
            }>Mato Grosso</option>
            <option value="Rondônia" ${
              this.cityData.estado === "Rondônia" ? "selected" : ""
            }>Rondônia</option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="ativo" class="block text-sm font-medium text-gray-700">Ativo:</label>
          <select id="ativo" name="ativo" required
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="true" ${
              this.cityData.ativo === "Sim" ? "selected" : ""
            }>Sim</option>
            <option value="false" ${
              this.cityData.ativo === "Não" ? "selected" : ""
            }>Não</option>
          </select>
        </div>
        <div class="col-span-2 flex items-center space-x-4">
          <div class="flex-1">
            <label for="brasao" class="block text-sm font-medium text-gray-700">Brasão:</label>
            <div class="flex items-center mt-1">
              <span id="brasao-file-name" class="text-gray-500 text-sm mr-4">${
                this.cityData.brasao ? "Atual:" : "Escolher Brasão"
              }</span>
              <input type="file" id="brasao" name="brasao" accept="image/*" class="hidden" />
              <button id="choose-brasao-btn" type="button"
                      class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
                Escolher Arquivo
              </button>
              ${
                this.cityData.brasao
                  ? `
                <img id="brasao-preview" src="${this.cityData.brasao}" alt="Brasão Atual" class="h-12 w-12 ml-4 object-contain" />
              `
                  : ""
              }
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
      <button id="update-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
        Atualizar
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
    const updateBtn = this.element.querySelector("#update-btn");
    const chooseBrasaoBtn = this.element.querySelector("#choose-brasao-btn");
    const brasaoInput = this.element.querySelector("#brasao");
    const brasaoFileName = this.element.querySelector("#brasao-file-name");
    const brasaoPreview = this.element.querySelector("#brasao-preview");

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        toast.info("Retornando à lista de cidades...");
        this.onBack();
      });
    }

    if (updateBtn) {
      updateBtn.addEventListener("click", () => {
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
          if (brasaoPreview) {
            brasaoPreview.src = URL.createObjectURL(brasaoInput.files[0]);
          } else {
            const img = document.createElement("img");
            img.id = "brasao-preview";
            img.src = URL.createObjectURL(brasaoInput.files[0]);
            img.alt = "Brasão Atual";
            img.className = "h-12 w-12 ml-4 object-contain";
            brasaoInput.parentElement.appendChild(img);
          }
        } else {
          brasaoFileName.textContent = this.cityData.brasao
            ? "Atual:"
            : "Escolher Brasão";
          if (brasaoPreview && this.cityData.brasao) {
            brasaoPreview.src = this.cityData.brasao;
          }
        }
      });
    }
  }

  /**
   * Processa o envio do formulário
   */
  submitForm() {
    const descricaoInput = this.element.querySelector("#descricao");
    const responsavelInput = this.element.querySelector("#responsavel");
    const setorInput = this.element.querySelector("#setor");
    const estadoInput = this.element.querySelector("#estado");
    const ativoInput = this.element.querySelector("#ativo");
    const brasaoInput = this.element.querySelector("#brasao");

    if (
      descricaoInput.checkValidity() &&
      estadoInput.checkValidity() &&
      ativoInput.checkValidity()
    ) {
      const updatedData = {
        id: this.cityData.id,
        codigo: this.cityData.codigo,
        cidade: descricaoInput.value,
        responsavel: responsavelInput.value || null,
        setor: setorInput.value || null,
        estado: estadoInput.value,
        ativo: ativoInput.value === "true" ? "Sim" : "Não",
        brasao:
          brasaoInput.files && brasaoInput.files.length > 0
            ? URL.createObjectURL(brasaoInput.files[0])
            : this.cityData.brasao,
      };

      toast.info("Atualizando cidade...");
      setTimeout(() => {
        toast.success(`Cidade "${updatedData.cidade}" atualizada com sucesso!`);
        this.onUpdate(updatedData);
      }, 1000);
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
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
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Editar Cidade</div>
        </div>
      `;
    }
    // Instanciar e renderizar o componente
    const component = new EditCityComponent(config);
    container.appendChild(component.element);
    return component;
  }
}

export default EditCityComponent;
