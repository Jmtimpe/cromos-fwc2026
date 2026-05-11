import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getEquipoInfo } from './equiposData';

// ============================================================================
// EXPORTAR PDF DE CROMOS FALTANTES
// ============================================================================
export function exportarFaltantesPDF({ catalogo, inventario, usuario }) {
  // Crear documento PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Configuración general
  const margenIzq = 14;
  const anchoUtil = 182;
  let y = 18;

  // ===== ENCABEZADO =====
  doc.setFillColor(10, 10, 15); // fwc-bg
  doc.rect(0, 0, 210, 35, 'F');

  // Título
  doc.setTextColor(212, 175, 55); // fwc-gold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('CROMOS MUNDIAL 2026', margenIzq, 15);

  // Subtítulo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('Lista de Cromos Faltantes', margenIzq, 23);

  // Trofeo emoji (texto)
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(24);
  doc.text('🏆', 185, 18);

  y = 45;

  // ===== INFO DEL USUARIO =====
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const fecha = new Date().toLocaleDateString('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Guayaquil',
  });

  doc.text(`Coleccionista: ${usuario.displayName || 'Anonimo'}`, margenIzq, y);
  doc.text(`Generado: ${fecha}`, margenIzq, y + 5);
  y += 15;

  // ===== ESTADÍSTICAS =====
  const totalCromos = catalogo.length;
  const totalObtenidos = catalogo.filter((c) => (inventario[c.numero] || 0) >= 1).length;
  const totalFaltantes = totalCromos - totalObtenidos;
  const totalRepetidos = catalogo.reduce((sum, c) => {
    const cant = inventario[c.numero] || 0;
    return sum + (cant > 1 ? cant - 1 : 0);
  }, 0);
  const porcentaje = totalCromos > 0 ? Math.round((totalObtenidos / totalCromos) * 100) : 0;

  // Caja de stats
  doc.setFillColor(245, 245, 250);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.roundedRect(margenIzq, y, anchoUtil, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(9);

  // Columna 1: Progreso
  doc.text('PROGRESO', margenIzq + 5, y + 7);
  doc.setFontSize(16);
  doc.setTextColor(212, 175, 55);
  doc.text(`${porcentaje}%`, margenIzq + 5, y + 16);

  // Columna 2: Obtenidos
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text('OBTENIDOS', margenIzq + 50, y + 7);
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);
  doc.text(`${totalObtenidos}/${totalCromos}`, margenIzq + 50, y + 16);

  // Columna 3: Repetidos
  doc.setFontSize(9);
  doc.text('REPETIDOS', margenIzq + 100, y + 7);
  doc.setFontSize(14);
  doc.setTextColor(0, 200, 200);
  doc.text(`${totalRepetidos}`, margenIzq + 100, y + 16);

  // Columna 4: Faltantes
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text('FALTANTES', margenIzq + 145, y + 7);
  doc.setFontSize(16);
  doc.setTextColor(255, 51, 102);
  doc.text(`${totalFaltantes}`, margenIzq + 145, y + 16);

  y += 30;

  // ===== FILTRAR CROMOS FALTANTES =====
  const faltantes = catalogo.filter((c) => (inventario[c.numero] || 0) === 0);

  if (faltantes.length === 0) {
    // ¡Mensaje especial si tiene todos los cromos!
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 55);
    doc.setFont('helvetica', 'bold');
    doc.text('FELICITACIONES!', margenIzq, y + 10);
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    doc.text('Has completado tu album. No te falta ningun cromo.', margenIzq, y + 18);
  } else {
    // ===== AGRUPAR FALTANTES POR SECCIÓN Y EQUIPO =====
    const agrupados = {};
    faltantes.forEach((cromo) => {
      const sec = cromo.seccion || 'OTROS';
      const eq = cromo.equipo || 'SIN EQUIPO';
      if (!agrupados[sec]) agrupados[sec] = {};
      if (!agrupados[sec][eq]) agrupados[sec][eq] = [];
      agrupados[sec][eq].push(cromo);
    });

    // Orden de secciones
    const ordenSecciones = [
      'ESPECIALES', 'MUNDIAL',
      'GRUPO A', 'GRUPO B', 'GRUPO C', 'GRUPO D',
      'GRUPO E', 'GRUPO F', 'GRUPO G', 'GRUPO H',
      'GRUPO I', 'GRUPO J', 'GRUPO K', 'GRUPO L',
    ];

    const seccionesVisibles = ordenSecciones.filter((s) => agrupados[s]);

    // ===== RENDERIZAR CADA SECCIÓN =====
    seccionesVisibles.forEach((seccion) => {
      const equipos = agrupados[seccion];
      const equiposLista = Object.keys(equipos);

      // Contar faltantes en esta sección
      const faltantesEnSeccion = Object.values(equipos).reduce(
        (sum, cromos) => sum + cromos.length,
        0
      );

      // Construir filas para la tabla
      const filas = [];
      equiposLista.forEach((equipo) => {
        const cromos = equipos[equipo];
        const equipoInfo = getEquipoInfo(equipo);
        cromos.forEach((cromo, idx) => {
          filas.push([
            idx === 0 ? equipoInfo.nombre : '',
            cromo.codigo,
            cromo.detalle || '-',
            cromo.tipo || 'NORMAL',
          ]);
        });
      });

      // Usar autoTable para renderizar la tabla
      autoTable(doc, {
        startY: y,
        head: [[
          {
            content: `${seccion} - ${faltantesEnSeccion} faltantes`,
            colSpan: 4,
            styles: {
              fillColor: [212, 175, 55],
              textColor: [10, 10, 15],
              fontStyle: 'bold',
              halign: 'left',
              fontSize: 11,
            },
          },
        ]],
        body: filas,
        columns: [
          { header: 'Equipo', dataKey: 'equipo' },
          { header: 'Codigo', dataKey: 'codigo' },
          { header: 'Detalle', dataKey: 'detalle' },
          { header: 'Tipo', dataKey: 'tipo' },
        ],
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
          1: { cellWidth: 25 },
          2: { cellWidth: 70 },
          3: { cellWidth: 25, halign: 'center' },
        },
        styles: {
          fontSize: 9,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [212, 175, 55],
          textColor: [10, 10, 15],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [248, 248, 250],
        },
        margin: { left: margenIzq, right: margenIzq },
      });

      // Obtener la nueva posición Y después de la tabla
      y = doc.lastAutoTable.finalY + 8;

      // Si nos acercamos al final de la página, agregar nueva página
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
  }

  // ===== FOOTER en cada página =====
  const totalPaginas = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);

    // Línea separadora
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.3);
    doc.line(margenIzq, 285, 196, 285);

    // Texto del footer
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Generado en cromosmundial.app  |  Desarrollado por J. M. Timpe`,
      margenIzq,
      290
    );

    // Numero de pagina (derecha)
    doc.text(`Pagina ${i} de ${totalPaginas}`, 196, 290, { align: 'right' });
  }

  // ===== GENERAR NOMBRE DE ARCHIVO =====
  const fechaArchivo = new Date().toISOString().split('T')[0]; // "2026-05-11"
  const nombreLimpio = (usuario.displayName || 'coleccionista')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  const nombreArchivo = `cromos-faltantes-${nombreLimpio}-${fechaArchivo}.pdf`;

  // ===== DESCARGAR =====
  doc.save(nombreArchivo);

  return { success: true, nombreArchivo, totalFaltantes };
}