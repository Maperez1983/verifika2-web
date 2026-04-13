## Verifika2 Web (portal + owner portal)

Portal público (listados/landing) + “Owner Portal” para propietarios (seguimiento, documentación, hitos, firmas y métricas), conectado al servicio `lead-hub/`.

### Rutas principales

- Landing/portal: `/`
- Inmuebles: `/inmuebles`
- Interés/contacto: `/interes`
- Publicar (demo): `/publicar`
- Acceso portal (si está protegido): `/acceso`
- Owner Portal (requiere código): `/owner/acceso`
- Healthcheck: `/healthz`
- Debug Lead Hub: `/api/debug/lead-hub`

### Desarrollo local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

### Variables de entorno (Render)

**Conexión con Lead Hub (recomendado)**

- `LEADS_WEBHOOK_URL` = `https://lead-hub.onrender.com/v1/leads` (o `LEAD_HUB_URL`)
- `LEADS_WEBHOOK_TOKEN` = mismo valor que `HUB_TOKEN` (o `LEAD_HUB_TOKEN`)

**Protección por contraseña del portal (opcional, recomendable en beta)**

- `PORTAL_PASSWORD` = contraseña
- `PORTAL_AUTH_SECRET` = secreto largo aleatorio (HMAC)

**Sesiones Owner Portal (obligatorio si usas `/owner/*`)**

- `OWNER_SESSION_SECRET` = secreto largo aleatorio

### Lead Hub

Ver `lead-hub/README.md` para endpoints, variables y cómo crear códigos de propietario.
