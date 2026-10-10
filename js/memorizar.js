import { librosAntiguoTestamento, librosNuevoTestamento } from './biblia.js';

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

const sinDatos = document.getElementById('sin-datos');
const memorizarContent = document.getElementById('memorizar-content');
const versoInfo = document.getElementById('verso-info');
const progresoText = document.getElementById('progreso-text');
const tiempoRestante = document.getElementById('tiempo-restante');
const erroresText = document.getElementById('errores-count');
const versoArea = document.getElementById('verso-area');
const mensajeResultado = document.getElementById('mensaje-resultado');
const btnCheck = document.getElementById('btn-check');
const btnReset = document.getElementById('btn-reset');
const selectorLibro = document.getElementById('selector-libro');
const selectorCapitulo = document.getElementById('selector-capitulo');
const listaVersiculos = document.getElementById('lista-versiculos');
const selectorMensaje = document.getElementById('selector-mensaje');
const btnAgregarVersiculos = document.getElementById('agregar-versiculos');
const selectorVersiculosPanel = document.getElementById('selector-versiculos-panel');

let versos = cargarLocalStorageArray('memorizarVersiculos');
let currentIndex = 0;
let roundNumber = 1;
let erroresVersiculo = 0;
let currentTokens = [];
let totalPalabras = 0;
let currentVerse = null;
let capitulosActuales = [];
let temporizadorLectura = null;
let temporizadorAvance = null;
let inicioLectura = 0;
const DURACION_LECTURA_MS = 2 * 60 * 1000;

btnCheck?.addEventListener('click', verificarRespuestas);
btnReset?.addEventListener('click', reiniciarVerso);
inicializarSelectorVersiculos();
selectorLibro?.addEventListener('change', cargarCapitulosLibro);
selectorCapitulo?.addEventListener('change', mostrarVersiculosParaSeleccion);
btnAgregarVersiculos?.addEventListener('click', agregarVersiculosSeleccionados);

function obtenerIndiceSeleccionado() {
    const parametros = new URLSearchParams(window.location.search);
    const valor = Number(parametros.get('index'));
    return Number.isInteger(valor) && valor >= 0 && valor < versos.length ? valor : 0;
}

if (!versos.length) {
    sinDatos.style.display = 'block';
    memorizarContent.style.display = 'none';
} else {
    currentIndex = obtenerIndiceSeleccionado();
    sinDatos.style.display = 'none';
    memorizarContent.style.display = 'block';
    iniciarVerso();
}

function inicializarSelectorVersiculos() {
    if (!selectorLibro) return;

    [...librosAntiguoTestamento, ...librosNuevoTestamento].forEach((libro, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = libro.nombre;
        selectorLibro.appendChild(option);
    });
}

async function cargarCapitulosLibro() {
    selectorCapitulo.innerHTML = '<option value="">Cargando capítulos...</option>';
    selectorCapitulo.disabled = true;
    listaVersiculos.innerHTML = '';
    btnAgregarVersiculos.disabled = true;
    selectorMensaje.textContent = '';
    capitulosActuales = [];

    const libros = [...librosAntiguoTestamento, ...librosNuevoTestamento];
    const libro = libros[Number(selectorLibro.value)];
    if (!libro) {
        selectorCapitulo.innerHTML = '<option value="">Selecciona un capítulo</option>';
        return;
    }

    try {
        const modulo = await import(libro.archivo);
        const datos = modulo.default || modulo.libro;
        const capitulos = Array.isArray(datos) ? datos : datos?.capitulos;
        if (!Array.isArray(capitulos) || !capitulos.length) {
            throw new Error(`El libro ${libro.nombre} no contiene capítulos válidos.`);
        }

        selectorCapitulo.innerHTML = '<option value="">Selecciona un capítulo</option>';
        capitulos.forEach((_, index) => {
            const option = document.createElement('option');
            option.value = String(index);
            option.textContent = `Capítulo ${index + 1}`;
            selectorCapitulo.appendChild(option);
        });
        selectorCapitulo.disabled = false;
        selectorCapitulo.dataset.libro = libro.nombre;
        capitulosActuales = capitulos;
    } catch (error) {
        console.error('No se pudo cargar el libro para seleccionar versículos:', error);
        selectorCapitulo.innerHTML = '<option value="">No se pudo cargar el libro</option>';
        capitulosActuales = [];
        selectorMensaje.textContent = 'No se pudo cargar este libro. Intenta seleccionar otro.';
    }
}

function mostrarVersiculosParaSeleccion() {
    listaVersiculos.innerHTML = '';
    btnAgregarVersiculos.disabled = true;

    if (selectorCapitulo.value === '') return;

    const indiceCapitulo = Number(selectorCapitulo.value);
    const contenido = capitulosActuales[indiceCapitulo];
    if (!Array.isArray(contenido)) return;

    const libro = selectorCapitulo.dataset.libro;
    const capitulo = indiceCapitulo + 1;
    contenido.forEach((texto, index) => {
        const label = document.createElement('label');
        label.className = 'selector-versiculo';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = String(index + 1);
        checkbox.addEventListener('change', actualizarEstadoAgregar);

        const referencia = document.createElement('strong');
        referencia.textContent = `${capitulo}:${index + 1}`;

        const contenidoVerso = document.createElement('span');
        contenidoVerso.textContent = ` ${texto}`;

        label.append(checkbox, referencia, contenidoVerso);
        listaVersiculos.appendChild(label);
    });
}

function actualizarEstadoAgregar() {
    btnAgregarVersiculos.disabled = !listaVersiculos.querySelector('input:checked');
}

function agregarVersiculosSeleccionados() {
    const libro = selectorCapitulo.dataset.libro;
    const capitulo = Number(selectorCapitulo.value) + 1;
    const textos = capitulosActuales[capitulo - 1];
    const seleccionados = Array.from(listaVersiculos.querySelectorAll('input:checked'));

    if (!libro || !Array.isArray(textos) || !seleccionados.length) return;

    const nuevasReferencias = seleccionados.map((checkbox) => ({
        libro,
        capitulo,
        verso: Number(checkbox.value),
        texto: textos[Number(checkbox.value) - 1]
    }));
    const clavesExistentes = new Set(versos.map(verso => `${verso.libro}|${verso.capitulo}|${verso.verso}`));
    const versosNuevos = nuevasReferencias.filter((verso) => {
        const clave = `${verso.libro}|${verso.capitulo}|${verso.verso}`;
        return !clavesExistentes.has(clave);
    });

    if (!versosNuevos.length) {
        selectorMensaje.textContent = 'Los versículos seleccionados ya están en la práctica.';
        return;
    }

    versos = [...versos, ...versosNuevos];
    localStorage.setItem('memorizarVersiculos', JSON.stringify(versos));
    currentIndex = versos.length - versosNuevos.length;
    sinDatos.style.display = 'none';
    memorizarContent.style.display = 'block';
    iniciarVerso();
    selectorMensaje.textContent = `${versosNuevos.length} versículo(s) agregado(s) a la práctica.`;
    selectorVersiculosPanel.open = false;
    listaVersiculos.querySelectorAll('input:checked').forEach(checkbox => {
        checkbox.checked = false;
    });
    actualizarEstadoAgregar();
}

function iniciarVerso() {
    detenerTemporizadorLectura();
    if (temporizadorAvance !== null) {
        window.clearTimeout(temporizadorAvance);
        temporizadorAvance = null;
    }
    erroresVersiculo = 0;
    actualizarErrores();
    currentVerse = versos[currentIndex];
    currentTokens = tokenizarVerso(currentVerse.texto);
    totalPalabras = currentTokens.filter(token => token.isWord).length;
    roundNumber = 1;
    renderizarVerso();
    actualizarProgreso();
    mensajeResultado.textContent = 'Memoriza el versículo completo antes de comenzar.';
    mensajeResultado.className = 'mensaje-resultado mensaje-neutral';
    btnCheck.disabled = true;
    iniciarTemporizadorLectura();
}

function iniciarTemporizadorLectura() {
    inicioLectura = Date.now();
    actualizarTiempoRestante();
    temporizadorLectura = window.setInterval(actualizarTiempoRestante, 250);
}

function actualizarTiempoRestante() {
    const restante = Math.max(0, DURACION_LECTURA_MS - (Date.now() - inicioLectura));
    const segundos = Math.ceil(restante / 1000);
    const minutosTexto = String(Math.floor(segundos / 60)).padStart(2, '0');
    const segundosTexto = String(segundos % 60).padStart(2, '0');
    tiempoRestante.textContent = `Tiempo para memorizar: ${minutosTexto}:${segundosTexto}`;

    if (restante === 0) {
        detenerTemporizadorLectura();
        ocultarPalabras();
        renderizarVerso();
        mensajeResultado.textContent = '¡Se acabó el tiempo! Completa las palabras ocultas.';
        mensajeResultado.className = 'mensaje-resultado mensaje-neutral';
        btnCheck.disabled = false;
    }
}

function detenerTemporizadorLectura() {
    if (temporizadorLectura !== null) {
        window.clearInterval(temporizadorLectura);
        temporizadorLectura = null;
    }
}

function tokenizarVerso(texto) {
    const partes = texto.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+|[^\sA-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+/g) || [texto];
    return partes.map(parte => ({
        text: parte,
        isWord: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+$/.test(parte),
        hidden: false
    }));
}

function ocultarPalabras() {
    const palabras = currentTokens.filter(token => token.isWord && !token.hidden);
    const ocultasActuales = currentTokens.filter(token => token.isWord && token.hidden).length;
    const objetivo = Math.min(3 + (roundNumber - 1) * 2, totalPalabras);
    const faltan = objetivo - ocultasActuales;
    if (faltan <= 0) {
        return;
    }

    const candidatos = palabras.slice();
    shuffle(candidatos);
    candidatos.slice(0, faltan).forEach(token => token.hidden = true);
}

function renderizarVerso() {
    versoArea.innerHTML = '';

    currentTokens.forEach((token, index) => {
        if (token.isWord && token.hidden) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'memorizacion-input';
            input.dataset.index = index;
            input.placeholder = '...';
            input.autocomplete = 'off';
            
            // Agregar listener para Enter y pasar al siguiente input
            input.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    const inputs = Array.from(versoArea.querySelectorAll('input[data-index]'));
                    const currentInputIndex = inputs.indexOf(input);
                    
                    if (currentInputIndex >= 0 && currentInputIndex < inputs.length - 1) {
                        // Hay siguiente input, hacer focus
                        inputs[currentInputIndex + 1].focus();
                    } else if (currentInputIndex === inputs.length - 1) {
                        // Es el último input, hacer focus al botón de verificar
                        btnCheck.focus();
                    }
                }
            });
            
            versoArea.appendChild(input);
        } else {
            const span = document.createElement('span');
            span.className = 'verso-texto';
            span.textContent = token.text;
            versoArea.appendChild(span);
        }
        versoArea.appendChild(document.createTextNode(' '));
    });
}

function verificarRespuestas() {
    if (!currentTokens.length) return;

    const inputs = Array.from(versoArea.querySelectorAll('input[data-index]'));
    if (!inputs.length) {
        mensajeResultado.textContent = 'No hay palabras ocultas. Haz clic en reiniciar para practicar otra vez.';
        mensajeResultado.className = 'mensaje-resultado mensaje-neutral';
        return;
    }

    let respuestasCorrectas = true;
    let erroresEnIntento = 0;

    inputs.forEach(input => {
        const index = Number(input.dataset.index);
        const token = currentTokens[index];
        const valor = normalizarTexto(input.value);
        const esperado = normalizarTexto(token.text);
        if (valor === esperado && valor.length > 0) {
            input.classList.remove('input-incorrecto');
            input.classList.add('input-correcto');
        } else {
            input.classList.remove('input-correcto');
            input.classList.add('input-incorrecto');
            respuestasCorrectas = false;
            if (valor.length > 0) {
                erroresEnIntento += 1;
            }
        }
    });

    if (!respuestasCorrectas) {
        erroresVersiculo += erroresEnIntento;
        actualizarErrores();
        mensajeResultado.textContent = 'Revisa las palabras marcadas en rojo y vuelve a intentar.';
        mensajeResultado.className = 'mensaje-resultado mensaje-error';
        return;
    }

    if (estaCompleto()) {
        mensajeResultado.textContent = '¡Muy bien! Has memorizado este verso.';
        mensajeResultado.className = 'mensaje-resultado mensaje-exito';
        btnCheck.disabled = true;
        temporizadorAvance = window.setTimeout(() => {
            temporizadorAvance = null;
            avanzarVerso();
        }, 1000);
        return;
    }

    mensajeResultado.textContent = 'Correcto. Preparando siguiente nivel...';
    mensajeResultado.className = 'mensaje-resultado mensaje-exito';
    btnCheck.disabled = true;

    setTimeout(() => {
        roundNumber += 1;
        ocultarPalabras();
        renderizarVerso();
        actualizarProgreso();
        mensajeResultado.textContent = '';
        btnCheck.disabled = false;
    }, 1000);
}

function estaCompleto() {
    return currentTokens.filter(token => token.isWord).every(token => token.hidden);
}

function avanzarVerso() {
    const completoCiclo = currentIndex === versos.length - 1;
    currentIndex = (currentIndex + 1) % versos.length;
    iniciarVerso();

    if (completoCiclo) {
        mensajeResultado.textContent = '¡Terminaste todos los versículos! Empezamos de nuevo.';
        mensajeResultado.className = 'mensaje-resultado mensaje-exito';
    }
}

function reiniciarVerso() {
    iniciarVerso();
}

function actualizarProgreso() {
    progresoText.textContent = `Verso ${currentIndex + 1} de ${versos.length} · Nivel ${roundNumber}`;
    versoInfo.textContent = `${currentVerse.libro} ${currentVerse.capitulo}:${currentVerse.verso}`;
}

function actualizarErrores() {
    erroresText.textContent = `Errores en este versículo: ${erroresVersiculo}`;
}

function normalizarTexto(texto) {
    return texto.trim().toLowerCase().replace(/\s+/g, ' ');
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
