/**
 * ComparativoPage.js - Página de Emissão de Relatório de Comparativo
 */
import { Header } from "../../../components/layout/Header.js";

class ComparativoPage {
  constructor() {
    this.initialize();
  }

  initialize() {
    console.log("Inicializando ComparativoPage...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.renderContent();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Relatórios | Comparativo</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Comparativo</div>
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
      <h2 class="text-2xl font-semibold text-blue-dark">Emitir Análise Comparativa Anual</h2>
    `;
    card.appendChild(header);

    const content = document.createElement("div");
    content.className = "text-gray-700 text-base mb-6";
    content.innerHTML = `
      <form class="imprimir-form flex flex-col gap-6">
    
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <select class="select-container"><option disabled selected>Município*</option></select>
          <select class="select-container"><option disabled selected>Grupo Econômico*</option></select>
          <select class="select-container"><option disabled selected>Contadores</option></select>
        </div>
    
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <select class="select-container"><option disabled selected>Remessas*</option></select>
          <select class="select-container"><option disabled selected>Exercícios*</option></select>
          <select class="select-container"><option disabled selected>Simples Nacional</option></select>
          <select class="select-container"><option disabled selected>Tipo</option></select>
        </div>
    
        <div class="grid grid-cols-3 md:grid-cols-3 gap-6">
          <div class='grid-3'>
            <select class="select-container"><option disabled selected>Situação</option></select>
            <select class="select-container"><option disabled selected>IE Simplificada</option></select>
            <select class="select-container"><option disabled selected>Orientação</option></select>
          </div>
        </div>
    
        <div class="flex justify-center">
          <button class="btn-primary flex items-center gap-2" id="imprimir-btn">
            <i class="fa-solid fa-print"></i>
            Imprimir
          </button>
        </div>
      </form>
    `;

    card.appendChild(content);
    mainContent.appendChild(card);
  }

  static initialize() {
    return new ComparativoPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ComparativoPage.initialize();
});

export default ComparativoPage;
