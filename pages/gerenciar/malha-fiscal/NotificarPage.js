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
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Gerenciar | Malha Fiscal | Notificar</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Notificar</div>
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
      <h2 class="text-2xl font-semibold text-blue-dark">Enviar Notificação</h2>
    `;
    card.appendChild(header);

    const content = document.createElement("div");
    content.className = "text-gray-700 text-base mb-6";
    content.innerHTML = `
        <form class="notificar-form">

          <div class="grid-3">
            <select class='select-container' >
              <option value="" disable selected>
                Municipio a Notificar
              </option>
            </select>
            <select class='select-container' >
              <option value="" disable selected>
                Filtrar por Atividade Econômica
              </option>
            </select>
            <select class='select-container' >
              <option value="" disable selected>
                Tipo de Contribuinte
              </option>
            </select>
          </div>

          <div class="grid-3">
            <select class='select-container' >
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
          
          <div class="grid-5">
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

          <div class="motivo-section">
            <label>Motivo da Notificação:</label>
            <div class="grid-2">
              <label><input type="radio" name="motivo" /> 1 - CONTRIBUINTE COM VALOR ADICIONADO NEGATIVO NO EXERCÍCIO DE APURAÇÃO.</label>
              <label><input type="radio" name="motivo" /> 4 - CONTRIBUINTE SEM MOVIMENTO.</label>
              <label><input type="radio" name="motivo" /> 5 - CONTRIBUINTE COM PORCENTAGEM ABAIXO DA MARGEM DE RISCO DEFINIDA.</label>
              <label><input type="radio" name="motivo" /> 8 - APONTAMENTO D-PARA DOS CFOP ENTRADA E SAÍDA.</label>
            </div>
          </div>

          <div class="submit-section">
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
