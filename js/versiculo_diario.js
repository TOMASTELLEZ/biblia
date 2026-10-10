const referencia = document.getElementById("referencia");
const texto = document.getElementById("textoVersiculo");

const libros = [

    { nombre: "Génesis", archivo: "genesis" },
    { nombre: "Éxodo", archivo: "exodo" },
    { nombre: "Levítico", archivo: "levitico" },
    { nombre: "Números", archivo: "numeros" },
    { nombre: "Deuteronomio", archivo: "deuteronomio" },
    { nombre: "Josué", archivo: "josue" },
    { nombre: "Jueces", archivo: "jueces" },
    { nombre: "Rut", archivo: "rut" },
    { nombre: "1 Samuel", archivo: "1_samuel" },
    { nombre: "2 Samuel", archivo: "2_samuel" },
    { nombre: "1 Reyes", archivo: "1_reyes" },
    { nombre: "2 Reyes", archivo: "2_reyes" },
    { nombre: "1 Crónicas", archivo: "1_cronicas" },
    { nombre: "2 Crónicas", archivo: "2_cronicas" },
    { nombre: "Esdras", archivo: "esdras" },
    { nombre: "Nehemías", archivo: "nehemias" },
    { nombre: "Ester", archivo: "ester" },
    { nombre: "Job", archivo: "job" },
    { nombre: "Salmos", archivo: "salmos" },
    { nombre: "Proverbios", archivo: "proverbios" },
    { nombre: "Eclesiastés", archivo: "eclesiastes" },
    { nombre: "Cantares", archivo: "cantares" },
    { nombre: "Isaías", archivo: "isaias" },
    { nombre: "Jeremías", archivo: "jeremias" },
    { nombre: "Lamentaciones", archivo: "lamentaciones" },
    { nombre: "Ezequiel", archivo: "ezequiel" },
    { nombre: "Daniel", archivo: "daniel" },
    { nombre: "Oseas", archivo: "oseas" },
    { nombre: "Joel", archivo: "joel" },
    { nombre: "Amós", archivo: "amos" },
    { nombre: "Abdías", archivo: "abdias" },
    { nombre: "Jonás", archivo: "jonas" },
    { nombre: "Miqueas", archivo: "miqueas" },
    { nombre: "Nahúm", archivo: "nahum" },
    { nombre: "Habacuc", archivo: "habacuc" },
    { nombre: "Sofonías", archivo: "sofonias" },
    { nombre: "Hageo", archivo: "hageo" },
    { nombre: "Zacarías", archivo: "zacarias" },
    { nombre: "Malaquías", archivo: "malaquias" },

    { nombre: "Mateo", archivo: "mateo" },
    { nombre: "Marcos", archivo: "marcos" },
    { nombre: "Lucas", archivo: "lucas" },
    { nombre: "Juan", archivo: "juan" },
    { nombre: "Hechos", archivo: "hechos" },
    { nombre: "Romanos", archivo: "romanos" },
    { nombre: "1 Corintios", archivo: "1_corintios" },
    { nombre: "2 Corintios", archivo: "2_corintios" },
    { nombre: "Gálatas", archivo: "galatas" },
    { nombre: "Efesios", archivo: "efesios" },
    { nombre: "Filipenses", archivo: "filipenses" },
    { nombre: "Colosenses", archivo: "colosenses" },
    { nombre: "1 Tesalonicenses", archivo: "1_tesalonicenses" },
    { nombre: "2 Tesalonicenses", archivo: "2_tesalonicenses" },
    { nombre: "1 Timoteo", archivo: "1_timoteo" },
    { nombre: "2 Timoteo", archivo: "2_timoteo" },
    { nombre: "Tito", archivo: "tito" },
    { nombre: "Filemón", archivo: "filemon" },
    { nombre: "Hebreos", archivo: "hebreos" },
    { nombre: "Santiago", archivo: "santiago" },
    { nombre: "1 Pedro", archivo: "1_pedro" },
    { nombre: "2 Pedro", archivo: "2_pedro" },
    { nombre: "1 Juan", archivo: "1_juan" },
    { nombre: "2 Juan", archivo: "2_juan" },
    { nombre: "3 Juan", archivo: "3_juan" },
    { nombre: "Judas", archivo: "judas" },
    { nombre: "Apocalipsis", archivo: "apocalipsis" }

];

async function generarVersiculoAleatorio() {

    while (true) {

        try {

            // Libro aleatorio
            const libro =
                libros[Math.floor(Math.random() * libros.length)];

            // Cargar libro
            const modulo =
                await import(`../procesados/${libro.archivo}.js`);

            const datos = modulo.default;

            // Capítulo aleatorio
            const capitulo =
                Math.floor(Math.random() * datos.length);

            // Versículo aleatorio
            const versiculo =
                Math.floor(Math.random() * datos[capitulo].length);

            return {

                referencia:
                    `${libro.nombre} ${capitulo + 1}:${versiculo + 1}`,

                texto:
                    datos[capitulo][versiculo]

            };

        } catch (error) {

            console.warn("No se pudo cargar un libro:", error);

        }

    }

}

async function cargarVersiculoDelDia() {

    // Fecha de hoy (ejemplo: 2026-08-04)
    const hoy = new Date().toISOString().split("T")[0];

    const fechaGuardada =
        localStorage.getItem("fechaVersiculo");

    const versiculoGuardado =
        localStorage.getItem("versiculoDelDia");

    if (fechaGuardada === hoy && versiculoGuardado) {

        const datos = JSON.parse(versiculoGuardado);

        referencia.textContent = datos.referencia;
        texto.textContent = datos.texto;

        return;

    }

    // Si cambió el día, generar uno nuevo
    const nuevo = await generarVersiculoAleatorio();

    referencia.textContent = nuevo.referencia;
    texto.textContent = nuevo.texto;

    localStorage.setItem("fechaVersiculo", hoy);

    localStorage.setItem(
        "versiculoDelDia",
        JSON.stringify(nuevo)
    );

}

cargarVersiculoDelDia();