/**
 * ApuracaoPage.js - Pagina de Apuração
 */
import ModalComponent from "../../../components/common/ModalComponent.js";
import { Header } from "../../../components/layout/Header.js";
import { toast } from "../../../js/Utilities.js";

class ApuracaoPage {
  constructor() {
    this.initialize();
  }

  initialize() {
    console.log("Inicializando ApuracaoPage...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.renderContent();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Gerenciar | Estatística | Apuração</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Apuração</div>
        </div>
      `;
    }
  }

  renderContent() {
    const mainContent = document.querySelector("main");
    if (!mainContent) return;

    mainContent.innerHTML = "";

    const card = document.createElement("div");
    card.className =
      "bg-white rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.25)] mx-24 my-20 p-12";

    const header = document.createElement("div");
    header.className = "flex justify-between items-center mb-6";
    header.innerHTML = `
      <h2 class="text-2xl font-semibold text-blue-dark">Apurar</h2>
    `;
    card.appendChild(header);

    const form = document.createElement("form");
    form.className = "notificar-form";

    form.innerHTML = `
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <select id="municipality-select" class="w-full border border-gray-300 rounded-lg h-12 px-3">
            <option disabled selected>Município*</option>
            <option value='A'>Município A</option>
            <option value='B'>Município B</option>
          </select>
        </div>
        <div>
          <select class="w-full border border-gray-300 rounded-lg h-12 px-3">
            <option disabled selected>Portaria*</option>
            <option value='1'>Portaria 1</option>
            <option value='2'>Portaria 2</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-4">
        <div>
          <select id="year-select" class="w-full border border-gray-300 rounded-lg h-12 px-3">
            <option disabled selected>Ano de Depuração*</option>
            <option value='2024'>2024</option>
            <option value='2023'>2023</option>
            <option value='2022'>2022</option>
            <option value='2021'>2021</option>
          </select>
        </div>
        <div>
          <select class="w-full border border-gray-300 rounded-lg h-12 px-3">
            <option disabled selected>Remessas*</option>
            <option value='1'>Remessa 1</option>
            <option value='2'>Remessa 2</option>
          </select>
        </div>
        <div>
          <select class="w-full border border-gray-300 rounded-lg h-12 px-3">
            <option disabled selected>Grupo Econômico*</option>
            <option value='simples'>Econômico Simples</option>
            <option value='prime'>Econômico Prime</option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <select class="w-full border border-gray-300 rounded-lg h-12 px-3">
          <option value='' disabled selected>Contribuintes*</option>
          <option value='1'>Contribuinte 1</option>
          <option value='2'>Contribuinte 2</option>
          <option value='3'>Contribuinte 3</option>
          <option value='4'>Contribuinte 4</option>
        </select>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-4">
        <div class="col-span-2">
          <select class="w-full border border-gray-300 rounded-lg h-12 px-3">
            <option value='' disabled selected>Contador(a)*</option>
            <option value='1'>Contador 1</option>
            <option value='2'>Contador 2</option>
            <option value='3'>Contador 3</option>
            <option value='4'>Contador 4</option>
          </select>
        </div>
        <div class="flex items-center justify-start max-w-[150px]">
          <button type="button" class="btn-primary flex gap-2 items-center w-full" id="filter-btn">
            <i class="fa-solid fa-filter"></i>
            Filtrar
          </button>
        </div>
      </div>
    `;

    card.appendChild(form);
    mainContent.appendChild(card);

    card.appendChild(form);

    form.querySelector("#filter-btn")?.addEventListener("click", () => {
      this.openFilterModal();
    });
  }

  openFilterModal() {
    const modalContent = document.createElement("div");
    modalContent.className = "text-gray-700 text-base space-y-6";

    modalContent.innerHTML = `
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-600">Filtro*</label>
          <select id="filter-type-select" class="w-full border border-gray-300 rounded-lg h-12 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option disabled selected>Selecione</option>
            <option value="situacao">Situação</option>
            <option value="atividade">Atividade Econômica</option>
            <option value="contador">Contabilista</option>
            <option value="contribuinte">Contribuinte</option>
          </select>
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-600">Valor do Filtro</label>
          <input type="text" id="filter-value" class="w-full border border-gray-300 rounded-lg h-12 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Digite o valor..." />
        </div>
      </div>
  
      <div class="flex justify-end gap-4 mt-6">
        <button type="button" class="btn-secondary px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition" id="back-filter">
          Voltar
        </button>
        <button type="button" class="btn-primary px-6 py-2 rounded-lg bg-[#3B657A] text-white hover:opacity-70 transition duration-300 ease-in-out" id="apply-filter-btn">
          <i class="fa-solid fa-filter mr-2"></i>Aplicar Filtro
        </button>
      </div>
    `;

    this.modal = new ModalComponent({
      id: "filtro-modal",
      title: "Filtrar por Tabela",
      content: modalContent,
      onClose: () => (this.modal = null),
    });

    this.modal.open();

    setTimeout(() => {
      document
        .getElementById("apply-filter-btn")
        .addEventListener("click", (e) => {
          e.preventDefault();
          this.applyFilter();
        });

      document.getElementById("back-filter").addEventListener("click", (e) => {
        e.preventDefault();
        this.closeModal();
      });
    }, 0);
  }

  applyFilter() {
    const filterType = document.getElementById("filter-type-select")?.value;
    const filterValue = document.getElementById("filter-value")?.value;

    if (!filterType || !filterValue) {
      toast.info("Selecione um tipo de filtro e insira um valor.");
      return;
    }

    toast.success(`Aplicando filtro: ${filterType} = ${filterValue}`);

    this.closeModal();
  }

  closeModal() {
    if (this.modal != null) {
      this.modal.close();
      this.modal = null;
    }
  }

  static initialize() {
    return new ApuracaoPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ApuracaoPage.initialize();
});

export default ApuracaoPage;
