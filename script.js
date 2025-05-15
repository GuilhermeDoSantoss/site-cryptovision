document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    
    // Garante que o preloader seja escondido mesmo se algumas imagens falharem
    const loadPromise = new Promise((resolve) => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve);
        }
    });

    loadPromise.then(() => {
        setTimeout(() => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    preloader.style.display = 'none';
                }
            });
        }, 1000);
    });

    // Cursor Personalizado
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: 'power1.out'
        });
        
        gsap.to(cursorFollower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3,
            ease: 'power1.out'
        });
    });
    
    // Efeito no hover dos links
    const hoverElements = document.querySelectorAll('a, button, .service-card, .market-card, .feature');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 3, duration: 0.3 });
            gsap.to(cursorFollower, { scale: 0.5, duration: 0.3 });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
            gsap.to(cursorFollower, { scale: 1, duration: 0.3 });
        });
    });

    // Menu Mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Animação do menu toggle
        if (menuToggle.classList.contains('active')) {
            gsap.from(navLinks.querySelectorAll('li'), {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.3,
                ease: 'power1.out'
            });
        }
    });

    // Scroll Suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                gsap.to(window, {
                    scrollTo: {
                        y: targetElement,
                        offsetY: 80
                    },
                    duration: 1,
                    ease: 'power2.inOut'
                });
                
                // Fechar menu mobile se estiver aberto
                if (navLinks.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Header Scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animação do Título do Hero com GSAP
    gsap.from('.title-word', {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5
    });

    // Animação da imagem do Bitcoin
    const bitcoinImg = document.querySelector('.bitcoin-3d img');
    if (bitcoinImg) {
        // Garante que a imagem está visível
        bitcoinImg.style.opacity = '1';
        
        // Animação de flutuação com GSAP
        gsap.to(bitcoinImg, {
            y: -20,
            rotation: 5,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    // Configuração avançada do Particles.js
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#f7931a"
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#f7931a",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }

    // Fetch Bitcoin Data
    async function fetchBitcoinData() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,cardano,solana');
            const data = await response.json();
            
            const marketCards = document.querySelector('.market-cards');
            marketCards.innerHTML = '';
            
            data.forEach((crypto, index) => {
                const change24h = crypto.price_change_percentage_24h;
                const changeClass = change24h >= 0 ? 'positive' : 'negative';
                const changeSymbol = change24h >= 0 ? '+' : '';
                
                const card = document.createElement('div');
                card.className = 'market-card';
                card.innerHTML = `
                    <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
                    <div class="price">$${crypto.current_price.toLocaleString()}</div>
                    <div class="change ${changeClass}">${changeSymbol}${change24h.toFixed(2)}%</div>
                `;
                
                marketCards.appendChild(card);
                
                // Animação de entrada dos cards
                gsap.from(card, {
                    y: 50,
                    opacity: 0,
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: 'power1.out'
                });
            });
        } catch (error) {
            console.error('Error fetching crypto data:', error);
        }
    }
    
    fetchBitcoinData();
    
    // Atualizar dados a cada 5 minutos
    setInterval(fetchBitcoinData, 300000);

    // Animação de Scroll com GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Animação para todas as seções
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    });
    
    // Animação para elementos específicos
    gsap.utils.toArray('.feature, .service-card, .info-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.5,
            delay: i * 0.1,
            ease: 'power1.out'
        });
    });

    // Efeito de digitação no subtítulo (opcional)
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        
        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, 20);
    }
});

// Animação da imagem do Bitcoin com GSAP
const bitcoinImg = document.querySelector('.bitcoin-3d img');
if (bitcoinImg) {
    // Configuração inicial
    bitcoinImg.style.opacity = '1';
    bitcoinImg.style.willChange = 'transform'; // Otimização de performance
    
    // Animação principal
    gsap.to(bitcoinImg, {
        y: -15,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Animação no hover
    bitcoinImg.addEventListener('mouseenter', () => {
        gsap.to(bitcoinImg, {
            scale: 1.1,
            duration: 0.3,
            boxShadow: '0 0 50px rgba(247, 147, 26, 0.7)',
            borderColor: 'rgba(247, 147, 26, 0.7)'
        });
    });
    
    bitcoinImg.addEventListener('mouseleave', () => {
        gsap.to(bitcoinImg, {
            scale: 1,
            duration: 0.3,
            boxShadow: '0 0 30px rgba(247, 147, 26, 0.4)',
            borderColor: 'rgba(247, 147, 26, 0.3)'
        });
    });
}
