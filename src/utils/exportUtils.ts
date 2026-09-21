import html2canvas from "html2canvas";
import confetti from "canvas-confetti";
import JSZip from "jszip";

export async function exportElementToPng(
  element: HTMLElement,
  filename: string,
  scale: number = 3
): Promise<string> {
  if (document.fonts) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    imageTimeout: 15000,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.querySelector(
        `[data-export-id="${element.getAttribute("data-export-id")}"]`
      );
      if (clonedElement) {
        (clonedElement as HTMLElement).style.transform = "none";
      }
    },
  });

  const dataUrl = canvas.toDataURL("image/png", 1.0);
  const link = document.createElement("a");
  link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return dataUrl;
}

export async function captureElementToBlob(
  element: HTMLElement,
  scale: number = 3
): Promise<Blob> {
  if (document.fonts) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    imageTimeout: 15000,
  });

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Falha ao converter canvas para Blob."));
      },
      "image/png",
      1.0
    );
  });
}

export async function exportCarouselToZip(
  slideElements: HTMLElement[],
  zipFilename: string,
  captionText?: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();
  const total = slideElements.length;

  for (let i = 0; i < total; i++) {
    if (onProgress) {
      onProgress(i + 1, total);
    }
    const elem = slideElements[i];
    const blob = await captureElementToBlob(elem, 3);
    const fileName = `slide_${String(i + 1).padStart(2, "0")}.png`;
    zip.file(fileName, blob);
  }

  if (captionText && captionText.trim().length > 0) {
    zip.file("legenda_instagram.txt", captionText.trim());
  }

  const zipBlob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  const downloadUrl = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.download = zipFilename.endsWith(".zip") ? zipFilename : `${zipFilename}.zip`;
  link.href = downloadUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);

  // Trigger celebration
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.65 },
    colors: ["#D4AF37", "#1A382B", "#38BDF8", "#FAF5F5", "#8B5E3C"],
  });
}

export async function batchExportSlides(
  slideElements: HTMLElement[],
  baseFilename: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const total = slideElements.length;
  for (let i = 0; i < total; i++) {
    if (onProgress) {
      onProgress(i + 1, total);
    }
    const elem = slideElements[i];
    const filename = `${baseFilename}_slide_${String(i + 1).padStart(2, "0")}.png`;
    await exportElementToPng(elem, filename, 3);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 },
    colors: ["#D4AF37", "#1A382B", "#38BDF8", "#FAF5F5"],
  });
}

