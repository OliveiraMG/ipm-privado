/**
 * EditUsuarioComponent.js - Componente para edição de usuário
 */
import { toast } from "../../../js/Utilities.js";

class EditUsuarioComponent {
  constructor({ usuarioData, onUpdate, onBack }) {
    this.usuarioData = usuarioData || {};
    this.onUpdate = onUpdate || (() => {});
    this.onBack = onBack || (() => {});
    this.element = this.render();
    this.setupEventListeners();
  }

  render() {
    const container = document.createElement("div");
    container.className = "w-full";

    const form = document.createElement("div");
    form.className = "p-4";

    form.innerHTML = `
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="col-span-1">
          <label for="tipo" class="block text-sm font-medium text-gray-700">Tipo</label>
          <select id="tipo" name="tipo"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="Desenvolvedor" ${
              this.usuarioData.tipoUsuario === "Desenvolvedor" ? "selected" : ""
            }>Desenvolvedor</option>
            <option value="Administrador" ${
              this.usuarioData.tipoUsuario === "Administrador" ? "selected" : ""
            }>Administrador</option>
            <option value="Contabilista" ${
              this.usuarioData.tipoUsuario === "Contabilista" ? "selected" : ""
            }>Contabilista</option>
            <option value="Prefeitura" ${
              this.usuarioData.tipoUsuario === "Prefeitura" ? "selected" : ""
            }>Prefeitura</option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="nome" class="block text-sm font-medium text-gray-700">Nome</label>
          <input type="text" id="nome" name="nome"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
                 value="${this.usuarioData.nome || ""}">
        </div>
        <div class="col-span-1">
          <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
          <input type="email" id="email" name="email"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
                 value="${this.usuarioData.email || ""}">
        </div>
        <div class="col-span-1">
          <label for="crcContabilista" class="block text-sm font-medium text-gray-700">CRC Contabilista</label>
          <input type="text" id="crcContabilista" name="crcContabilista"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
                 value="${this.usuarioData.crcContabilista || ""}">
        </div>
        <div class="col-span-1">
          <label for="inscricao" class="block text-sm font-medium text-gray-700">Inscrição</label>
          <input type="text" id="inscricao" name="inscricao"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
                 value="${this.usuarioData.inscricao || ""}">
        </div>
        <div class="col-span-1">
          <label for="ativo" class="block text-sm font-medium text-gray-700">Ativo?</label>
          <select id="ativo" name="ativo"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="Sim" ${
              this.usuarioData.ativo === "Sim" ? "selected" : ""
            }>SIM</option>
            <option value="Não" ${
              this.usuarioData.ativo === "Não" ? "selected" : ""
            }>NÃO</option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="cidade" class="block text-sm font-medium text-gray-700">Cidade</label>
          <select id="cidade" name="cidade"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="São Paulo" ${
              this.usuarioData.cidade === "São Paulo" ? "selected" : ""
            }>São Paulo</option>
            <option value="Rio de Janeiro" ${
              this.usuarioData.cidade === "Rio de Janeiro" ? "selected" : ""
            }>Rio de Janeiro</option>
            <option value="Belo Horizonte" ${
              this.usuarioData.cidade === "Belo Horizonte" ? "selected" : ""
            }>Belo Horizonte</option>
            <option value="Pontes e Lacerda" ${
              this.usuarioData.cidade === "Pontes e Lacerda" ? "selected" : ""
            }>Pontes e Lacerda</option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="senha" class="block text-sm font-medium text-gray-700">Senha</label>
          <input type="password" id="senha" name="senha"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
                 placeholder="Digite a nova senha">
        </div>
        <div class="col-span-2 flex items-center space-x-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Atual:</label>
            <img id="foto-preview" src="${
              this.usuarioData.foto || "https://via.placeholder.com/50"
            }" alt="Foto do usuário"
                 class="w-12 h-12 rounded-full object-cover">
          </div>
          <div class="flex-1">
            <label for="foto" class="block text-sm font-medium text-gray-700">Escolher Foto</label>
            <label class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
              <span>Escolher Arquivo</span>
              <input type="file" id="foto" name="foto" class="hidden" accept="image/*">
            </label>
          </div>
        </div>
      </div>
      <div class="flex justify-end space-x-4 mt-6">
        <button id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Voltar
        </button>
        <button id="submit-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
          Atualizar
        </button>
      </div>
    `;

    container.appendChild(form);
    return container;
  }

  setupEventListeners() {
    const cancelBtn = this.element.querySelector("#cancel-btn");
    const submitBtn = this.element.querySelector("#submit-btn");
    const fotoInput = this.element.querySelector("#foto");
    const fotoPreview = this.element.querySelector("#foto-preview");

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        toast.info("Edição cancelada.");
        this.onBack();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        this.submitForm();
      });
    }

    if (fotoInput) {
      fotoInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            fotoPreview.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  submitForm() {
    const tipo = this.element.querySelector("#tipo").value;
    const nome = this.element.querySelector("#nome").value;
    const email = this.element.querySelector("#email").value;
    const crcContabilista =
      this.element.querySelector("#crcContabilista").value;
    const inscricao = this.element.querySelector("#inscricao").value;
    const ativo = this.element.querySelector("#ativo").value;
    const cidade = this.element.querySelector("#cidade").value;
    const senha = this.element.querySelector("#senha").value;
    const foto = this.element.querySelector("#foto").files[0];

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }

    const updatedData = {
      id: this.usuarioData.id,
      tipoUsuario: tipo,
      nome,
      email,
      crcContabilista,
      inscricao,
      ativo,
      cidade,
      perfil: tipo, // Assuming perfil is the same as tipo for now
      senha: senha || this.usuarioData.senha || "",
      foto: foto ? URL.createObjectURL(foto) : this.usuarioData.foto,
    };

    toast.success("Usuário atualizado com sucesso!");
    this.onUpdate(updatedData);
  }
}

export default EditUsuarioComponent;
