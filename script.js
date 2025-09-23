// script.js

document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA SIMPLES PARA O CARROSSEL DO BANNER ---
    const slides = document.querySelectorAll('.banner-slide');
    let currentSlide = 0;
    const slideInterval = 7000; // Muda a cada 7 segundos

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Inicia o carrossel se houver mais de um slide
    if (slides.length > 1) {
        setInterval(nextSlide, slideInterval);
    }
});


function login() {
    // Simula o login
    document.getElementById('btnLogin').classList.add('hide');
    document.getElementById('btnLogout').classList.remove('hide');
    document.getElementById('dlgLogin').showModal()
    showToast('Login realizado com sucesso!');
}

function logout() {
    // Simula o logout
    document.getElementById('btnLogin').classList.remove('hide');
    document.getElementById('btnLogout').classList.add('hide');
    showToast('Logout realizado com sucesso!');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hide');
    setTimeout(()=>toast.classList.add('hide'),1800)
}
function cancel(seletor) {
    document.getElementById(seletor).close()
    showToast('Login cancelado!');
}

function paginaProjetos() {
        document.getElementById('pgProjetos').showModal()

}