/**
 * StatCard Component - Display statistical information in a card
 * @param {string} title - The title/label of the card
 * @param {string|number} value - The main value to display
 * @param {Object} details - Object containing details (MEI, Simples Nacional, Simplificada)
 * @param {number} details.mei - MEI count
 * @param {number} details.simplesNacional - Simples Nacional count
 * @param {number} details.simplificada - Simplificada count
 */
class StatCard {
  constructor(title, value, details = {}) {
    this.title = title;
    this.value = value;
    this.details = {
      mei: details.mei || 0,
      simplesNacional: details.simplesNacional || 0,
      simplificada: details.simplificada || 0
    };
  }

  // Formatar números com separador de milhar
  formatNumber(number) {
    if (typeof number === 'number') {
      return number.toLocaleString('pt-BR');
    }
    return number;
  }

  render() {
    const formattedValue = this.formatNumber(this.value);
    
    return `
      <div class="bg-blue-medium text-white p-6 rounded-3xl">
        <div class="text-center">
          <p class="text-sm uppercase font-semibold mb-2">${this.title}</p>
          <p class="text-4xl font-bold mb-2">${formattedValue}</p>
          <p class="text-s text-gray-200">
            MEI: ${this.formatNumber(this.details.mei)} | Simples Nacional: ${this.formatNumber(this.details.simplesNacional)} | Simplificada: ${this.formatNumber(this.details.simplificada)}
          </p>
        </div>
      </div>
    `;
  }

  // Método estático para criar e renderizar um card em um container
  static renderCard(container, options) {
    const card = new StatCard(options.title, options.value, options.details);
    
    // Se o container for um seletor CSS
    if (typeof container === 'string') {
      const element = document.querySelector(container);
      if (element) {
        element.innerHTML += card.render();
        return element;
      }
    } 
    // Se for um elemento DOM
    else if (container instanceof Element) {
      const cardDiv = document.createElement('div');
      cardDiv.innerHTML = card.render();
      const cardElement = cardDiv.firstElementChild;
      container.appendChild(cardElement);
      return cardElement;
    }
  }
}

export default StatCard;