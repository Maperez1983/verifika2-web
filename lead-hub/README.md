# Verifika2 Lead Hub (beta)

Servicio “ingestor” para captar leads del portal sin acoplarlo al CRM.

## Endpoints

- `GET /healthz` – healthcheck (incluye ping a Postgres)
- `POST /v1/leads` – ingesta de lead (requiere `Authorization: Bearer <HUB_TOKEN>`)
- `GET /v1/leads/recent` – últimos leads (requiere `Authorization: Bearer <HUB_TOKEN>`)
- `GET /v1/leads/search?listing_id=...` – leads por inmueble (opcional `intent=visita|info|contacto`)
- `POST /v1/leads/:id/status` – actualizar estado/resultado (visitas y seguimiento)
- `POST /v1/owners` – crear/actualizar propietario por código (requiere `Authorization: Bearer <HUB_TOKEN>`)
- `POST /v1/owners/verify` – validar código y devolver accesos (requiere `Authorization: Bearer <HUB_TOKEN>`)
- `POST /v1/slack/test` – envía un mensaje de prueba a Slack (requiere `Authorization: Bearer <HUB_TOKEN>`)
- `POST /v1/events/view` – incrementa vistas por `listing_id`
- `GET /v1/metrics?listing_id=...` – vistas + contadores (leads/visitas)
- `GET /v1/documents?listing_id=...` – checklist documental (beta)
- `POST /v1/documents` – crear solicitud documental (beta)
- `PATCH /v1/documents/:id` – actualizar estado documental (beta)
- `GET /v1/milestones?listing_id=...` – hitos/timeline (beta)
- `POST /v1/milestones` – crear hito (beta)
- `PATCH /v1/milestones/:id` – actualizar estado hito (beta)
- `GET /v1/signatures?listing_id=...` – solicitudes de firma (beta)
- `POST /v1/signatures` – crear solicitud de firma (beta)
- `PATCH /v1/signatures/:id` – actualizar estado de firma (beta)

## Variables de entorno (Render)

- `DATABASE_URL` (Render Postgres)
- `HUB_TOKEN` (token compartido con el portal)
- `OWNER_CODE_SALT` (obligatorio) – salt para hashear códigos de acceso propietario
- `SLACK_WEBHOOK_URL` (opcional) – notificación inmediata
- `CRM_LEADS_ENDPOINT` (opcional) – POST al CRM
- `CRM_TOKEN` (opcional) – Bearer token para el CRM

## Conectar con `verifika2-web`

En el servicio del portal (Next.js), configurar:

- `LEADS_WEBHOOK_URL` = `https://<tu-lead-hub>/v1/leads`
- `LEADS_WEBHOOK_TOKEN` = el mismo valor que `HUB_TOKEN`

Si `LEADS_WEBHOOK_URL` no está configurada, el portal deja el lead en logs del propio servicio.
