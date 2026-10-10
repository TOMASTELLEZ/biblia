const parametros = new URLSearchParams(window.location.search);
const rutaHimno = parametros.get('himno');
const nombreHimno = parametros.get('nombre');
const titulo = document.getElementById('titulo-himno');
const contenedorLetra = document.getElementById('letra-himno');
const botonScroll = document.getElementById('btn-scroll-himno');

let animacionDesplazamiento = null;
let inicioDesplazamiento = null;
let posicionInicial = 0;
let actualizacionLineaPendiente = false;

const patronAcorde = /^(?:[A-G](?:#|b)?(?:m|maj|min|dim|aug|sus|add)?\d*(?:\/[A-G](?:#|b)?(?:m)?\d*)?)(?:\s+(?:[A-G](?:#|b)?(?:m|maj|min|dim|aug|sus|add)?\d*(?:\/[A-G](?:#|b)?(?:m)?\d*)?))*$/;

function actualizarLineaActiva() {
    actualizacionLineaPendiente = false;
    const lineas = contenedorLetra.querySelectorAll('.letra-himno-linea:not(.letra-himno-acorde):not(.letra-himno-espacio)');
    const referencia = window.innerHeight * 0.42;
    let lineaActiva = null;
    let distanciaMinima = Infinity;

    lineas.forEach(linea => {
        const rectangulo = linea.getBoundingClientRect();
        if (rectangulo.bottom < 0 || rectangulo.top > window.innerHeight) return;

        const distancia = Math.abs((rectangulo.top + rectangulo.bottom) / 2 - referencia);
        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            lineaActiva = linea;
        }
    });

    contenedorLetra.querySelector('.letra-himno-linea.activa')?.classList.remove('activa');
    lineaActiva?.classList.add('activa');
}

function programarActualizacionLinea() {
    if (actualizacionLineaPendiente) return;
    actualizacionLineaPendiente = true;
    requestAnimationFrame(actualizarLineaActiva);
}

window.addEventListener('scroll', programarActualizacionLinea, { passive: true });
window.addEventListener('resize', programarActualizacionLinea);

function detenerDesplazamiento() {
    if (animacionDesplazamiento !== null) {
        cancelAnimationFrame(animacionDesplazamiento);
        animacionDesplazamiento = null;
    }
    inicioDesplazamiento = null;
    botonScroll.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i>';
    botonScroll.setAttribute('aria-label', 'Iniciar desplazamiento automático');
    botonScroll.setAttribute('title', 'Iniciar desplazamiento');
    botonScroll.setAttribute('aria-pressed', 'false');
}

function avanzarDesplazamiento(tiempo) {
    if (inicioDesplazamiento === null) {
        inicioDesplazamiento = tiempo;
    }

    const elementoDesplazable = document.scrollingElement;
    const maximo = elementoDesplazable.scrollHeight - elementoDesplazable.clientHeight;
    const segundos = (tiempo - inicioDesplazamiento) / 1000;
    const siguienteY = Math.min(Math.floor(posicionInicial + 12 * segundos), maximo);

    window.scrollTo(0, siguienteY);
    programarActualizacionLinea();

    if (siguienteY >= maximo || maximo <= 0) {
        detenerDesplazamiento();
        return;
    }

    animacionDesplazamiento = requestAnimationFrame(avanzarDesplazamiento);
}

function iniciarDesplazamientoAutomatico() {
    if (animacionDesplazamiento !== null) return;

    const elementoDesplazable = document.scrollingElement;
    const maximo = elementoDesplazable.scrollHeight - elementoDesplazable.clientHeight;
    if (window.scrollY >= maximo) {
        window.scrollTo(0, 0);
    }

    posicionInicial = window.scrollY;
    inicioDesplazamiento = null;
    botonScroll.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
    botonScroll.setAttribute('aria-label', 'Pausar desplazamiento automático');
    botonScroll.setAttribute('title', 'Pausar desplazamiento');
    botonScroll.setAttribute('aria-pressed', 'true');
    animacionDesplazamiento = requestAnimationFrame(avanzarDesplazamiento);
}

botonScroll.addEventListener('click', () => {
    if (animacionDesplazamiento === null) {
        iniciarDesplazamientoAutomatico();
    } else {
        detenerDesplazamiento();
    }
});

async function cargarHimno() {
    if (!rutaHimno || !titulo || !contenedorLetra) {
        throw new Error('No se indicó un himno para mostrar.');
    }

    const rutaImport = new URL(rutaHimno, window.location.href);
    const modulo = await import(rutaImport.href);
    const himno = modulo.default;

    if (!himno || typeof himno.letra !== 'string') {
        throw new Error('El archivo del himno no contiene una letra válida.');
    }

    titulo.textContent = nombreHimno || himno.nombre || 'Himno';
    const letra = document.createElement('div');
    letra.className = 'letra-himno';
    himno.letra.split(/\r?\n/).forEach(texto => {
        const linea = document.createElement('span');
        linea.className = 'letra-himno-linea';

        if (!texto.trim()) {
            linea.classList.add('letra-himno-espacio');
            linea.setAttribute('aria-hidden', 'true');
        } else if (/^coro$/i.test(texto.trim())) {
            linea.classList.add('letra-himno-seccion');
        } else if (patronAcorde.test(texto.trim())) {
            linea.classList.add('letra-himno-acorde');
        }

        linea.textContent = texto || '\u00a0';
        letra.appendChild(linea);
    });
    contenedorLetra.replaceChildren(letra);
    programarActualizacionLinea();
}

cargarHimno().catch(error => {
    console.error('Error al cargar el himno:', error);
    if (contenedorLetra) {
        contenedorLetra.textContent = 'No se pudo cargar la letra del himno.';
    }
});
