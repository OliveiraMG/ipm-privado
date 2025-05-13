/**
 * NotificarPage.js - Página de Envio de Notificações
 */
import { Header } from "../../../components/layout/Header.js";
import { toast } from "../../../js/Utilities.js";

class NotificarPage {
  constructor() {
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando NotificarPage...");
    Header.initialize();
    this.setupBreadcrumbs();
    this.renderContent();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-3 pb-3 pl-6 pr-6 md:pl-20 md:pr-16">
          <div class="text-gray-500 text-sm md:text-base leading-tight">Gerenciar | Malha Fiscal | Notificar</div>
          <div class="text-blue-dark font-semibold text-2xl md:text-4xl leading-tight mt-1 md:mt-0">Notificar</div>
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
      "bg-white rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.25)] mx-4 my-6 md:mx-24 md:my-20 p-6 md:p-12";

    const header = document.createElement("div");
    header.className = "flex justify-between items-center mb-4 md:mb-6";
    header.innerHTML = `
      <h2 class="text-xl md:text-2xl font-semibold text-blue-dark">Enviar Notificação</h2>
    `;
    card.appendChild(header);

    const content = document.createElement("div");
    content.className = "text-gray-700 text-sm md:text-base mb-4 md:mb-6";
    content.innerHTML = `
      <form class="notificar-form flex flex-col gap-4 md:gap-6">

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select class='select-container'>
            <option value="" disable selected>
              Municipio a Notificar
            </option>
          </select>
          <select class='select-container'>
            <option value="" disable selected>
              Filtrar por Atividade Econômica
            </option>
          </select>
          <select class='select-container'>
            <option value="" disable selected>
              Tipo de Contribuinte
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select class='select-container'>
            <option value="" disable selected>
              Remessa de Apuração
            </option>
          </select>
          <select class='select-container'>
            <option value="" disable selected>
              Contribuintes
            </option>
          </select>
          <select class='select-container'>
            <option value="" disable selected>
              Contador(a)
            </option>
          </select>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <select class="select-container">
            <option value="" disabled selected>Data Retroativa?</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>

          <select class="select-container">
            <option value="" disabled selected>Contribuinte com ou sem contador?</option>
            <option value="com">Com contador</option>
            <option value="sem">Sem contador</option>
          </select>

          <select class="select-container">
            <option value="" disabled selected>Contribuinte Simplificado?</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>

          <select class="select-container">
            <option value="" disabled selected>Exercício de Apuração</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select>

          <select class="select-container">
            <option value="" disabled selected>Anos a percorrer para VA anterior</option>
            <option value="1">1 ano</option>
            <option value="2">2 anos</option>
            <option value="3">3 anos</option>
          </select>

          <select class="input-container">
            <option value="" disabled selected>Iniciar notificação pelo Nº?</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>

        <div class="motivo-section mt-4 md:mt-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Motivo da Notificação:</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <label class="flex items-center gap-2">
              <input type="radio" name="motivo" class="mr-2"> 1 - CONTRIBUINTE COM VALOR ADICIONADO NEGATIVO NO EXERCÍCIO DE APURAÇÃO.
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="motivo" class="mr-2"> 4 - CONTRIBUINTE SEM MOVIMENTO.
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="motivo" class="mr-2"> 5 - CONTRIBUINTE COM PORCENTAGEM ABAIXO DA MARGEM DE RISCO DEFINIDA.
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="motivo" class="mr-2"> 8 - APONTAMENTO D-PARA DOS CFOP ENTRADA E SAÍDA.
            </label>
          </div>
        </div>

        <div class="submit-section mt-6">
          <button class="btn-primary" id="notify-btn">Gerar 🖨️</button>
        </div>

      </form>
      `;

    card.appendChild(content);

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
    return new NotificarPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  NotificarPage.initialize();
});

export default NotificarPage;
