//sc_principal.js

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

//................................................................
//sc_inscripcion.js

// Funciones para el modal de inscripción
function openInscripcionModal() {
    const modal = document.getElementById('inscripcionModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeInscripcionModal() {
    const modal = document.getElementById('inscripcionModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

//................................................................

document.getElementById('inscripcionForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir envío tradicional

    // Capturar valores
    const nombre = document.querySelector('input[name="nombre"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const telefono = document.querySelector('input[name="telefono"]').value.trim();

    // Validación de nombre (mínimo 2 palabras)
    if (nombre.split(' ').length < 2) {
        alert('Por favor, ingrese nombre y apellido completos');
        return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingrese un correo electrónico válido');
        return;
    }

    // Validación de teléfono (ejemplo para número peruano)
    const telefonoRegex = /^9\d{8}$/;
    if (!telefonoRegex.test(telefono)) {
        alert('Por favor, ingrese un número de teléfono válido (9 dígitos)');
        return;
    }

    // Envío con AJAX
    const formData = new FormData(this);
    
    fetch('procesar_inscripcion.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert(data.message);
            closeInscripcionModal(); // Cerrar modal
            // Limpiar formulario
            this.reset();
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema con la inscripción');
    });
});

//------------------------------------------------------------------
// Manejo de términos y condiciones
document.getElementById('terminos')?.addEventListener('change', function() {
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = !this.checked;
    if (this.checked) {
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');
    }
});


//................................................................

//Malla_curricular_desplegable
function toggleCollapse(id) {
    const element = document.getElementById(id);
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}
//................................................................

//sc_costos.js

// Costo base inicial
const costoBase = 6000; // El costo base inicial de S/. 6,000
document.getElementById("costoBase").textContent = `S/. ${costoBase}`;
document.getElementById("costoFinal").textContent = `S/. ${costoBase}`;


// Función para calcular el descuento
function calcularDescuento() {
    const tipoPago = document.getElementById("tipoPago").value;
    const descuento = document.getElementById("descuento").value;
    let descuentoAplicado = 0;

    // Habilita o deshabilita el campo de descuento en función del tipo de pago seleccionado
    const descuentoSelect = document.getElementById("descuento");
    if (tipoPago === "cuotas") {
        descuentoSelect.disabled = true;
        descuentoSelect.value = "sin_descuento"; // Reinicia a "Sin descuento" si es pago en cuotas
    } else {
        descuentoSelect.disabled = false;
    }

    // Solo aplica el descuento si es pago único
    if (tipoPago === "unico") {
        if (descuento === "anticipado") {
            descuentoAplicado = costoBase * 0.10; // 10% de descuento
        } else if (descuento === "estudiante") {
            descuentoAplicado = costoBase * 0.15; // 15% de descuento
        }
    }

    // Calcula el costo total con el descuento aplicado
    let costoTotal = costoBase - descuentoAplicado;

    // Muestra el total para pago en cuotas o único
    if (tipoPago === "cuotas") {
        const cuotaMensual = costoTotal / 3; // Divide en 3 cuotas mensuales
        document.getElementById("cuotasInfo").classList.remove("hidden");
        document.getElementById("cuotaMensual").textContent = `S/. ${cuotaMensual.toFixed(2)}`;
    } else {
        document.getElementById("cuotasInfo").classList.add("hidden");
    }

    // Actualiza el DOM con los valores calculados
    document.getElementById("ahorro").textContent = `-S/. ${descuentoAplicado.toFixed(2)}`;
    document.getElementById("costoFinal").textContent = `S/. ${costoTotal.toFixed(2)}`;
}

// Escucha los cambios en los selectores para actualizar el costo
document.getElementById("tipoPago").addEventListener("change", calcularDescuento);
document.getElementById("descuento").addEventListener("change", calcularDescuento);

// Llama a la función de cálculo inicial para establecer los valores en la página al cargar
calcularDescuento();


//................................................................

//sc_bot.js

function toggleChat() {
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer.style.display === 'none' || !chatContainer.style.display) {
        chatContainer.style.display = 'flex';
        // Agregar mensaje de bienvenida si es la primera vez
        if (chatContainer.querySelector('.chat-messages').children.length === 0) {
            addMessage('¡Hola! ¿En qué puedo ayudarte?', 'bot-message');
        }
    } else {
        chatContainer.style.display = 'none';
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message) {
        addMessage(message, 'user-message');
        userInput.value = '';
        
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addMessage(botResponse, 'bot-message');
        }, 1000);
    }
}

function addMessage(message, className) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(message) {
    message = message.toLowerCase();
    
    if (message.includes('hola')) {
        return '¡Hola! ¿En qué puedo ayudarte hoy?';
    } else if (message.includes('información')) {
        return '¡Claro! ¿Sobre qué tema específico necesitas información?';
    } else if (message.includes('precio') || message.includes('costo')) {
        return 'Nuestros precios varían según el servicio. ¿Te gustaría que un asesor te contacte con más detalles?';
    } else if (message.includes('gracias')) {
        return '¡De nada! ¿Hay algo más en lo que pueda ayudarte?';
    } else if (message.includes('adios') || message.includes('adiós')) {
        return '¡Hasta luego! Gracias por tu interés. ¡Que tengas un excelente día!';
    } else {
        return 'Entiendo tu consulta. ¿Te gustaría que un asesor se comunique contigo para brindarte información más detallada?';
    }
}

//................................................................



