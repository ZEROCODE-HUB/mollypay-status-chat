# Alcance Detallado del Proyecto — Plataforma Fintech B2B MoliPay

**Cliente:** MoliPay (Money Life SRL)
**Proveedor:** Zerocode E.I.R.L.
**Responsable de proyecto (cliente):** Ruben Espinoza

---

## 1. Contexto y Objetivo General

Reconstrucción completa de la plataforma de billetera virtual de Money Life SRL, actualmente operando sobre un SaaS de terceros que impide su evolución. El objetivo es entregar una plataforma propia, robusta y escalable, con código fuente entregado en su totalidad al cliente, sin dependencia de proveedores externos.

**Plazo de transición con el proveedor saliente:** 90 días (ya acordado).

---

## 2. Objetivos del Proyecto

1. Tener una plataforma propia, robusta y escalable que soporte la expansión a nuevos mercados a nivel regional desde el inicio.
2. Eliminar la conciliación manual mediante reportes automáticos discriminados por cuenta madre y subcuentas desde el primer día.
3. Reducir el costo operativo con un sistema de alertas y monitoreo que reemplace el trabajo manual del equipo.
4. Unificar en una sola plataforma los cuatro pilares del negocio: billetera, recaudación, remesas y e-commerce.

---

## 3. Roles de Usuario

### 3.1 Cliente corporativo (empresa)
Empresa que opera desde el portal web, gestiona su cuenta con CVU, administra subcuentas, realiza transferencias, genera links de pago y accede a la API para integrar sus propios sistemas.

### 3.2 Administrador de backoffice (MoliPay)
Equipo interno de MoliPay que gestiona altas de clientes, carga de comisiones, legajos, módulo de compliance, parametrización de alertas y supervisión general de la operatoria.

---

## 4. Funcionalidades a Implementar

> Nota: a confirmar en detalle luego del levantamiento de información durante la fase de análisis.

### 4.1 Billetera y Operaciones
- **Cuenta con CVU y transferencias:** cada empresa recibe una cuenta con CVU propio para enviar y recibir dinero desde bancos y billeteras las 24 horas del día.
- **CVU Collect y subcuentas:** las empresas crean subcuentas bajo una cuenta madre para asignar CVU individuales a sus clientes y asociar cada cobro a una unidad específica.
- **Destinatarios guardados:** los usuarios guardan contactos frecuentes con CVU o alias para realizar transferencias sin reingresar datos.
- **Transferencias programadas:** automatización de pagos recurrentes para fechas futuras sin intervención manual.
- **Link de pago:** generación de links de cobro con monto fijo o libre para recibir pagos con tarjeta de crédito y débito.
- **QR interoperable:** cobro y pago mediante QR estático o dinámico, compatible con todas las billeteras del ecosistema argentino, con acreditación inmediata.

### 4.2 Recaudación y Cobros
- **Recaudación masiva:** procesamiento de cobros en lote para consorcios, alquileres, colegios, universidades y cualquier empresa que necesite cobrar a múltiples pagadores simultáneamente.
- **Consorcio y Recaudación (motor sectorial):** configurable por tipo de entidad (consorcios, alquileres, colegios, universidades), con carga de deuda, emisión automática de links y dashboard financiero por entidad.
- **Dispersión automática de fondos:** distribución configurable de cobros entre múltiples cuentas destino con porcentajes definidos por MoliPay.

### 4.3 Servicios Financieros e Integraciones
- **Pago de servicios e impuestos:** integración con Pago Mis Cuentas de Banelco.
- **E-commerce e Integraciones:** APIs de integración para plataformas e-commerce y sistemas externos que requieran procesar cobros.
- **Remesas y crossborder vía MORE:** envío de dinero internacional, conversión de fondos y operaciones crossborder.
- **Integraciones adicionales:** Banco de Comercio, Meriva, PayWay, RENAPER y Truora (vía Zapsign).

### 4.4 Backoffice y Compliance
- **Backoffice administrativo:** panel interno para gestión de clientes, documentación KYC, comisiones, monitoreo global de transacciones y administración de cuentas y subcuentas.
- **Compliance con alertas automáticas:** sistema de parámetros configurables que dispara alertas y bloqueos automáticos ante operaciones que superen los límites definidos.
- **KYC con RENAPER y Truora (Zapsign):** validación automática de identidad para personas naturales y jurídicas, con flujo manual para personas jurídicas gestionado desde el backoffice.

### 4.5 Reportería y Monitoreo
- **Reportería por cuenta madre y subcuentas:** reportes automáticos con número de serie, fecha y logo institucional, descargables sin intervención manual.
- **Monitoreo de transacciones en tiempo real:** dashboard global con volumen, alertas activas y estado de operaciones.
- **Estadísticas por período:** visualización de saldo y volumen operado por día, semana, mes o rango personalizado.

---

## 5. Alcance de la Plataforma por Vista

### 5.1 Usuario Final (Empresa)
- Login | Registro | Recuperación de contraseña | Seguridad 2FA
- KYC y Validación: registro de usuarios, validación biométrica, carga documental, estado de aprobación
- Billetera: saldo, CVU y alias, transferencias, destinatarios guardados, subcuentas, historial de movimientos
- Cobros y Recaudación: links de pago, QR interoperable, recaudación masiva, dispersión automática
- Servicios Financieros: pago de servicios e impuestos, remesas internacionales, historial financiero
- E-commerce: credenciales API, webhooks, pasarela de pagos, estado de integraciones
- Reportes y Configuración: reportes por cuenta/subcuenta, estadísticas, exportación, historial
- Cuenta: resumen de saldo, CVU asignado, seguridad y contraseña

### 5.2 Administrador (Backoffice)
- Login seguro
- Clientes y Onboarding: alta y administración de clientes, KYC (casos automáticos y manuales), gestión de documentación, administración de usuarios y permisos
- Operaciones Financieras: monitoreo de transacciones, gestión de cuentas/CVU/subcuentas, configuración de comisiones y límites, dashboard operativo
- Recaudación: monitoreo de entidades activas, gestión de incidencias, dashboard consolidado
- Remesas y Crossborder: operaciones MORE, seguimiento, conversión y liquidación de fondos
- Compliance: alertas y bloqueos automáticos, validaciones regulatorias, auditoría y trazabilidad
- Reportería: reportes financieros y operativos, exportación, historial

---

## 6. Arquitectura Técnica (MVP)

| Componente | Tecnología |
|---|---|
| Vista web | React (100% responsive) |
| Vista móvil | React Native |
| Back End | Next.js |
| Base de datos | Supabase |
| Notificaciones | SendGrid |
| KYC | RENAPER, ZapSign (Truora) |
| Integraciones financieras | PayWay, MORE, Banco de Comercio, PagoMisCuentas, Banco Mariva |

**Stack de desarrollo "AI Assisted":** Bolt, Claude Code, Google Antigravity, Supabase.

---

## 7. Ciberseguridad

Backend en Supabase, que soporta:
- Autenticación multifactor segura (2FA)
- Cumplimiento del protocolo SOC 2 Tipo 2
- Conformidad con HIPAA (sujeto a acuerdo BAA)
- Cifrado AES-256 en base de datos y TLS en tránsito
- Control de acceso basado en roles
- Copias de seguridad diarias (plan Pro)
- Gestión continua de vulnerabilidades
- Protección DDoS mediante Cloudflare

---

## 8. Migración de Usuarios (si es necesaria)

- Migración de documentación KYC y registros de compliance
- Migración de clientes, usuarios y estructuras organizacionales
- Migración de cuentas, subcuentas, CVU y configuraciones operativas
- Migración de saldos e historial de movimientos
- Validación de consistencia de la información migrada
- Marcha blanca con clientes piloto y operación en paralelo
- Migración progresiva de clientes corporativos
- Desactivación controlada de la plataforma anterior

---

## 9. Fuera de Alcance / Pendiente de Definición

- Versión de app móvil iOS y Android: **a considerar**, no confirmada como obligatoria en el MVP.
- Definición final de roles, permisos granulares y flujos KYC para personas jurídicas: sujeta al levantamiento detallado durante la fase de análisis.
- Detalles finales de integraciones bancarias (Banco de Comercio, Meriva) y su alcance funcional exacto.

---

## 10. Garantías del Proyecto

- **Validación previa:** prototipo funcional antes de escalar desarrollo.
- **Producto funcional:** devolución del 100% si no se cumple lo acordado.
- **No disconformidad (28 días):** devolución del 100% si no hay conformidad inicial.
- **Propiedad total:** código, documentación y PI transferidos al día 90.
- **Estabilidad técnica (12 meses):** sin fallos críticos ni pérdida de funcionalidad post-lanzamiento.
