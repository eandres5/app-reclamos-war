# App Reclamos (Frontend)

Sistema de gestión de reclamos para clientes. Permite a los clientes autenticarse con su cédula, consultar sus datos y registrar reclamos.

---

## Stack Tecnológico

| Tecnología       | Versión   | Uso                                    |
|------------------|-----------|----------------------------------------|
| Angular          | 19        | Framework frontend                     |
| PrimeNG          | 19        | Componentes UI                         |
| PrimeFlex        | 4.0       | Utilidades CSS                         |
| PrimeIcons       | 7.0       | Iconografía                            |
| TypeScript       | 5.7       | Lenguaje                               |
| Signals          | Angular 19| Reactividad moderna                    |
| JWT              | —         | Autenticación con token                |

---

## Requisitos Previos

- **Node.js** >= 20.x
- **npm** >= 10.x
- **Angular CLI** >= 19.x
- **Maven** >= 3.9 (Para generar WAR)

---

## Instalación

```bash
# 1. Clonar el repositorio
https://github.com/eandres5/app-reclamos-war.git
cd app-reclamos

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
ng serve
```

La aplicación estará disponible en: **http://localhost:4200**

---

## Build por Ambiente

```bash
# Desarrollo
npm run build:desa

# QA
npm run build:qa

# Producción
npm run build:prod
```

Los archivos compilados se generan en: `dist/app-reclamos/browser/`

---

## Generar WAR

El WAR permite desplegar el frontend en un servidor de aplicaciones Java (Tomcat, WildFly, WebSphere).

```bash
# desde el directorio raiz ejectuar el siguiente comando
mvn clean package -DskipTests

```
El archivo .war generado por el comando se encontrara en la siguiente ruta `/app-reclamos-war/target/` con el nombre `app-reclamos.war`

## WAR

El archivo .war se se encontrará dentro de este repositorio en la ruta principal del proyecto con el nombre `app-reclamos.war`

## Estructura del Proyecto

```
src/app/
├── core/                              # Capa CORE (singleton)
│   ├── guards/
│   │   └── auth.guard.ts              # Protección de rutas
│   ├── interceptors/
│   │   └── jwt.interceptor.ts         # Inyección automática del JWT
│   ├── services/
│   │   └── auth.service.ts            # Lógica de autenticación
│   └── models/
│       ├── auth.model.ts              # DTOs de login
│       ├── cliente.model.ts           # Entidad Cliente
│       └── reclamo.model.ts           # Entidad Reclamo + Enum tipos
│
├── features/                          # Capa FEATURES (negocio)
│   ├── auth/
│   │   └── login/
│   │       └── login.component.ts     # Pantalla de login
│   └── reclamos/
│       ├── services/
│       │   └── reclamo.service.ts     # Servicio de reclamos
│       └── pages/
│           └── registro-reclamo/
│               └── registro-reclamo.component.ts  # Formulario principal
│
├── app.component.ts                   # Componente raíz
├── app.config.ts                      # Configuración standalone
└── app.routes.ts                      # Rutas con lazy loading
```

---

## Flujo Funcional

```
1. LOGIN
   → Cliente ingresa cédula + contraseña
   → POST /v1/api/auth/login
   → Recibe JWT + nombres + apellidos
   → Almacena token en localStorage

2. REGISTRO DE RECLAMO
   → Cliente ingresa cédula en campo "Identificación"
   → Click en "Consultar"
   → GET /v1/api/clientes/{cedula} (con JWT)
   → Se muestran nombres y apellidos (campos deshabilitados)
   → Se habilitan campos: Tipo Reclamo + Detalle

3. GUARDAR RECLAMO
   → Cliente selecciona tipo y escribe detalle
   → Click en "Guardar Reclamo"
   → POST /api/reclamos (con JWT)
   → Modal: "¿Desea ingresar un nuevo reclamo?"
     → SÍ: Limpia formulario, permanece en la página
     → NO: Cierra sesión, redirige al login
```

---

## Credenciales de Prueba

| Cédula       | Nombre                    | Contraseña  |
|--------------|---------------------------|-------------|
| 1712345678   | Juan Carlos Pérez López   | juan1234    |
| 1798765432   | María Elena González Ruiz | maria1234   |
| 0501234567   | Carlos Andrés Ramírez T.  | carlos1234  |
| 0912345678   | Ana Gabriela Mendoza S.   | ana1234     |
| 1104567890   | Luis Fernando Castillo H. | luis1234    |

> **Nota:** Estas credenciales son cargadas automáticamente por el backend (DataLoader) al iniciar la aplicación.

---

## Endpoints del Backend (esperados)

| Método | Endpoint                    | Auth  | Descripción              |
|--------|-----------------------------|-------|--------------------------|
| POST   | `/v1/api/auth/login`        | ✗     | Login → retorna JWT      |
| GET    | `/v1/api/clientes/{cedula}` | ✓ JWT | Consultar cliente        |
| POST   | `/v1/api/reclamos`          | ✓ JWT | Registrar reclamo        |

---
