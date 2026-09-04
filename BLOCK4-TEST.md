# Bloque 4 — Reportes y confianza

Antes de fusionar/desplegar, comprobar:

- Usuario autenticado puede reportar un servicio ajeno.
- No puede reportar su propio servicio ni a sí mismo.
- Se evita duplicar un reporte abierto/en revisión sobre el mismo objetivo.
- Admin ve reportes y filtra por pendiente/en revisión/resuelto/descartado.
- Admin puede cambiar estado y dejar nota administrativa.
- El cambio queda en admin_actions y se intenta notificar al reportante.
- Cuenta suspendida recibe ACCOUNT_SUSPENDED y fecha cuando existe, en lugar de Invalid credentials.
- Pagos siguen desactivados y no se modifica ningún flujo de cobro.
