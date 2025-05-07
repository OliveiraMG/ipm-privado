class RichTextEditorComponent {
  constructor(config) {
    this.id = config.id || "rich-text-editor";
    this.onChange = config.onChange || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement("div");
    container.className = "space-y-6";
    const form = document.createElement("div");
    form.id = `${this.id}-form`;
    form.className = "space-y-6";
    const superiorContainer = document.createElement("div");
    superiorContainer.innerHTML = `
      <label for="${this.id}-superior" class="block text-sm font-medium text-gray-700">Conteúdo Superior*:</label>
      <textarea id="${this.id}-superior" name="conteudo-superior" class="mt-1 border border-gray-300 rounded-md w-full p-2" style="min-height: 150px;" required></textarea>
    `;
    form.appendChild(superiorContainer);
    const inferiorContainer = document.createElement("div");
    inferiorContainer.innerHTML = `
      <label for="${this.id}-inferior" class="block text-sm font-medium text-gray-700">Conteúdo Inferior*:</label>
      <textarea id="${this.id}-inferior" name="conteudo-inferior" class="mt-1 border border-gray-300 rounded-md w-full p-2" style="min-height: 150px;" required></textarea>
    `;
    form.appendChild(inferiorContainer);
    container.appendChild(form);
    return container;
  }

  setupEventListeners() {
    const superiorInput = this.element.querySelector(`#${this.id}-superior`);
    const inferiorInput = this.element.querySelector(`#${this.id}-inferior`);
    if (superiorInput) {
      superiorInput.addEventListener("input", () => {
        this.onChange({
          conteudoSuperior: superiorInput.value,
          conteudoInferior: inferiorInput.value,
        });
      });
    }
    if (inferiorInput) {
      inferiorInput.addEventListener("input", () => {
        this.onChange({
          conteudoSuperior: superiorInput.value,
          conteudoInferior: inferiorInput.value,
        });
      });
    }
  }

  getFormData() {
    const superiorInput = this.element.querySelector(`#${this.id}-superior`);
    const inferiorInput = this.element.querySelector(`#${this.id}-inferior`);
    return {
      conteudoSuperior: superiorInput ? superiorInput.value : "",
      conteudoInferior: inferiorInput ? inferiorInput.value : "",
    };
  }

  reset() {
    const superiorInput = this.element.querySelector(`#${this.id}-superior`);
    const inferiorInput = this.element.querySelector(`#${this.id}-inferior`);
    if (superiorInput) {
      superiorInput.value = "";
    }
    if (inferiorInput) {
      inferiorInput.value = "";
    }
  }
}

export default RichTextEditorComponent;
