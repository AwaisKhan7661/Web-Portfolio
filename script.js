document.addEventListener('DOMContentLoaded', async () => {
    const slidesWrapper = document.getElementById('slides-wrapper');
    const indicatorsContainer = document.getElementById('indicators');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentSlide = 0;
    let slidesData = [];
    let autoRotateInterval;


    try {
        const response = await fetch('data.json');
        slidesData = await response.json();
        initSlider();
    } catch (error) {
        console.error('Error fetching slide data:', error);
    }

    function initSlider() {
        slidesData.forEach((slide, index) => {

            const slideDiv = document.createElement('div');
            slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
            slideDiv.style.backgroundImage = `url(${slide.image})`;
            slideDiv.innerHTML = `
                <div class="slide-content">
                    <h2>${slide.title}</h2>
                    <p>${slide.description}</p>
                    <a href="${slide.link}" class="btn">${slide.cta}</a>
                </div>
            `;
            slidesWrapper.appendChild(slideDiv);


            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(dot);
        });

        startAutoRotate();
    }

    function updateSlider() {
        slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;


        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');

        slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
        resetAutoRotate();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slidesData.length;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slidesData.length) % slidesData.length;
        updateSlider();
    }

    function startAutoRotate() {
        autoRotateInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoRotate();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoRotate();
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });
});
