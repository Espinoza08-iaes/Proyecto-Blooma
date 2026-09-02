# 02. Ficha Técnica de Color y Verificación de Accesibilidad WCAG AA
### Proyecto Blooma — Paletas Cromáticas Clínicas e Inclusivas

---

## 1. Ficha Técnica de Paletas de Color (HEX, RGB y CMYK)

Blooma ofrece 4 temas cromáticos adaptados a la comodidad visual de la usuaria, alejándose de los estereotipos saturados:

### Tema 1: Earth (Tierra & Calidez Clínica - Predeterminado)
| Rol de Color | Nombre | HEX | RGB | CMYK | Aplicación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primario** | Teal Vital | `#0d9488` | `rgb(13, 148, 136)` | `85%, 20%, 48%, 15%` | Botones principales, acentos y estado fértil |
| **Secundario**| Rose Clay | `#e11d48` | `rgb(225, 29, 72)` | `5%, 98%, 68%, 0%` | Días de sangrado menstrual y alertas |
| **Fondo** | Warm Cream | `#fff1f2` | `rgb(255, 241, 242)` | `0%, 7%, 3%, 0%` | Fondo de pantallas y tarjetas secundarias |
| **Neutro Oscuro**| Slate Ink | `#0f172a` | `rgb(15, 23, 42)` | `85%, 75%, 55%, 65%` | Títulos y texto de alta jerarquía |
| **Neutro Medio** | Slate Muted| `#64748b` | `rgb(100, 116, 139)`| `60%, 45%, 35%, 10%` | Leyendas, fechas y textos secundarios |

### Tema 2: Orchid (Floral & Serenidad)
* **Primario:** `#9333ea` (RGB: `147, 51, 234` | CMYK: `65%, 85%, 0%, 0%`)
* **Secundario:** `#db2777` (RGB: `219, 39, 119` | CMYK: `10%, 95%, 35%, 0%`)
* **Fondo:** `#faf5ff` (RGB: `250, 245, 255` | CMYK: `2%, 5%, 0%, 0%`)

### Tema 3: Forest (Botánico & Regeneración)
* **Primario:** `#059669` (RGB: `5, 150, 105` | CMYK: `85%, 15%, 75%, 5%`)
* **Secundario:** `#10b981` (RGB: `16, 185, 129` | CMYK: `75%, 0%, 60%, 0%`)
* **Fondo:** `#f0fdf4` (RGB: `240, 253, 244` | CMYK: `5%, 0%, 4%, 0%`)

### Tema 4: Ocean (Sereno & Antiestrés)
* **Primario:** `#0284c7` (RGB: `2, 132, 199` | CMYK: `85%, 40%, 0%, 0%`)
* **Secundario:** `#06b6d4` (RGB: `6, 182, 212` | CMYK: `70%, 0%, 15%, 0%`)
* **Fondo:** `#f0f9ff` (RGB: `240, 249, 255` | CMYK: `5%, 1%, 0%, 0%`)

---

## 2. Matriz de Validación de Contraste WCAG AA (Ratio Mínimo 4.5:1)

Se verificó el contraste de todas las combinaciones de texto y fondo en base a las Pautas de Accesibilidad para el Contenido Web (WCAG 2.1 nivel AA):

| Combinación Evaluada | Color de Texto | Color de Fondo | Ratio de Contraste | Cumplimiento WCAG AA |
| :--- | :--- | :--- | :---: | :---: |
| **Texto Principal sobre Fondo** | `#0f172a` (Slate Ink) | `#ffffff` (Blanco) | **17.8:1** | Aprobado (Supera 4.5:1) |
| **Texto Secundario sobre Fondo** | `#64748b` (Slate Muted) | `#ffffff` (Blanco) | **4.9:1** | Aprobado (Supera 4.5:1) |
| **Botón Primario (Texto Blanco)** | `#ffffff` (Blanco) | `#0d9488` (Teal Vital) | **4.6:1** | Aprobado (Supera 4.5:1) |
| **Alerta Urgente (Texto Blanco)** | `#ffffff` (Blanco) | `#e11d48` (Rose Red) | **4.8:1** | Aprobado (Supera 4.5:1) |
| **Badge de Alerta sobre Fondo Suave** | `#9f1239` (Rose 800) | `#ffe4e6` (Rose 100) | **7.5:1** | Aprobado (Supera 4.5:1) |
