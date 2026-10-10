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

const memorizarVersiculos = cargarLocalStorageArray('memorizarVersiculos');
const favoritosVersiculos = cargarLocalStorageArray('favoritosVersiculos');

const pendientesCount = document.getElementById('pendientes-count');
const favoritosCount = document.getElementById('favoritos-count');
const pendientesList = document.getElementById('pendientes-list');
const favoritosList = document.getElementById('favoritos-list');
const continueSubtitle = document.getElementById('continue-subtitle');
const continueTitle = document.getElementById('continue-title');
const continueText = document.getElementById('continue-text');
const continueAction = document.getElementById('continue-action');

function normalizarNombreLibro(nombre) {
    return (nombre || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

const libroRutaMap = {
    [normalizarNombreLibro("Genesis")]: "../procesados/genesis.js",
    [normalizarNombreLibro("Exodo")]: "../procesados/exodo.js",
    [normalizarNombreLibro("Levitico")]: "../procesados/levitico.js",
    [normalizarNombreLibro("Numeros")]: "../procesados/numeros.js",
    [normalizarNombreLibro("Deuteronomio")]: "../procesados/deuteronomio.js",
    [normalizarNombreLibro("Josue")]: "../procesados/josue.js",
    [normalizarNombreLibro("Jueces")]: "../procesados/jueces.js",
    [normalizarNombreLibro("Rut")]: "../procesados/rut.js",
    [normalizarNombreLibro("1 Samuel")]: "../procesados/1_samuel.js",
    [normalizarNombreLibro("2 Samuel")]: "../procesados/2_samuel.js",
    [normalizarNombreLibro("1 Reyes")]: "../procesados/1_reyes.js",
    [normalizarNombreLibro("2 Reyes")]: "../procesados/2_reyes.js",
    [normalizarNombreLibro("1 Cronicas")]: "../procesados/1_cronicas.js",
    [normalizarNombreLibro("2 Cronicas")]: "../procesados/2_cronicas.js",
    [normalizarNombreLibro("Esdras")]: "../procesados/esdras.js",
    [normalizarNombreLibro("Nehemias")]: "../procesados/nehemias.js",
    [normalizarNombreLibro("Ester")]: "../procesados/ester.js",
    [normalizarNombreLibro("Job")]: "../procesados/job.js",
    [normalizarNombreLibro("Salmos")]: "../procesados/salmos.js",
    [normalizarNombreLibro("Proverbios")]: "../procesados/proverbios.js",
    [normalizarNombreLibro("Eclesiastes")]: "../procesados/eclesiastes.js",
    [normalizarNombreLibro("Cantares")]: "../procesados/cantares.js",
    [normalizarNombreLibro("Isaias")]: "../procesados/isaias.js",
    [normalizarNombreLibro("Jeremias")]: "../procesados/jeremias.js",
    [normalizarNombreLibro("Lamentaciones")]: "../procesados/lamentaciones.js",
    [normalizarNombreLibro("Ezequiel")]: "../procesados/ezequiel.js",
    [normalizarNombreLibro("Daniel")]: "../procesados/daniel.js",
    [normalizarNombreLibro("Oseas")]: "../procesados/oseas.js",
    [normalizarNombreLibro("Joel")]: "../procesados/joel.js",
    [normalizarNombreLibro("Amos")]: "../procesados/amos.js",
    [normalizarNombreLibro("Abdias")]: "../procesados/abdias.js",
    [normalizarNombreLibro("Jonas")]: "../procesados/jonas.js",
    [normalizarNombreLibro("Miqueas")]: "../procesados/miqueas.js",
    [normalizarNombreLibro("Nahum")]: "../procesados/nahum.js",
    [normalizarNombreLibro("Habacuc")]: "../procesados/habacuc.js",
    [normalizarNombreLibro("Sofonias")]: "../procesados/sofonias.js",
    [normalizarNombreLibro("Hageo")]: "../procesados/hageo.js",
    [normalizarNombreLibro("Zacarias")]: "../procesados/zacarias.js",
    [normalizarNombreLibro("Malaquias")]: "../procesados/malaquias.js",
    [normalizarNombreLibro("Mateo")]: "../procesados/mateo.js",
    [normalizarNombreLibro("Marcos")]: "../procesados/marcos.js",
    [normalizarNombreLibro("Lucas")]: "../procesados/lucas.js",
    [normalizarNombreLibro("Juan")]: "../procesados/juan.js",
    [normalizarNombreLibro("Hechos")]: "../procesados/hechos.js",
    [normalizarNombreLibro("Romanos")]: "../procesados/romanos.js",
    [normalizarNombreLibro("1 Corintios")]: "../procesados/1_corintios.js",
    [normalizarNombreLibro("2 Corintios")]: "../procesados/2_corintios.js",
    [normalizarNombreLibro("Galatas")]: "../procesados/galatas.js",
    [normalizarNombreLibro("Efesios")]: "../procesados/efesios.js",
    [normalizarNombreLibro("Filipenses")]: "../procesados/filipenses.js",
    [normalizarNombreLibro("Colosenses")]: "../procesados/colosenses.js",
    [normalizarNombreLibro("1 Tesalonicenses")]: "../procesados/1_tesalonicenses.js",
    [normalizarNombreLibro("2 Tesalonicenses")]: "../procesados/2_tesalonicenses.js",
    [normalizarNombreLibro("1 Timoteo")]: "../procesados/1_timoteo.js",
    [normalizarNombreLibro("2 Timoteo")]: "../procesados/2_timoteo.js",
    [normalizarNombreLibro("Tito")]: "../procesados/tito.js",
    [normalizarNombreLibro("Filemon")]: "../procesados/filemon.js",
    [normalizarNombreLibro("Hebreos")]: "../procesados/hebreos.js",
    [normalizarNombreLibro("Santiago")]: "../procesados/santiago.js",
    [normalizarNombreLibro("1 Pedro")]: "../procesados/1_pedro.js",
    [normalizarNombreLibro("2 Pedro")]: "../procesados/2_pedro.js",
    [normalizarNombreLibro("1 Juan")]: "../procesados/1_juan.js",
    [normalizarNombreLibro("2 Juan")]: "../procesados/2_juan.js",
    [normalizarNombreLibro("3 Juan")]: "../procesados/3_juan.js",
    [normalizarNombreLibro("Judas")]: "../procesados/judas.js",
    [normalizarNombreLibro("Apocalipsis")]: "../procesados/apocalipsis.js"
};

function obtenerRutaLibroPorNombre(nombre) {
    const nombreNormalizado = normalizarNombreLibro(nombre);
    if (!nombreNormalizado) {
        return "";
    }

    if (libroRutaMap[nombreNormalizado]) {
        return libroRutaMap[nombreNormalizado];
    }

    const slug = nombreNormalizado
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");

    return slug ? `../procesados/${slug}.js` : "";
}

function guardarLocalStorageArray(key, arreglo) {
    localStorage.setItem(key, JSON.stringify(Array.isArray(arreglo) ? arreglo : []));
}

function quitarVersiculoEnProgreso(index) {
    if (!Number.isInteger(index) || index < 0 || index >= memorizarVersiculos.length) {
        return;
    }

    memorizarVersiculos.splice(index, 1);
    guardarLocalStorageArray('memorizarVersiculos', memorizarVersiculos);
    mostrarDashboard();
}

function quitarFavorito(clave) {
    if (!clave || typeof clave !== 'string') {
        return;
    }

    const pendientes = favoritosVersiculos.filter(item => item !== clave);
    favoritosVersiculos.length = 0;
    favoritosVersiculos.push(...pendientes);
    guardarLocalStorageArray('favoritosVersiculos', favoritosVersiculos);
    mostrarDashboard();
}

function mostrarDashboard() {
    const pendientes = Array.isArray(memorizarVersiculos) ? memorizarVersiculos : [];
    const favoritos = Array.isArray(favoritosVersiculos) ? favoritosVersiculos : [];

    pendientesCount.textContent = pendientes.length;
    favoritosCount.textContent = favoritos.length;

    actualizarContinueCard(pendientes);
    rellenarListaPendientes(pendientes);
    rellenarListaFavoritos(favoritos);
}

function actualizarContinueCard(versos) {
    if (versos.length > 0) {
        const primerVerso = versos[0];
        continueSubtitle.textContent = 'Continúa aprendiendo';
        continueTitle.textContent = `${primerVerso.libro} ${primerVerso.capitulo}:${primerVerso.verso}`;
        continueText.textContent = primerVerso.texto;
        continueAction.disabled = false;
        continueAction.innerHTML = `<i class="fa-solid fa-play"></i> Continuar aprendizaje`;
        continueAction.onclick = () => {
            window.location.href = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}/pantallas/memorizar.html?index=0`;
        };
        return;
    }

    continueSubtitle.textContent = 'Continúa aprendiendo';
    continueTitle.textContent = 'No hay versículos en progreso';
    continueText.textContent = 'Selecciona uno o varios versículos desde la Biblia para empezar a memorizar.';
    continueAction.disabled = false;
    continueAction.innerHTML = '<i class="fa-solid fa-book-bible"></i> Ir a la Biblia';
    continueAction.onclick = () => {
        window.location.href = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}/pantallas/biblia.html`;
    };
}

function rellenarListaPendientes(versos) {
    pendientesList.innerHTML = '';

    if (!versos.length) {
        pendientesList.innerHTML = '<p>No hay versículos en progreso.</p>';
        return;
    }

    versos.forEach((verso, index) => {
        const item = document.createElement('div');
        item.className = 'info-item';

        const mainButton = document.createElement('button');
        mainButton.type = 'button';
        mainButton.className = 'info-item-button info-item-main';
        mainButton.innerHTML = `
            <strong>${verso.libro} ${verso.capitulo}:${verso.verso}</strong>
            <span>${verso.texto}</span>
        `;
        mainButton.addEventListener('click', () => {
            window.location.href = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}/pantallas/memorizar.html?index=${index}`;
        });

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'info-item-remove';
        removeButton.title = 'Eliminar versículo';
        removeButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        removeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            quitarVersiculoEnProgreso(index);
        });

        item.appendChild(mainButton);
        item.appendChild(removeButton);
        pendientesList.appendChild(item);
    });
}

function rellenarListaFavoritos(keys) {
    favoritosList.innerHTML = '';

    if (!keys.length) {
        favoritosList.innerHTML = '<p>No hay favoritos guardados.</p>';
        return;
    }

    keys.forEach((clave) => {
        if (typeof clave !== 'string') return;
        const [libro, capitulo, verso] = clave.split('|');
        if (!libro || !capitulo || !verso) return;

        const item = document.createElement('div');
        item.className = 'info-item';

        const mainButton = document.createElement('button');
        mainButton.type = 'button';
        mainButton.className = 'info-item-button info-item-main';
        mainButton.innerHTML = `
            <strong>${libro} ${capitulo}:${verso}</strong>
            <span>Marcado como favorito</span>
        `;
        mainButton.addEventListener('click', () => {
            const rutaLibro = obtenerRutaLibroPorNombre(libro);
            window.location.href = `pantallas/leer.html?libro=${encodeURIComponent(rutaLibro)}&nombre=${encodeURIComponent(libro)}&capitulo=${capitulo}&verso=${verso}`;
        });

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'info-item-remove';
        removeButton.title = 'Eliminar favorito';
        removeButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        removeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            quitarFavorito(clave);
        });

        item.appendChild(mainButton);
        item.appendChild(removeButton);
        favoritosList.appendChild(item);
    });
}

window.addEventListener('DOMContentLoaded', mostrarDashboard);
