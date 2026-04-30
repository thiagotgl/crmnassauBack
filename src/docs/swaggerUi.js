export function renderSwaggerUi({ title, specUrl }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      :root {
        --blue-900: #0b3a60;
        --blue-700: #125b8f;
        --blue-500: #2f84b8;
        --blue-100: #eaf4fb;
        --orange-500: #f28c28;
        --orange-100: #fff1e4;
        --red-500: #e53e3e;
        --red-100: #fff5f5;
        --white: #ffffff;
        --ink: #12324a;
        --muted: #607b90;
        --line: rgba(18, 50, 74, 0.1);
        --shadow-lg: 0 28px 80px rgba(10, 47, 76, 0.18);
        --shadow-md: 0 16px 44px rgba(10, 47, 76, 0.1);
      }

      html {
        box-sizing: border-box;
        overflow-y: scroll;
      }

      *, *:before, *:after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        font-family: "Segoe UI", sans-serif;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(242, 140, 40, 0.18), transparent 16%),
          radial-gradient(circle at top right, rgba(255, 255, 255, 0.16), transparent 20%),
          linear-gradient(135deg, #0d446f 0%, #176292 58%, #2f84b8 100%);
      }

      .topbar {
        display: none;
      }

      .page-shell {
        width: min(100%, 1240px);
        margin: 0 auto;
        padding: 28px 20px 48px;
      }

      .hero {
        position: relative;
        overflow: hidden;
        margin-bottom: 22px;
        padding: 28px 30px;
        border-radius: 28px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(247, 251, 255, 0.98) 100%);
        border: 1px solid rgba(255, 255, 255, 0.38);
        box-shadow: var(--shadow-lg);
      }

      .hero::after {
        content: "";
        position: absolute;
        top: -70px;
        right: -60px;
        width: 220px;
        height: 220px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(242, 140, 40, 0.16) 0%, rgba(242, 140, 40, 0) 72%);
        pointer-events: none;
      }

      .hero-row {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(242, 140, 40, 0.14);
        color: var(--orange-500);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .hero h1 {
        margin: 14px 0 8px;
        font-size: clamp(2rem, 5vw, 3.4rem);
        line-height: 0.96;
        letter-spacing: -0.05em;
      }

      .hero p {
        margin: 0;
        max-width: 56ch;
        color: var(--muted);
        line-height: 1.7;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
      }

      .hero-button,
      .hero-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        padding: 0 18px;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 700;
        transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
      }

      .hero-button {
        background: var(--orange-500);
        color: var(--white);
        box-shadow: 0 14px 28px rgba(242, 140, 40, 0.24);
      }

      .hero-link {
        background: rgba(18, 91, 143, 0.08);
        border: 1px solid rgba(18, 91, 143, 0.12);
        color: var(--blue-700);
      }

      .hero-button:hover,
      .hero-link:hover {
        transform: translateY(-1px);
      }

      .docs-panel {
        padding: 10px;
        border-radius: 30px;
        background: rgba(255, 255, 255, 0.16);
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow: var(--shadow-md);
        backdrop-filter: blur(8px);
      }

      .swagger-ui {
        color: var(--ink);
      }

      .swagger-ui .wrapper {
        max-width: none;
        padding: 0;
      }

      .swagger-ui .information-container,
      .swagger-ui .scheme-container,
      .swagger-ui .opblock,
      .swagger-ui .responses-inner,
      .swagger-ui .model-box,
      .swagger-ui .dialog-ux .modal-ux,
      .swagger-ui section.models {
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid rgba(255, 255, 255, 0.35);
        box-shadow: var(--shadow-md);
      }

      .swagger-ui .information-container {
        padding-bottom: 0;
        border-radius: 28px;
        margin: 0 0 18px;
      }

      .swagger-ui .info {
        margin: 0;
        padding: 28px;
      }

      .swagger-ui .info .title {
        color: var(--ink);
        font-size: clamp(2rem, 5vw, 3.2rem);
        letter-spacing: -0.04em;
      }

      .swagger-ui .info .title small {
        background: var(--blue-100);
        color: var(--blue-700);
        border-radius: 999px;
      }

      .swagger-ui .info p,
      .swagger-ui .info li,
      .swagger-ui .markdown p,
      .swagger-ui .markdown li,
      .swagger-ui .opblock-description-wrapper p,
      .swagger-ui .opblock-external-docs-wrapper p,
      .swagger-ui .response-col_description__inner p {
        color: var(--muted);
      }

      .swagger-ui .scheme-container {
        border-radius: 22px;
        padding: 18px 24px;
        margin: 0 0 18px;
      }

      .swagger-ui .scheme-container .schemes > label {
        color: var(--ink);
      }

      .swagger-ui .opblock-tag {
        color: var(--ink);
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid var(--line);
        border-radius: 20px;
        margin-bottom: 14px;
        padding: 16px 18px;
      }

      .swagger-ui .opblock-tag small {
        color: var(--muted);
      }

      .swagger-ui .opblock {
        border-radius: 24px;
        overflow: hidden;
        margin: 0 0 16px;
      }

      .swagger-ui .opblock .opblock-summary {
        border-color: var(--line);
      }

      .swagger-ui .opblock-summary-path,
      .swagger-ui .opblock-summary-description,
      .swagger-ui .parameter__name,
      .swagger-ui .response-col_status,
      .swagger-ui table thead tr td,
      .swagger-ui table thead tr th {
        color: var(--ink);
      }

      .swagger-ui .opblock-summary-method {
        border-radius: 999px;
        font-weight: 700;
        min-width: 78px;
      }

      .swagger-ui .opblock.opblock-post {
        border-color: rgba(242, 140, 40, 0.26);
        background: rgba(255, 241, 228, 0.96);
      }

      .swagger-ui .opblock.opblock-post .opblock-summary-method {
        background: var(--orange-500);
      }

      .swagger-ui .opblock.opblock-post .opblock-summary {
        border-color: rgba(242, 140, 40, 0.24);
      }

      .swagger-ui .opblock.opblock-get {
        border-color: rgba(18, 91, 143, 0.22);
        background: rgba(234, 244, 251, 0.98);
      }

      .swagger-ui .opblock.opblock-get .opblock-summary-method {
        background: var(--blue-700);
      }

      .swagger-ui .opblock.opblock-put {
        border-color: rgba(47, 132, 184, 0.24);
        background: rgba(234, 244, 251, 0.96);
      }

      .swagger-ui .opblock.opblock-put .opblock-summary-method {
        background: var(--blue-500);
      }

      .swagger-ui .opblock.opblock-put .opblock-summary {
        border-color: rgba(47, 132, 184, 0.2);
      }
      
      .swagger-ui .opblock.opblock-delete {
        border-color: rgba(229, 62, 62, 0.2);
        background: rgba(255, 245, 245, 0.96);
      }

      .swagger-ui .opblock.opblock-delete .opblock-summary-method {
        background: var(--red-500);
      }

      .swagger-ui .opblock.opblock-delete .opblock-summary {
        border-color: rgba(229, 62, 62, 0.18);
      }

      .swagger-ui .btn.authorize,
      .swagger-ui .btn.execute {
        background: var(--orange-500);
        border-color: var(--orange-500);
        color: var(--white);
        box-shadow: 0 10px 24px rgba(242, 140, 40, 0.2);
      }

      .swagger-ui .btn.authorize svg {
        fill: currentColor;
      }

      .swagger-ui .btn.cancel {
        border-color: #cc4b37;
        color: #cc4b37;
      }

      .swagger-ui .btn,
      .swagger-ui select,
      .swagger-ui input[type=text],
      .swagger-ui input[type=password],
      .swagger-ui input[type=search],
      .swagger-ui textarea {
        border-radius: 14px;
      }

      .swagger-ui input[type=text],
      .swagger-ui input[type=password],
      .swagger-ui input[type=search],
      .swagger-ui textarea,
      .swagger-ui select {
        border: 1px solid var(--line);
        color: var(--ink);
      }

      .swagger-ui textarea {
        background: #fcfdff;
      }

      .swagger-ui section.models {
        border-radius: 24px;
        padding: 12px 0;
      }

      .swagger-ui .model-box,
      .swagger-ui .responses-inner {
        border-radius: 18px;
      }

      .swagger-ui .tab li {
        color: var(--muted);
      }

      .swagger-ui .tab li.active {
        color: var(--blue-700);
      }

      .swagger-ui .dialog-ux .modal-ux {
        border-radius: 24px;
      }

      .swagger-ui .dialog-ux .modal-ux-header {
        background: var(--blue-900);
      }

      .swagger-ui .dialog-ux .modal-ux-header h3 {
        color: var(--white);
      }

      .swagger-ui .servers-title,
      .swagger-ui .opblock-section-header h4,
      .swagger-ui .responses-inner h4,
      .swagger-ui .responses-inner h5,
      .swagger-ui .model-title {
        color: var(--ink);
      }

      .swagger-ui .copy-to-clipboard {
        background: var(--blue-soft);
      }

      .swagger-ui a {
        color: var(--blue-700);
      }

      .swagger-ui .response-control-media-type__accept-message,
      .swagger-ui .response-control-media-type__title,
      .swagger-ui .parameter__type,
      .swagger-ui .parameter__deprecated,
      .swagger-ui .parameter__in,
      .swagger-ui .opblock-summary-operation-id,
      .swagger-ui .opblock-summary-path__deprecated {
        color: var(--muted);
      }

      @media (max-width: 640px) {
        .page-shell {
          padding: 16px;
        }

        .hero {
          padding: 22px 20px;
          border-radius: 22px;
        }

        .hero-row {
          flex-direction: column;
          align-items: flex-start;
        }

        .docs-panel {
          border-radius: 22px;
        }

        .swagger-ui .info,
        .swagger-ui .scheme-container {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <main class="page-shell">
      <section class="hero">
        <div class="hero-row">
          <div>
            <span class="eyebrow">Global API</span>
            <h1>${title}</h1>
            <p>Documentação técnica interativa da API do Global, o CRM da Nassau Tecnologia.</p>
          </div>
          <div class="hero-actions">
            <a class="hero-button" href="/">Voltar para início</a>
            <a class="hero-link" href="/openapi.json">Ver OpenAPI JSON</a>
          </div>
        </div>
      </section>
      <section class="docs-panel">
        <div id="swagger-ui"></div>
      </section>
    </main>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '${specUrl}',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          layout: 'BaseLayout'
        });
      };
    </script>
  </body>
</html>`;
}
