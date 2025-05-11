/**
 * MunicipalPage.js - Página de Emissão de Relatório Municipal.
 */
import { Header } from "../../../components/layout/Header.js";

class MunicipalPage {
  constructor() {
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando MunicipalPage...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.renderContent();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Gerenciar | ICMS Cota Parte | Municipal</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Municipal</div>
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
      <h2 class="text-2xl font-semibold text-blue-dark">Emitir Relatório Extrato</h2>
    `;
    card.appendChild(header);

    const content = document.createElement("div");
    content.className = "text-gray-700 text-base mb-6";
    content.innerHTML = `
        <form class="imprimir-form flex flex-col gap-6">

          <div class="grid-3">
            <select class='select-container' >
              <option value="" disabled selected>
                Grupo Atividade
              </option>
            </select>
            <select class='select-container' >
              <option value="" disabled selected>
                Município
              </option>
            </select>
            <select class='select-container' >
              <option value="" disabled selected>
                Exercício
              </option>
            </select>
          </div>
          
          <div class="grid-2">
            <select class='select-container' >
              <option value="" disabled selected>
                Tipo
              </option>
            </select>
          </div>
          

          <div class="submit-section">
            <button class="btn-primary" id="imprimir-btn"> 
              Imprimir
              <i class="fa-solid fa-print"></i>
            </button>
          </div>

        </form>
        `;

    card.appendChild(content);

    mainContent.appendChild(card);
  }

  static initialize() {
    return new MunicipalPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  MunicipalPage.initialize();
});

export default MunicipalPage;
