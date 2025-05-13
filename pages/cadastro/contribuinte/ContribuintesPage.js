/**
 * ContribuintesPage.js - Página de Listagem de Contribuintes
 */
import { Header } from "../../../components/layout/Header.js";

class ContribuintesPage {
  constructor() {
    this.initialize();
    this.modal = null;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.totalPages = 0;
    this.contribuintes = [];
  }

  initialize() {
    console.log("Inicializando ContribuintesPage...");
    Header.initialize();
    this.setupBreadcrumbs();

    // Aguarda o carregamento completo do DOM (incluindo <main>)
    const waitForMain = setInterval(() => {
      if (document.querySelector("main")) {
        clearInterval(waitForMain);
        this.loadContribuintes(); // Agora pode carregar
      }
    }, 50);
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

  loadContribuintes() {
    this.contribuintes = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      nome: `Contribuinte ${i + 1}`,
      contabilista: `Nome do Contabilista ${(i % 3) + 1}`,
      situacao: i % 2 === 0 ? "Ativo" : "Inativo",
      municipio: `CIDADE ${(i % 5) + 1} - UF`,
      grupoEconomico: `NOME DO GRUPO ECONÔMICO ${(i % 4) + 1}`,
      simplificado: i % 3 === 0 ? "Sim" : "Não",
      simplesNacional: i % 2 === 0 ? "Sim" : "Não",
    }));
    this.totalPages = Math.ceil(this.contribuintes.length / this.itemsPerPage);
    this.renderContent(); // Chamada correta
  }

  renderContent() {
    const mainContent = document.querySelector("main");
    if (!mainContent) return;

    mainContent.innerHTML = "";
    const pageContainer = document.createElement("div");
    pageContainer.className = "mx-auto my-10 px-6 w-full";

    const topStatsAndSearch = document.createElement("div");
    topStatsAndSearch.className =
      "flex flex-wrap md:flex-nowrap items-start gap-6 mb-8 w-full";

    const topStats = document.createElement("div");
    topStats.className = "flex flex-wrap gap-4 w-full md:w-3/4";
    topStats.innerHTML = `
        <div class="bg-[#2d4850] rounded-xl p-4 flex items-center gap-4 flex-1 min-w-[220px]">
          <i class="fas fa-landmark text-white text-3xl"></i>
          <div>
            <div class="font-semibold text-2xl text-white">15.294</div>
            <div class="text-lg text-white">Contribuintes</div>
          </div>
        </div>
        <div class="bg-[#2d4850] rounded-xl p-4 flex items-center gap-4 flex-1 min-w-[220px]">
          <i class="fas fa-users text-white text-3xl"></i>
          <div>
            <div class="font-semibold text-2xl text-white">3.194</div>
            <div class="text-lg text-white">MEI</div>
          </div>
        </div>
        <div class="bg-[#2d4850] rounded-xl p-4 flex items-center gap-4 flex-1 min-w-[220px]">
          <i class="fas fa-chart-line text-white text-3xl"></i>
          <div>
            <div class="font-semibold text-2xl text-white">1.129</div>
            <div class="text-lg text-white">Simples Nacional</div>
          </div>
        </div>
        <div class="bg-[#2d4850] rounded-xl p-4 flex items-center gap-4 flex-1 min-w-[220px]">
          <i class="fas fa-file-invoice text-white text-3xl"></i>
          <div>
            <div class="font-semibold text-2xl text-white">0</div>
            <div class="text-lg text-white">Simplificada</div>
          </div>
        </div>
    `;
    topStatsAndSearch.appendChild(topStats);

    const searchAndFilters = document.createElement("div");
    searchAndFilters.className =
      "flex flex-col gap-3 md:flex-col justify-start md:justify-center w-full md:w-1/4";
    searchAndFilters.innerHTML = `
        <div class="relative w-full">
          <input id="search-input" type="text" class="w-full rounded-full border border-gray-300 pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-light text-lg" placeholder="Pesquisar...">
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <i class="fas fa-search text-gray-500 h-6 w-6"></i>
          </div>
        </div>
        <div class="flex items-center gap-3 justify-end">
          <button id="filter-button" class="bg-white border border-gray-300 rounded-full p-3 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-light">
            <i class="fas fa-filter h-6 w-6"></i>
          </button>
          <button id="sort-button" class="bg-white border border-gray-300 rounded-full p-3 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-light">
            <i class="fas fa-bars h-6 w-6"></i>
          </button>
          <button id="options-button" class="bg-white border border-gray-300 rounded-full p-3 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-light">
            <i class="fas fa-ellipsis-v h-6 w-6"></i>
          </button>
        </div>
    `;
    topStatsAndSearch.appendChild(searchAndFilters);

    pageContainer.appendChild(topStatsAndSearch);

    const listContainer = document.createElement("div");
    listContainer.id = "list-container";
    listContainer.className = "grid grid-cols-1 md:grid-cols-2 gap-6 w-full";
    pageContainer.appendChild(listContainer);

    const pagination = document.createElement("div");
    pagination.id = "pagination-container";
    pagination.className = "flex justify-center mt-8 w-full";
    pageContainer.appendChild(pagination);

    mainContent.appendChild(pageContainer);

    this.setupEventListeners();

    // Render após garantir que os elementos estão no DOM
    setTimeout(() => {
      this.renderTable();
      this.renderPagination();
    }, 10);
  }

  setupEventListeners() {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        this.currentPage = 1;
        this.renderTable();
        this.renderPagination();
      });
    }

    const filterButton = document.getElementById("filter-button");
    const sortButton = document.getElementById("sort-button");
    const optionsButton = document.getElementById("options-button");

    filterButton?.addEventListener("click", () =>
      alert("Implementar funcionalidade de filtro")
    );
    sortButton?.addEventListener("click", () =>
      alert("Implementar funcionalidade de ordenação")
    );
    optionsButton?.addEventListener("click", () =>
      alert("Implementar opções adicionais")
    );
  }

  filterContribuintes() {
    const input = document.getElementById("search-input");
    const searchTerm = input ? input.value.toLowerCase() : "";
    return this.contribuintes.filter((c) => {
      return (
        (c.nome || "").toLowerCase().includes(searchTerm) ||
        (c.contabilista || "").toLowerCase().includes(searchTerm) ||
        (c.municipio || "").toLowerCase().includes(searchTerm)
      );
    });
  }

  renderTable() {
    const listContainer = document.getElementById("list-container");
    if (!listContainer) return;

    listContainer.innerHTML = "";

    const filtered = this.filterContribuintes();
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const current = filtered.slice(start, end);

    if (current.length === 0) {
      listContainer.innerHTML = `<div class="col-span-full text-center text-gray-500 py-8">Nenhum contribuinte encontrado.</div>`;
      return;
    }

    current.forEach((c) => {
      const div = document.createElement("div");
      div.className = "bg-white rounded-xl shadow-md p-6";
      div.innerHTML = `
        <div class="flex justify-between items-start mb-3">
          <div class="text-lg text-gray-700 font-semibold">Contribuinte: ${
            c.nome
          }</div>
          <div class="text-md text-gray-500">#${c.id}</div>
        </div>
        <div class="text-md text-gray-600 mb-2">Contabilista: ${
          c.contabilista
        }</div>
        <div class="text-md text-gray-600 mb-2">Situação: <span class='p-1 ${
          c.situacao === "Ativo" ? "bg-green-300" : "bg-red-300"
        }'>${c.situacao}</span></div>
        <div class="text-md text-gray-600 mb-2">Município: ${c.municipio}</div>
        <div class="text-md text-gray-600">Grupo Eco: ${c.grupoEconomico}</div>
        <div class="mt-3 flex justify-between items-center">
          <div class="text-md text-gray-500">Simplificado: ${
            c.simplificado
          }</div>
          <div class="text-md text-gray-500">Simples Nacional: ${
            c.simplesNacional
          }</div>
        </div>
      `;
      listContainer.appendChild(div);
    });
  }

  renderPagination() {
    const container = document.getElementById("pagination-container");
    if (!container) return;

    container.innerHTML = "";
    if (this.totalPages <= 1) return;

    const nav = document.createElement("nav");
    nav.className = "flex space-x-2 justify-center";

    const prev = document.createElement("button");
    prev.textContent = "<";
    prev.className = `px-3 py-1 border rounded ${
      this.currentPage === 1
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "bg-white text-blue-dark hover:bg-blue-light"
    }`;
    prev.disabled = this.currentPage === 1;
    prev.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderTable();
        this.renderPagination();
      }
    });
    nav.appendChild(prev);

    for (let i = 1; i <= this.totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = `px-3 py-1 border rounded ${
        this.currentPage === i
          ? "bg-blue-dark text-white"
          : "bg-white text-blue-dark hover:bg-blue-light"
      }`;
      btn.addEventListener("click", () => {
        this.currentPage = i;
        this.renderTable();
        this.renderPagination();
      });
      nav.appendChild(btn);
    }

    const next = document.createElement("button");
    next.textContent = ">";
    next.className = `px-3 py-1 border rounded ${
      this.currentPage === this.totalPages
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "bg-white text-blue-dark hover:bg-blue-light"
    }`;
    next.disabled = this.currentPage === this.totalPages;
    next.addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.renderTable();
        this.renderPagination();
      }
    });
    nav.appendChild(next);

    container.appendChild(nav);
  }

  static initialize() {
    return new ContribuintesPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ContribuintesPage.initialize();
});

export default ContribuintesPage;
