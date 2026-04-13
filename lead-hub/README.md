# Verifika2 Lead Hub (beta)

Servicio “ingestor” para captar leads del portal sin acoplarlo al CRM.

## Endpoints

- `GET /healthz` – healthcheck (incluye ping a Postgres)
- `POST /v1/leads` – ingesta de lead (requiere `Authorization: Bearer <HUB_TOKEN>`)
- `GET /v1/leads/recent` – últimos leads (requiere `Authorization: Bearer <HUB_TOKEN>`)
- `GET /v1/leads/search?listing_id=...` – leads por inmueble (opcional `intent=visita|info|contacto`)
- `POST /v1/leads/:id/status` – actualizar estado/resultado (visitas y seguimiento)
- `POST /v1/slack/test` – envía un mensaje de prueba a Slack (requiere `Authorization: Bearer <HUB_TOKEN>`)
- `POST /v1/events/view` – incrementa vistas por `listing_id`
- `GET /v1/metrics?listing_id=...` – vistas + contadores (leads/visitas)
- `GET /v1/documents?listing_id=...` – checklist documental (beta)
- `POST /v1/documents` – crear solicitud documental (beta)
- `PATCH /v1/documents/:id` – actualizar estado documental (beta)

## Variables de entorno (Render)

- `DATABASE_URL` (Render Postgres)
- `HUB_TOKEN` (token compartido con el portal)
- `SLACK_WEBHOOK_URL` (opcional) – notificación inmediata
- `CRM_LEADS_ENDPOINT` (opcional) – POST al CRM
- `CRM_TOKEN` (opcional) – Bearer token para el CRM

## Conectar con `verifika2-web`

En el servicio del portal (Next.js), configurar:

- `LEADS_WEBHOOK_URL` = `https://<tu-lead-hub>/v1/leads`
- `LEADS_WEBHOOK_TOKEN` = el mismo valor que `HUB_TOKEN`

Si `LEADS_WEBHOOK_URL` no está configurada, el portal deja el lead en logs del propio servicio.
