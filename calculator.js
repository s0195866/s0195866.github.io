window.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    
    const quantityInput = document.getElementById('quantity');
    const productSelect = document.getElementById('product');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('quantityError');
    
    // Регулярное выражение для проверки ввода (только цифры)
    const numberRegex = /^\d+$/;
    
    function validateInput(input) {
        return numberRegex.test(input);
    }
    
    function calculateTotal() {
        const quantity = quantityInput.value.trim();
        const price = parseInt(productSelect.value);
        
        // Проверка корректности ввода
        if (!validateInput(quantity)) {
            errorDiv.classList.remove('hidden');
            resultDiv.classList.add('hidden');
            return;
        }
        
        // Скрываем сообщение об ошибке, если оно было показано
        errorDiv.classList.add('hidden');
        
        const quantityNumber = parseInt(quantity);
        const total = price * quantityNumber;
        
        // Форматируем вывод с разделением тысяч
        const formattedTotal = total.toLocaleString('ru-RU');
        
        // Получаем название выбранного товара
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        const productName = selectedOption.text.split(' - ')[0];
        
        resultDiv.innerHTML = `Стоимость заказа: <br>
                              Товар: ${productName} <br>
                              Количество: ${quantityNumber} шт. <br>
                              Общая стоимость: ${formattedTotal} руб.`;
        
        resultDiv.classList.remove('hidden');
    }
    
    // Назначаем обработчик события на кнопку
    calculateBtn.addEventListener('click', calculateTotal);
    
    // Дополнительно: обработчик нажатия Enter в поле ввода
    quantityInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            calculateTotal();
        }
    });
    
    // Очистка ошибки при начале ввода
    quantityInput.addEventListener('input', function() {
        if (errorDiv.classList.contains('hidden') === false) {
            errorDiv.classList.add('hidden');
        }
    });
});