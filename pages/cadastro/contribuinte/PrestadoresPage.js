/**
 * PrestadoresPage.js - Página de Prestadores
 */
import { Header } from "../../../components/layout/Header.js";

class PrestadoresPage {
  constructor() {
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando PrestadoresPage...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.renderContent();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Cadastro | Contribuinte | Prestadores</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Prestadores</div>
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
      <h2 class="text-2xl font-semibold text-blue-dark">Prestadores</h2>
    `;
    card.appendChild(header);

    const content = document.createElement("div");
    content.className = "text-gray-700 text-base mb-6";
    content.innerHTML = `
    PAGINA NAO IMPLEMENTADA
        `;

    card.appendChild(content);

    mainContent.appendChild(card);

    document.getElementById("notify-btn").addEventListener("click", () => {
      this.showNotificationModal();
    });
  }

  static initialize() {
    return new PrestadoresPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  PrestadoresPage.initialize();
});

export default PrestadoresPage;
