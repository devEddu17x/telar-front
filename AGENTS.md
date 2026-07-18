# AGENTS.md

Contexto operativo para futuros agentes trabajando en este repo.

## Producto

Esta app es el frontend administrativo de Telar, orientado a empresas que
producen ropa. El usuario dueño del proyecto es backend/cloud y conoce a fondo
el backend e infraestructura, pero no necesariamente los detalles internos de
Next.js.

El frontend debe comportarse como una SPA/frontend tradicional:

- Las operaciones principales llaman directo a una API externa.
- No se deben reintroducir Server Actions para operaciones de negocio.
- No se debe usar Next como proxy del backend.
- El objetivo de despliegue es hosting estatico sin compute, idealmente S3 +
  CloudFront, aunque tambien puede probarse en Vercel o Amplify.

## Backend Y Entorno

El backend se documenta en `api-docs-json.json`.

`NEXT_PUBLIC_API_URL` incluye el prefijo completo `/api/v1`. Por ejemplo:

```env
NEXT_PUBLIC_API_URL=https://api.example.com/api/v1
```

Por eso las llamadas deben usar endpoints relativos como:

```ts
apiRequest('/auth/register')
apiRequest('/customers')
apiRequest('/quotes')
```

No agregar de nuevo `/api/v1` en codigo.

Variables canonicas:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_AWS_COGNITO_REGION=
NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID=
NEXT_PUBLIC_AWS_COGNITO_ENDPOINT=
ASSETS_HOSTNAME=
```

No usar `NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID`; el nombre valido es
`NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID`.

`NEXT_PUBLIC_AWS_COGNITO_ENDPOINT` es opcional y se usa solo en desarrollo local
para apuntar a un emulador compatible, por ejemplo `http://localhost:9229`. Si
esta vacia o no existe, el SDK usa Cognito AWS de la region configurada.

Para el stack local, el frontend normalmente apunta a una API local y Cognito
Local en `http://localhost:9229`. Las credenciales AWS de emuladores y tokens
internos son solo del backend: nunca exponerlos con prefijo `NEXT_PUBLIC_`. Las
subidas con URLs firmadas salen desde el navegador; el storage local o remoto
debe permitir CORS desde el origen del frontend (`http://localhost:3002` en
desarrollo).

`ASSETS_HOSTNAME` debe ser solo el hostname, sin protocolo. Ejemplos:

```env
ASSETS_HOSTNAME=d123abcxyz.cloudfront.net
ASSETS_HOSTNAME=assets.example.com
```

## Autenticacion

La autenticacion usa Cognito directo desde el cliente.

Detalles importantes:

- El login usa Cognito `USER_PASSWORD_AUTH`.
- El refresh usa Cognito `REFRESH_TOKEN_AUTH`.
- El backend espera el `IdToken` en `Authorization: Bearer <idToken>`.
- Cognito no entrega el token por header; el frontend guarda tokens recibidos
  desde la respuesta.
- El registro de tenant/usuario principal es la excepcion: debe pasar por
  `/auth/register`, porque el backend crea tenant, usuario local y recursos
  asociados.
- El resto de operaciones de auth se hacen directo contra Cognito cuando aplica.

Sesion cliente:

- Ver `modules/auth/lib/session-client.ts`.
- El refresh token se usa para obtener un nuevo id token cuando expira.
- `apiRequest` reintenta una vez ante `401` despues de refrescar sesion.
- `403` no debe refrescar sesion; representa falta real de permisos.

## Cliente API

El cliente HTTP central esta en:

```txt
lib/api/client.ts
```

Reglas:

- No usar `fetchWithAuth`; fue eliminado.
- No crear wrappers server-side.
- No leer cookies desde servidor.
- No manejar todos los `404` globalmente como vacios.
- El manejo especifico de errores debe vivir en el cliente de cada modulo.

Ejemplo importante:

- En listados de cotizaciones y ordenes, el backend puede devolver `404` cuando
  no hay datos. Para esos listados se interpreta como `[]`.
- En detalles (`/quotes/{id}`, `/orders/{id}`), `404` debe seguir siendo error
  real de "no encontrado".

Contrato de empleados:

- La tabla de empleados necesita `roles: string[]` en la respuesta de
  `GET /admin/employees` para mostrar los badges. Si el backend no incluye esa
  propiedad, el cliente la normaliza como `[]` y la celda queda vacia.
- Los valores internos son `owner`, `admin` y `seller`; en la tabla se muestran
  como `Dueño`, `Administrador` y `Vendedor`.

## Modulos Migrados

Los modulos principales ya fueron migrados a llamadas cliente:

- Auth
- Empleados
- Clientes
- Prendas
- Cotizaciones
- Ordenes
- Dashboard/layout/perfil

Ecommerce fue eliminado porque el backend lo depreco.

El dashboard de admin no consume metricas. Muestra un collage de prendas con
`getClothesClient` en `modules/clothes/ui/components/clothes-collage.tsx`; cada
tile enlaza al detalle usando `detailPath`.

No deben volver a crearse:

- `modules/**/actions`
- `modules/**/queries.ts`
- `lib/fetch.ts`
- `modules/auth/lib/dal.ts`
- `cookies()` / `headers()` / `server-only` para flujos principales

## Rutas Y Export Estatico

El proyecto esta configurado para export estatico:

```ts
// next.config.ts
output: 'export'
```

Tambien se usa:

```ts
images: {
  unoptimized: true
}
```

Esto evita depender del servidor de optimizacion de imagenes de Next. Las
imagenes remotas se sirven directamente desde S3/CloudFront u otro CDN.

Las rutas con IDs no usan segmentos dinamicos `[id]`, porque eso impide un
export estatico simple con IDs desconocidos en build time.

Patron actual:

```txt
/admin/clothes/detail?id=...
/admin/clothes/edit?id=...
/admin/quotations/detail?id=...
/admin/quotations/edit?id=...
/admin/orders/detail?id=...
```

Tambien existen equivalentes para `/seller`.

Para construir links usar:

```ts
import { detailPath, editPath } from '@/lib/routes'
```

No volver a rutas tipo:

```txt
/admin/clothes/{id}
/admin/clothes/{id}/edit
```

## Validaciones De Dominio

- Prendas: descripcion vacia o de hasta 1024 caracteres; al crear, una
  descripcion vacia se omite del payload. Precio base entre 1 y 1000; precio
  adicional de variantes entre 0 y 1000.
- Cotizaciones: cantidad por detalle es entero entre 1 y 100000. Las
  personalizaciones se limitan a `min(cantidad, 100)`. Sus atributos son
  opcionales; strings vacios se transforman en atributos omitidos. Cuando se
  envian: nombre 1..100, numero 0..100 y notas 1..1024.
- Ordenes: fecha de entrega no puede estar en el pasado, sin maximo artificial
  de dias. Departamento, ciudad y distrito son 1..100; direccion exacta es
  1..255.

## Despliegue

Para hosting estatico:

```bash
pnpm run build
```

El artefacto correcto es:

```txt
out/
```

Para S3 + CloudFront, subir el contenido de `out/`, no `.next/`.

Para probar localmente:

```bash
pnpx serve@latest out
```

En Vercel:

- Mantener Framework Preset: `Next.js`.
- No poner `out` como Output Directory cuando se usa preset Next.js.
- Agregar env vars `NEXT_PUBLIC_*` y `ASSETS_HOSTNAME`.

## Validaciones

Comandos utiles:

```bash
pnpm exec tsc --noEmit
pnpm run build
```

Lint enfocado:

```bash
pnpm exec eslint <archivos-tocados>
```

El lint global puede reportar un error preexistente en
`components/ui/sidebar.tsx` por `Math.random()` durante render. No pertenece a
la migracion de Server Actions.

`components.json` solo configura el CLI de shadcn. No es necesario en runtime;
si se elimina, restaurarlo antes de usar el CLI para agregar componentes.

## Roadmap

El historial de fases de migracion esta en:

```txt
docs/server-actions-migration-roadmap.md
```

Consultar ese archivo antes de hacer cambios grandes.
