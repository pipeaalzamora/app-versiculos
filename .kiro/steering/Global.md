---
inclusion: always
---
Steering General para Proyectos
Propósito del Proyecto

Este proyecto tiene como objetivo desarrollar software robusto, mantenible y escalable, siguiendo las mejores prácticas del sector y alineándose con los requerimientos del cliente o usuario final.
Tecnologías Principales

    Lenguajes: JavaScript/TypeScript, Python

    Frameworks: React para frontend, Node.js/Express o FastAPI para backend

    Bases de datos: PostgreSQL y/o MongoDB

    Contenedores: Docker para ambiente de desarrollo y despliegue

    Control de versiones: Git con metodología GitFlow

Convenciones y Estándares de Código

    Seguir las guías de estilo oficiales para cada lenguaje (ESLint para JS/TS, PEP8 para Python)

    Los nombres de variables y funciones deben ser descriptivos y en camelCase

    Separar la lógica en módulos reutilizables y bien documentados

    Escribir tests unitarios para las funcionalidades críticas con cobertura mínima del 80%

Estructura de Carpetas Sugerida

/src
  /components
  /services
  /models
  /utils
/tests
  /unit
  /integration
/public
  /assets
  /styles

Prácticas de Desarrollo

    Usar branches para funcionalidades, revisiones de código antes de merges

    Automatización de pruebas con CI/CD

    Documentar funciones complejas y módulos principales

    Gestionar errores y logs para facilitar debugging

Seguridad y Calidad

    Validar entradas de usuario en backend y frontend

    Usar HTTPS y mecanismos de autenticación seguros

    Revisiones regulares de dependencias para evitar vulnerabilidades

Idioma de Programación y Documentación

    Todo el código debe ser escrito en idioma español, incluyendo nombres de variables, funciones, clases y comentarios.

    La documentación debe ser precisa y clara, evitando redundancias o documentación excesiva.

    La generación de documentación debe realizarse al finalizar un conjunto significativo de requerimientos o módulos, no de manera fragmentada tras cada requerimiento pequeño.

    Se debe priorizar la calidad y utilidad práctica de la documentación para futuros mantenimientos y revisiones.

<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 