// Array con los 66 libros de la Biblia y sus rutas correctas desde pantallas/biblia.html
export const librosAntiguoTestamento = [
    { nombre: "Génesis", archivo: "../procesados/genesis.js" },
    { nombre: "Éxodo", archivo: "../procesados/exodo.js" },
    { nombre: "Levítico", archivo: "../procesados/levitico.js" },
    { nombre: "Números", archivo: "../procesados/numeros.js" },
    { nombre: "Deuteronomio", archivo: "../procesados/deuteronomio.js" },
    { nombre: "Josué", archivo: "../procesados/josue.js" },
    { nombre: "Jueces", archivo: "../procesados/jueces.js" },
    { nombre: "Rut", archivo: "../procesados/rut.js" },
    { nombre: "1 Samuel", archivo: "../procesados/1_samuel.js" },
    { nombre: "2 Samuel", archivo: "../procesados/2_samuel.js" },
    { nombre: "1 Reyes", archivo: "../procesados/1_reyes.js" },
    { nombre: "2 Reyes", archivo: "../procesados/2_reyes.js" },
    { nombre: "1 Crónicas", archivo: "../procesados/1_cronicas.js" },
    { nombre: "2 Crónicas", archivo: "../procesados/2_cronicas.js" },
    { nombre: "Esdras", archivo: "../procesados/esdras.js" },
    { nombre: "Nehemías", archivo: "../procesados/nehemias.js" },
    { nombre: "Ester", archivo: "../procesados/ester.js" },
    { nombre: "Job", archivo: "../procesados/job.js" },
    { nombre: "Salmos", archivo: "../procesados/salmos.js" },
    { nombre: "Proverbios", archivo: "../procesados/proverbios.js" },
    { nombre: "Eclesiastés", archivo: "../procesados/eclesiastes.js" },
    { nombre: "Cantares", archivo: "../procesados/cantares.js" },
    { nombre: "Isaías", archivo: "../procesados/isaias.js" },
    { nombre: "Jeremías", archivo: "../procesados/jeremias.js" },
    { nombre: "Lamentaciones", archivo: "../procesados/lamentaciones.js" },
    { nombre: "Ezequiel", archivo: "../procesados/ezequiel.js" },
    { nombre: "Daniel", archivo: "../procesados/daniel.js" },
    { nombre: "Oseas", archivo: "../procesados/oseas.js" },
    { nombre: "Joel", archivo: "../procesados/joel.js" },
    { nombre: "Amós", archivo: "../procesados/amos.js" },
    { nombre: "Abdías", archivo: "../procesados/abdias.js" },
    { nombre: "Jonás", archivo: "../procesados/jonas.js" },
    { nombre: "Miqueas", archivo: "../procesados/miqueas.js" },
    { nombre: "Nahúm", archivo: "../procesados/nahum.js" },
    { nombre: "Habacuc", archivo: "../procesados/habacuc.js" },
    { nombre: "Sofonías", archivo: "../procesados/sofonias.js" },
    { nombre: "Hageo", archivo: "../procesados/hageo.js" },
    { nombre: "Zacarías", archivo: "../procesados/zacarias.js" },
    { nombre: "Malaquías", archivo: "../procesados/malaquias.js" }
];

export const librosNuevoTestamento = [
    { nombre: "Mateo", archivo: "../procesados/mateo.js" },
    { nombre: "Marcos", archivo: "../procesados/marcos.js" },
    { nombre: "Lucas", archivo: "../procesados/lucas.js" },
    { nombre: "Juan", archivo: "../procesados/juan.js" },
    { nombre: "Hechos", archivo: "../procesados/hechos.js" },
    { nombre: "Romanos", archivo: "../procesados/romanos.js" },
    { nombre: "1 Corintios", archivo: "../procesados/1_corintios.js" },
    { nombre: "2 Corintios", archivo: "../procesados/2_corintios.js" },
    { nombre: "Gálatas", archivo: "../procesados/galatas.js" },
    { nombre: "Efesios", archivo: "../procesados/efesios.js" },
    { nombre: "Filipenses", archivo: "../procesados/filipenses.js" },
    { nombre: "Colosenses", archivo: "../procesados/colosenses.js" },
    { nombre: "1 Tesalonicenses", archivo: "../procesados/1_tesalonicenses.js" },
    { nombre: "2 Tesalonicenses", archivo: "../procesados/2_tesalonicenses.js" },
    { nombre: "1 Timoteo", archivo: "../procesados/1_timoteo.js" },
    { nombre: "2 Timoteo", archivo: "../procesados/2_timoteo.js" },
    { nombre: "Tito", archivo: "../procesados/tito.js" },
    { nombre: "Filemón", archivo: "../procesados/filemon.js" },
    { nombre: "Hebreos", archivo: "../procesados/hebreos.js" },
    { nombre: "Santiago", archivo: "../procesados/santiago.js" },
    { nombre: "1 Pedro", archivo: "../procesados/1_pedro.js" },
    { nombre: "2 Pedro", archivo: "../procesados/2_pedro.js" },
    { nombre: "1 Juan", archivo: "../procesados/1_juan.js" },
    { nombre: "2 Juan", archivo: "../procesados/2_juan.js" },
    { nombre: "3 Juan", archivo: "../procesados/3_juan.js" },
    { nombre: "Judas", archivo: "../procesados/judas.js" },
    { nombre: "Apocalipsis", archivo: "../procesados/apocalipsis.js" }
];

// Función para renderizar los botones en el HTML
function renderizarLibros(libros, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    
    libros.forEach(libro => {
        const enlace = document.createElement('a');
        const libroParam = encodeURIComponent(libro.archivo);
        const nombreParam = encodeURIComponent(libro.nombre);
        enlace.href = `leer.html?libro=${libroParam}&nombre=${nombreParam}`;
        enlace.className = 'book-card';
        enlace.textContent = libro.nombre;
        
        contenedor.appendChild(enlace);
    });
}

// Ejecutar cuando el documento cargue
document.addEventListener('DOMContentLoaded', () => {
    renderizarLibros(librosAntiguoTestamento, 'antiguo-testamento');
    renderizarLibros(librosNuevoTestamento, 'nuevo-testamento');
});