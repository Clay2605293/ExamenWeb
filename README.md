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
