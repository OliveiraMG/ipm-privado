/**
 * RegisterUsuarioComponent.js - Componente para cadastro de usuário
 */
import { toast } from "../../../js/Utilities.js";

class RegisterUsuarioComponent {
  constructor({ onSubmit, onBack }) {
    this.onSubmit = onSubmit || (() => {});
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
          <label for="tipo" class="block text-sm font-medium text-gray-700">Tipo*</label>
          <select id="tipo" name="tipo"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="">Selecione</option>
            <option value="Desenvolvedor">Desenvolvedor</option>
            <option value="Administrador">Administrador</option>
            <option value="Contabilista">Contabilista</option>
            <option value="Prefeitura">Prefeitura</option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="nome" class="block text-sm font-medium text-gray-700">Nome*</label>
          <input type="text" id="nome" name="nome"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
                 placeholder="Digite o nome">
        </div>
        <div class="col-span-1">
          <label for="email" class="block text-sm font-medium text-gray-700">E-mail*</label>
          <input type="email" id="email" name="email"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
                 placeholder="Digite o e-mail">
        </div>
        <div class="col-span-1">
          <label for="crcContabilista" class="block text-sm font-medium text-gray-700">CRC Contabilista*</label>
          <input type="text" id="crcContabilista" name="crcContabilista"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
                 placeholder="Digite o CRC">
        </div>
        <div class="col-span-1">
          <label for="inscricao" class="block text-sm font-medium text-gray-700">Inscrição*</label>
          <input type="text" id="inscricao" name="inscricao"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
                 placeholder="Digite a inscrição">
        </div>
        <div class="col-span-1">
          <label for="ativo" class="block text-sm font-medium text-gray-700">Ativo?*</label>
          <select id="ativo" name="ativo"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="cidade" class="block text-sm font-medium text-gray-700">Cidade*</label>
          <select id="cidade" name="cidade"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light">
            <option value="">Selecione</option>
            <option value="São Paulo">São Paulo</option>
            <option value="Rio de Janeiro">Rio de Janeiro</option>
            <option value="Belo Horizonte">Belo Horizonte</option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="senha" class="block text-sm font-medium text-gray-700">Senha</label>
          <input type="password" id="senha" name="senha"
                 class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-light focus:border-blue-light"
                 placeholder="Digite a senha">
        </div>
        <div class="col-span-2">
          <label for="foto" class="block text-sm font-medium text-gray-700">Foto</label>
          <label class="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
            <span>Escolher Arquivo</span>
            <input type="file" id="foto" name="foto" class="hidden" accept="image/*">
          </label>
        </div>
      </div>
      <div class="flex justify-end space-x-4 mt-6">
        <button id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-100">
          Voltar
        </button>
        <button id="submit-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full text-sm hover:bg-blue-medium">
          Cadastrar
        </button>
      </div>
    `;

    container.appendChild(form);
    return container;
  }

  setupEventListeners() {
    const cancelBtn = this.element.querySelector("#cancel-btn");
    const submitBtn = this.element.querySelector("#submit-btn");

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        toast.info("Cadastro cancelado.");
        this.onBack();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        this.submitForm();
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

    // Basic validation for required fields
    if (
      !tipo ||
      !nome ||
      !email ||
      !crcContabilista ||
      !inscricao ||
      !ativo ||
      !cidade
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }

    const userData = {
      tipo,
      nome,
      email,
      crcContabilista,
      inscricao,
      ativo,
      cidade,
      senha: senha || "",
      foto: foto ? URL.createObjectURL(foto) : "",
    };

    toast.success("Usuário cadastrado com sucesso!");
    this.onSubmit(userData);
  }
}

export default RegisterUsuarioComponent;
