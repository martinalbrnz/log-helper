import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: path.resolve(__dirname, "index.js"), // Punto de entrada de tu aplicación
  output: {
    path: path.resolve(__dirname, "dist"), // Directorio de salida para el archivo ejecutable
    filename: "bundle.js", // Nombre del archivo de salida
  },
  resolve: {
    extensions: [".js", ".json"], // Agrega extensiones adicionales si es necesario
  },
  target: "node", // Establece el objetivo de la construcción a "node" para Node.js
};
