/**
 * Header Component - Main navigation header for IPM-e
 */

import HeaderDropdown from '../layout/HeaderDropdown.js';

class Header {
  constructor() {
    this.dropdowns = [];
    this.modules = {
      dashboard: { paths: ['/index.html'], title: 'Dashboard' },
      importacao: { paths: ['/pages/imports/'], title: 'Importação' },
      gerenciar: {
        paths: ['/gerenciar/', '/malha-fiscal/', '/monitoramento/', '/estatisticas/'],
        title: 'Gerenciar'
      },
      cadastro: { paths: ['/cadastro/', '/contribuinte/'], title: 'Cadastro' },
      relatorios: { paths: ['/relatorios/', '/extrato/', '/progressao/'], title: 'Relatórios' },
      auxiliares: { paths: ['/auxiliares/', '/entidades/', '/cidades/'], title: 'Auxiliares' },
      acessos: { paths: ['/acessos/', '/usuarios/', '/perfil/'], title: 'Acessos' }
    };
  }

  getActiveModule() {
    const path = window.location.pathname.toLowerCase();
    for (const [moduleId, moduleData] of Object.entries(this.modules)) {
      if (moduleData.paths.some(modulePath => {
        if (modulePath === '/' && path === '/') {
          return true;
        }
        return modulePath !== '/' && path.includes(modulePath);
      })) {
        return moduleId;
      }
    }
    return 'dashboard';
  }

  render() {
    const activeModule = this.getActiveModule();
    const activeTitle = this.modules[activeModule].title;
    const path = window.location.pathname.toLowerCase();
    let subTitle = activeTitle;
    const pathParts = path.split('/').filter(part => part);
    if (pathParts.length > 1) {
      const lastPart = pathParts[pathParts.length - 1];
      subTitle = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    }

    const navItems = Object.entries(this.modules).map(([moduleId, moduleData]) => {
      const isActive = moduleId === activeModule;
      const navClass = isActive
        ? "flex items-center justify-center text-2xl font-medium bg-blue-light !text-white py-2 px-6 rounded-full h-[46px] w-48 text-center"
        : "block hover:text-blue-light";

      const fontClass = isActive ? 'text-xl font-medium' : 'text-base';
      const iconMap = {
        dashboard: 'gauge-high',
        importacao: 'file-import',
        gerenciar: 'gears',
        cadastro: 'list-check',
        relatorios: 'file-lines',
        auxiliares: 'circle-info',
        acessos: 'lock'
      };

      // 🔽 ALTERAÇÃO FEITA AQUI:
      const hrefValue = moduleId === 'dashboard' ? '/index.html' : '#';

      return `
        <li class="nav-item">
          <a href="${hrefValue}" id="nav-${moduleId}" class="${navClass}" ${isActive ? 'aria-current="page"' : ''}>
            <i class="fa-solid fa-${iconMap[moduleId]} mr-2"></i>
            <span class="${fontClass}">${moduleData.title}</span>
          </a>
        </li>
      `;
    }).join('');

    return `
      <div class="w-full bg-white">
        <!-- Logo and Notification Section -->
        <div class="flex justify-between items-center pt-8 pb-6 px-16">
          <h1 class="text-5xl font-bold text-blue-dark ml-8">IPM-e</h1>
          <div class="flex items-center">
            <button aria-label="Notificações" class="text-gray-500 hover:text-gray-700">
              <i class="fa-regular fa-bell text-xl"></i>
            </button>
          </div>
        </div>
        
        <!-- Main Navigation -->
        <div class="mx-10 mb-6">
          <div class="flex justify-center">
            <ul class="flex items-center space-x-12 py-3">
              ${navItems}
            </ul>
          </div>
        </div>
        
        <!-- Submenu/Breadcrumb -->
        <div class="w-full bg-[#D9D9D9]" role="navigation" aria-label="Breadcrumb">
          <div class="pt-1 pb-1 pl-20 pr-16">
            <div class="text-gray-500 text-base leading-tight">${activeTitle} ${subTitle !== activeTitle ? `| ${subTitle}` : ''}</div>
            <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">${subTitle}</div>
          </div>
        </div>
      </div>
    `;
  }

  setupDropdowns() {
    this.setupImportacaoDropdown();
    this.setupGerenciarDropdown();
    this.setupCadastroDropdown();
    this.setupRelatoriosDropdown();
    this.setupAuxiliaresDropdown();
    this.setupAcessosDropdown();
  }

  setupImportacaoDropdown() {
    this.dropdowns.push(
      HeaderDropdown.create({
        targetElement: document.getElementById('nav-importacao'),
        items: [
          { title: 'IMPORTAR', icon: 'file-import', url: '/pages/imports/import.html' },
          { title: 'IMPORTADOS', icon: 'list', url: '/importados' },
          { title: 'REMESSAS', icon: 'box', url: '/remessas' },
          { title: 'PUBLICAÇÕES', icon: 'newspaper', url: '/publicacoes' },
          { title: 'EXERCÍCIOS', icon: 'dumbbell', url: '/exercicios' },
          { title: 'FILAS', icon: 'list-ol', url: '/filas' },
          { title: 'FALHAS', icon: 'triangle-exclamation', url: '/falhas' }
        ]
      })
    );
  }


  /**
   * Configura o dropdown de Gerenciar
   */
  setupGerenciarDropdown() {
    this.dropdowns.push(
      HeaderDropdown.create({
        targetElement: document.getElementById('nav-gerenciar'),
        categories: [
          { id: 'malha-fiscal', title: 'Malha Fiscal' },
          { id: 'monitoramento', title: 'Monitoramento' },
          { id: 'estatisticas', title: 'Estatísticas' },
          { id: 'icms-cota-parte', title: 'ICMS Cota Parte' }
        ],
        items: [
          // Malha Fiscal
          { title: 'NOTIFICAR', icon: 'user-shield', url: '/gerenciar/malha-fiscal/notificar', category: 'malha-fiscal' },
          { title: 'LOTES GERADOS', icon: 'layer-group', url: '/gerenciar/malha-fiscal/lotes-gerados', category: 'malha-fiscal' },
          { title: 'DISPARO DE NOTIFICAÇÕES', icon: 'paper-plane', url: '/gerenciar/malha-fiscal/disparo-notificacoes', category: 'malha-fiscal' },
          { title: 'NOTIFICAÇÃO AVULSA', icon: 'envelope', url: '/gerenciar/malha-fiscal/notificacao-avulsa', category: 'malha-fiscal' },
          { title: 'MOTIVOS NOTIFICAÇÕES', icon: 'list', url: '/gerenciar/malha-fiscal/motivos-notificacoes', category: 'malha-fiscal' },

          // Monitoramento
          { title: 'INCLUSÃO', icon: 'plus-circle', url: '/gerenciar/monitoramento/inclusao', category: 'monitoramento' },

          // Estatísticas
          { title: 'APURAÇÃO', icon: 'calculator', url: '/gerenciar/estatisticas/apuracao', category: 'estatisticas' },
          { title: 'GRÁFICOS', icon: 'chart-line', url: '/gerenciar/estatisticas/graficos', category: 'estatisticas' },
          { title: 'ÍNDICE DO MUNICÍPIO', icon: 'list-ol', url: '/gerenciar/estatisticas/indice-municipio', category: 'estatisticas' },
          { title: 'ÍNDICE ANTERIOR E ATUAL', icon: 'exchange-alt', url: '/gerenciar/estatisticas/indice-anterior-atual', category: 'estatisticas' },
          { title: 'VA,REC. BRUTA,POPULAÇÃO e ÁREA', icon: 'city', url: '/gerenciar/estatisticas/va-rec-bruta', category: 'estatisticas' },
          { title: 'VA POR CAT. ECONÔMICA E OUTROS', icon: 'chart-pie', url: '/gerenciar/estatisticas/va-cat-economica', category: 'estatisticas' },

          // ICMS Cota Parte
          { title: 'ESTADUAL', icon: 'building-government', url: '/gerenciar/icms-cota-parte/estadual', category: 'icms-cota-parte' },
          { title: 'MUNICIPAL', icon: 'city', url: '/gerenciar/icms-cota-parte/municipal', category: 'icms-cota-parte' }
        ]
      })
    );
  }

  /**
   * Configura o dropdown de Cadastro
   */
  setupCadastroDropdown() {
    this.dropdowns.push(
      HeaderDropdown.create({
        targetElement: document.getElementById('nav-cadastro'),
        categories: [
          { id: 'contribuinte', title: 'Contribuinte' },
          { id: 'notas-fiscais', title: 'Notas Fiscais' },
          { id: 'atividades-economicas', title: 'Atividades Econômicas' }
        ],
        items: [
          // Contribuinte
          { title: 'CONTRIBUINTES', icon: 'users', url: '/cadastro/contribuinte/contribuintes', category: 'contribuinte' },
          { title: 'SITUAÇÃO CONTRIBUINTE', icon: 'user-tag', url: '/cadastro/contribuinte/situacao-contribuinte', category: 'contribuinte' },
          { title: 'OMISSOS', icon: 'user-slash', url: '/cadastro/contribuinte/omissos', category: 'contribuinte' },
          { title: 'SEM MOVIMENTO', icon: 'user-clock', url: '/cadastro/contribuinte/sem-movimento', category: 'contribuinte' },
          { title: 'VA POSITIVOS', icon: 'arrow-trend-up', url: '/cadastro/contribuinte/va-positivos', category: 'contribuinte' },
          { title: 'VA NEGATIVOS', icon: 'arrow-trend-down', url: '/cadastro/contribuinte/va-negativos', category: 'contribuinte' },
          { title: 'EFD LANÇAMENTOS', icon: 'receipt', url: '/cadastro/contribuinte/efd-lancamentos', category: 'contribuinte' },
          { title: 'GIA-ICMS LANÇAMENTO', icon: 'file-invoice', url: '/cadastro/contribuinte/gia-icms', category: 'contribuinte' },
          { title: 'MEI', icon: 'id-card', url: '/cadastro/contribuinte/mei', category: 'contribuinte' },
          { title: 'PGDAS', icon: 'file-lines', url: '/cadastro/contribuinte/pgdas', category: 'contribuinte' },
          { title: 'COP3', icon: 'clipboard-list', url: '/cadastro/contribuinte/cop3', category: 'contribuinte' },
          { title: 'PRESTADORES DE SERVIÇO', icon: 'handshake', url: '/cadastro/contribuinte/prestadores', category: 'contribuinte' },

          // Notas Fiscais
          { title: 'NF-e Entradas (109)', icon: 'file-import', url: '/cadastro/notas-fiscais/nf-e-entradas', category: 'notas-fiscais', badge: '109' },
          { title: 'NF-e Declaradas (415)', icon: 'file-export', url: '/cadastro/notas-fiscais/nf-e-declaradas', category: 'notas-fiscais', badge: '415' },
          { title: 'NF-e Avulsas (812)', icon: 'file-alt', url: '/cadastro/notas-fiscais/nf-e-avulsas', category: 'notas-fiscais', badge: '812' },

          // Atividades Econômicas
          { title: 'CNAE', icon: 'briefcase', url: '/cadastro/atividades-economicas/cnae', category: 'atividades-economicas' },
          { title: 'CLASSES', icon: 'layer-group', url: '/cadastro/atividades-economicas/classes', category: 'atividades-economicas' },
          { title: 'GRUPOS', icon: 'object-group', url: '/cadastro/atividades-economicas/grupos', category: 'atividades-economicas' },
          { title: 'DIVISÕES', icon: 'table-cells', url: '/cadastro/atividades-economicas/divisoes', category: 'atividades-economicas' },
          { title: 'SEÇÕES', icon: 'table-columns', url: '/cadastro/atividades-economicas/secoes', category: 'atividades-economicas' }
        ]
      })
    );
  }

  /**
   * Configura o dropdown de Relatórios
   */
  setupRelatoriosDropdown() {
    this.dropdowns.push(
      HeaderDropdown.create({
        targetElement: document.getElementById('nav-relatorios'),
        items: [
          { title: 'EXTRATO', icon: 'file-invoice', url: '/relatorios/extrato' },
          { title: 'PROGRESSÃO', icon: 'chart-line', url: '/relatorios/progressao' },
          { title: 'COMPARATIVO', icon: 'balance-scale', url: '/relatorios/comparativo' },
          { title: 'CONSOLIDADO', icon: 'file-contract', url: '/relatorios/consolidado' },
          { title: 'DEMONSTRATIVO', icon: 'file-alt', url: '/relatorios/demonstrativo' },
          { title: 'COMPARATIVO DOE', icon: 'newspaper', url: '/relatorios/comparativo-doe' },
          { title: 'GRUPO ECONÔMICO', icon: 'building', url: '/relatorios/grupo-economico' }
        ]
      })
    );
  }

  /**
   * Configura o dropdown de Auxiliares
   */
  setupAuxiliaresDropdown() {
    this.dropdowns.push(
      HeaderDropdown.create({
        targetElement: document.getElementById('nav-auxiliares'),
        items: [
          { title: 'ENTIDADES', icon: 'building', url: '/auxiliares/entidades' },
          { title: 'CIDADES', icon: 'city', url: '/auxiliares/cidades' },
          { title: 'CFOP', icon: 'tag', url: '/auxiliares/cfop' },
          { title: 'PORTARIAS', icon: 'file-contract', url: '/auxiliares/portarias' },
          { title: 'GRUPO ATIVIDADES', icon: 'layer-group', url: '/auxiliares/grupo-atividades' },
          { title: 'INFORMATIVOS', icon: 'info-circle', url: '/auxiliares/informativos' }
        ]
      })
    );
  }

  /**
   * Configura o dropdown de Acessos
   */
  setupAcessosDropdown() {
    this.dropdowns.push(
      HeaderDropdown.create({
        targetElement: document.getElementById('nav-acessos'),
        items: [
          { title: 'USUÁRIOS', icon: 'users', url: '/acessos/usuarios' },
          { title: 'PERFIL', icon: 'user-tag', url: '/acessos/perfil' },
          { title: 'PERMISSÕES', icon: 'key', url: '/acessos/permissoes' },
          { title: 'MÓDULOS', icon: 'puzzle-piece', url: '/acessos/modulos' }
        ]
      })
    );
  }

  /**
   * Inicializa o header no DOM
   */
  static initialize() {
    console.log("Inicializando o Header...");
    const headerContainer = document.getElementById('header-component');
    if (headerContainer) {
      const header = new Header();
      headerContainer.innerHTML = header.render();

      // Inicializar os dropdowns após renderizar o header
      setTimeout(() => {
        header.setupDropdowns();
      }, 100);

      console.log("Header renderizado com sucesso!");
    } else {
      console.error("Elemento header-component não encontrado!");
    }
  }
}

// Criar um objeto de API compatível com o HeaderComponent
const HeaderComponent = {
  render(selector) {
    const headerContainer = document.querySelector(selector);
    if (headerContainer) {
      const header = new Header();
      headerContainer.innerHTML = header.render();

      // Inicializar os dropdowns após renderizar o header
      setTimeout(() => {
        header.setupDropdowns();
      }, 100);
    }
  }
};

// Exportar tanto a classe quanto o objeto compatível
export { Header, HeaderComponent };