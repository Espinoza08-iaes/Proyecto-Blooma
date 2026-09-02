# 03. Diagramas UML del Sistema (Casos de Uso, Actividades y Clases)
### Proyecto Blooma — Especificación de Modelado de Software

---

## 1. Diagrama de Casos de Uso (UML Use Case Diagram)

Representa las interacciones entre los actores del sistema (Usuaria, Motor de Telemetría Wearable, Servidor API y Red de Casas Maternas MINSA):

```mermaid
graph LR
 User((Usuaria))
 Wearable((Reloj / Anillo Inteligente))
 Server((Servidor Backend / Supabase))
 Minsa((Red Casas Maternas MINSA))

 subgraph "Sistema Blooma (PWA + Backend)"
 UC1[Configurar Etapa y Perfil]
 UC2[Registrar Ciclo Menstrual]
 UC3[Predecir Próximo Periodo con Confianza]
 UC4[Completar Triaje Obstétrico de Síntomas]
 UC5[Localizar y Llamar a Casa Materna]
 UC6[Sincronizar Telemetría Biométrica]
 UC7[Respaldar Datos Cifrados en la Nube]
 UC8[Eliminar Cuenta y Datos en Cascada]
 end

 User --> UC1
 User --> UC2
 User --> UC3
 User --> UC4
 User --> UC5
 User --> UC6
 User --> UC7
 User --> UC8

 Wearable --> UC6
 UC4 -.->|Si clasificación es Urgente| UC5
 UC5 --> Minsa
 UC7 --> Server
 UC8 --> Server
```

---

## 2. Diagrama de Actividades (UML Activity Diagram)
### Flujo: Evaluación y Triaje Obstétrico de Síntomas de Alarma

Muestra el proceso de toma de decisiones clínicas ante la presencia de signos de peligro en el embarazo:

```mermaid
stateDiagram-v2
 [*] --> IniciarTriaje
 IniciarTriaje --> IngresarSemanaGestacion
 IngresarSemanaGestacion --> SeleccionarSintomas
 
 state DecisionSintomas <<choice>>
 SeleccionarSintomas --> DecisionSintomas

 DecisionSintomas --> AlertaUrgente : Cefalea severa, visión borrosa, dolor epigástrico o sangrado
 DecisionSintomas --> AlertaVigilar : Molestias urinarias, edema leve o disminución leve de movimientos
 DecisionSintomas --> EstadoNormal : Cambios fisiológicos leves esperados

 state AlertaUrgente {
 [*] --> ResaltarPantallaRoja
 ResaltarPantallaRoja --> ActivarPulsoEmergencia
 ActivarPulsoEmergencia --> ConsultarCasaMaternaCercana
 ConsultarCasaMaternaCercana --> MostrarBotonLlamadaDirecta
 }

 state AlertaVigilar {
 [*] --> ResaltarPantallaNaranja
 ResaltarPantallaNaranja --> RecomendarMonitoreoPresion
 RecomendarMonitoreoPresion --> ProgramarControlPrenatal
 }

 state EstadoNormal {
 [*] --> ResaltarPantallaVerde
 ResaltarPantallaVerde --> MostrarPautasAutocuidado
 }

 AlertaUrgente --> GuardarRegistroLocal
 AlertaVigilar --> GuardarRegistroLocal
 EstadoNormal --> GuardarRegistroLocal

 GuardarRegistroLocal --> [*]
```

---

## 3. Diagrama de Clases (UML Class Diagram)

Estructura orientada a objetos del frontend y backend de Blooma:

```mermaid
classDiagram
 class BloomaDatabase {
 +Table profile
 +Table cycles
 +Table dailyLogs
 +Table triageRecords
 +Table maternalHouses
 +Table biometrics
 +init()
 +transaction()
 }

 class HealthSyncService {
 +getWearableStatus() WearableDeviceStatus
 +connectWearableDevice(type) WearableDeviceStatus
 +syncLatestBiometrics(deviceType) BiometricLog
 +getLatestBiometrics() BiometricLog
 }

 class CycleAnalyticsEngine {
 +calculateMedian(cycles: Cycle[]) number
 +calculateConfidenceScore(cycles: Cycle[]) number
 +predictNextCycle(lastDate: Date, avgDuration: number) PredictionResult
 }

 class AuthController {
 +register(email, password) Promise~Response~
 +login(email, password) Promise~Response~
 +hashPassword(password) Promise~HashResult~
 +verifyPassword(password, hash, salt) Promise~boolean~
 +generateToken(payload) string
 +verifyToken(token) TokenPayload
 }

 class SyncController {
 +processSyncBatch(userId, clientData) Promise~MergedData~
 +mergeWithLWW(clientItem, serverItem) MergedItem
 }

 class MaternalHouseService {
 +getHousesByDepartment(department: string) MaternalHouse[]
 +getEmergencyHousePhone(houseId: number) string
 }

 BloomaDatabase <-- HealthSyncService : persiste telemetría
 BloomaDatabase <-- CycleAnalyticsEngine : consume históricos
 AuthController --> SyncController : valida sesión JWT
 SyncController --> BloomaDatabase : sincroniza datos
 MaternalHouseService --> BloomaDatabase : consulta directorio
```
