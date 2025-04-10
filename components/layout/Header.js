/**
 * Header Component - Main navigation header for IPM-e
 */
class Header {
  constructor() {
    // Não precisa de parâmetros por enquanto
  }

  render() {
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
              <li>
                <a href="#" class="block bg-blue-light text-white py-2 px-6 rounded-full w-48 text-center" aria-current="page">
                  <i class="fa-solid fa-gauge-high mr-2"></i>
                  <span class="text-xl font-medium">Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" class="block hover:text-blue-light">
                  <i class="fa-solid fa-file-import mr-2"></i>
                  <span class="text-base">Importação</span>
                </a>
              </li>
              <li>
                <a href="#" class="block hover:text-blue-light">
                  <i class="fa-solid fa-gears mr-2"></i>
                  <span class="text-base">Gerenciar</span>
                </a>
              </li>
              <li>
                <a href="#" class="block hover:text-blue-light">
                  <i class="fa-solid fa-list-check mr-2"></i>
                  <span class="text-base">Cadastro</span>
                </a>
              </li>
              <li>
                <a href="#" class="block hover:text-blue-light">
                  <i class="fa-solid fa-file-lines mr-2"></i>
                  <span class="text-base">Relatórios</span>
                </a>
              </li>
              <li>
                <a href="#" class="block hover:text-blue-light">
                  <i class="fa-solid fa-circle-info mr-2"></i>
                  <span class="text-base">Auxiliares</span>
                </a>
              </li>
              <li>
                <a href="#" class="block hover:text-blue-light">
                  <i class="fa-solid fa-lock mr-2"></i>
                  <span class="text-base">Acessos</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Submenu/Breadcrumb - Com espaçamento reduzido -->
        <div class="w-full bg-[#D9D9D9]" role="navigation" aria-label="Breadcrumb">
          <div class="pt-1 pb-1 pl-20 pr-16">
            <div class="text-gray-500 text-base leading-tight">Dashboard |</div>
            <div class="text-blue-dark font-semibold text-4xl leading-tight mt-0">Dashboard</div>
          </div>
        </div>
      </div>
    `;
  }

  // Método para inicializar o header no DOM
  static initialize() {
    console.log("Inicializando o Header...");
    const headerContainer = document.getElementById('header-component');
    if (headerContainer) {
      const header = new Header();
      headerContainer.innerHTML = header.render();
      console.log("Header renderizado com sucesso!");
    } else {
      console.error("Elemento header-component não encontrado!");
    }
  }
}

// Criar um objeto de API compatível com o HeaderComponent
const HeaderComponent = {
render(selector) {
  console.log("HeaderComponent.render() chamado com seletor:", selector);
  const headerContainer = document.querySelector(selector);
  if (headerContainer) {
    const header = new Header();
    headerContainer.innerHTML = header.render();
    console.log("Header renderizado via HeaderComponent");
  } else {
    console.error("Seletor não encontrado:", selector);
  }
}
};

// Inicializar o header quando o documento for carregado
document.addEventListener('DOMContentLoaded', () => {
console.log("DOMContentLoaded no Header.js");
Header.initialize();
});

// Exportar tanto a classe quanto o objeto compatível
export { Header, HeaderComponent };