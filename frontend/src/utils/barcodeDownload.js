import JsBarcode from 'jsbarcode';

export async function downloadBarcodePng(code, filename = null) {
  // Dimensions et marges
  const width = 220;
  const barHeight = 60;
  const fontSize = 12;
  const textMargin = 8;
  const margin = 8;
  const padding = 16; // padding externe pour l'image finale
  // Hauteur totale = barres + espace texte + taille du texte + marge supérieure
  const svgHeight = barHeight + textMargin + fontSize + margin;

  // Crée un SVG temporaire avec texte inclus via JsBarcode
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(svgHeight));
  JsBarcode(svg, code, {
    format: 'CODE128',
    displayValue: true,
    textAlign: 'center',
    textMargin,
    fontSize,
    margin,
    height: barHeight,
  });

  // Crée un canvas avec padding et dessine le SVG centré
  const canvas = document.createElement('canvas');
  canvas.width = width + padding * 2;
  canvas.height = svgHeight + padding * 2;
  const ctx = canvas.getContext('2d');

  // Convertit le SVG en image
  const svgData = new XMLSerializer().serializeToString(svg);
  const img = new window.Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  await new Promise((resolve) => {
    img.onload = () => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const x = Math.round((canvas.width - img.width) / 2);
      const y = Math.round((canvas.height - img.height) / 2);
      ctx.drawImage(img, x, y);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.src = url;
  });

  // Télécharge le PNG
  const link = document.createElement('a');
  link.download = filename || `barcode-${code}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
