import './style.css'

document.addEventListener('DOMContentLoaded', () => {
    // Load Navbar
    fetch('/components/nav.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar-container').innerHTML = html;
            
            // Re-initialize mobile menu logic dynamically after insertion
            const menuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            let isMenuOpen = false;

            if (menuBtn && mobileMenu) {
                menuBtn.addEventListener('click', () => {
                    isMenuOpen = !isMenuOpen;
                    if (isMenuOpen) {
                        mobileMenu.classList.remove('hidden');
                        // Small timeout to allow display:block to apply before animating opacity
                        setTimeout(() => {
                            mobileMenu.classList.remove('opacity-0', '-translate-y-4');
                            mobileMenu.classList.add('opacity-100', 'translate-y-0');
                        }, 10);
                        menuBtn.querySelector('span').textContent = 'close';
                    } else {
                        mobileMenu.classList.add('opacity-0', '-translate-y-4');
                        mobileMenu.classList.remove('opacity-100', 'translate-y-0');
                        setTimeout(() => {
                            mobileMenu.classList.add('hidden');
                        }, 300); // Wait for transition
                        menuBtn.querySelector('span').textContent = 'menu';
                    }
                });
            }
        });

    // Load Footer
    fetch('/components/footer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('footer-container').innerHTML = html;
        });

    // Add scroll reveal observer for sophisticated animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-12');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    // We use setTimeout to ensure elements injected later (if any) are caught, but mostly works for immediate dom
    setTimeout(() => {
        document.querySelectorAll('.scroll-reveal').forEach((el) => {
            el.classList.add('transition-all', 'duration-[1000ms]', 'opacity-0', 'translate-y-12', 'ease-out');
            observer.observe(el);
        });
    }, 100);
});
