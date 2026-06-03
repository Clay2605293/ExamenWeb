# Examen Web - Backend y Frontend

Este repositorio contiene una aplicación web dividida en dos componentes principales:

* **Backend:** API desarrollada con Spring Boot.
* **Frontend:** Aplicación cliente que consume los servicios expuestos por el backend.

Este documento se irá actualizando conforme avance la revisión técnica, corrección de errores, integración entre componentes y validación funcional.

---

# 1. Backend

## 1.1 Descripción general

El backend es una API REST desarrollada con **Spring Boot**. Actualmente expone servicios para consultar métricas de productividad de un desarrollador, tales como commits, bugs corregidos, tareas completadas y story points.

La aplicación levanta en el puerto `8080` y expone endpoints bajo la ruta `/metrics`.

Actualmente, la información regresada por la API proviene de datos simulados en memoria. No existe persistencia real en base de datos para las métricas consultadas.

---

## 1.2 Tecnologías identificadas

El backend utiliza las siguientes tecnologías:

* Java 21
* Spring Boot
* Spring Web
* Spring Security
* Spring Data JPA
* H2 Database
* Lombok
* Maven

Aunque el proyecto incluye dependencias relacionadas con JPA y H2, en el estado actual del código no existen entidades JPA ni repositorios reales de persistencia. La información se genera desde una clase que devuelve datos hardcodeados.

---

## 1.3 Estructura del backend

La estructura principal del backend es la siguiente:

```text
src/main/java/com/exampleback/demo
├── DemoApplication.java
├── config
│   ├── CorsConfig.java
│   └── SecurityConfig.java
├── controller
│   └── MetricsController.java
├── dto
│   ├── MetricRequestDTO.java
│   └── MetricResponseDTO.java
├── model
│   └── DeveloperMetric.java
├── repository
│   ├── DeveloperMetricRepository.java
│   └── MetricResponseDTO.java
└── service
    └── MetricsService.java
```

La organización intenta seguir una separación por capas:

* `controller`: expone endpoints REST.
* `service`: contiene la lógica de transformación de métricas.
* `repository`: provee los datos usados por el servicio.
* `model`: representa el modelo de datos usado internamente.
* `dto`: define objetos de transferencia para entrada o salida de datos.
* `config`: contiene configuración de CORS y seguridad.

---

## 1.4 Cómo ejecutar el backend

Desde la carpeta raíz del backend:

```bash
chmod +x ./mvnw
./mvnw spring-boot:run
```

Si se prefiere usar Maven instalado localmente:

```bash
mvn spring-boot:run
```

Cuando el backend arranca correctamente, debe observarse un log similar a:

```text
Tomcat started on port 8080 (http) with context path '/'
Started DemoApplication
```

La aplicación queda disponible en:

```text
http://localhost:8080
```

---

## 1.5 Validación inicial

Al abrir directamente:

```text
http://localhost:8080/
```

Spring Boot devuelve una página Whitelabel con error `404 Not Found`.

Esto ocurre porque el backend no define un endpoint para la ruta raíz `/`. No significa que la API esté caída; únicamente indica que no existe un controlador asociado a esa ruta.

La API debe probarse usando los endpoints reales bajo `/metrics`.

---

## 1.6 Endpoints disponibles

### Consultar commits

```bash
curl http://localhost:8080/metrics/commits
```

Respuesta observada:

```json
[
  {
    "label": "2026-05-01",
    "value": 12
  },
  {
    "label": "2026-05-02",
    "value": 18
  },
  {
    "label": "2026-05-03",
    "value": 15
  },
  {
    "label": "2026-05-04",
    "value": 22
  }
]
```

---

### Consultar bugs corregidos

```bash
curl http://localhost:8080/metrics/bugs
```

Respuesta observada:

```json
[
  {
    "label": "2026-05-01",
    "value": 2
  },
  {
    "label": "2026-05-02",
    "value": 1
  },
  {
    "label": "2026-05-03",
    "value": 3
  },
  {
    "label": "2026-05-04",
    "value": 0
  }
]
```

---

### Consultar tareas completadas

```bash
curl http://localhost:8080/metrics/tasks
```

Respuesta observada:

```json
[
  {
    "label": "2026-05-01",
    "value": 5
  },
  {
    "label": "2026-05-02",
    "value": 7
  },
  {
    "label": "2026-05-03",
    "value": 6
  },
  {
    "label": "2026-05-04",
    "value": 8
  }
]
```

---

### Consultar story points

```bash
curl http://localhost:8080/metrics/storyPoints
```

Respuesta observada:

```json
[
  {
    "label": "2026-05-01",
    "value": 8
  },
  {
    "label": "2026-05-02",
    "value": 13
  },
  {
    "label": "2026-05-03",
    "value": 10
  },
  {
    "label": "2026-05-04",
    "value": 15
  }
]
```

---

## 1.7 Métricas soportadas actualmente

El endpoint `/metrics/{metric}` soporta los siguientes valores:

| Métrica       | Descripción                                  |
| ------------- | -------------------------------------------- |
| `commits`     | Número de commits por fecha                  |
| `bugs`        | Número de bugs corregidos por fecha          |
| `tasks`       | Número de tareas completadas por fecha       |
| `storyPoints` | Número de story points completados por fecha |

---

## 1.8 Estado actual de validación

| Validación                      | Resultado                 |
| ------------------------------- | ------------------------- |
| Compilación del proyecto        | Correcta                  |
| Arranque de Spring Boot         | Correcto                  |
| Puerto de ejecución             | `8080`                    |
| Endpoint raíz `/`               | No existe, devuelve `404` |
| Endpoint `/metrics/commits`     | Funciona                  |
| Endpoint `/metrics/bugs`        | Funciona                  |
| Endpoint `/metrics/tasks`       | Funciona                  |
| Endpoint `/metrics/storyPoints` | Funciona                  |
| Respuesta JSON                  | Correcta para demo        |
| Persistencia real               | No implementada           |
| Seguridad real                  | No implementada           |

---

## 1.9 Hallazgos técnicos del backend

Durante la revisión inicial se identificaron los siguientes hallazgos.

### 1.9.1 DTO duplicado en paquete incorrecto

Existe una clase `MetricResponseDTO` dentro del paquete `dto`, que es el lugar correcto para este tipo de objeto.

Sin embargo, también existe otra clase con el mismo nombre dentro del paquete `repository`:

```text
repository/MetricResponseDTO.java
```

Esto representa un problema de organización porque un DTO no debe vivir dentro de la capa de repositorio. Además, mantener dos clases con el mismo nombre puede provocar errores de importación, confusión en mantenimiento y deuda técnica innecesaria.

**Recomendación:** eliminar `repository/MetricResponseDTO.java`.

---

### 1.9.2 DTO de request incompleto y no utilizado

Existe la clase:

```text
dto/MetricRequestDTO.java
```

Actualmente solo contiene el atributo `metric`, pero no tiene getters, setters ni anotaciones de Lombok. Además, no se utiliza en ningún controlador.

El endpoint actual recibe la métrica mediante path variable:

```text
GET /metrics/{metric}
```

Por lo tanto, `MetricRequestDTO` no aporta funcionalidad en el estado actual del sistema.

**Recomendación:** eliminar `MetricRequestDTO` si no se implementará un endpoint `POST` que reciba la métrica en el cuerpo de la petición.

---

### 1.9.3 Repositorio con datos hardcodeados

La clase `DeveloperMetricRepository` está anotada como repositorio, pero no consulta una base de datos. En realidad, devuelve una lista fija de datos definidos directamente en código.

Esto es aceptable para una demostración inicial, pero debe documentarse claramente porque no representa persistencia real.

**Recomendación:** renombrar la clase a algo más explícito, por ejemplo:

```text
InMemoryDeveloperMetricRepository
```

o:

```text
MockDeveloperMetricRepository
```

---

### 1.9.4 Dependencias de JPA y H2 presentes aunque no hay persistencia real

El proyecto levanta H2 y configura JPA durante el arranque, pero no se identificaron entidades `@Entity`, llaves primarias `@Id` ni interfaces que extiendan `JpaRepository`.

Esto puede causar confusión porque el proyecto parece tener persistencia configurada, pero las métricas realmente provienen de datos en memoria.

**Recomendación:** decidir una de dos alternativas:

1. Mantener datos en memoria y eliminar dependencias innecesarias de JPA/H2.
2. Implementar persistencia real usando entidades JPA y repositorios Spring Data.

Para una corrección rápida y coherente con el alcance actual, se recomienda la primera opción.

---

### 1.9.5 Métricas inválidas devuelven valores en cero

Si se solicita una métrica no soportada, el servicio actualmente devuelve una respuesta con valores en `0`.

Ejemplo:

```bash
curl http://localhost:8080/metrics/invalid
```

Este comportamiento puede ser problemático porque el frontend podría interpretar la respuesta como válida y graficar datos incorrectos.

**Recomendación:** devolver un error `400 Bad Request` cuando la métrica solicitada no esté soportada.

Respuesta recomendada:

```json
{
  "error": "Unsupported metric",
  "supportedMetrics": ["commits", "bugs", "tasks", "storyPoints"]
}
```

---

### 1.9.6 Seguridad configurada en modo abierto

El backend incluye configuración de Spring Security, pero actualmente permite todas las solicitudes.

Esto facilita las pruebas locales y la integración inicial con frontend, pero no representa seguridad real.

**Recomendación:** documentar que la seguridad está en modo abierto para desarrollo. Si la aplicación evoluciona, se debe implementar autenticación y autorización reales.

---

### 1.9.7 CORS limitado a frontend local

La configuración de CORS permite solicitudes desde:

```text
http://localhost:5173
```

Esto es adecuado si el frontend se ejecuta con Vite en el puerto `5173`.

Sin embargo, si el frontend usa otro puerto o se despliega en otro dominio, las solicitudes serán bloqueadas por CORS.

**Recomendación:** mover los orígenes permitidos a `application.properties`.

Ejemplo:

```properties
app.cors.allowed-origins=http://localhost:5173
```

---

### 1.9.8 No existe endpoint de health check

Actualmente no existe un endpoint simple para validar que el backend está vivo.

Al entrar a `/`, el sistema responde con `404`, lo cual puede confundir durante la validación inicial.

**Recomendación:** agregar un endpoint de estado:

```text
GET /health
```

Respuesta sugerida:

```json
{
  "status": "UP",
  "service": "metrics-backend"
}
```

---

### 1.9.9 No existen pruebas funcionales de endpoints

El proyecto solo incluye una prueba de carga de contexto de Spring Boot.

No existen pruebas para validar:

* Respuesta correcta de `/metrics/commits`.
* Respuesta correcta de `/metrics/bugs`.
* Respuesta correcta de `/metrics/tasks`.
* Respuesta correcta de `/metrics/storyPoints`.
* Comportamiento ante métricas inválidas.
* Contrato JSON esperado por el frontend.

**Recomendación:** agregar pruebas con MockMvc para cubrir los endpoints principales.

---

## 1.10 Priorización de correcciones recomendadas

Las correcciones recomendadas para el backend se priorizan de la siguiente manera:

### Alta prioridad

1. Eliminar `repository/MetricResponseDTO.java`.
2. Eliminar o justificar `MetricRequestDTO.java`.
3. Cambiar el comportamiento para que métricas inválidas devuelvan `400 Bad Request`.
4. Agregar pruebas funcionales con MockMvc.
5. Documentar claramente que los datos actuales son simulados.

### Media prioridad

6. Agregar endpoint `/health`.
7. Renombrar `DeveloperMetricRepository` a `InMemoryDeveloperMetricRepository` o `MockDeveloperMetricRepository`.
8. Mover configuración CORS a `application.properties`.
9. Revisar si realmente se necesitan JPA y H2.

### Baja prioridad

10. Agregar prefijo `/api` o `/api/v1` a los endpoints.
11. Completar metadata del `pom.xml`.
12. Mejorar formato y consistencia del código.

---

## 1.11 Conclusión del estado actual del backend

El backend arranca correctamente y expone los endpoints mínimos necesarios para consumir métricas desde un frontend. Sin embargo, el código presenta problemas de mantenibilidad, organización de paquetes, validación de entradas, claridad arquitectónica y pruebas automatizadas.

La API funciona para una demostración inicial, pero requiere ajustes antes de considerarse una base limpia y mantenible para integración con frontend o crecimiento futuro.


# 2. Frontend

## 2.1 Descripción general

El frontend es una aplicación desarrollada con **React** y **Vite**. Su propósito actual es mostrar un dashboard de productividad que consume las métricas expuestas por el backend Spring Boot.

La aplicación se conecta correctamente al backend local y visualiza información de métricas mediante gráficos. En el estado actual, el frontend funciona como una demostración inicial, pero presenta oportunidades importantes de mejora en configuración, mantenibilidad, manejo de errores, estructura de carpetas y documentación.

---

## 2.2 Ubicación real del proyecto frontend

Durante la revisión se identificó que el proyecto funcional del frontend no está directamente en la carpeta raíz `front`, sino dentro de:

```text
front/productivity-dashboard
```

La estructura observada es:

```text
front/productivity-dashboard
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public
├── src
└── vite.config.js
```

Dentro de `src`, la estructura principal es:

```text
src
├── App.css
├── App.jsx
├── assets
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── component
│   └── Dashboard.jsx
├── index.css
├── main.jsx
└── services
    └── metricsService.js
```

Se observó que ejecutar `npm run dev` desde la carpeta raíz `front` genera el error:

```text
Missing script: "dev"
```

Esto ocurre porque los scripts de ejecución existen en el `package.json` ubicado dentro de `front/productivity-dashboard`.

---

## 2.3 Cómo ejecutar el frontend

Para ejecutar correctamente el frontend, se debe entrar a la carpeta real del proyecto:

```bash
cd front/productivity-dashboard
```

Instalar dependencias:

```bash
npm install
```

Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

El frontend se ejecuta normalmente con Vite en:

```text
http://localhost:5173
```

Para que la integración funcione, el backend debe estar ejecutándose en:

```text
http://localhost:8080
```

---

## 2.4 Scripts disponibles

El `package.json` del frontend define los siguientes scripts:

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

| Script            | Propósito                                 |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Ejecuta el frontend en modo desarrollo    |
| `npm run build`   | Genera la versión productiva del frontend |
| `npm run lint`    | Ejecuta análisis estático con ESLint      |
| `npm run preview` | Sirve localmente el build generado        |

---

## 2.5 Tecnologías identificadas

El frontend utiliza las siguientes tecnologías principales:

* React
* Vite
* JavaScript con JSX
* Chart.js
* React Chart.js 2
* ESLint
* CSS

Las dependencias principales identificadas son:

```text
react
react-dom
chart.js
react-chartjs-2
```

Las dependencias de desarrollo incluyen:

```text
vite
@vitejs/plugin-react
eslint
eslint-plugin-react-hooks
eslint-plugin-react-refresh
```

---

## 2.6 Integración con backend

El frontend consume el backend mediante el archivo:

```text
src/services/metricsService.js
```

Actualmente la URL del backend está definida directamente en código:

```javascript
const API_URL = "http://localhost:8080/metrics";
```

El servicio expone una función para obtener datos de una métrica específica:

```javascript
export const getMetricData = async (metric) => {
    const response = await axios.get(
        `${API_URL}/${metric}`
    );

    return response.data;
};
```

Esto permite consultar endpoints como:

```text
http://localhost:8080/metrics/commits
```

La integración local fue validada correctamente, ya que el frontend logró conectarse al backend y visualizar la información.

---

## 2.7 Métricas disponibles desde backend

El backend soporta actualmente las siguientes métricas:

| Métrica            | Endpoint               |
| ------------------ | ---------------------- |
| Commits            | `/metrics/commits`     |
| Bugs corregidos    | `/metrics/bugs`        |
| Tareas completadas | `/metrics/tasks`       |
| Story points       | `/metrics/storyPoints` |

Sin embargo, el frontend actual consume principalmente la métrica de `commits`, por lo que todavía no aprovecha completamente todos los endpoints disponibles.

---

## 2.8 Estado actual de validación

| Validación                                                        | Resultado                    |
| ----------------------------------------------------------------- | ---------------------------- |
| El proyecto frontend arranca desde `front/productivity-dashboard` | Correcto                     |
| El proyecto arranca desde la carpeta raíz `front`                 | Incorrecto                   |
| El frontend se conecta al backend local                           | Correcto                     |
| El backend responde a las llamadas del frontend                   | Correcto                     |
| El dashboard muestra datos                                        | Correcto                     |
| La URL del backend es configurable por ambiente                   | No implementado              |
| Manejo visible de errores                                         | Limitado                     |
| Estado de carga visible                                           | No implementado claramente   |
| README propio del frontend                                        | Permanece como template base |
| Pruebas automatizadas de frontend                                 | No implementadas             |

---

## 2.9 Hallazgos técnicos del frontend

Durante la revisión inicial se identificaron los siguientes hallazgos.

### 2.9.1 El proyecto real está dentro de una subcarpeta

El frontend funcional se encuentra dentro de:

```text
front/productivity-dashboard
```

Sin embargo, en la carpeta raíz `front` también existen archivos como `node_modules`, `package.json` y `package-lock.json`.

Esto puede indicar que se ejecutaron comandos de Node en una carpeta incorrecta. Como consecuencia, una persona que clone el repositorio podría intentar correr el frontend desde `front` y recibir el error:

```text
Missing script: "dev"
```

**Recomendación:** documentar claramente la ruta correcta de ejecución y limpiar archivos generados accidentalmente en la raíz `front`, si no forman parte del proyecto real.

---

### 2.9.2 URL del backend hardcodeada

El archivo `metricsService.js` define directamente la URL del backend:

```javascript
const API_URL = "http://localhost:8080/metrics";
```

Este enfoque funciona en desarrollo local, pero reduce la portabilidad del proyecto. Si el backend cambia de puerto, dominio o ambiente, será necesario modificar código fuente.

**Recomendación:** mover la URL base del backend a una variable de entorno de Vite.

Ejemplo:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Y utilizarla en el servicio:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/metrics`;
```

También se recomienda agregar un archivo `.env.example` para documentar las variables necesarias.

---

### 2.9.3 El dashboard no aprovecha todas las métricas disponibles

El backend expone métricas para:

```text
commits
bugs
tasks
storyPoints
```

Sin embargo, el frontend actual se enfoca principalmente en la visualización de commits.

Esto limita el valor funcional del dashboard, ya que existen endpoints adicionales disponibles que podrían visualizarse sin cambios mayores en el backend.

**Recomendación:** agregar un selector de métrica que permita cambiar entre:

```text
Commits
Bugs corregidos
Tareas completadas
Story Points
```

Esto haría que el frontend aproveche mejor la API existente y permitiría validar de forma más completa la integración entre ambos componentes.

---

### 2.9.4 Manejo limitado de errores

El frontend realiza la llamada al backend, pero el manejo de errores es limitado. En caso de que el backend esté apagado, exista un problema de CORS o el endpoint falle, el usuario no recibe una explicación clara en pantalla.

**Recomendación:** agregar estados explícitos de carga y error.

Ejemplo:

```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

Y mostrar mensajes como:

```text
Cargando métricas...
No se pudo conectar con el backend.
```

Esto mejora la experiencia de usuario y facilita el diagnóstico durante pruebas.

---

### 2.9.5 Falta validación del contrato de datos

El frontend asume que cada elemento recibido desde el backend tiene la siguiente estructura:

```json
{
  "label": "2026-05-01",
  "value": 12
}
```

Si el backend modifica los nombres de los campos, devuelve valores nulos o cambia el formato, el frontend podría fallar o mostrar información incorrecta.

**Recomendación:** agregar una etapa mínima de normalización o validación de datos antes de enviarlos al gráfico.

Ejemplo:

```javascript
const normalizeMetricData = (data) =>
  data.filter(item =>
    typeof item.label === "string" &&
    typeof item.value === "number"
  );
```

---

### 2.9.6 Estilos inline excesivos

El componente principal del dashboard concentra lógica de carga de datos, cálculo de métricas, configuración del gráfico, renderizado visual y estilos.

Esto funciona para una demostración pequeña, pero dificulta el mantenimiento si el dashboard crece.

**Recomendación:** mover estilos a un archivo CSS específico, por ejemplo:

```text
src/component/Dashboard.css
```

o reorganizar la carpeta como:

```text
src/components/Dashboard/Dashboard.jsx
src/components/Dashboard/Dashboard.css
```

---

### 2.9.7 CSS residual del template inicial

Se observaron estilos relacionados con elementos del template de Vite, como clases para hero, contador, logos y secciones de documentación.

Estos estilos no parecen corresponder directamente al dashboard actual.

**Recomendación:** eliminar estilos no utilizados para reducir ruido, mejorar legibilidad y evitar confusión durante mantenimiento.

---

### 2.9.8 README del frontend no describe el proyecto real

El README incluido en el frontend todavía corresponde al template base de React + Vite.

No documenta:

* Propósito del dashboard.
* Cómo ejecutar el frontend.
* Dependencia con el backend.
* Puerto esperado del backend.
* Endpoints consumidos.
* Variables de entorno.
* Limitaciones actuales.
* Problemas conocidos.

**Recomendación:** reemplazar el README local o consolidar la documentación en el README principal del proyecto.

---

### 2.9.9 No existen pruebas automatizadas de frontend

El `package.json` no incluye scripts de prueba. Actualmente solo existen scripts para desarrollo, build, lint y preview.

No se identificaron pruebas unitarias o de integración para validar:

* Renderizado del dashboard.
* Consumo correcto del servicio de métricas.
* Cálculo de totales o indicadores.
* Manejo de errores.
* Comportamiento cuando el backend no responde.

**Recomendación:** agregar pruebas con Vitest y React Testing Library si el alcance del proyecto lo permite.

---

### 2.9.10 Convención de carpeta `component`

La carpeta actual se llama:

```text
src/component
```

Aunque no es un error funcional, la convención más común en proyectos React es usar:

```text
src/components
```

Esto mejora claridad y consistencia con prácticas comunes del ecosistema.

**Recomendación:** renombrar `component` a `components` y actualizar imports correspondientes.

---

### 2.9.11 Configuración mínima de Vite

El archivo `vite.config.js` contiene únicamente la configuración base del plugin de React.

Esto es suficiente para desarrollo local básico. Sin embargo, no existe configuración de proxy hacia el backend.

**Recomendación:** considerar un proxy de desarrollo para evitar dependencia directa de CORS durante ejecución local.

Ejemplo:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  }
});
```

Con esta configuración, el frontend podría consumir:

```text
/api/metrics/commits
```

en vez de llamar directamente a:

```text
http://localhost:8080/metrics/commits
```

---

## 2.10 Priorización de correcciones recomendadas

Las correcciones recomendadas para el frontend se priorizan de la siguiente manera.

### Alta prioridad

1. Documentar que el proyecto se ejecuta desde `front/productivity-dashboard`.
2. Limpiar archivos de Node generados en la carpeta raíz `front`, si no pertenecen al proyecto real.
3. Mover la URL del backend a una variable de entorno.
4. Agregar archivo `.env.example`.
5. Agregar manejo visible de carga y error.
6. Actualizar el README para reemplazar la documentación genérica del template.

### Media prioridad

7. Agregar selector de métrica para consumir `commits`, `bugs`, `tasks` y `storyPoints`.
8. Validar o normalizar el contrato de datos recibido desde backend.
9. Mover estilos inline a archivos CSS.
10. Eliminar CSS residual del template de Vite.
11. Renombrar `component` a `components`.

### Baja prioridad

12. Agregar configuración de proxy en Vite.
13. Agregar pruebas automatizadas con Vitest y React Testing Library.
14. Actualizar el título del documento HTML.
15. Revisar y limpiar assets no utilizados como logos o imágenes heredadas del template.

---

## 2.11 Conclusión del estado actual del frontend

El frontend arranca correctamente desde la carpeta `front/productivity-dashboard` y se conecta de forma exitosa con el backend local. Esto valida la integración básica entre ambos componentes.

Sin embargo, el frontend todavía presenta características de prototipo: depende de una URL hardcodeada, no aprovecha todas las métricas disponibles, tiene manejo limitado de errores, conserva documentación y estilos del template inicial, y no cuenta con pruebas automatizadas.

La aplicación es funcional para demostración, pero requiere limpieza, configuración por ambiente, mejor manejo de estados y documentación antes de considerarse una base mantenible para evolución futura.
