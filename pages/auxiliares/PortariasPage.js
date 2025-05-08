/**
 * PortariasPage.js - Página de listagem de Portarias
 */
import { Header } from "../../../components/layout/Header.js";
import { toast } from "../../../js/Utilities.js";
import RegisterPortariaComponent from "../../../pages/auxiliares/register/RegisterPortariaComponent.js";
import EditPortariaComponent from "../../../pages/auxiliares/edit/EditPortariaComponent.js";
import EditCfopPortariaComponent from "../../../pages/auxiliares/edit/EditCfopPortariaComponent.js";
import SearchPortariaComponent from "../../../pages/auxiliares/search/SearchPortariaComponent.js";
import PrintPortariaComponent from "../../../pages/auxiliares/print/PrintPortariaComponent.js";
import ModalComponent from "../../../components/common/ModalComponent.js";

class PortariasPage {
  constructor() {
    this.tableData = [];
    this.originalData = [];
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando PortariasPage...");

    Header.initialize();

    this.setupBreadcrumbs();

    this.renderContent();

    this.loadData();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Auxiliares | Portarias</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Portarias</div>
        </div>
      `;
    }
  }

  renderContent() {
    const mainContent = document.querySelector("main");
    if (!mainContent) {
      console.error("Elemento main não encontrado!");
      return;
    }

    mainContent.innerHTML = "";

    const card = document.createElement("div");
    card.className =
      "bg-white rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.25)] mx-24 my-20 p-12";

    const header = document.createElement("div");
    header.className = "flex justify-between items-center mb-6";
    header.innerHTML = `
      <h2 class="text-2xl font-semibold text-blue-dark">Listagem</h2>
    `;
    card.appendChild(header);

    const tableContainer = document.createElement("div");
    tableContainer.id = "portarias-table";
    tableContainer.className = "w-full px-2";
    card.appendChild(tableContainer);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "flex justify-center space-x-4 mt-6";
    buttonContainer.innerHTML = `
      <button id="print-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
        <i class="fa-solid fa-print mr-2"></i>Imprimir
      </button>
      <button id="register-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
        <i class="fa-solid fa-plus mr-2"></i>Cadastrar
      </button>
      <button id="search-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
        <i class="fa-solid fa-search mr-2"></i>Pesquisar
      </button>
    `;
    card.appendChild(buttonContainer);

    mainContent.appendChild(card);

    this.setupButtonEvents();

    this.renderTable();
  }

  setupButtonEvents() {
    const registerBtn = document.getElementById("register-btn");
    const searchBtn = document.getElementById("search-btn");
    const printBtn = document.getElementById("print-btn");

    if (registerBtn) {
      registerBtn.addEventListener("click", () => {
        toast.info("Abrindo formulário de cadastro...");
        this.openRegisterModal();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        toast.info("Abrindo formulário de pesquisa...");
        this.openSearchModal();
      });
    }

    if (printBtn) {
      printBtn.addEventListener("click", () => {
        toast.info("Abrindo formulário de impressão...");
        this.openPrintModal();
      });
    }
  }

  openRegisterModal() {
    const registerComponent = new RegisterPortariaComponent({
      onSubmit: (data) => {
        console.log("Formulário submetido:", data);
        this.tableData.unshift({
          id: Math.max(...this.tableData.map((d) => d.id), 0) + 1,
          cfopList: [],
          ...data,
        });
        this.originalData = [...this.tableData];
        this.renderTable();
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info("Retornado à lista de portarias");
      },
    });

    this.modal = new ModalComponent({
      id: "register-portaria-modal",
      title: "Cadastrar Portaria",
      titleClass: "text-blue-dark font-semibold text-xl",
      content: registerComponent.element,
      contentClass: "p-0",
      onClose: () => {
        this.modal = null;
      },
    });
    this.modal.open();
  }

  openEditModal(portariaId) {
    const portariaData = this.tableData.find((item) => item.id === portariaId);
    if (!portariaData) {
      toast.error("Portaria não encontrada!");
      return;
    }

    const editComponent = new EditPortariaComponent({
      portariaData: portariaData,
      onUpdate: (updatedData) => {
        this.updateData(updatedData);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info("Retornado à lista de portarias");
      },
    });

    this.modal = new ModalComponent({
      id: "edit-portaria-modal",
      title: "Editar Portaria",
      titleClass: "text-blue-dark font-semibold text-xl",
      content: editComponent.element,
      contentClass: "p-0",
      onClose: () => {
        this.modal = null;
      },
    });
    this.modal.open();
  }

  openEditCfopModal(portariaId) {
    const portariaData = this.tableData.find((item) => item.id === portariaId);
    if (!portariaData) {
      toast.error("Portaria não encontrada!");
      return;
    }

    const editCfopComponent = new EditCfopPortariaComponent({
      cfopData: portariaData.cfopList || [],
      cfopSelect: portariaData.cfopSelect || "",
      onUpdate: (updatedData) => {
        portariaData.cfopList = updatedData.cfopList;
        portariaData.cfopSelect = updatedData.cfopSelect;
        this.renderTable();
        this.modal.close();
        toast.success("CFOPs da portaria atualizados com sucesso!");
      },
      onBack: () => {
        this.modal.close();
        toast.info("Retornado à lista de portarias");
      },
    });

    this.modal = new ModalComponent({
      id: "edit-cfop-modal",
      title: "Editar Cfop",
      titleClass: "text-blue-dark font-semibold text-xl",
      content: editCfopComponent.element,
      contentClass: "p-0",
      onClose: () => {
        this.modal = null;
      },
    });
    this.modal.open();
  }

  openSearchModal() {
    const searchComponent = new SearchPortariaComponent({
      onSearch: (filters) => {
        this.applyFilters(filters);
        this.modal.close();
      },
      onCancel: () => {
        this.modal.close();
      },
    });

    this.modal = new ModalComponent({
      id: "search-portaria-modal",
      title: "Pesquisar",
      titleClass: "text-blue-dark font-semibold text-xl",
      content: searchComponent.element,
      contentClass: "p-0",
      onClose: () => {
        this.modal = null;
      },
    });
    this.modal.open();
  }

  openPrintModal() {
    const printComponent = new PrintPortariaComponent({
      onPrint: (filters) => {
        this.handlePrint(filters);
        this.modal.close();
      },
      onCancel: () => {
        this.modal.close();
      },
    });

    this.modal = new ModalComponent({
      id: "print-portaria-modal",
      title: "Imprimir",
      titleClass: "text-blue-dark font-semibold text-xl",
      content: printComponent.element,
      contentClass: "p-0",
      onClose: () => {
        this.modal = null;
      },
    });
    this.modal.open();
  }

  applyFilters(filters) {
    this.tableData = this.originalData.filter((item) => {
      const matchesVigente =
        !filters.vigente || item.vigente === filters.vigente;
      const matchesNumero =
        !filters.numero ||
        (item.numeroAno && item.numeroAno.split("/")[0] === filters.numero);
      const matchesAno =
        !filters.ano ||
        (item.numeroAno && item.numeroAno.split("/")[1] === filters.ano);
      return matchesVigente && matchesNumero && matchesAno;
    });
    this.renderTable();
  }

  handlePrint(filters) {
    const filteredData = this.originalData.filter((item) => {
      const matchesVigente =
        !filters.vigente || item.vigente === filters.vigente;
      const matchesNumero =
        !filters.numero ||
        (item.numeroAno && item.numeroAno.split("/")[0] === filters.numero);
      const matchesAno =
        !filters.ano ||
        (item.numeroAno && item.numeroAno.split("/")[1] === filters.ano);
      return matchesVigente && matchesNumero && matchesAno;
    });
    console.log("Dados para impressão:", filteredData);
    // Placeholder for actual printing logic
  }

  updateData(updatedData) {
    this.tableData = this.tableData.map((item) =>
      item.id === updatedData.id ? { ...item, ...updatedData } : item
    );
    this.originalData = this.originalData.map((item) =>
      item.id === updatedData.id ? { ...item, ...updatedData } : item
    );
    this.renderTable();
    toast.success("Portaria atualizada com sucesso!");
  }

  loadData() {
    console.log("Carregando dados...");
    setTimeout(() => {
      this.tableData = this.getMockData();
      this.originalData = [...this.tableData];
      console.log("Loaded tableData:", this.tableData);
      this.renderTable();
    }, 300);
  }

  renderTable() {
    const tableContainer = document.getElementById("portarias-table");
    if (!tableContainer) {
      console.error("Container da tabela não encontrado!");
      return;
    }

    console.log("tableData before rendering:", this.tableData);

    if (!this.tableData || !this.tableData.length) {
      tableContainer.innerHTML =
        '<p class="text-center py-4">Nenhum dado disponível</p>';
      return;
    }

    try {
      let tableHTML = `
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-600">
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">AÇÕES</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">VIGENTE</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 15%">NÚMERO/ANO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 15%">PORTARIA</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">ASSINATURA</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">PUBLICAÇÃO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 30%">DESCRIÇÃO</th>
            </tr>
          </thead>
          <tbody>
      `;

      this.tableData.forEach((row) => {
        console.log("Rendering row:", row);
        tableHTML += `
          <tr class="bg-white">
            <td class="text-center py-2 px-4">
              <div class="flex space-x-2 justify-center">
                <button class="edit-btn bg-blue-dark text-white text-xs rounded px-2 py-1" data-id="${
                  row.id || ""
                }" style="display: inline-block !important;">
                  <i class="fa-solid fa-edit mr-1"></i> Editar
                </button>
                <button class="cfop-btn bg-blue-dark text-white text-xs rounded px-2 py-1 hover:bg-blue-medium" data-id="${
                  row.id || ""
                }" style="display: inline-block !important;">
                  <i class="fa-solid fa-copy mr-1"></i> Cfop
                </button>
              </div>
            </td>
            <td class="text-center py-2 px-4">${row.vigente}</td>
            <td class="text-center py-2 px-4">${row.numeroAno}</td>
            <td class="text-center py-2 px-4">${row.portaria}</td>
            <td class="text-center py-2 px-4">${row.assinatura}</td>
            <td class="text-center py-2 px-4">${row.publicacao}</td>
            <td class="text-left py-2 px-4">${row.descricao}</td>
          </tr>
        `;
      });

      tableHTML += `
          </tbody>
        </table>
      `;

      tableContainer.innerHTML = tableHTML;

      setTimeout(() => {
        this.setupTableButtonEvents();
      }, 100);
    } catch (error) {
      console.error("Erro ao renderizar tabela:", error);
      tableContainer.innerHTML = `<p class="text-center text-red-500 py-4">Erro ao renderizar tabela: ${error.message}</p>`;
    }
  }

  setupTableButtonEvents() {
    const editButtons = document.querySelectorAll(".edit-btn");
    const cfopButtons = document.querySelectorAll(".cfop-btn");

    console.log("Found edit buttons:", editButtons.length);
    console.log("Found cfop buttons:", cfopButtons.length);

    editButtons.forEach((button) => {
      console.log(
        "Binding event to edit button with data-id:",
        button.getAttribute("data-id")
      );
      button.addEventListener("click", () => {
        const portariaId = parseInt(button.getAttribute("data-id"));
        toast.info("Abrindo formulário de edição...");
        this.openEditModal(portariaId);
      });
    });

    cfopButtons.forEach((button) => {
      console.log(
        "Binding event to cfop button with data-id:",
        button.getAttribute("data-id")
      );
      button.addEventListener("click", () => {
        const portariaId = parseInt(button.getAttribute("data-id"));
        toast.info("Abrindo formulário de edição de CFOPs...");
        this.openEditCfopModal(portariaId);
      });
    });
  }

  getMockData() {
    return [
      {
        id: 1,
        vigente: "Sim",
        numeroAno: "99/2022",
        portaria: "PORTARIA N° 99/2022-SEFAZ",
        assinatura: "12/09/2022",
        publicacao: "20/09/2022",
        descricao:
          "Altera a Portaria n° 084/2005-SEFAZ, de 22/07/2005 (DOE 22/07/2005), que consolida normas relativas à coleta de dados necessários à apuração dos Índices de Participação dos Municipios do Estado do Mato Grosso no produto da arrecadação do ICMS e dá outras providências.",
        cfopSelect: "repercute",
        ementa: "Ementa da portaria 99/2022",
        cfop: "cfop1;cfop2",
        cfopList: [
          {
            cfop: "7947",
            descricao:
              "Venda de combustível ou lubrificante a consumidor ou usuário final",
            repercute: true,
          },
          {
            cfop: "7948",
            descricao: "Venda de combustível ou lubrificante para revenda",
            repercute: false,
          },
          {
            cfop: "7949",
            descricao: "Exportação de mercadorias ou serviços para o exterior",
            repercute: true,
          },
          {
            cfop: "7950",
            descricao: "Prestação de serviço de transporte para o exterior",
            repercute: false,
          },
          {
            cfop: "7951",
            descricao: "Devolução de compra para industrialização ou produção",
            repercute: true,
          },
          {
            cfop: "7952",
            descricao:
              "Anulação de valor relativo a aquisição de serviço de transporte",
            repercute: false,
          },
          {
            cfop: "7953",
            descricao: "Anulação de valor relativo a serviço de transporte",
            repercute: true,
          },
          {
            cfop: "7954",
            descricao: "Devolução de compra para comercialização",
            repercute: false,
          },
          {
            cfop: "7955",
            descricao: "Devolução de compra para industrialização ou produção",
            repercute: true,
          },
          {
            cfop: "7956",
            descricao:
              "Anulação de valor relativo a aquisição de serviço de transporte",
            repercute: false,
          },
          {
            cfop: "7957",
            descricao: "Anulação de valor relativo a serviço de transporte",
            repercute: true,
          },
          {
            cfop: "7958",
            descricao: "Devolução de compra para comercialização",
            repercute: false,
          },
        ],
      },
      {
        id: 2,
        vigente: "Não",
        numeroAno: "031/2022",
        portaria: "PORTARIA N° 031/2022-SEFAZ",
        assinatura: "15/02/2022",
        publicacao: "03/03/2022",
        descricao:
          "Altera a Portaria n° 084/2005-SEFAZ, de 22/07/2005 (DOE 22/07/2005), que consolida normas relativas à coleta de dados necessários à apuração dos Índices de Participação dos Municipios do Estado do Mato Grosso no produto da arrecadação do ICMS e dá outras providências.",
        cfopSelect: null,
        ementa: "Ementa da portaria 031/2022",
        cfop: "cfop3;cfop4",
        cfopList: [
          {
            cfop: "7947",
            descricao:
              "Venda de combustível ou lubrificante a consumidor ou usuário final",
            repercute: true,
          },
          {
            cfop: "7948",
            descricao: "Venda de combustível ou lubrificante para revenda",
            repercute: false,
          },
        ],
      },
      {
        id: 3,
        vigente: "Não",
        numeroAno: "157/2021",
        portaria: "PORTARIA N° 157/2021-SEFAZ",
        assinatura: "25/07/2021",
        publicacao: "03/08/2021",
        descricao:
          "Altera a Portaria que menciona, para dispensar reconhecimento de firma, nas hipóteses que específica, e dá outras providências.",
        cfopSelect: null,
        ementa: "Ementa da portaria 157/2021",
        cfop: "cfop5;cfop6",
        cfopList: [
          {
            cfop: "7949",
            descricao: "Exportação de mercadorias ou serviços para o exterior",
            repercute: true,
          },
          {
            cfop: "7950",
            descricao: "Prestação de serviço de transporte para o exterior",
            repercute: false,
          },
        ],
      },
      {
        id: 4,
        vigente: "Não",
        numeroAno: "113/2020",
        portaria: "PORTARIA N° 113/2020-SEFAZ",
        assinatura: "19/06/2020",
        publicacao: "23/06/2020",
        descricao:
          "Altera a Portaria n° 084/2005-SEFAZ, de 22/07/2005 (DOE 22/07/2005), que consolida normas relativas à coleta de dados necessários à apuração dos Índices de Participação dos Municipios do Estado do Mato Grosso no produto da arrecadação do ICMS e dá outras providências.",
        cfopSelect: "repercute",
        ementa: "Ementa da portaria 113/2020",
        cfop: "cfop7;cfop8",
        cfopList: [
          {
            cfop: "7951",
            descricao: "Devolução de compra para industrialização ou produção",
            repercute: true,
          },
          {
            cfop: "7952",
            descricao:
              "Anulação de valor relativo a aquisição de serviço de transporte",
            repercute: false,
          },
        ],
      },
    ];
  }

  static initialize() {
    return new PortariasPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  PortariasPage.initialize();
});

export default PortariasPage;
