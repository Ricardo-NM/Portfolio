# Portfolio

Portafolio personal, desarrollado con Astro, React y TypeScript. El sitio presenta perfil profesional, experiencia laboral, logros, tecnologías, actividad de GitHub y un formulario de contacto conectado con Resend.

## Características

- Sitio SSR con Astro y adapter standalone de Node.js.
- Componentes interactivos construidos con React.
- Soporte de idioma español/inglés y tema claro/oscuro.
- Secciones para experiencia, logros, tecnologías, actividad de GitHub y contacto.
- API interna para consultar contribuciones de GitHub.
- Endpoint de contacto con validación de datos y envío de correo mediante Resend.

## Tecnologías

- Astro
- React
- TypeScript
- Node.js
- Resend
- Lucide React

## Requisitos

- Node.js 20 o superior.
- npm.
- Token de GitHub para cargar actividad/contribuciones.
- Cuenta y API key de Resend para habilitar el formulario de contacto.

## Configuración

1. Instala dependencias:

```bash
npm install
```

2. Crea el archivo de variables de entorno:

```bash
cp .env.example .env
```

3. Actualiza `.env` con tus valores:

```env
GITHUB_TOKEN=replace_with_github_token
RESEND_API_KEY=replace_with_resend_api_key
CONTACT_TO_EMAIL=your_inbox@example.com
CONTACT_FROM_EMAIL="Portfolio Contact <onboarding@resend.dev>"
```

## Scripts

```bash
npm run dev
```

Inicia el servidor de desarrollo.

```bash
npm run build
```

Valida el proyecto con `astro check` y genera la versión de producción.

```bash
npm run preview
```

Previsualiza la versión generada.

## Estructura

```text
src/
  components/   Componentes de interfaz y controles interactivos
  data/         Datos usados por las vistas del portfolio
  hooks/        Hooks de React
  layouts/      Layout base del sitio
  pages/        Rutas y endpoints de Astro
public/
  assets/       Imágenes, iconos y CV
```

## Variables de entorno

| Variable             | Descripción                                                 |
| -------------------- | ----------------------------------------------------------- |
| `GITHUB_TOKEN`       | Token usado para consultar la actividad de GitHub.          |
| `RESEND_API_KEY`     | API key de Resend para enviar mensajes desde el formulario. |
| `CONTACT_TO_EMAIL`   | Correo donde llegarán los mensajes del formulario.          |
| `CONTACT_FROM_EMAIL` | Remitente verificado configurado en Resend.                 |

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.
