# Página pública

Esta carpeta se publica sola. No incluye el código de la aplicación, ni las maquetas, ni las fotos PNG originales.

## Antes de subirla

1. Abra `config.js`.
2. Cambie `nombreProducto` si el producto no se va a llamar así.
3. Ponga `whatsapp` (solo dígitos, con indicativo de país), `correo`, `linkedin` y, si tiene un repositorio **público**, `github`.
4. Si va a mostrar precio, ponga `mostrarPrecio` en `true` y escriba `precio` (por ejemplo `desde $80.000 al mes`). Si no, queda «Pide tu cotización».
5. Ponga `urlPublica` con la dirección del sitio, sin barra al final, para que la vista previa al compartir use una imagen absoluta.

No escriba en esta carpeta rutas de su computador.

## Cómo publicarla sin abrir el repositorio privado

Copie solo esta carpeta a un sitio nuevo.

- **Railway:** conecte el repositorio que solo tiene esta carpeta. El build copia la página a `dist/` (Railway lo exige) y `npm start` la publica en el puerto que le asigna.
- **Netlify:** «Add new site» → «Deploy manually» y suelte esta carpeta. `netlify.toml` ya dice que la raíz publicada es esta carpeta. También puede crear un repositorio que contenga únicamente estos archivos y conectarlo.
- **Vercel:** importe un repositorio que solo tenga esta carpeta, o suba la carpeta como raíz del proyecto. No hace falta comando de build.
- **Otra copia:** cualquier hosting de archivos estáticos sirve con `index.html` en la raíz.

La página del negocio es `index.html`. La página técnica es `proyecto.html` (enlace «Cómo está hecho»).

## Volver a generar las fotos

Eso se hace en el repositorio de la aplicación, no aquí:

`npm run capturas:landing`

Ese comando reemplaza la base de **desarrollo** con datos de ejemplo. No usa la base del negocio. Las fotos maestras se quedan en una carpeta temporal; aquí solo entran WebP, un WebM y un MP4.
