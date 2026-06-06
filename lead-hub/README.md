# Verifika2 Lead Hub

Servicio operativo para captar leads del portal, alimentar el CRM, gestionar accesos privados y controlar servicios premium por operación.

## Endpoints

- `GET /healthz` – healthcheck (incluye ping a Postgres)
- `POST /v1/leads` – ingesta de lead (requiere `Authorization: Bearer <HUB_TOKEN>`)
- `GET /v1/leads/recent` – últimos leads (requiere `Authorization: Bearer <HUB_TOKEN>`)
- `GET /v1/leads/search?listing_id=...` – leads por inmueble (opcional `intent=visita|info|contacto`)
- `POST /v1/leads/:id/status` – actualizar estado/resultado (visitas y seguimiento)
- `GET /v1/buyers` – compradores con acceso privado
- `POST /v1/buyers/create_code` – generar/actualizar acceso de comprador y servicios globales
- `POST /v1/buyers/verify` – validar acceso de comprador
- `GET /v1/buyers/leads?contact=...` – intereses y solicitudes del comprador
- `GET /v1/owners` – propietarios con acceso privado
- `POST /v1/owners` – crear/actualizar propietario por código (requiere `Authorization: Bearer <HUB_TOKEN>`)
- `POST /v1/owners/create_code` – generar acceso de propietario con inmuebles asignados
- `POST /v1/owners/verify` – validar código y devolver accesos (requiere `Authorization: Bearer <HUB_TOKEN>`)
- `GET /v1/operation_services` – servicios activados por inmueble y sujeto
- `POST /v1/operation_services` – activar/cambiar estado de tracking o verificación documental
- `GET /v1/service_audit` – auditoría de activaciones y cambios de estado
- `POST /v1/slack/test` – envía un mensaje de prueba a Slack (requiere `Authorization: Bearer <HUB_TOKEN>`)
- `POST /v1/events/view` – incrementa vistas por `listing_id`
- `GET /v1/metrics?listing_id=...` – vistas + contadores (leads/visitas)
- `GET /v1/documents?listing_id=...` – checklist documental
- `POST /v1/documents` – crear solicitud documental
- `PATCH /v1/documents/:id` – actualizar estado documental
- `GET /v1/milestones?listing_id=...` – hitos/timeline
- `POST /v1/milestones` – crear hito
- `PATCH /v1/milestones/:id` – actualizar estado hito
- `GET /v1/signatures?listing_id=...` – solicitudes de firma
- `POST /v1/signatures` – crear solicitud de firma
- `PATCH /v1/signatures/:id` – actualizar estado de firma

## Variables de entorno (Render)

- `DATABASE_URL` (Render Postgres)
- `HUB_TOKEN` (token compartido con el portal)
- `OWNER_CODE_SALT` (obligatorio) – salt para hashear códigos de acceso propietario
- `BUYER_CODE_SALT` (obligatorio si se separa del salt de propietario) – salt para accesos de comprador
- `SLACK_WEBHOOK_URL` (opcional) – notificación inmediata
- `CRM_LEADS_ENDPOINT` (opcional) – POST al CRM
- `CRM_TOKEN` (opcional) – Bearer token para el CRM

## Conectar con `verifika2-web`

En el servicio del portal (Next.js), configurar:

- `LEADS_WEBHOOK_URL` = `https://<tu-lead-hub>/v1/leads`
- `LEADS_WEBHOOK_TOKEN` = el mismo valor que `HUB_TOKEN`

Si `LEADS_WEBHOOK_URL` no está configurada, el portal deja el lead en logs del propio servicio.

## Ejemplos (curl)

> Todos los endpoints `/v1/*` requieren `Authorization: Bearer <HUB_TOKEN>`.

```bash
export HUB_TOKEN="...tu token..."
```

**Ver configuración**

```bash
curl -sS -H "Authorization: Bearer $HUB_TOKEN" https://lead-hub.onrender.com/v1/config
```

**Crear/actualizar un propietario (código + inmuebles)**

```bash
curl -sS -H "Authorization: Bearer $HUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Propietario Demo","contact":"owner@demo.com","code":"V2-ABCD-1234","listing_ids":["piso-centro-112m2"]}' \
  https://lead-hub.onrender.com/v1/owners
```

**Validar código de propietario**

```bash
curl -sS -H "Authorization: Bearer $HUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"V2-ABCD-1234"}' \
  https://lead-hub.onrender.com/v1/owners/verify
```
