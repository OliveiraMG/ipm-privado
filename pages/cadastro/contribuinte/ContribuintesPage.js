/**
 * ContribuintesPage.js - Página de Listagem de Contribuintes
 */
import { Header } from "../../../components/layout/Header.js";

class ContribuintesPage {
  constructor() {
    this.initialize();
  }

  initialize() {
    console.log("Inicializando ContribuintesPage...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.renderContent();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-6 md:pl-20 pr-6 md:pr-16">
          <div class="text-gray-500 text-base leading-tight">Cadastro | Contribuinte | Contribuintes</div>
          <div class="text-blue-dark font-semibold text-2xl md:text-4xl leading-tight mt-0">Listagem</div>
        </div>
      `;
    }
  }
  renderContent() {
    const mainContent = document.querySelector("main");
    if (!mainContent) return;

    mainContent.innerHTML = "";
    const pageContainer = document.createElement("div");
    pageContainer.className = "mx-auto my-10 px-6 w-full";

    const topStatsAndSearch = document.createElement("div");
    topStatsAndSearch.className =
      "flex flex-col md:flex-row items-center flex-wrap gap-6 mb-8 w-full";

    const topStats = document.createElement("div");
    topStats.className = "flex justify-center gap-4 flex-wrap";
    topStats.innerHTML = `
        <div class="rounded-xl p-4 flex items-center gap-4 min-w-[250px]">
          <div class="bg-[#2d4850] rounded-xl p-12 flex items-center gap-4 min-w-[220px]">
            <i class="fas fa-landmark text-white text-3xl"></i>
            <div>
              <div class="font-semibold text-2xl text-white text-left">15.294</div>
              <div class="text-lg text-white text-left">Contribuintes</div>
            </div>
          </div>
        </div>
        <div class="rounded-xl p-4 flex items-center gap-4 min-w-[250px]">
          <div class="bg-[#2d4850] rounded-xl p-12 flex items-center gap-4 min-w-[220px]">
            <i class="fas fa-users text-white text-3xl"></i>
            <div>
              <div class="font-semibold text-2xl text-white text-left">3.194</div>
              <div class="text-lg text-white text-left">MEI</div>
            </div>
          </div>
        </div>
        <div class="rounded-xl p-4 flex items-center gap-4 min-w-[250px]">
          <div class="bg-[#2d4850] rounded-xl p-12 flex items-center gap-4 min-w-[220px]">
            <i class="fas fa-chart-line text-white text-3xl"></i>
            <div>
              <div class="font-semibold text-2xl text-white text-left">1.129</div>
              <div class="text-lg text-white text-left">Simples Nacional</div>
            </div>
          </div>
        </div>
        <div class="rounded-xl p-4 flex items-center gap-4 min-w-[250px]">
          <div class="bg-[#2d4850] rounded-xl p-12 flex items-center gap-4 min-w-[220px]">
           <i class="fas fa-file-invoice text-white text-3xl"></i>
            <div>
              <div class="font-semibold text-2xl text-white text-left">0</div>
              <div class="text-lg text-white text-left">Simplificada</div>
            </div>
          </div>
        </div>
    `;
    topStatsAndSearch.appendChild(topStats);

    const searchAndFilters = document.createElement("div");
    searchAndFilters.className =
      "flex flex-col md:flex-row items-center gap-4 flex-grow justify-end";

    searchAndFilters.innerHTML = `
            <div class="relative w-full lg:max-w-[400px]">
              <input type="text" class="w-full rounded-full border border-gray-300 pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-light text-lg" placeholder="Pesquisar...">
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i class="fas fa-search text-gray-500 h-6 w-6"></i>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button class="bg-white border border-gray-300 rounded-full p-3 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-light">
                <i class="fas fa-filter h-6 w-6"></i>
              </button>
              <button class="bg-white border border-gray-300 rounded-full p-3 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-light">
                <i class="fas fa-bars h-6 w-6"></i>
              </button>
              <button class="bg-white border border-gray-300 rounded-full p-3 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-light">
                <i class="fas fa-ellipsis-v h-6 w-6"></i>
              </button>
            </div>
    `;

    topStatsAndSearch.appendChild(searchAndFilters);
    pageContainer.appendChild(topStatsAndSearch);

    const listContainer = document.createElement("div");
    listContainer.className = "grid grid-cols-1 md:grid-cols-2 gap-6";
    const numberOfItems = 10;

    for (let i = 0; i < numberOfItems; i++) {
      const listItem = document.createElement("div");
      listItem.className = "bg-white rounded-xl shadow-md p-6";
      listItem.innerHTML = `
            <div class="flex justify-between items-start mb-3">
              <div class="text-lg text-gray-700 font-semibold">Contribuinte: ${
                i + 1
              }</div>
              <div class="text-md text-gray-500">#${Math.floor(
                Math.random() * 100
              )}</div>
            </div>
            <div class="text-md text-gray-600 mb-2">Contabilista: Nome do Contabilista</div>
            <div class="text-md text-gray-600 mb-2">Situação: <span class='p-1 bg-green-300'>Ativo</span></div>
            <div class="text-md text-gray-600 mb-2">Município: CIDADE - UF</div>
            <div class="text-md text-gray-600">Grupo Eco: NOME DO GRUPO ECONÔMICO</div>
            <div class="mt-3 flex justify-between items-center">
              <div class="text-md text-gray-500">Simplificado: Não</div>
              <div class="text-md text-gray-500">Simples Nacional: Não</div>
            </div>
        `;
      listContainer.appendChild(listItem);
    }

    pageContainer.appendChild(listContainer);

    const pagination = document.createElement("div");
    pagination.className = "flex justify-center mt-8";
    pagination.innerHTML = `
        <button class="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:text-gray-400 disabled:bg-gray-50 text-lg" disabled>&lt;</button>
        <button class="px-4 py-2 rounded-md border border-gray-300 text-blue-dark hover:bg-blue-light text-lg">1</button>
        <button class="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 text-lg">2</button>
        <button class="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 text-lg">3</button>
        <span class="mx-3 text-gray-500 text-lg">...</span>
        <button class="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 text-lg">99</button>
        <button class="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 text-lg">&gt;</button>
    `;
    pageContainer.appendChild(pagination);

    mainContent.appendChild(pageContainer);
  }

  static initialize() {
    return new ContribuintesPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ContribuintesPage.initialize();
});

export default ContribuintesPage;
