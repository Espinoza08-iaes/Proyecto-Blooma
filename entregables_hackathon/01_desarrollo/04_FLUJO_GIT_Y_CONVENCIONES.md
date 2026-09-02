# 04. Flujo de Control de Versiones en Git y Convenciones
### Proyecto Blooma — Estándar de Colaboración Técnica

---

## 1. Estrategia de Ramas (GitFlow Adaptado)

Para asegurar la trazabilidad del código y evitar conflictos en el despliegue a producción, el equipo utiliza el flujo estructurado:

```mermaid
gitGraph
 commit id: "Initial commit"
 branch develop
 checkout develop
 commit id: "setup: repo base & deps"
 
 branch feature/triaje-embarazo
 checkout feature/triaje-embarazo
 commit id: "feat(triaje): logica de arbol de decision"
 commit id: "feat(triaje): casas maternas UI"
 checkout develop
 merge feature/triaje-embarazo id: "PR #1: Merge triaje feature"
 
 branch feature/seguridad-owasp
 checkout feature/seguridad-owasp
 commit id: "fix(auth): pbkdf2 210k iteraciones"
 commit id: "fix(auth): timingSafeEqual y eliminacion bypass"
 checkout develop
 merge feature/seguridad-owasp id: "PR #2: Merge security hardening"
 
 checkout main
 merge develop id: "Release v1.0.0 (Sprint 1)"
 commit id: "docs: entrega oficial Hackathon 2026"
```

---

## 2. Estándar de Conventional Commits

Todos los mensajes de confirmación siguen la especificación semántica: `<tipo>(<alcance>): <descripción>`

### Tipos Permitidos:
* **`feat`**: Nueva funcionalidad para la usuaria (ej. `feat(wearables): conectar telemetria de reloj inteligente`).
* **`fix`**: Corrección de un error o vulnerabilidad (ej. `fix(auth): prevenir oraculo de tiempo en login`).
* **`docs`**: Cambios exclusivos en documentación (ej. `docs(erd): actualizar diagrama 3FN`).
* **`style`**: Ajustes visuales o de formato que no afectan la lógica (ej. `style(theme): mejorar contraste WCAG AA`).
* **`refactor`**: Reestructuración de código sin alterar comportamiento (ej. `refactor(db): modularizar indices Dexie`).
* **`test`**: Pruebas automatizadas o manuales documentadas.

---

## 3. Política de Pull Requests (PR) y Code Review

1. Ningún cambio directo en la rama `main`.
2. Las ramas de características (`feature/*`) se fusionan a `develop` mediante Pull Request con revisión de al menos un integrante del equipo técnico.
3. Se verifica que el build de Vite (`npm run build`) no arroje errores de compilación ni TypeScript antes de aprobar el PR.
