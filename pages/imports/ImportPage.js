/**
 * ImportPage.js - Página de importação de arquivos
 */
import { Header } from "/components/layout/Header.js";
import Button from "/components/common/Button.js";
import Select from "/components/common/Select.js";
import FileUpload from "/components/forms/FileUpload.js";

class ImportPage {
  constructor() {
    this.initialize();
  }

  initialize() {
    // Renderizar header
    Header.initialize();

    // Configurar breadcrumbs
    this.setupBreadcrumbs();

    // Renderizar formulário de importação
    this.renderImportForm();

    // Configurar event listeners para interatividade
    this.setupEventListeners();
  }

  setupBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('[role="navigation"]');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <div class="pt-1 pb-1 pl-20 pr-16">
          <div class="text-gray-500 text-base leading-tight">Importação | Importar |</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Importar</div>
        </div>
      `;
    }
  }

  renderImportForm() {
    const mainContent = document.querySelector("main");
    if (!mainContent) return;

    // Limpar conteúdo atual
    mainContent.innerHTML = "";

    // Container para o formulário
    const formContainer = document.createElement("div");
    formContainer.className = "max-w-full mx-auto px-4 md:px-8 lg:px-12";

    // Card principal
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-3xl shadow-lg mt-6 mb-10 overflow-hidden";

    // Cabeçalho do card
    const header = document.createElement("div");
    header.className = "bg-blue-dark text-white py-4 px-6 text-center";
    header.innerHTML =
      '<h2 class="text-xl font-medium text-white">Importar Arquivos</h2>';
    card.appendChild(header);

    // Corpo do formulário
    const body = document.createElement("div");
    body.className = "p-8";

    // Grid para os selects
    const selectsGrid = document.createElement("div");
    selectsGrid.className = "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8";

    // Tipos de arquivo para o select
    const fileTypes = [
      { value: "", text: "Tipo de Arquivo*", disabled: true, selected: true },
      { value: "avulso", text: "Arquivo Avulso" },
      { value: "normal", text: "Arquivo Normal" },
    ];

    // Tipos de remessa
    const remessaTypes = [
      { value: "", text: "Remessa*", disabled: true, selected: true },
      { value: "definitivo", text: "Definitivo" },
      { value: "preliminarR1", text: "R1 - Preliminar" },
      { value: "preliminarR2", text: "R2 - Preliminar" },
      { value: "preliminarR3", text: "R3 - Preliminar" },
      { value: "preliminarR4", text: "R4 - Preliminar" },
      { value: "preliminarR5", text: "R5 - Preliminar" },
      { value: "preliminarR6", text: "R6 - Preliminar" },
      { value: "preliminarR7", text: "R7 - Preliminar" },
    ];

    // Tipos de apuração
    const apuracaoTypes = [
      { value: "", text: "Apuração*", disabled: true, selected: true },
      { value: "2010", text: "2010" },
      { value: "2011", text: "2011" },
      { value: "2012", text: "2012" },
      { value: "2013", text: "2013" },
      { value: "2014", text: "2014" },
      { value: "2015", text: "2015" },
      { value: "2016", text: "2016" },
      { value: "2017", text: "2017" },
      { value: "2018", text: "2018" },
      { value: "2019", text: "2019" },
      { value: "2020", text: "2020" },
      { value: "2021", text: "2021" },
      { value: "2022", text: "2022" },
      { value: "2023", text: "2023" },
    ];

    // Tipos de documento
    const documentTypes = [
      { value: "", text: "Tipo Documento*", disabled: true, selected: true },
      {
        value: "ACGPT109",
        text: "ACGPT109 - NFE-Eletrônica: Relatório de Notas Fiscais de entrada eletrônicas",
      },
      {
        value: "ACGPT415",
        text: "ACGPT415 - NFE-EFD: Relatório de Notas Fiscais de entrada eletrônicas EFD",
      },
      { value: "ACGPT420", text: "ACGPT420 - EFD – OMISSO" },
      { value: "ACGPT425", text: "ACGPT425 - EFD – SEM MOVIMENTO" },
      {
        value: "ACGPT430",
        text: "ACGPT430 - EFD-ESCRITURAÇÃO FISCAL DIGITAL – registros por CFOPs",
      },
      {
        value: "ACGPR812",
        text: "ACGPR812 - Notas Fiscais de Produtor e Avulsa (NFPA) – eletrônicas",
      },
      {
        value: "PGDAS",
        text: "PGDAS - Receita dos contribuintes Simples Nacional",
      },
      {
        value: "DHRPR555",
        text: "DHRPR555 - Valores adicionados por contribuinte (positivos)",
      },
      {
        value: "DHRPR557",
        text: "DHRPR557 - Valores adicionados por contribuinte (negativos e nulos)",
      },
      { value: "ACDPR535", text: "ACDPR535 - Catálogo de contribuintes (CAP)" },
      { value: "ACEPR572", text: "ACEPR572 - Catálogo de contribuintes (CCI)" },
      { value: "MEI", text: "MEI - IEs Simples Nacional" },
      {
        value: "DHRPR098",
        text: "DHRPR098 - GIA-ICMS Sem movimento (entradas e saídas zeradas)",
      },
      { value: "DHRPR278", text: "DHRPR278 - GIA-ICMS Omissos" },
      {
        value: "DHRPR296",
        text: "DHRPR296 - GIA-ICMS – Registros por CFOPs (entradas e saídas)",
      },
      { value: "COP3", text: "COP3 - GIA-ICMS – anexo I" },
      {
        value: "ACGPT400-410",
        text: "ACGPT400-410 - Reg. 1400 EFD: registros valores prestados por município",
      },
      { value: "ACYPR535", text: "ACYPR535 - Relação dos Índices Apurados" },
      {
        value: "ACYPR540",
        text: "ACYPR540 - Relação das Variações dos Índices",
      },
    ];

    // Renderizar os selects
    const fileTypeSelect = Select.render({
      id: "file-type-select",
      options: fileTypes,
      className: "w-full",
    });
    selectsGrid.appendChild(fileTypeSelect);

    const remessaSelect = Select.render({
      id: "remessa-select",
      options: remessaTypes,
      className: "w-full",
    });
    selectsGrid.appendChild(remessaSelect);

    const apuracaoSelect = Select.render({
      id: "apuracao-select",
      options: apuracaoTypes,
      className: "w-full",
    });
    selectsGrid.appendChild(apuracaoSelect);

    const documentSelect = Select.render({
      id: "document-select",
      options: documentTypes,
      className: "w-full",
    });
    selectsGrid.appendChild(documentSelect);

    // Adicionar grid ao corpo
    body.appendChild(selectsGrid);

    // Container para campos dinâmicos (descrição e tipo de arquivo para Avulso)
    const dynamicFieldsContainer = document.createElement("div");
    dynamicFieldsContainer.id = "dynamic-fields-container";
    dynamicFieldsContainer.className = "hidden";
    body.appendChild(dynamicFieldsContainer);

    // Container para upload
    const uploadContainer = document.createElement("div");
    uploadContainer.className = "mb-8";

    // Texto indicativo
    const uploadText = document.createElement("p");
    uploadText.className = "text-gray-600 mb-2";
    uploadText.textContent = "Arquivo* (XLSX ou CSV)";
    uploadContainer.appendChild(uploadText);

    // Componente de upload de arquivo
    const fileUpload = new FileUpload({
      id: "file-upload",
      accept: ".xlsx,.csv",
      onChange: (file) => this.handleFileChange(file),
    });
    uploadContainer.appendChild(fileUpload.element);

    // Adicionar upload ao corpo
    body.appendChild(uploadContainer);

    // Container para botão de envio (centralizado)
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "flex justify-center";

    // Botão de importar
    const importButton = Button.render({
      id: "import-button",
      text: "Importar",
      icon: "upload",
      type: "primary",
      onClick: () => this.handleSubmit(),
    });
    buttonContainer.appendChild(importButton);

    // Adicionar botão ao corpo
    body.appendChild(buttonContainer);

    // Adicionar corpo ao card
    card.appendChild(body);

    // Adicionar card ao container
    formContainer.appendChild(card);

    // Adicionar container à página
    mainContent.appendChild(formContainer);
  }

  /**
   * Configura eventos para interatividade do formulário
   */
  setupEventListeners() {
    // Esperar renderização completa para garantir que os elementos existam
    setTimeout(() => {
      const fileTypeSelect = document.getElementById("file-type-select");
      if (fileTypeSelect) {
        fileTypeSelect.addEventListener("change", (e) =>
          this.handleFileTypeChange(e)
        );
      }
    }, 100);
  }

  /**
   * Manipula a mudança do tipo de arquivo (Avulso/Normal)
   * @param {Event} event - Evento de mudança
   */
  handleFileTypeChange(event) {
    const selectedType = event.target.value;
    const dynamicContainer = document.getElementById(
      "dynamic-fields-container"
    );
    const uploadText = document.querySelector(".mb-8 p");
    const fileInput = document.getElementById("file-upload");

    if (!dynamicContainer) return;

    // Limpar o container dinâmico
    dynamicContainer.innerHTML = "";
    dynamicContainer.className = selectedType === "avulso" ? "mb-6" : "hidden";

    if (selectedType === "avulso") {
      // Mostrar campos adicionais para Arquivo Avulso

      // Campo de descrição
      const descriptionContainer = document.createElement("div");
      descriptionContainer.className = "mb-4";

      const descriptionLabel = document.createElement("p");
      descriptionLabel.className = "text-gray-600 mb-2";
      descriptionLabel.textContent = "Descrição (Opcional)";
      descriptionContainer.appendChild(descriptionLabel);

      const descriptionInput = document.createElement("input");
      descriptionInput.type = "text";
      descriptionInput.id = "description-input";
      descriptionInput.placeholder = "Descreva o arquivo que está importando";
      descriptionInput.className =
        "border border-gray-300 rounded-lg w-full px-4 py-2 text-gray-700";
      descriptionContainer.appendChild(descriptionInput);

      dynamicContainer.appendChild(descriptionContainer);

      // Seletor de tipo de arquivo (extensão)
      const fileTypeExtContainer = document.createElement("div");
      fileTypeExtContainer.className = "mb-4";

      const fileTypeExtLabel = document.createElement("p");
      fileTypeExtLabel.className = "text-gray-600 mb-2";
      fileTypeExtLabel.textContent = "Extensão do arquivo?";
      fileTypeExtContainer.appendChild(fileTypeExtLabel);

      const fileTypeExtOptions = [
        { value: "pdf", text: "PDF" },
        { value: "excel", text: "Excel" },
      ];

      const fileTypeExtSelect = Select.render({
        id: "file-type-ext-select",
        options: fileTypeExtOptions,
        className: "w-full",
      });
      fileTypeExtContainer.appendChild(fileTypeExtSelect);

      dynamicContainer.appendChild(fileTypeExtContainer);

      // Atualizar o texto e o tipo aceito do upload
      uploadText.textContent = "Arquivo* (PDF ou Excel)";
      if (fileInput) {
        fileInput.accept = ".pdf,.xlsx,.xls";
      }
    } else {
      // Ocultar campos adicionais e restaurar valores padrão para Arquivo Normal
      uploadText.textContent = "Arquivo* (XLSX ou CSV)";
      if (fileInput) {
        fileInput.accept = ".xlsx,.csv";
      }
    }
  }

  /**
   * Manipula a mudança de arquivo
   * @param {File} file - Arquivo selecionado
   */
  handleFileChange(file) {
    console.log("Arquivo selecionado:", file);
    // Implementar lógica para validar arquivo
  }

  /**
   * Manipula o envio do formulário
   */
  handleSubmit() {
    console.log("Formulário enviado");

    // Coletar dados
    const fileType = document.getElementById("file-type-select").value;
    const remessa = document.getElementById("remessa-select").value;
    const apuracao = document.getElementById("apuracao-select").value;
    const documentType = document.getElementById("document-select").value;
    const fileInput = document.getElementById("file-upload");

    // Validar campos principais
    if (
      !fileType ||
      !remessa ||
      !apuracao ||
      !documentType ||
      !fileInput.files[0]
    ) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Criar FormData para envio
    const formData = new FormData();
    formData.append("fileType", fileType);
    formData.append("remessa", remessa);
    formData.append("apuracao", apuracao);
    formData.append("documentType", documentType);
    formData.append("file", fileInput.files[0]);

    // Se for arquivo avulso, adicionar campos específicos
    if (fileType === "avulso") {
      const description =
        document.getElementById("description-input")?.value || "";
      const fileTypeExt = document.getElementById(
        "file-type-ext-select"
      )?.value;

      if (!fileTypeExt) {
        alert("Por favor, selecione o tipo de arquivo (PDF ou Excel)");
        return;
      }

      formData.append("description", description);
      formData.append("fileTypeExt", fileTypeExt);

      console.log("Dados prontos para envio (Arquivo Avulso):", {
        fileType,
        description,
        fileTypeExt,
        remessa,
        apuracao,
        documentType,
        fileName: fileInput.files[0].name,
      });
    } else {
      console.log("Dados prontos para envio (Arquivo Normal):", {
        fileType,
        remessa,
        apuracao,
        documentType,
        fileName: fileInput.files[0].name,
      });
    }

    // Mostrar feedback ao usuário
    alert("Arquivo enviado com sucesso!");
  }

  // Método estático para inicializar a página
  static initialize() {
    return new ImportPage();
  }
}

// Inicializar a página quando o documento carregar
document.addEventListener("DOMContentLoaded", () => {
  ImportPage.initialize();
});

export default ImportPage;
