/**
 * Aplica el nombre, el contacto y el precio de config.js, y el visor de imágenes.
 */
(function aplicarSitio() {
  const sitio = window.SITIO || {};
  const nombre = sitio.nombreProducto || 'Inventario y Facturación';

  document.querySelectorAll('[data-nombre]').forEach((nodo) => {
    nodo.textContent = nombre;
  });
  document.title = document.title.replace('NOMBRE', nombre);

  const descripcion = document.querySelector('meta[name="description"]');
  if (descripcion) {
    descripcion.setAttribute(
      'content',
      descripcion.getAttribute('content').replaceAll('NOMBRE', nombre),
    );
  }
  const ogTitulo = document.querySelector('meta[property="og:title"]');
  if (ogTitulo) ogTitulo.setAttribute('content', document.title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && descripcion) ogDesc.setAttribute('content', descripcion.getAttribute('content'));

  const imagen = document.querySelector('meta[property="og:image"]');
  if (imagen && sitio.urlPublica) {
    const relativa = imagen.getAttribute('content');
    imagen.setAttribute('content', `${sitio.urlPublica.replace(/\/$/, '')}/${relativa}`);
    let url = document.querySelector('meta[property="og:url"]');
    if (!url) {
      url = document.createElement('meta');
      url.setAttribute('property', 'og:url');
      document.head.append(url);
    }
    url.setAttribute('content', sitio.urlPublica.replace(/\/$/, '') + location.pathname);
  }

  const precio = document.querySelector('[data-precio]');
  if (precio) {
    precio.textContent =
      sitio.mostrarPrecio && sitio.precio ? sitio.precio : 'Pide tu cotización';
  }

  const textoWhatsapp = encodeURIComponent(sitio.mensajeWhatsapp || `Hola, quiero conocer ${nombre}.`);
  document.querySelectorAll('[data-whatsapp]').forEach((enlace) => {
    if (!sitio.whatsapp) {
      enlace.hidden = true;
      return;
    }
    enlace.href = `https://wa.me/${sitio.whatsapp}?text=${textoWhatsapp}`;
  });

  document.querySelectorAll('[data-demo]').forEach((enlace) => {
    if (sitio.correo) {
      const asunto = encodeURIComponent(`Demostración de ${nombre}`);
      const cuerpo = encodeURIComponent(`Hola, quiero una demostración de ${nombre}.`);
      enlace.href = `mailto:${sitio.correo}?subject=${asunto}&body=${cuerpo}`;
      return;
    }
    if (sitio.whatsapp) {
      enlace.href = `https://wa.me/${sitio.whatsapp}?text=${textoWhatsapp}`;
      return;
    }
    enlace.hidden = true;
  });

  document.querySelectorAll('[data-correo]').forEach((enlace) => {
    if (!sitio.correo) {
      enlace.hidden = true;
      return;
    }
    enlace.href = `mailto:${sitio.correo}`;
    enlace.textContent = sitio.correo;
  });

  document.querySelectorAll('[data-linkedin]').forEach((enlace) => {
    if (!sitio.linkedin) {
      enlace.hidden = true;
      return;
    }
    enlace.href = sitio.linkedin;
  });

  document.querySelectorAll('[data-github]').forEach((enlace) => {
    if (!sitio.github) {
      enlace.hidden = true;
      return;
    }
    enlace.href = sitio.github;
  });

  const avisoContacto = document.querySelector('[data-sin-contacto]');
  if (avisoContacto && (sitio.whatsapp || sitio.correo)) avisoContacto.hidden = true;

  const guardado = localStorage.getItem('sitio-tema');
  const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const tema = guardado || (prefiereOscuro ? 'oscuro' : 'claro');
  document.documentElement.dataset.tema = tema;
  const botonTema = document.querySelector('[data-tema-boton]');
  const pintarTema = () => {
    if (!botonTema) return;
    botonTema.textContent = document.documentElement.dataset.tema === 'oscuro' ? 'Claro' : 'Oscuro';
  };
  pintarTema();
  botonTema?.addEventListener('click', () => {
    const siguiente = document.documentElement.dataset.tema === 'oscuro' ? 'claro' : 'oscuro';
    document.documentElement.dataset.tema = siguiente;
    localStorage.setItem('sitio-tema', siguiente);
    pintarTema();
  });

  const luz = document.querySelector('.luz');
  const lienzo = document.querySelector('[data-luz-medio]');
  let escala = 1;
  /** @type {HTMLImageElement | HTMLVideoElement | null} */
  let abierto = null;

  /**
   * Ancho de la foto abierta. En el celular empieza ancha para poder leerla.
   *
   * @returns {void}
   */
  const aplicarZoom = () => {
    if (!abierto || !lienzo) return;
    const natural =
      abierto instanceof HTMLVideoElement ? abierto.videoWidth : abierto.naturalWidth;
    const base = natural > 0 ? natural / 2 : 960;
    const celular = window.matchMedia('(max-width: 800px)').matches;
    const minimo = celular ? Math.max(base, 960) : Math.min(base, window.innerWidth * 0.92);
    lienzo.style.setProperty('--ancho-luz', `${Math.round(minimo * escala)}px`);
  };

  const cerrarLuz = () => {
    if (!luz || typeof luz.close !== 'function') return;
    luz.close();
    lienzo?.replaceChildren();
    abierto = null;
    escala = 1;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
    try {
      screen.orientation?.unlock();
    } catch {
      /* El navegador no permite soltar la orientación. */
    }
  };

  document.querySelectorAll('[data-ampliar]').forEach((figura) => {
    figura.addEventListener('click', () => {
      const origen = figura.querySelector('img, video');
      if (!origen || !luz || !lienzo) return;
      escala = 1;
      lienzo.replaceChildren();
      if (origen.tagName === 'VIDEO') {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        origen.querySelectorAll('source').forEach((fuente) => {
          const copia = document.createElement('source');
          copia.src = fuente.src;
          copia.type = fuente.type;
          video.append(copia);
        });
        video.addEventListener('loadedmetadata', aplicarZoom);
        lienzo.append(video);
        abierto = video;
      } else {
        const imagenGrande = document.createElement('img');
        imagenGrande.src = origen.currentSrc || origen.src;
        imagenGrande.alt = origen.alt;
        imagenGrande.addEventListener('load', aplicarZoom);
        lienzo.append(imagenGrande);
        abierto = imagenGrande;
      }
      if (typeof luz.showModal === 'function') luz.showModal();
      aplicarZoom();
      if (window.matchMedia('(max-width: 800px)').matches && figura.dataset.ampliar === 'completa') {
        void document.documentElement.requestFullscreen?.().then(() => {
          void screen.orientation?.lock('landscape').catch(() => undefined);
        });
      }
    });
  });

  luz?.querySelector('[data-luz-cerrar]')?.addEventListener('click', cerrarLuz);
  luz?.querySelector('[data-zoom-mas]')?.addEventListener('click', () => {
    escala = Math.min(escala + 0.35, 3);
    aplicarZoom();
  });
  luz?.querySelector('[data-zoom-menos]')?.addEventListener('click', () => {
    escala = Math.max(escala - 0.35, 0.6);
    aplicarZoom();
  });
  luz?.addEventListener('cancel', (evento) => {
    evento.preventDefault();
    cerrarLuz();
  });
})();
