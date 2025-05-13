/**
 * MotivosNotificacoesPage.js - Página de listagem de motivos de notificações
 */
import { Header } from "../../../components/layout/Header.js";
import { toast } from "../../../js/Utilities.js";
import ModalComponent from "../../../components/common/ModalComponent.js";
import RegisterMotivoComponent from "./registers/RegisterMotivosNotificacoesComponent.js";
import EditMotivosNotificacoesComponent from "./edit/EditMotivosNotificacoesComponent.js";

class MotivosNotificacoesPage {
  constructor() {
    this.tableData = [];
    this.originalTableData = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.totalPages = 1;
    this.modal = null;
    this.initialize();
  }

  initialize() {
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
          <div class="text-gray-500 text-base leading-tight">Gerenciar | Malha Fiscal | Motivos Notificações</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Motivos Notificações</div>
        </div>
      `;
    }
  }

  renderContent() {
    const mainContent = document.querySelector("main");
    if (!mainContent) return;

    mainContent.innerHTML = "";

    const card = document.createElement("div");
    card.className = "bg-white rounded-2xl shadow-lg mx-24 my-20 p-12";

    card.innerHTML = `
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-blue-dark">Listagem</h2>
      </div>
      <div id="permissoes-table" class="w-full px-2"></div>
      <div id="pagination-container" class="flex justify-center mt-4"></div>
      <div class="flex justify-center space-x-4 mt-6">
        <button id="register-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
          <i class="fa-solid fa-plus mr-2"></i>Cadastrar
        </button>
      </div>
    `;

    mainContent.appendChild(card);
    this.setupButtonEvents();
    this.renderTable();
  }

  setupButtonEvents() {
    document
      .getElementById("register-btn")
      ?.addEventListener("click", () => this.openRegisterModal());
  }

  openDeleteModal(motivoId) {
    const motivoToDelete = this.tableData.find((item) => item.id === motivoId);
    if (!motivoToDelete) return toast.error("Motivo não encontrado!");

    const confirmationElement = document.createElement("div");
    confirmationElement.innerHTML = `
      <p class="text-gray-800 text-base">Tem certeza que deseja excluir o motivo: <strong>${motivoToDelete.descricao}</strong>?</p>
      <div class="mt-4 flex justify-end space-x-4">
        <button id="confirm-delete-btn" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Confirmar</button>
        <button id="cancel-delete-btn" class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
      </div>
    `;

    this.modal = new ModalComponent({
      id: "delete-modal",
      title: "Confirmar Exclusão",
      content: confirmationElement,
      onClose: () => (this.modal = null),
    });

    this.modal.open();

    document
      .getElementById("confirm-delete-btn")
      ?.addEventListener("click", () => {
        this.tableData = this.tableData.filter((item) => item.id !== motivoId);
        this.originalTableData = this.originalTableData.filter(
          (item) => item.id !== motivoId
        );
        this.totalPages = Math.ceil(this.tableData.length / this.itemsPerPage);
        this.currentPage = Math.min(this.currentPage, this.totalPages);
        this.renderTable();
        this.renderPagination();
        this.modal.close();
        toast.success("Motivo excluído com sucesso!");
      });

    document
      .getElementById("cancel-delete-btn")
      ?.addEventListener("click", () => {
        this.modal.close();
        toast.info("Exclusão cancelada.");
      });
  }

  openRegisterModal() {
    const registerComponent = new RegisterMotivoComponent({
      onSubmit: (data) => {
        const newMotivo = {
          id: Math.max(...this.tableData.map((d) => d.id), 0) + 1,
          ...data,
        };
        this.tableData.unshift(newMotivo);
        this.originalTableData.unshift(newMotivo);
        this.totalPages = Math.ceil(this.tableData.length / this.itemsPerPage);
        this.currentPage = 1;
        this.renderTable();
        this.renderPagination();
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info("Retornado à lista de permissões");
      },
    });

    this.modal = new ModalComponent({
      id: "cadastrar-motivo-modal",
      title: "Cadastrar Motivo",
      content: registerComponent.element,
      onClose: () => (this.modal = null),
    });

    this.modal.open();
  }

  openEditModal(motivoId) {
    const motivo = this.tableData.find((item) => item.id === motivoId);
    if (!motivo) return toast.error("Motivo não encontrado!");

    const editComponent = new EditMotivosNotificacoesComponent({
      motivosData: motivo,
      onUpdate: (updatedData) => {
        this.updateData(updatedData);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info("Retornado à lista de permissões");
      },
    });

    this.modal = new ModalComponent({
      id: "edit-motivo-modal",
      title: "Editar Motivo",
      content: editComponent.element,
      onClose: () => (this.modal = null),
    });

    this.modal.open();
  }
  
  updateData(updatedData) {
    this.tableData = this.tableData.map((item) =>
      item.id === updatedData.id ? { ...item, ...updatedData } : item
    );
    this.originalTableData = this.originalTableData.map((item) =>
      item.id === updatedData.id ? { ...item, ...updatedData } : item
    );
    this.renderTable();
    this.renderPagination();
    toast.success("Motivo atualizado com sucesso!");
  }

  loadData() {
    setTimeout(() => {
      this.tableData = this.getMockData();
      this.originalTableData = [...this.tableData];
      this.totalPages = Math.ceil(this.tableData.length / this.itemsPerPage);
      this.renderTable();
      this.renderPagination();
    }, 300);
  }

  renderTable() {
    const container = document.getElementById("permissoes-table");
    if (!container) return;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const data = this.tableData.slice(startIndex, endIndex);

    if (!data.length) {
      container.innerHTML =
        '<p class="text-center py-4">Nenhum dado disponível</p>';
      return;
    }

    const rows = data
      .map(
        (row, i) => `
      <tr class="${i % 2 === 0 ? "bg-white" : "bg-gray-50"}">
        <td class="text-center py-2 px-4 border-2">
          <div class="flex space-x-2 justify-center">
            <button class="edit-btn bg-blue-dark text-white text-sm rounded px-2 py-1 hover:bg-blue-medium" data-id="${
              row.id
            }"><i class="fa-solid fa-pencil-alt"></i> Editar</button>
            <button class="delete-btn bg-red-600 text-white text-sm rounded px-2 py-1 hover:bg-red-700" data-id="${
              row.id
            }"><i class="fa-solid fa-trash"></i> Excluir</button>
          </div>
        </td>
        <td class="text-center py-2 px-4 border-2">${row.id}</td>
        <td class="text-left py-2 px-4 border-2">${row.sigla}</td>
        <td class="text-left py-2 px-4 border-2">${row.descricao}</td>
        <td class="text-left py-2 px-4 border-2">${row.modulo}</td>
        <td class="text-left py-2 px-4 border-2">${row.ativo}</td>
      </tr>`
      )
      .join("");

    container.innerHTML = `
      <table class="min-w-full border-collapse rounded-xl overflow-hidden">
        <thead>
          <tr class="bg-blue-dark">
            <th class="text-white text-sm text-center py-2 px-4 border-2">AÇÕES</th>
            <th class="text-white text-sm text-center py-2 px-4 border-2">ID</th>
            <th class="text-white text-sm text-center py-2 px-4 border-2">Sigla</th>
            <th class="text-white text-sm text-left py-2 px-4 border-2">DESCRIÇÃO</th>
            <th class="text-white text-sm text-left py-2 px-4 border-2">MÓDULO</th>
            <th class="text-white text-sm text-left py-2 px-4 border-2">ATIVO</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    this.setupTableButtonEvents();
  }

  setupTableButtonEvents() {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () =>
        this.openEditModal(parseInt(btn.dataset.id))
      );
    });
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () =>
        this.openDeleteModal(parseInt(btn.dataset.id))
      );
    });
  }

  renderPagination() {
    const container = document.getElementById("pagination-container");
    if (!container) return;

    let html = `<nav class="flex space-x-2">`;
    html += `<button id="prev-page" class="px-3 py-1 border rounded ${
      this.currentPage === 1
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "bg-white text-blue-dark hover:bg-blue-light"
    }" ${this.currentPage === 1 ? "disabled" : ""}><</button>`;

    for (let i = 1; i <= this.totalPages; i++) {
      html += `<button class="page-btn px-3 py-1 border rounded ${
        this.currentPage === i
          ? "bg-blue-dark text-white"
          : "bg-white text-blue-dark hover:bg-blue-light"
      }" data-page="${i}">${i}</button>`;
    }

    html += `<button id="next-page" class="px-3 py-1 border rounded ${
      this.currentPage === this.totalPages
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "bg-white text-blue-dark hover:bg-blue-light"
    }" ${this.currentPage === this.totalPages ? "disabled" : ""}>></button>`;
    html += `</nav>`;

    container.innerHTML = html;
    this.setupPaginationEvents();
  }

  setupPaginationEvents() {
    document.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentPage = parseInt(btn.dataset.page);
        this.renderTable();
        this.renderPagination();
      });
    });
    document.getElementById("prev-page")?.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderTable();
        this.renderPagination();
      }
    });
    document.getElementById("next-page")?.addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.renderTable();
        this.renderPagination();
      }
    });
  }

  getMockData() {
    const items = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      sigla: `SIGLA${i + 1}`,
      descricao: `Descrição ${i + 1}`,
      modulo: `Módulo ${i + 1}`,
      ativo: (i + 1) % 2 === 0 ? "Sim" : "Não",
    }));
    return items;
  }

  static initialize() {
    return new MotivosNotificacoesPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  MotivosNotificacoesPage.initialize();
});

export default MotivosNotificacoesPage;
