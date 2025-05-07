/**
 * FileUpload.js - Componente para upload de arquivos
 */
class FileUpload {
  /**
   * @param {Object} config - Configuração do componente
   * @param {string} config.id - ID do elemento
   * @param {string} config.accept - Tipos de arquivo aceitos
   * @param {Function} config.onChange - Função chamada quando o arquivo muda
   */
  constructor(config) {
    this.id = config.id || "file-upload";
    this.accept = config.accept || "*/*";
    this.onChange = config.onChange || (() => {});

    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement("div");
    container.className =
      "flex items-center border border-gray-300 rounded-lg overflow-hidden";

    // Input de arquivo (oculto visualmente)
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = this.id;
    fileInput.accept = this.accept;
    fileInput.className = "hidden";
    container.appendChild(fileInput);

    // Campo de exibição do nome do arquivo
    const fileNameDisplay = document.createElement("input");
    fileNameDisplay.type = "text";
    fileNameDisplay.readOnly = true;
    fileNameDisplay.placeholder = "Nenhum arquivo selecionado";
    fileNameDisplay.className =
      "flex-grow px-4 py-2 outline-none text-gray-700";
    container.appendChild(fileNameDisplay);

    // Botão para escolher arquivo
    const chooseButton = document.createElement("button");
    chooseButton.type = "button";
    chooseButton.className =
      "bg-blue-medium hover:bg-blue-dark text-white px-4 py-2 transition-colors";
    chooseButton.textContent = "Escolher Arquivo";
    container.appendChild(chooseButton);

    return container;
  }

  setupEventListeners() {
    const fileInput = this.element.querySelector('input[type="file"]');
    const fileNameDisplay = this.element.querySelector('input[type="text"]');
    const chooseButton = this.element.querySelector("button");

    // Clicar no botão abre o seletor de arquivo
    chooseButton.addEventListener("click", () => {
      fileInput.click();
    });

    // Quando o arquivo é selecionado
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        fileNameDisplay.value = file.name;
        this.onChange(file);
      } else {
        fileNameDisplay.value = "";
      }
    });
  }
}

export default FileUpload;
