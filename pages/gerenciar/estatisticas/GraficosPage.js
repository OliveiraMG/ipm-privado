/**
 * GraficosPage.js - Pagina de Gráficos.
 */
import { Header } from "../../../components/layout/Header.js";

class GraficosPage {
  constructor() {
    this.initialize();
  }

  initialize() {
    Header.initialize();
    this.setupBreadcrumbs();
    this.renderContent();
    this.renderCharts();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Gerenciar | Estatística | Gráficos</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Gráficos</div>
        </div>
      `;
    }
  }

  renderContent() {
    const mainContent = document.querySelector("main");
    if (!mainContent) return;

    mainContent.innerHTML = `
      <div class="mx-24 my-10">
        <div class="grid grid-cols-3 gap-4 items-end mb-6">
          <div>
            <select class="w-full border border-gray-300 rounded-lg h-10 px-3">
              <option disabled selected>Selecione o Município</option>
              <option>ACORIZAL</option>
              <option>AGUA BOA</option>
              <option>ALTA FLORESTA</option>
              <option>ALTA ARAGUAIA</option>
              <option>ALTO BOA VISTA</option>
            </select>
          </div>
          <div>
            <select class="w-full border border-gray-300 rounded-lg h-10 px-3">
              <option disabled selected>Exercício</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
              <option>2020</option>
            </select>
          </div>
          <div>
            <button class="bg-blue-dark text-white rounded-lg px-6 py-2 h-10 flex items-center justify-center gap-2">
              <i class="fas fa-search"></i> Buscar
            </button>
          </div>
        </div>

        <h2 class="text-xl font-semibold text-gray-700 mb-4">Estado de Mato Grosso</h2>

        <div class="grid grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-2xl shadow-md p-6">
            <div class="text-lg font-semibold mb-4">Progressão do Valor Adicionado</div>
            <canvas id="vaProgressChart"></canvas>
          </div>
          <div class="bg-white rounded-2xl shadow-md p-6">
            <div class="text-lg font-semibold mb-4">VA por Grupo Econômico</div>
            <canvas id="vaGroupChart"></canvas>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-md p-6">
          <div class="text-lg font-semibold mb-4">Índice Final do Município</div>
          <canvas id="indiceFinalChart"></canvas>
        </div>
      </div>
    `;
  }

  renderCharts() {
    // 1. Progressão do Valor Adicionado
    this.vaProgressChart = new Chart(
      document.getElementById("vaProgressChart"),
      {
        type: "bar",
        data: {
          labels: [
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
            "2022",
            "2023",
            "2024",
          ],
          datasets: [
            {
              label: "Valor Adicionado",
              data: [80, 95, 105, 115, 130, 150, 180, 200, 230, 250, 270],
              backgroundColor: "#60A5FA",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true },
          },
        },
      }
    );

    // 2. VA por Grupo Econômico
    this.vaGroupChart = new Chart(document.getElementById("vaGroupChart"), {
      type: "bar",
      data: {
        labels: ["Indústria", "Rural", "PIT"],
        datasets: [
          {
            label: "2020",
            data: [200000, 150000, 100000],
            backgroundColor: "#9CA3AF",
          },
          {
            label: "2021",
            data: [220000, 160000, 120000],
            backgroundColor: "#6B7280",
          },
          {
            label: "2022",
            data: [250000, 180000, 140000],
            backgroundColor: "#4B5563",
          },
          {
            label: "2023",
            data: [270000, 200000, 160000],
            backgroundColor: "#3B82F6",
          },
          {
            label: "2024",
            data: [300000, 220000, 180000],
            backgroundColor: "#1E3A8A",
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        scales: {
          x: {
            ticks: {
              callback: function (value) {
                return value.toLocaleString("pt-BR");
              },
            },
          },
        },
      },
    });

    // 3. Índice Final do Município
    this.indiceFinalChart = new Chart(
      document.getElementById("indiceFinalChart"),
      {
        type: "line",
        data: {
          labels: [
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
            "2022",
            "2023",
            "2024",
          ],
          datasets: [
            {
              label: "Estado de Mato Grosso",
              data: [20, 12, 17, 16, 15, 17, 19, 18, 17, 15, 18],
              borderColor: "#2563EB",
              fill: false,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true },
          },
        },
      }
    );
  }

  static initialize() {
    return new GraficosPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  GraficosPage.initialize();
});

export default GraficosPage;
