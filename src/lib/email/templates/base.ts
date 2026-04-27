export function emailLayout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; background-color: #F5F0E8; font-family: 'Helvetica Neue', Arial, sans-serif; color: #141414; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
    .card { background: #ffffff; border-radius: 16px; padding: 40px 32px; }
    .logo { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; color: #141414; margin-bottom: 32px; }
    .logo span { color: #C9561E; }
    h1 { font-size: 24px; font-weight: 700; margin: 0 0 16px; line-height: 1.3; color: #141414; }
    p { font-size: 15px; line-height: 1.6; color: #141414; opacity: 0.7; margin: 0 0 16px; }
    .highlight { color: #C9561E; font-weight: 600; opacity: 1; }
    .divider { border: none; border-top: 1px solid rgba(20,20,20,0.08); margin: 24px 0; }
    .detail-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #141414; opacity: 0.4; margin: 0 0 4px; font-weight: 600; }
    .detail-value { font-size: 15px; color: #141414; margin: 0 0 16px; }
    .footer { text-align: center; padding: 24px 0 0; font-size: 12px; color: #141414; opacity: 0.35; }
    .footer a { color: #C9561E; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">Neelakar <span>Creative House</span></div>
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Neelakar Creative House &middot; <a href="https://neelakar.com">neelakar.com</a></p>
    </div>
  </div>
</body>
</html>`
}
