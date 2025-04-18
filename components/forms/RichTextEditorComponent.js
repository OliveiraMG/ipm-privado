/**
 * RichTextEditorComponent.js - Componente para editores de texto rico duplos
 */
import Quill from 'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js';

class RichTextEditorComponent {
  /**
   * @param {Object} config - Configuração do componente
   * @param {string} config.id - ID base do componente
   * @param {Function} config.onChange - Função chamada quando o conteúdo muda
   */
  constructor(config) {
    this.id = config.id || 'rich-text-editor';
    this.onChange = config.onChange || (() => {});
    this.quillSuperior = null;
    this.quillInferior = null;

    this.element = this.render();
    this.setupQuillEditors();
    this.setupEventListeners();
  }

  /**
   * Renderiza o componente
   * @returns {HTMLElement} - Elemento do componente
   */
  render() {
    const container = document.createElement('div');
    container.className = 'space-y-6';

    // Formulário
    const form = document.createElement('form');
    form.id = `${this.id}-form`;
    form.className = 'space-y-6';

    // Conteúdo Superior
    const superiorContainer = document.createElement('div');
    superiorContainer.innerHTML = `
      <label for="${this.id}-superior" class="block text-sm font-medium text-gray-700">Conteúdo Superior*:</label>
      <div id="${this.id}-quill-superior" class="mt-1 border border-gray-300 rounded-md" style="min-height: 150px;"></div>
      <input type="hidden" id="${this.id}-superior" name="conteudo-superior" required>
    `;
    form.appendChild(superiorContainer);

    // Conteúdo Inferior
    const inferiorContainer = document.createElement('div');
    inferiorContainer.innerHTML = `
      <label for="${this.id}-inferior" class="block text-sm font-medium text-gray-700">Conteúdo Inferior*:</label>
      <div id="${this.id}-quill-inferior" class="mt-1 border border-gray-300 rounded-md" style="min-height: 150px;"></div>
      <input type="hidden" id="${this.id}-inferior" name="conteudo-inferior" required>
    `;
    form.appendChild(inferiorContainer);

    container.appendChild(form);
    return container;
  }

  /**
   * Configura os editores Quill
   */
  setupQuillEditors() {
    // Configuração do Quill para Conteúdo Superior
    const superiorContainer = this.element.querySelector(`#${this.id}-quill-superior`);
    if (superiorContainer) {
      this.quillSuperior = new Quill(`#${this.id}-quill-superior`, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });
    }

    // Configuração do Quill para Conteúdo Inferior
    const inferiorContainer = this.element.querySelector(`#${this.id}-quill-inferior`);
    if (inferiorContainer) {
      this.quillInferior = new Quill(`#${this.id}-quill-inferior`, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });
    }
  }

  /**
   * Configura os eventos dos editores
   */
  setupEventListeners() {
    const superiorInput = this.element.querySelector(`#${this.id}-superior`);
    const inferiorInput = this.element.querySelector(`#${this.id}-inferior`);

    // Atualizar input oculto e chamar onChange para Conteúdo Superior
    if (this.quillSuperior) {
      this.quillSuperior.on('text-change', () => {
        const content = this.quillSuperior.root.innerHTML;
        superiorInput.value = content;
        this.onChange({
          conteudoSuperior: content,
          conteudoInferior: inferiorInput.value
        });
      });
    }

    // Atualizar input oculto e chamar onChange para Conteúdo Inferior
    if (this.quillInferior) {
      this.quillInferior.on('text-change', () => {
        const content = this.quillInferior.root.innerHTML;
        inferiorInput.value = content;
        this.onChange({
          conteudoSuperior: superiorInput.value,
          conteudoInferior: content
        });
      });
    }
  }

  /**
   * Obtém os dados do formulário
   * @returns {Object} - Dados dos editores
   */
  getFormData() {
    const superiorInput = this.element.querySelector(`#${this.id}-superior`);
    const inferiorInput = this.element.querySelector(`#${this.id}-inferior`);
    return {
      conteudoSuperior: superiorInput ? superiorInput.value : '',
      conteudoInferior: inferiorInput ? inferiorInput.value : ''
    };
  }

  /**
   * Limpa os editores
   */
  reset() {
    if (this.quillSuperior) {
      this.quillSuperior.setContents([]);
      this.element.querySelector(`#${this.id}-superior`).value = '';
    }
    if (this.quillInferior) {
      this.quillInferior.setContents([]);
      this.element.querySelector(`#${this.id}-inferior`).value = '';
    }
  }
}

export default RichTextEditorComponent;