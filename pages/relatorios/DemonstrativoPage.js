/**
 * DemonstrativoPage.js - Página de Emissão de Relatório Demonstrativo
 */
import { Header } from "../../../components/layout/Header.js";

class DemonstrativoPage {
  constructor() {
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando DemonstrativoPage...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.renderContent();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Relatorios | Demonstrativo</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Demonstrativo</div>
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
      <h2 class="text-2xl font-semibold text-blue-dark">Emitir Relatório Demonstrativo</h2>
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
                Grupo Econômico*
              </option>
            </select>
            <select class='select-container' >
              <option value="" disabled selected>
                Situação*
              </option>
            </select>
          </div>

          <div class="grid-3">
            <select class='select-container' >
              <option value="" disabled selected>
                Exercícios*
              </option>
            </select>
            <select class='select-container'>
              <option value="" disabled selected>
                Remessas*
              </option>
            </select>
            <select class='select-container'>
              <option value="" disabled selected>
                Simplificada*
              </option>
            </select>
          </div>
          
          <div class="grid-5">
            <select class="select-container">
              <option value="" disabled selected>Simples Nacional</option>
            </select>

            <select class="select-container">
              <option value="" disabled selected>
                MEI
              </option>
            </select>

            <select class="select-container">
              <option value="" disabled selected>
                Tipo
              </option>
            </select>

            <select class="select-container">
              <option value="" disabled selected>
                Tipo Contribuinte
                </option>
            </select>

            <select class="select-container">
              <option value="" disabled selected>
                Orientação
              </option>
              <option value="3">3 anos</optin>
            </select>
            </select>
          </div>
          
          <div class="grid-2">
            <select class='select-container' >
              <option value="" disable selected>
                Contribuintes*
              </option>
            </select>

            <select class='select-container'>
              <option value="" disable selected>
                Contador(a)*
              </option>
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
    return new DemonstrativoPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  DemonstrativoPage.initialize();
});

export default DemonstrativoPage;
