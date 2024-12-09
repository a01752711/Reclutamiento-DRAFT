// script.js

// Variables globales
let jugadores = [];

// Cargar un archivo TSV automáticamente
async function cargarArchivoTSV() {
  try {
    // Ruta del archivo TSV
    const archivo = "jugadores.tsv"; // Cambia "jugadores.tsv" por el nombre y ruta de tu archivo

    const response = await fetch(archivo);
    if (!response.ok) throw new Error(`No se pudo cargar el archivo: ${response.status}`);

    const tsvData = await response.text(); // Leer el archivo como texto

    jugadores = procesarTSV(tsvData); // Procesar el contenido TSV
    console.log("Datos procesados del TSV:", jugadores); // Verifica los datos procesados
    mostrarResultados(jugadores); // Mostrar resultados
  } catch (error) {
    console.error("Error al cargar el archivo TSV:", error);
  }
}

// Procesar contenido TSV
function procesarTSV(data) {
  const rows = data.split("\n"); // Dividir en filas
  const headers = rows[0].split("\t").map(header => header.trim()); // Extraer encabezados

  return rows.slice(1).map(row => {
    const values = row.split("\t").map(value => value.trim()); // Dividir fila en columnas
    const jugador = {};

    // Mapear encabezados a valores
    headers.forEach((header, index) => {
      jugador[header] = values[index] || ""; // Asignar el valor correspondiente
    });

    return jugador; // Devolver el jugador como objeto
  }).filter(jugador => jugador["Nombre"]); // Filtrar filas vacías
}






// Variables globales para los filtros
let filtroPosicionOfensiva = "";
let filtroPosicionDefensiva = "";
let filtroClase = "";
let filtroEstado = "";
let filtroAlturaMin = null;
let filtroAlturaMax = null;
let filtroPesoMin = null;
let filtroPesoMax = null;
let filtroRating = "";
let paginaActual = 1; // Página inicial
const jugadoresPorPagina = 10; // Número de jugadores por página
const cumpleClase =
  filtroClase === "" || // Mostrar todos si no hay filtro
  claseJugador === filtroClase || // Coincidencia exacta
  (filtroClase === "all" && ["2025", "2026", "2027"].includes(claseJugador)); // Opción 'all'
const cumpleAltura =
  (filtroAlturaMin === null || alturaJugador >= filtroAlturaMin) &&
  (filtroAlturaMax === null || alturaJugador <= filtroAlturaMax);
const cumplePeso =
  (filtroPesoMin === null || pesoJugador >= filtroPesoMin) &&
  (filtroPesoMax === null || pesoJugador <= filtroPesoMax);









// Filtrar jugadores por posición ofensiva
function filtrarPorPosicionOfensiva() {
  filtroPosicionOfensiva = document.getElementById("posicionOfensivaFiltro").value;
  paginaActual = 1; // Reinicia la paginación
  filtrarJugadores();
}

// Filtrar jugadores por posición defensiva
function filtrarPorPosicionDefensiva() {
  filtroPosicionDefensiva = document.getElementById("posicionDefensivaFiltro").value;
  paginaActual = 1;
  filtrarJugadores();
}

// Filtrar jugadores por estado
function filtrarPorEstado() {
  filtroEstado = document.getElementById("estadoFiltro").value;
  paginaActual = 1;
  filtrarJugadores();
}

// Filtrar jugadores por altura
function filtrarPorAltura() {
  filtroAlturaMin = parseFloat(document.getElementById("alturaMinFiltro").value) || null;
  filtroAlturaMax = parseFloat(document.getElementById("alturaMaxFiltro").value) || null;
  paginaActual = 1;
  filtrarJugadores();
}

// Filtrar jugadores por peso
function filtrarPorPeso() {
  filtroPesoMin = parseFloat(document.getElementById("pesoMinFiltro").value) || null;
  filtroPesoMax = parseFloat(document.getElementById("pesoMaxFiltro").value) || null;
  paginaActual = 1;
  filtrarJugadores();
}

// Filtrar jugadores por rating
function filtrarPorRating() {
  filtroRating = document.getElementById("ratingFiltro").value;
  paginaActual = 1;
  filtrarJugadores();
}

function filtrarPorClase() {
  filtroClase = document.getElementById("claseFiltro").value; // Obtiene el valor del filtro
  filtrarJugadores(); // Llama a la función principal de filtrado
}



function cerrarSesion() {
  // Eliminar datos básicos de sesión almacenados en localStorage
  localStorage.removeItem("usuario");

  // Redirigir a la página de inicio de sesión
  window.location.href = "login.html";
}

function calcularEstrellas(rating) {
  if (rating >= 70 && rating <= 89) return `<span style="color: #FFD700;">★★★</span>`;
  if (rating >= 90 && rating <= 97) return `<span style="color: #FFD700;">★★★★</span>`;
  if (rating >= 98 && rating <= 110) return `<span style="color: #FFD700;">★★★★★</span>`;
  return `<span style="color: #999;">Sin clasificación</span>`;
}





document.getElementById("cerrar-sesion").addEventListener("click", function () {
  console.log("Botón de cerrar sesión clicado."); // Para depuración
  localStorage.removeItem("usuario");
  window.location.href = "login.html"; // Asegúrate de que login.html existe
});






// Combinar todos los filtros
function filtrarJugadores() {
  const jugadoresFiltrados = jugadores.filter(jugador => {
    const posicionOfensivaJugador = jugador["Posición Ofensiva"] || "Ninguna";
    const posicionDefensivaJugador = jugador["Posición Defensiva"] || "Ninguna";
    const claseJugador = jugador["Clase (Año de graduación)"];
    const estadoJugador = jugador["Estado"];
    const alturaJugador = parseFloat(jugador["Altura en mts"]) || 0;
    const pesoJugador = parseFloat(jugador["Peso en Kgs"]) || 0;
    const ratingJugador = parseFloat(jugador["Rating"]) || 0;

    const cumpleOfensiva = filtroPosicionOfensiva === "" || posicionOfensivaJugador === filtroPosicionOfensiva;
    const cumpleDefensiva = filtroPosicionDefensiva === "" || posicionDefensivaJugador === filtroPosicionDefensiva;
    const cumpleClase =
      filtroClase === "" || // Mostrar todos si no hay filtro
      claseJugador === filtroClase || // Coincidencia exacta
      (filtroClase === "all" && ["2025", "2026", "2027"].includes(claseJugador)); // Opción 'all'
    const cumpleEstado = filtroEstado === "" || filtroEstado === "Todos" || estadoJugador === filtroEstado;
    const cumpleAltura =
      (filtroAlturaMin === null || alturaJugador >= filtroAlturaMin) &&
      (filtroAlturaMax === null || alturaJugador <= filtroAlturaMax);
    const cumplePeso =
      (filtroPesoMin === null || pesoJugador >= filtroPesoMin) &&
      (filtroPesoMax === null || pesoJugador <= filtroPesoMax);
    const cumpleRating =
      filtroRating === "" ||
      (filtroRating === "3" && ratingJugador >= 70 && ratingJugador <= 89) ||
      (filtroRating === "4" && ratingJugador >= 90 && ratingJugador <= 97) ||
      (filtroRating === "5" && ratingJugador >= 98 && ratingJugador <= 110);

    return cumpleOfensiva && cumpleDefensiva && cumpleClase && cumpleEstado && cumpleAltura && cumplePeso && cumpleRating;
  });

  mostrarResultados(jugadoresFiltrados);
}





// Obtener el usuario actual del almacenamiento local
const usuarioActual = localStorage.getItem("usuarioActual");

// Mostrar el mensaje de bienvenida si el usuario está autenticado
if (usuarioActual) {
  document.getElementById("bienvenida").textContent = `Bienvenido, ${usuarioActual}!`;
} else {
  // Redirigir al login si no hay un usuario registrado
  window.location.href = "login.html";
}








// Mostrar resultados en la interfaz
function mostrarResultados(lista) {
  const resultados = document.getElementById("resultados");
  resultados.innerHTML = "";

  // Paginación
  const inicio = (paginaActual - 1) * jugadoresPorPagina;
  const fin = inicio + jugadoresPorPagina;
  const listaPaginada = lista.slice(inicio, fin);

  if (listaPaginada.length === 0) {
    resultados.innerHTML = "<li>No se encontraron jugadores.</li>";
    return;
  }

  listaPaginada.forEach(jugador => {
    const li = document.createElement("li");
    li.className = "jugador-card";

    // Imagen del jugador
    const img = document.createElement("img");
    img.src = jugador["Carpeta"] && jugador["Carpeta"].trim() !== "" 
              ? jugador["Carpeta"] 
              : "imagenes/default.jpg"; // Ruta predeterminada
    img.alt = `${jugador["Nombre"]} ${jugador["Apellido Paterno"]} ${jugador["Apellido Materno"]}`;    
    img.className = "jugador-imagen";
    li.appendChild(img);

    // Información del jugador
    const info = document.createElement("div");
    info.className = "jugador-info";

    // Crear el enlace del nombre
    const nombreLink = document.createElement("a");
    nombreLink.href = `perfil.html?nombre=${encodeURIComponent(jugador["Nombre"])}&apellido=${encodeURIComponent(jugador["Apellido Paterno"])}`;
    nombreLink.textContent = `${jugador["Nombre"]} ${jugador["Apellido Paterno"]}`;
    nombreLink.style.color = "#000"; // Mantiene estilo
    nombreLink.style.textDecoration = "none"; // Sin subrayado

    // Añadir información del jugador
    info.innerHTML = `
      <strong></strong><br>
      Edad: ${jugador["Edad"] || "N/A"} años<br>
      Ciudad: ${jugador["Ciudad"] || "N/A"}, Estado: ${jugador["Estado"] || "N/A"}<br>
      Posición Ofensiva: ${jugador["Posición Ofensiva"] || "Ninguna"}<br>
      Posición Defensiva: ${jugador["Posición Defensiva"] || "Ninguna"}<br>
      Clase: ${jugador["Clase (Año de graduación)"] || "N/A"}<br>
      Rating: ${jugador["Rating"] || "N/A"} (${calcularEstrellas(jugador["Rating"])})
    `;


    // Insertar el enlace del nombre al principio
    info.querySelector("strong").appendChild(nombreLink);

    li.appendChild(info);
    resultados.appendChild(li);
  });

  actualizarPaginacion(lista.length);
}


// Cambiar página
function cambiarPagina(nuevaPagina, totalJugadores) {
  const totalPaginas = Math.ceil(totalJugadores / jugadoresPorPagina);
  if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
  paginaActual = nuevaPagina;
  filtrarJugadores();
}

function actualizarPaginacion(totalJugadores) {
  const paginacion = document.getElementById("paginacion");
  paginacion.innerHTML = ""; // Limpia los controles existentes

  const totalPaginas = Math.ceil(totalJugadores / jugadoresPorPagina);

  // Botón anterior
  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "Anterior";
  btnAnterior.disabled = paginaActual === 1;
  btnAnterior.onclick = () => cambiarPagina(paginaActual - 1, totalJugadores);
  paginacion.appendChild(btnAnterior);

  // Botones de página
  for (let i = 1; i <= totalPaginas; i++) {
    const btnPagina = document.createElement("button");
    btnPagina.textContent = i;
    btnPagina.className = i === paginaActual ? "active" : "";
    btnPagina.onclick = () => cambiarPagina(i, totalJugadores);
    paginacion.appendChild(btnPagina);
  }

  // Botón siguiente
  const btnSiguiente = document.createElement("button");
  btnSiguiente.textContent = "Siguiente";
  btnSiguiente.disabled = paginaActual === totalPaginas;
  btnSiguiente.onclick = () => cambiarPagina(paginaActual + 1, totalJugadores);
  paginacion.appendChild(btnSiguiente);
}











// Cargar el archivo TSV al iniciar la aplicación
cargarArchivoTSV();
