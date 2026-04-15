export function renderApiDocs({ baseUrl }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CRM Nassau API</title>
    <style>
      :root {
        --blue-strong: #0f4c81;
        --orange: #f28c28;
        --white: #ffffff;
        --ink: #12324a;
        --muted: #5d7588;
        --line: rgba(15, 76, 129, 0.12);
        --shadow: 0 24px 60px rgba(17, 56, 88, 0.14);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Segoe UI", sans-serif;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(242, 140, 40, 0.15), transparent 20%),
          linear-gradient(135deg, #0d446f 0%, #176292 58%, #2f84b8 100%);
        min-height: 100vh;
        display: grid;
        place-items: center;
      }

      .shell {
        width: min(100%, 720px);
        padding: 24px;
      }

      .card {
        text-align: center;
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid rgba(255, 255, 255, 0.35);
        border-radius: 28px;
        padding: 40px 32px;
        box-shadow: var(--shadow);
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(242, 140, 40, 0.16);
        color: var(--orange);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      h1 {
        margin: 16px 0 10px;
        font-size: clamp(2.4rem, 7vw, 4.4rem);
        line-height: 0.95;
        letter-spacing: -0.05em;
      }

      p {
        margin: 0 auto;
        max-width: 34ch;
        font-size: 1rem;
        line-height: 1.7;
        color: var(--muted);
      }

      .button-primary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        padding: 0 20px;
        margin-top: 24px;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 700;
        background: var(--orange);
        color: var(--white);
        box-shadow: 0 14px 30px rgba(242, 140, 40, 0.28);
        transition: transform 160ms ease, box-shadow 160ms ease;
      }

      .button-primary:hover {
        transform: translateY(-1px);
      }

      .meta {
        display: block;
        margin-top: 18px;
        color: var(--muted);
        font-size: 0.92rem;
      }

      @media (max-width: 640px) {
        .shell {
          padding: 16px;
        }

        .card {
          border-radius: 20px;
          padding: 32px 24px;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="card">
        <span class="badge">Nassau Tecnologia</span>
        <h1>Global API</h1>
        <p>A documentação técnica da API está disponível na área de docs.</p>
        <a class="button-primary" href="/docs">Ir para /docs</a>
        <span class="meta">${baseUrl}</span>
      </section>
    </main>
  </body>
</html>`;
}
