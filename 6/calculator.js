// Конфигурация калькулятора
const calculatorConfig = {
    basePrices: {
        basic: 100,
        premium: 200,
        custom: 150
    },
    
    serviceTypes: [
        { id: 'type1', value: 'basic', label: 'Базовая услуга' },
        { id: 'type2', value: 'premium', label: 'Премиум услуга' },
        { id: 'type3', value: 'custom', label: 'Кастомная услуга' }
    ],
    
    options: [
        { value: 'option1', label: 'Стандартная опция', multiplier: 1.0 },
        { value: 'option2', label: 'Расширенная опция', multiplier: 1.5 },
        { value: 'option3', label: 'Профессиональная опция', multiplier: 2.0 }
    ],
    
    propertyMultiplier: 1.2
};

// Основной класс калькулятора
class ServiceCalculator {
    constructor() {
        this.initializeElements();
        this.createServiceTypeRadios();
        this.createOptionsSelect();
        this.bindEvents();
        this.updateFormVisibility();
        this.calculateTotalPrice();
    }

    initializeElements() {
        // Основные элементы формы
        this.quantityInput = document.getElementById('quantity');
        this.serviceTypeGroup = document.getElementById('service-type-group');
        this.optionsGroup = document.getElementById('options-group');
        this.optionsSelect = document.getElementById('options');
        this.propertyGroup = document.getElementById('property-group');
        this.propertyCheckbox = document.getElementById('property');
        this.totalPriceElement = document.getElementById('total-price');
    }

    createServiceTypeRadios() {
        calculatorConfig.serviceTypes.forEach((type, index) => {
            const radioOption = document.createElement('div');
            radioOption.className = 'radio-option';
            
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.id = type.id;
            radioInput.name = 'serviceType';
            radioInput.value = type.value;
            radioInput.checked = index === 0;
            
            const radioLabel = document.createElement('label');
            radioLabel.htmlFor = type.id;
            radioLabel.textContent = type.label;
            
            radioOption.appendChild(radioInput);
            radioOption.appendChild(radioLabel);
            this.serviceTypeGroup.appendChild(radioOption);
        });
    }

    createOptionsSelect() {
        calculatorConfig.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            this.optionsSelect.appendChild(optionElement);
        });
    }

    bindEvents() {
        // Обработчики событий
        this.quantityInput.addEventListener('input', () => this.calculateTotalPrice());
        
        document.querySelectorAll('input[name="serviceType"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateFormVisibility();
                this.calculateTotalPrice();
            });
        });
        
        this.optionsSelect.addEventListener('change', () => this.calculateTotalPrice());
        this.propertyCheckbox.addEventListener('change', () => this.calculateTotalPrice());
    }

    updateFormVisibility() {
        const selectedType = document.querySelector('input[name="serviceType"]:checked').value;
        
        // Сбрасываем значения при смене типа
        this.optionsSelect.selectedIndex = 0;
        this.propertyCheckbox.checked = false;
        
        // Показываем/скрываем элементы в зависимости от типа услуги
        switch(selectedType) {
            case 'basic':
                // Первый тип - нет опций и свойств
                this.hideElement(this.optionsGroup);
                this.hideElement(this.propertyGroup);
                break;
            case 'premium':
                // Второй тип - только опции
                this.showElement(this.optionsGroup);
                this.hideElement(this.propertyGroup);
                break;
            case 'custom':
                // Третий тип - только свойство
                this.hideElement(this.optionsGroup);
                this.showElement(this.propertyGroup);
                break;
        }
    }

    showElement(element) {
        element.classList.remove('hidden');
    }

    hideElement(element) {
        element.classList.add('hidden');
    }

    calculateTotalPrice() {
        const quantity = parseInt(this.quantityInput.value) || 1;
        const selectedType = document.querySelector('input[name="serviceType"]:checked').value;
        
        let basePrice = calculatorConfig.basePrices[selectedType];
        let totalPrice = basePrice * quantity;
        
        // Учитываем опцию для premium типа
        if (selectedType === 'premium') {
            const selectedOption = this.optionsSelect.value;
            const optionConfig = calculatorConfig.options.find(opt => opt.value === selectedOption);
            if (optionConfig) {
                totalPrice *= optionConfig.multiplier;
            }
        }
        
        // Учитываем свойство для custom типа
        if (selectedType === 'custom' && this.propertyCheckbox.checked) {
            totalPrice *= calculatorConfig.propertyMultiplier;
        }
        
        // Обновляем отображение цены
        this.updatePriceDisplay(Math.round(totalPrice));
    }

    updatePriceDisplay(price) {
        this.totalPriceElement.textContent = price + ' руб.';
    }
}

// Инициализация калькулятора при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    new ServiceCalculator();
});