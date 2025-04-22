/**
 * UsuariosPage.js - Página de listagem de usuários
 */
import { Header } from '/components/layout/Header.js';
import { toast } from '/js/Utilities.js';
import RegisterUsuarioComponent from '/pages/acessos/register/RegisterUsuarioComponent.js';
import EditUsuarioComponent from '/pages/acessos/edit/EditUsuarioComponent.js';
import ModalComponent from '/components/common/ModalComponent.js';
import SincronizarPerfisUsuarioComponent from '/pages/acessos/edit/SincronizarPerfisUsuarioComponent.js';
import SincronizarPermissoesUsuarioComponent from '/pages/acessos/edit/SincronizarPermissoesUsuarioComponent.js';

class UsuariosPage {
  constructor() {
    this.tableData = [];
    this.modal = null;
    this.initialize();
  }

  initialize() {
    console.log("Inicializando UsuariosPage...");

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
          <div class="text-gray-500 text-base leading-tight">Acessos | Usuários</div>
          <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Usuários</div>
        </div>
      `;
    }
  }

  renderContent() {
    const mainContent = document.querySelector('main');
    if (!mainContent) {
      console.error("Elemento main não encontrado!");
      return;
    }

    mainContent.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.25)] mx-24 my-20 p-12';

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-6';
    header.innerHTML = `
      <h2 class="text-2xl font-semibold text-blue-dark">Listagem</h2>
    `;
    card.appendChild(header);

    const tableContainer = document.createElement('div');
    tableContainer.id = 'usuarios-table';
    tableContainer.className = 'w-full px-2';
    card.appendChild(tableContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex justify-center space-x-4 mt-6';
    buttonContainer.innerHTML = `
      <button id="register-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
        <i class="fa-solid fa-plus mr-2"></i>Cadastrar
      </button>
      <button id="export-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
        <i class="fa-solid fa-download mr-2"></i>Exportar
      </button>
      <button id="search-btn" class="px-4 py-2 bg-blue-dark text-white rounded-full hover:bg-blue-medium">
        <i class="fa-solid fa-search mr-2"></i>Pesquisar
      </button>
      <button id="removed-btn" class="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600">
        <i class="fa-solid fa-trash mr-2"></i>Removidos
      </button>
    `;
    card.appendChild(buttonContainer);

    mainContent.appendChild(card);

    this.setupButtonEvents();

    this.renderTable();
  }

  setupButtonEvents() {
    const registerBtn = document.getElementById('register-btn');
    const exportBtn = document.getElementById('export-btn');
    const searchBtn = document.getElementById('search-btn');
    const removedBtn = document.getElementById('removed-btn');

    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        toast.info('Abrindo formulário de cadastro...');
        this.openRegisterModal();
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        console.log('Exportando dados dos usuários:', this.tableData);
        toast.success('Exportação simulada com sucesso! Verifique o console.');
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        toast.info('Funcionalidade de pesquisa ainda não implementada.');
      });
    }

    if (removedBtn) {
      removedBtn.addEventListener('click', () => {
        toast.info('Funcionalidade de visualizar removidos ainda não implementada.');
      });
    }
  }

  openRegisterModal() {
    const registerComponent = new RegisterUsuarioComponent({
      onSubmit: (data) => {
        const newUser = {
          id: Math.max(...this.tableData.map(d => d.id), 0) + 1,
          nome: data.nome,
          email: data.email,
          crcContabilista: data.crcContabilista,
          inscricao: data.inscricao,
          tipoUsuario: data.tipo,
          perfil: data.tipo,
          ativo: data.ativo,
          cidade: data.cidade,
          foto: data.foto || ''
        };
        this.tableData.unshift(newUser);
        this.renderTable();
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de usuários');
      }
    });

    this.modal = new ModalComponent({
      id: 'register-usuario-modal',
      title: 'Cadastrar Usuário',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: registerComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openEditModal(userId) {
    const usuarioData = this.tableData.find(item => item.id === userId);
    if (!usuarioData) {
      toast.error('Usuário não encontrado!');
      return;
    }

    const editComponent = new EditUsuarioComponent({
      usuarioData: usuarioData,
      onUpdate: (updatedData) => {
        this.updateData(updatedData);
        this.modal.close();
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de usuários');
      }
    });

    this.modal = new ModalComponent({
      id: 'edit-usuario-modal',
      title: 'Editar Usuário',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: editComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openSincronizarPerfisModal(userId) {
    const usuarioData = this.tableData.find(item => item.id === userId);
    if (!usuarioData) {
      toast.error('Usuário não encontrado!');
      return;
    }

    const sincronizarPerfisComponent = new SincronizarPerfisUsuarioComponent({
      userName: usuarioData.nome,
      onSync: (data) => {
        this.tableData = this.tableData.map(item =>
          item.id === userId ? { ...item, perfil: data.profile, tipoUsuario: data.profile } : item
        );
        this.renderTable();
        this.modal.close();
        toast.success(`Perfil de ${usuarioData.nome} sincronizado com sucesso!`);
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de usuários');
      }
    });

    this.modal = new ModalComponent({
      id: 'sincronizar-perfis-modal',
      title: 'Sincronizar Perfis',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: sincronizarPerfisComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  openSincronizarPermissoesModal(userId) {
    const usuarioData = this.tableData.find(item => item.id === userId);
    if (!usuarioData) {
      toast.error('Usuário não encontrado!');
      return;
    }

    const sincronizarPermissoesComponent = new SincronizarPermissoesUsuarioComponent({
      userName: usuarioData.nome,
      onSync: (data) => {
        console.log(`Permissões sincronizadas para ${usuarioData.nome}:`, data.permissions);
        this.modal.close();
        toast.success(`Permissões de ${usuarioData.nome} sincronizadas com sucesso!`);
      },
      onBack: () => {
        this.modal.close();
        toast.info('Retornado à lista de usuários');
      }
    });

    this.modal = new ModalComponent({
      id: 'sincronizar-permissoes-modal',
      title: 'Sincronizar Permissões',
      titleClass: 'text-blue-dark font-semibold text-xl',
      content: sincronizarPermissoesComponent.element,
      contentClass: 'p-0',
      onClose: () => {
        this.modal = null;
      }
    });
    this.modal.open();
  }

  updateData(updatedData) {
    this.tableData = this.tableData.map(item =>
      item.id === updatedData.id ? { ...item, ...updatedData } : item
    );
    this.renderTable();
    toast.success('Usuário atualizado com sucesso!');
  }

  loadData() {
    console.log("Carregando dados...");
    setTimeout(() => {
      this.tableData = this.getMockData();
      console.log("Loaded tableData:", this.tableData);
      this.renderTable();
    }, 300);
  }

  renderTable() {
    const tableContainer = document.getElementById('usuarios-table');
    if (!tableContainer) {
      console.error("Container da tabela não encontrado!");
      return;
    }

    console.log('tableData before rendering:', this.tableData);

    if (!this.tableData || !this.tableData.length) {
      tableContainer.innerHTML = '<p class="text-center py-4">Nenhum dado disponível</p>';
      return;
    }

    try {
      let tableHTML = `
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-blue-dark">
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">AÇÕES</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 5%">ID</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 15%">NOME</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">CRC CONTABILISTA</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">INSCRIÇÃO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-left py-2 px-4" style="width: 20%">E-MAIL</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">TIPO USUÁRIO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 10%">PERFIL</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 5%">ATIVO</th>
              <th class="text-white font-medium text-sm uppercase tracking-wider text-center py-2 px-4" style="width: 5%">FOTO</th>
            </tr>
          </thead>
          <tbody>
      `;

      this.tableData.forEach((row, index) => {
        const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        tableHTML += `
          <tr class="${rowClass}">
            <td class="text-center py-2 px-4">
              <div class="flex space-x-2 justify-center">
                <button class="edit-btn bg-blue-dark text-white text-xs rounded px-2 py-1 hover:bg-blue-medium" data-id="${row.id || ''}" style="display: inline-block !important;">
                  <i class="fa-solid fa-pencil-alt"></i>
                </button>
                <button class="profiles-btn bg-blue-dark text-white text-xs rounded px-2 py-1 hover:bg-blue-medium" data-id="${row.id || ''}" style="display: inline-block !important;">
                  <i class="fa-solid fa-th"></i>
                </button>
                <button class="permissions-btn bg-blue-dark text-white text-xs rounded px-2 py-1 hover:bg-blue-medium" data-id="${row.id || ''}" style="display: inline-block !important;">
                  <i class="fa-solid fa-search"></i>
                </button>
                <button class="delete-btn bg-red-500 text-white text-xs rounded px-2 py-1 hover:bg-red-600" data-id="${row.id || ''}" style="display: inline-block !important;">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
            <td class="text-center py-2 px-4">${row.id}</td>
            <td class="text-left py-2 px-4">${row.nome}</td>
            <td class="text-center py-2 px-4">${row.crcContabilista}</td>
            <td class="text-center py-2 px-4">${row.inscricao}</td>
            <td class="text-left py-2 px-4">${row.email}</td>
            <td class="text-center py-2 px-4">${row.tipoUsuario}</td>
            <td class="text-center py-2 px-4">${row.perfil}</td>
            <td class="text-center py-2 px-4">${row.ativo}</td>
            <td class="text-center py-2 px-4">${row.foto ? '<img src="' + row.foto + '" class="w-6 h-6 rounded-full inline-block" />' : ''}</td>
          </tr>
        `;
      });

      tableHTML += `
          </tbody>
        </table>
      `;

      tableContainer.innerHTML = tableHTML;

      this.setupTableButtonEvents();
    } catch (error) {
      console.error("Erro ao renderizar tabela:", error);
      tableContainer.innerHTML = `<p class="text-center text-red-500 py-4">Erro ao renderizar tabela: ${error.message}</p>`;
    }
  }

  setupTableButtonEvents() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const profilesButtons = document.querySelectorAll('.profiles-btn');
    const permissionsButtons = document.querySelectorAll('.permissions-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const userId = parseInt(button.getAttribute('data-id'));
        toast.info('Abrindo formulário de edição...');
        this.openEditModal(userId);
      });
    });

    profilesButtons.forEach(button => {
      button.addEventListener('click', () => {
        const userId = parseInt(button.getAttribute('data-id'));
        this.openSincronizarPerfisModal(userId);
      });
    });

    permissionsButtons.forEach(button => {
      button.addEventListener('click', () => {
        const userId = parseInt(button.getAttribute('data-id'));
        this.openSincronizarPermissoesModal(userId);
      });
    });

    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const userId = parseInt(button.getAttribute('data-id'));
        toast.info(`Funcionalidade de remoção do usuário ${userId} ainda não implementada.`);
      });
    });
  }

  getMockData() {
    return [
      {
        id: 1,
        nome: 'Desenvolvedor',
        crcContabilista: '',
        inscricao: '',
        email: 'desenvolvedor@desenvolvedor.com',
        tipoUsuario: 'Desenvolvedor',
        perfil: 'Desenvolvedor',
        ativo: 'Sim',
        cidade: 'São Paulo',
        foto: ''
      },
      {
        id: 2,
        nome: 'Darlan',
        crcContabilista: '',
        inscricao: '',
        email: 'darlan@etecmt.com.br',
        tipoUsuario: 'Administrador',
        perfil: 'Administrador',
        ativo: 'Sim',
        cidade: 'Pontes e Lacerda',
        foto: 'https://via.placeholder.com/50'
      },
      {
        id: 3,
        nome: 'Anderson Marcel',
        crcContabilista: '',
        inscricao: '',
        email: 'anderson.marcel@etecmt.com.br',
        tipoUsuario: 'Administrador',
        perfil: 'Administrador',
        ativo: 'Sim',
        cidade: 'Belo Horizonte',
        foto: ''
      },
      {
        id: 4,
        nome: 'José Bastos',
        crcContabilista: '',
        inscricao: '',
        email: 'jose@etecmt.com.br',
        tipoUsuario: 'Administrador',
        perfil: 'Administrador',
        ativo: 'Sim',
        cidade: 'Rio de Janeiro',
        foto: ''
      },
      {
        id: 5,
        nome: 'Adauto',
        crcContabilista: '',
        inscricao: '',
        email: 'adauto@etecmt.com.br',
        tipoUsuario: 'Administrador',
        perfil: 'Administrador',
        ativo: 'Sim',
        cidade: 'São Paulo',
        foto: ''
      },
      {
        id: 6,
        nome: 'Contador',
        crcContabilista: '1',
        inscricao: '',
        email: 'contador@etecmt.com.br',
        tipoUsuario: 'Contabilista',
        perfil: 'Contabilista',
        ativo: 'Sim',
        cidade: 'Belo Horizonte',
        foto: ''
      },
      {
        id: 7,
        nome: 'Fagner Menezes de Freitas',
        crcContabilista: '',
        inscricao: '',
        email: 'fiscalcazacortutiana06@ponteselacerda.mt.gov.br',
        tipoUsuario: 'Prefeitura',
        perfil: 'Prefeitura',
        ativo: 'Sim',
        cidade: 'Pontes e Lacerda',
        foto: ''
      }
    ];
  }

  static initialize() {
    return new UsuariosPage();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  UsuariosPage.initialize();
});

export default UsuariosPage;