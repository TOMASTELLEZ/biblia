// 1. Leer qué libro seleccionó el usuario desde la URL
const parametrosURL = new URLSearchParams(window.location.search);
const rutaLibro = parametrosURL.get('libro');
const nombreLibroSeleccionado = parametrosURL.get('nombre');
const capituloSeleccionado = parametrosURL.get('capitulo');
const versoSeleccionado = parametrosURL.get('verso');

// 2. Referencias al HTML
const tituloLibro = document.getElementById('titulo-libro');
const contenedorLectura = document.getElementById('contenedor-lectura');
const selectCapitulo = document.getElementById('select-capitulo');
const controlesCapitulos = document.getElementById('controles-capitulos');
const seleccionBar = document.getElementById('seleccion-bar');
const seleccionInfo = document.getElementById('seleccion-info');
const btnMemorizar = document.getElementById('btn-memorizar');
const btnLimpiar = document.getElementById('btn-limpiar');

// Variable para guardar el libro completo una vez cargado
let libroActual = null;
let rutaActual = '';
let nombreLibroActual = '';
let capituloMeta = null;
let versoMeta = null;

function cargarLocalStorageArray(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.warn(`No se pudo leer "${key}" desde localStorage:`, error);
        return [];
    }
}

const seleccionados = new Set(cargarLocalStorageArray('seleccionadosVersiculos'));
const favoritos = new Set(cargarLocalStorageArray('favoritosVersiculos'));

document.addEventListener('DOMContentLoaded', () => {
    seleccionados.clear();
    localStorage.removeItem('seleccionadosVersiculos');
    localStorage.removeItem('memorizarVersiculos');

    if (!rutaLibro) {
        mostrarError("No se ha seleccionado ningún libro.");
        return;
    }
    rutaActual = rutaLibro;
    nombreLibroActual = nombreLibroSeleccionado || obtenerNombreDesdeRuta(rutaLibro);
    capituloMeta = capituloSeleccionado ? Number(capituloSeleccionado) - 1 : null;
    versoMeta = versoSeleccionado ? Number(versoSeleccionado) - 1 : null;
    cargarLibro(rutaLibro);

    if (btnMemorizar) {
        btnMemorizar.addEventListener('click', memorizarSeleccionados);
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarSeleccion);
    }
});

function normalizarRutaParaImport(ruta) {
    if (!ruta) return ruta;
    if (ruta.startsWith('http://') || ruta.startsWith('https://') || ruta.startsWith('/') || ruta.startsWith('file:')) {
        return ruta;
    }

    const rutaBase = window.location.href;

    if (!ruta.startsWith('.')) {
        if (ruta.includes('procesados/')) {
            ruta = `../${ruta}`;
        } else {
            ruta = `../procesados/${ruta}`;
        }
    }

    try {
        return new URL(ruta, rutaBase).href;
    } catch (error) {
        return ruta;
    }
}

function obtenerNombreDesdeRuta(ruta) {
    if (!ruta) return 'Libro';
    const partes = ruta.split('/');
    let nombre = partes[partes.length - 1] || partes[partes.length - 2] || '';
    nombre = nombre.replace('.js', '').replace(/_/g, ' ');
    return nombre
        .split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
}

// 3. Función para importar el archivo dinámicamente
async function cargarLibro(ruta) {
    try {
        const rutaImport = normalizarRutaParaImport(ruta);
        const modulo = await import(rutaImport);
        const datosImportados = modulo.default || modulo.libro;

        if (!datosImportados) {
            throw new Error("El archivo del libro no exporta datos válidos.");
        }

        if (Array.isArray(datosImportados)) {
            libroActual = {
                nombre: nombreLibroSeleccionado || obtenerNombreDesdeRuta(ruta),
                capitulos: datosImportados
            };
        } else if (datosImportados.capitulos && Array.isArray(datosImportados.capitulos)) {
            libroActual = {
                nombre: datosImportados.nombre || nombreLibroSeleccionado || obtenerNombreDesdeRuta(ruta),
                capitulos: datosImportados.capitulos
            };
        } else {
            throw new Error("El archivo del libro no tiene el formato esperado.");
        }

        if (!libroActual.capitulos || !libroActual.capitulos.length) {
            throw new Error("El libro no contiene capítulos.");
        }

        // Configurar la pantalla
        tituloLibro.textContent = libroActual.nombre;
        prepararSelectorCapitulos(libroActual.capitulos.length);
        
        // Mostrar el capítulo inicial o el capítulo 1 por defecto
        const indiceCapitulo = Number.isInteger(capituloMeta) && capituloMeta >= 0 && capituloMeta < libroActual.capitulos.length
            ? capituloMeta
            : 0;
        mostrarCapitulo(indiceCapitulo);
        selectCapitulo.value = indiceCapitulo;
        actualizarSeleccionBar(); 

    } catch (error) {
        console.error("Error al cargar:", error);
        mostrarError(`No se pudo cargar el archivo: ${ruta}. <br><b>Nota:</b> Recuerda usar Live Server.`);
    }
}

// 4. Llenar el selector (dropdown) con la cantidad de capítulos
function prepararSelectorCapitulos(totalCapitulos) {
    controlesCapitulos.style.display = "block";
    selectCapitulo.innerHTML = ""; // Limpiar antes de llenar

    for (let i = 0; i < totalCapitulos; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Capítulo ${i + 1}`;
        selectCapitulo.appendChild(option);
    }

    // Escuchar cuando el usuario cambie de capítulo
    selectCapitulo.addEventListener('change', (e) => {
        capituloMeta = null;
        versoMeta = null;
        mostrarCapitulo(parseInt(e.target.value));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 5. Pinta los versículos del capítulo seleccionado en el HTML
function mostrarCapitulo(indiceCapitulo) {
    const versiculos = libroActual.capitulos[indiceCapitulo];
    contenedorLectura.innerHTML = "";

    const tarjetaCapitulo = document.createElement('article');
    tarjetaCapitulo.className = 'capitulo-card';
    tarjetaCapitulo.dataset.capitulo = String(indiceCapitulo + 1);

    versiculos.forEach((texto, index) => {
        const claveVerso = generarClaveVerso(indiceCapitulo + 1, index + 1);
        const filaVerso = document.createElement('div');
        filaVerso.className = 'versiculo-fila';
        filaVerso.dataset.clave = claveVerso;
        filaVerso.dataset.versoIndex = String(index);

        if (seleccionados.has(claveVerso)) {
            filaVerso.classList.add('seleccionado');
        }
        filaVerso.classList.toggle('favorito', favoritos.has(claveVerso));

        const numero = document.createElement('span');
        numero.className = 'numero-verso';
        numero.textContent = `${index + 1}`;

        const textoVerso = document.createElement('p');
        textoVerso.className = 'texto-verso';
        textoVerso.textContent = texto;

        const favoritoIcono = document.createElement('button');
        favoritoIcono.type = 'button';
        favoritoIcono.className = 'favorito-indicator';
        favoritoIcono.title = 'Quitar de favoritos';
        favoritoIcono.innerHTML = '<i class="fa-solid fa-star"></i>';
        favoritoIcono.style.display = favoritos.has(claveVerso) ? 'inline-flex' : 'none';
        favoritoIcono.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleFavorito(claveVerso);
            syncFavoritosVisuales();
        });

        filaVerso.appendChild(numero);
        filaVerso.appendChild(textoVerso);
        filaVerso.appendChild(favoritoIcono);

        filaVerso.addEventListener('click', (event) => {
            event.preventDefault();
            toggleSeleccionVerso(claveVerso);
        });

        filaVerso.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            mostrarMenuContextual(event, claveVerso);
        });

        tarjetaCapitulo.appendChild(filaVerso);
    });

    contenedorLectura.appendChild(tarjetaCapitulo);

    if (capituloMeta === indiceCapitulo && Number.isInteger(versoMeta) && versoMeta >= 0) {
        marcarVersoComoDestacado(versoMeta);
    }

    actualizarSeleccionBar();
}

function marcarVersoComoDestacado(index) {
    document.querySelectorAll('.verso-item').forEach(item => item.classList.remove('verso-destacado'));
    const destino = document.querySelector(`.verso-item[data-verso-index="${index}"]`);
    if (destino) {
        destino.classList.add('verso-destacado');
        destino.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function mostrarError(mensaje) {
    tituloLibro.textContent = "Error";
    contenedorLectura.innerHTML = `<p style="color:red; text-align:center;">${mensaje}</p>`;
}

function generarClaveVerso(capitulo, verso) {
    return `${nombreLibroActual}|${capitulo}|${verso}`;
}

function toggleSeleccionVerso(clave) {
    const estabaSeleccionado = seleccionados.has(clave);

    if (estabaSeleccionado) {
        seleccionados.delete(clave);
    } else {
        seleccionados.add(clave);
    }

    guardarSeleccionados();
    document.querySelectorAll('.versiculo-fila').forEach((fila) => {
        fila.classList.toggle('seleccionado', seleccionados.has(fila.dataset.clave));
    });
    actualizarSeleccionBar();

    if (!estabaSeleccionado) {
        const fila = document.querySelector(`.versiculo-fila[data-clave="${CSS.escape(clave)}"]`);
        if (fila) {
            const rect = fila.getBoundingClientRect();
            mostrarMenuContextual({
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            }, clave);
        }
    }
}

function guardarSeleccionados() {
    localStorage.setItem('seleccionadosVersiculos', JSON.stringify(Array.from(seleccionados)));
}

function toggleFavorito(clave) {
    if (favoritos.has(clave)) {
        favoritos.delete(clave);
    } else {
        favoritos.add(clave);
    }
    localStorage.setItem('favoritosVersiculos', JSON.stringify(Array.from(favoritos)));
}

function syncFavoritosVisuales() {
    document.querySelectorAll('.versiculo-fila').forEach((fila) => {
        const estrella = fila.querySelector('.favorito-indicator');
        if (!estrella) return;

        const clave = fila.dataset.clave;
        const esFavorito = favoritos.has(clave);
        fila.classList.toggle('favorito', esFavorito);
        estrella.style.display = esFavorito ? 'inline-flex' : 'none';
        estrella.classList.toggle('activo', esFavorito);
        estrella.innerHTML = '<i class="fa-solid fa-star"></i>';
        estrella.title = 'Quitar de favoritos';
    });
}

let menuContextualActivo = null;

function cerrarMenuContextual() {
    if (menuContextualActivo && menuContextualActivo.parentNode) {
        menuContextualActivo.remove();
    }
    menuContextualActivo = null;
}

function mostrarMenuContextual(event, claveBase) {
    cerrarMenuContextual();

    const menu = document.createElement('div');
    menu.className = 'verso-context-menu';

    const listaClaves = seleccionados.size > 0 ? Array.from(seleccionados) : [claveBase];
    const todosFavoritos = listaClaves.length > 0 && listaClaves.every(clave => favoritos.has(clave));

    const memorizarBtn = document.createElement('button');
    memorizarBtn.type = 'button';
    memorizarBtn.textContent = listaClaves.length > 1 ? 'Memorizar seleccionados' : 'Memorizar versículo';
    memorizarBtn.addEventListener('click', () => {
        cerrarMenuContextual();
        memorizarClaves(listaClaves);
    });

    const favoritoBtn = document.createElement('button');
    favoritoBtn.type = 'button';
    favoritoBtn.textContent = todosFavoritos
        ? (listaClaves.length > 1 ? 'Quitar seleccionados de favoritos' : 'Quitar de favoritos')
        : (listaClaves.length > 1 ? 'Agregar seleccionados a favoritos' : 'Agregar a favoritos');
    favoritoBtn.addEventListener('click', () => {
        cerrarMenuContextual();
        toggleFavoritos(listaClaves);
    });

    const seleccionarBtn = document.createElement('button');
    seleccionarBtn.type = 'button';
    seleccionarBtn.textContent = seleccionados.has(claveBase) ? 'Quitar selección' : 'Seleccionar';
    seleccionarBtn.addEventListener('click', () => {
        cerrarMenuContextual();
        toggleSeleccionVerso(claveBase);
    });

    menu.appendChild(memorizarBtn);
    menu.appendChild(favoritoBtn);
    menu.appendChild(seleccionarBtn);
    document.body.appendChild(menu);

    const x = Math.min(window.innerWidth - menu.offsetWidth - 12, event.clientX);
    const y = Math.min(window.innerHeight - menu.offsetHeight - 12, event.clientY);
    menu.style.left = `${Math.max(12, x)}px`;
    menu.style.top = `${Math.max(12, y)}px`;
    menuContextualActivo = menu;
}

function toggleFavoritos(claves) {
    const clavesUnicas = [...new Set(claves.filter(Boolean))];
    const hayAlgunFavorito = clavesUnicas.some(clave => favoritos.has(clave));

    if (hayAlgunFavorito) {
        clavesUnicas.forEach(clave => favoritos.delete(clave));
    } else {
        clavesUnicas.forEach(clave => favoritos.add(clave));
    }

    localStorage.setItem('favoritosVersiculos', JSON.stringify(Array.from(favoritos)));
    syncFavoritosVisuales();
}

function memorizarClaves(claves) {
    const versos = [];

    const clavesUnicas = [...new Set(claves.filter(Boolean))];
    clavesUnicas.forEach(clave => {
        const [libro, capitulo, verso] = clave.split('|');
        const cap = Number(capitulo) - 1;
        const ver = Number(verso) - 1;

        if (libroActual?.capitulos?.[cap]?.[ver]) {
            versos.push({
                libro,
                capitulo: Number(capitulo),
                verso: Number(verso),
                texto: libroActual.capitulos[cap][ver]
            });
        }
    });

    if (!versos.length) {
        alert('No hay versículos para memorizar.');
        return;
    }

    localStorage.setItem('memorizarVersiculos', JSON.stringify([]));
    localStorage.setItem('memorizarVersiculos', JSON.stringify(versos));
    window.location.href = new URL('memorizar.html', window.location.href).href;
}

function actualizarSeleccionBar() {
    if (!seleccionInfo || !seleccionBar) {
        return;
    }

    const cantidad = seleccionados.size;
    seleccionInfo.textContent = `${cantidad} versículos seleccionados`;
    seleccionBar.style.display = cantidad > 0 ? 'flex' : 'none';

    if (btnMemorizar) {
        btnMemorizar.disabled = cantidad === 0;
    }
}

function limpiarSeleccion() {
    seleccionados.clear();
    guardarSeleccionados();
    actualizarSeleccionBar();
    document.querySelectorAll('.versiculo-fila').forEach(fila => fila.classList.remove('seleccionado'));
}

function memorizarSeleccionados() {
    const claves = Array.from(seleccionados);
    if (!claves.length) {
        alert('No hay versículos seleccionados para memorizar.');
        return;
    }

    memorizarClaves(claves);
}

document.addEventListener('click', cerrarMenuContextual);