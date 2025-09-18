export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

// Load PDF.js from CDN without import statements
async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).pdfjsLib) {
      pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = 
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(pdfjsLib);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    
    script.onload = () => {
      if ((window as any).pdfjsLib) {
        pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(pdfjsLib);
      } else {
        reject(new Error("PDF.js not found after loading"));
      }
    };
    
    script.onerror = () => reject(new Error("Failed to load PDF.js"));
    document.head.appendChild(script);
  });

  return loadPromise;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    // Validate file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('File is not a PDF');
    }

    // Load PDF.js
    const lib = await loadPdfJs();
    
    // Read file
    const arrayBuffer = await file.arrayBuffer();
    
    // Parse PDF
    const loadingTask = lib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    // Get first page
    const page = await pdf.getPage(1);
    
    // Set up viewport (scale 2 for good quality)
    const viewport = page.getViewport({ scale: 2 });
    
    // Create canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    if (!context) {
      throw new Error("Cannot get canvas context");
    }
    
    // Set canvas dimensions
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    // Configure rendering
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    
    // Render page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const originalName = file.name.replace(/\.pdf$/i, "");
          const imageFile = new File([blob], `${originalName}.png`, {
            type: "image/png",
          });
          
          resolve({
            imageUrl: URL.createObjectURL(blob),
            file: imageFile,
          });
        } else {
          resolve({
            imageUrl: "",
            file: null,
            error: "Failed to create image blob",
          });
        }
      }, "image/png", 0.9);
    });
    
  } catch (err) {
    console.error("PDF conversion error:", err);
    return {
      imageUrl: "",
      file: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// Utility function to cleanup object URLs
export function cleanupImageUrl(imageUrl: string): void {
  if (imageUrl) {
    URL.revokeObjectURL(imageUrl);
  }
}