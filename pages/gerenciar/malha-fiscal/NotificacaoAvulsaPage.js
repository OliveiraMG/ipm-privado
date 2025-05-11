/**
 * NotificacaoAvulsa.js - NotificacaoAvulsaPage
 */
import { Header } from "../../../components/layout/Header.js";
import { toast } from "../../../js/Utilities.js";

class NotificacaoAvulsaPage {
  constructor() {
    this.initialize();
  }

  initialize() {
    console.log("Inicializando NotificacaoAvulsaPage...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.renderContent();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Gerenciar | Malha Fiscal | Notificação Avulsa</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Notificação Avulsa</div>
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
      <h2 class="text-2xl font-semibold text-blue-dark">Enviar Notificação Avulsa</h2>
    `;
    card.appendChild(header);

    const form = document.createElement("form");
    form.className = "notificar-form";

    form.innerHTML = `
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-700 mb-2">Município</label>
          <select id="municipality-select" class="w-full">
            <option disabled selected>Selecione</option>
            <option>Município A</option>
            <option>Município B</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 mb-2">Tipo de Notificação</label>
          <select class="w-full border border-gray-300 rounded-lg h-12 px-3">
            <option disabled selected>Selecione</option>
            <option>Tipo 1</option>
            <option>Tipo 2</option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Assunto</label>
        <input type="text" class="w-full border border-gray-300 rounded-lg h-12 px-3" placeholder="Digite o assunto" />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Mensagem</label>
        <textarea class="w-full border border-gray-300 rounded-lg px-3 py-2" rows="5" placeholder="Digite a mensagem"></textarea>
      </div>

      <div class="submit-section">
        <button type="submit" id="notify-btn" class="btn-primary">Enviar Notificação</button>
      </div>
    `;

    card.appendChild(form);
    mainContent.appendChild(card);

    const notifyBtn = document.getElementById("notify-btn");
    if (notifyBtn) {
      notifyBtn.addEventListener("click", (event) => {
        event.preventDefault();
        this.handleNotifyClick();
      });
    }
  }

  handleNotifyClick() {
    const form = document.querySelector(".notificar-form");
    if (form) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      console.log("Dados do formulário:", data);

      // Aqui você pode fazer a chamada para a API ou qualquer outra lógica necessária
      toast.success("Notificação enviada com sucesso!", 3000);
    } else {
      toast.error("Erro ao enviar notificação.", 3000);
    }
  }

  static initialize() {
    return new NotificacaoAvulsaPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  NotificacaoAvulsaPage.initialize();
});

export default NotificacaoAvulsaPage;
