# Chat de estado de proyecto — con logo, documentos reales y LLM

## Estructura del proyecto

```
index.html            → la pagina del chat (logo arriba, centrado)
assets/logo.png        → tu logo (ZeroCode)
reports/status.json    → nombre del proyecto, semaforo de estado, fecha
reports/alcance.md      → documento real: alcance acordado
reports/avance.md       → documento real: avance actual
worker/proxy.js         → servidor pequeño que guarda tu API key en secreto
```

La pagina YA NO tiene texto de estado escrito dentro del HTML: lee
`alcance.md` y `avance.md` como documentos reales del repositorio, y se los
pasa al LLM como contexto en cada pregunta. Editar esos archivos es toda la
"gestion de contenido" que necesitas.

---

## PASOS EXACTOS PARA PONERLO EN FUNCIONAMIENTO

### Paso 1 — Crea el repositorio en GitHub

1. Entra a github.com → **New repository**.
2. Nombralo, por ejemplo `zerocode-estado-proyecto`. Puede ser publico.
3. No agregues README desde GitHub (ya tienes uno en este paquete).
4. Sube TODO el contenido de esta carpeta (`index.html`, `assets/`,
   `reports/`, este `README.md`). El folder `worker/` tambien lo subes al
   repo como respaldo, pero su codigo se despliega aparte (paso 3), no lo
   sirve GitHub Pages.

Desde tu computadora, si usas git:
```bash
cd sitio-estado-proyecto
git init
git add .
git commit -m "Version inicial del chat de estado"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/zerocode-estado-proyecto.git
git push -u origin main
```

### Paso 2 — Activa GitHub Pages

1. En tu repo: **Settings → Pages**.
2. En "Source" elige la rama `main` y la carpeta `/ (root)`.
3. Guarda. En 1-2 minutos tendras una URL como:
   `https://tu-usuario.github.io/zerocode-estado-proyecto/`
   Esa es la que compartiras con tu cliente. Es publica, sin login.

### Paso 3 — Despliega el proxy que conecta con el LLM (una sola vez)

Este proxy usa **DeepSeek V4-Flash** (no Anthropic): mucho mas barato para
uso pesado del cliente ($0.14 / $0.28 por millon de tokens), y DeepSeek
regala 5 millones de tokens gratis a cada cuenta nueva. Ojo: eso no es un
plan gratis permanente, es un credito inicial; despues se cobra por uso
(muy poco). Ademas, DeepSeek procesa las solicitudes en su propia
infraestructura (empresa china) — tenlo en cuenta si el reporte del
cliente tiene informacion sensible.

Necesitas:
- Una cuenta gratis en Cloudflare (dash.cloudflare.com/sign-up)
- Una API key de DeepSeek (platform.deepseek.com -> API Keys)

```bash
npm install -g wrangler
wrangler login
wrangler init proxy-zerocode
# Elige: "Hello World Worker" -> JavaScript
```

Abre el archivo `src/index.js` que crea wrangler y reemplaza TODO su
contenido por el de `worker/proxy.js` de este paquete.

```bash
cd proxy-zerocode
wrangler secret put DEEPSEEK_API_KEY
# Pega aqui tu API key de DeepSeek cuando te la pida (no se muestra en pantalla)
wrangler deploy
```

Al terminar, wrangler te da una URL como:
`https://proxy-zerocode.tu-usuario.workers.dev`

### Paso 4 — Conecta la pagina con el proxy

1. Abre `index.html` (en tu repo o localmente).
2. Busca:
   ```js
   const PROXY_URL = "https://TU-WORKER.tu-usuario.workers.dev";
   ```
3. Reemplaza por la URL real que te dio wrangler en el paso 3.
4. Recomendado: en `worker/proxy.js`, cambia
   ```js
   const ALLOWED_ORIGIN = "*";
   ```
   por tu URL real de GitHub Pages, ej:
   `"https://tu-usuario.github.io"`, y vuelve a correr `wrangler deploy`.
   Esto evita que otros sitios usen tu proxy y gasten tu saldo de API.
5. Sube el `index.html` actualizado a GitHub:
   ```bash
   git add index.html
   git commit -m "Conectar proxy"
   git push
   ```

### Paso 5 — Prueba

Abre `https://tu-usuario.github.io/zerocode-estado-proyecto/` en una
ventana de incognito (para simular que eres el cliente, sin sesion
iniciada en nada) y haz una pregunta. Deberia responder usando el
contenido real de `alcance.md` y `avance.md`.

---

## Como actualizas la informacion despues

Edita `reports/alcance.md` y/o `reports/avance.md` directamente en GitHub
(boton de lapiz "Edit file"), o `reports/status.json` para cambiar el
nombre del proyecto o el semaforo de estado (`ontrack`, `atrisk`,
`delayed`). Haz commit y en segundos el chat ya responde con lo nuevo.

Para generar el contenido de `avance.md`, pidele a Claude (con tus
conectores de GitHub y Google Drive activados) que compare el documento de
alcance contra el estado real del repositorio, y pega el resultado ahi.

## Cambiar el logo

Reemplaza `assets/logo.png` por otra imagen con el mismo nombre, o cambia
la ruta en `index.html`:
```js
const LOGO_PATH = "./assets/logo.png";
```

## Costos

- GitHub Pages: gratis.
- Cloudflare Workers: gratis hasta 100,000 solicitudes/dia.
- DeepSeek: 5 millones de tokens gratis al crear la cuenta (alcanza para
  cientos de conversaciones). Despues de eso, pago por uso a ~$0.14 por
  millon de tokens de entrada -- muchisimo mas barato que Claude u OpenAI,
  pero no gratis de forma permanente.

## Si prefieres volver a usar Claude en vez de DeepSeek

El unico archivo que cambia es `worker/proxy.js`. Anteriormente usabamos
la API de Anthropic ahi; si quieres volver, dimelo y te regreso esa
version (llamaba a api.anthropic.com con el modelo claude-sonnet-4-6).
`index.html` no necesita cambios en ningun caso, porque el proxy siempre
traduce la respuesta al mismo formato.
