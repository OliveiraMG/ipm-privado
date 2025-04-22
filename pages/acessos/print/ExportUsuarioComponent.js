/**
 * ExportUsuarioComponent.js - Componente para exportação de usuários
 */
import { toast } from '/js/Utilities.js';

class ExportUsuarioComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {Function} config.onExportPDF - Função chamada ao clicar em Exportar PDF
   * @param {Function} config.onExportExcel - Função chamada ao clicar em Exportar Excel
   */
  constructor(config) {
    this.onExportPDF = config.onExportPDF || (() => {});
    this.onExportExcel = config.onExportExcel || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  /**
   * Renderiza o componente
   * @returns {HTMLElement} - Elemento do componente
   */
  render() {
    const container = document.createElement('div');
    container.className = 'p-6';

    // Título
    const title = document.createElement('h3');
    title.className = 'text-lg font-semibold text-blue-dark mb-4';
    title.textContent = 'Exportar';
    container.appendChild(title);

    // Botões de exportação
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex flex-col space-y-4';

    buttonContainer.innerHTML = `
      <button id="export-pdf-btn" class="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed" disabled>
        <i class="fa-solid fa-file-pdf"></i>
        <span>PDF</span>
      </button>
      <button id="export-excel-btn" class="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed" disabled>
        <i class="fa-solid fa-file-excel"></i>
        <span>Excel</span>
      </button>
    `;

    container.appendChild(buttonContainer);
    return container;
  }

  /**
   * Configura os eventos dos botões
   */
  setupEventListeners() {
    const exportPDFBtn = this.element.querySelector('#export-pdf-btn');
    const exportExcelBtn = this.element.querySelector('#export-excel-btn');

    if (exportPDFBtn) {
      exportPDFBtn.addEventListener('click', () => {
        // Botão está desabilitado, mas adicionamos o evento para consistência
        toast.info('Exportação para PDF está desabilitada.');
        this.onExportPDF();
      });
    }

    if (exportExcelBtn) {
      exportExcelBtn.addEventListener('click', () => {
        // Botão está desabilitado, mas adicionamos o evento para consistência
        toast.info('Exportação para Excel está desabilitada.');
        this.onExportExcel();
      });
    }
  }
}

export default ExportUsuarioComponent;