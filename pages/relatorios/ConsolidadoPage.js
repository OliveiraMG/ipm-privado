/**
 * Consolidado.js - Página de Emissão de Relatório Consolidado
 */
import { Header } from "../../../components/layout/Header.js";

class Consolidado {
  constructor() {
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando Consolidado...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.renderContent();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Relatorios | Consolidado</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Consolidado</div>
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
      <h2 class="text-2xl font-semibold text-blue-dark">Emitir Relatório Consolidado</h2>
    `;
    card.appendChild(header);

    const content = document.createElement("div");
    content.className = "text-gray-700 text-base mb-6";
    content.innerHTML = `
        <form class="imprimir-form flex flex-col gap-6">

          <div class="grid-3">
            <select class='select-container' >
              <option value="" disabled selected>
                Cidades*
              </option>
            </select>
            <select class='select-container' >
              <option value="" disabled selected>
                Exercicio*
              </option>
            </select>
            <select class='select-container' >
              <option value="" disabled selected>
                Remessa*
              </option>
            </select>
          </div>

          <div class="grid-3">
            <select class='select-container' >
              <option value="" disabled selected>
                Situação*
              </option>
            </select>
            <select class='select-container'>
              <option value="" disabled selected>
                Grupo Econômico*
              </option>
            </select>
            <select class='select-container'>
              <option value="" disabled selected>
                Orientação*
              </option>
            </select>
          </div>
          
          <div class="grid-2">
            <select class="select-container">
              <option value="" disabled selected>Contribuintes*</option>
            </select>

            <select class="select-container">
              <option value="" disabled selected>Contador(a)*</option>
            </select>

          </div>


          <div class="submit-section">
            <button class="btn-primary" id="imprimir-btn">
              Imprimir 
              <i class="fas fa-print"></i>
            </button>
          </div>

        </form>
        `;

    card.appendChild(content);

    mainContent.appendChild(card);
  }

  static initialize() {
    return new Consolidado();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Consolidado.initialize();
});

export default Consolidado;
