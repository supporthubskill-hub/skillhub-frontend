from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')

old_provider = '''        <div class="card">
            <h3>💼 Panel del Proveedor</h3>
            <div class="stats-grid" style="margin-top: 10px;">
                <div class="stat-box"><p style="font-size:0.75rem;">Ganancias</p><strong>$420.00</strong></div>
                <div class="stat-box"><p style="font-size:0.75rem;">Pendientes</p><strong>$85.00</strong></div>
                <div class="stat-box"><p style="font-size:0.75rem;">Clientes</p><strong>18</strong></div>
            </div>
            <button class="btn btn-success" style="margin-top: 10px;" onclick="alert('Solicitud de cobro procesada.')">Solicitar Pago / Retiro</button>
        </div>'''

new_provider = '''        <div class="card">
            <h3>💼 Panel del Vendedor</h3>
            <p class="service-meta" style="margin-top:10px;">Tus servicios, disponibilidad y reservas se muestran con datos reales del backend.</p>
            <button class="btn" style="margin-top:12px;" onclick="switchTab('tab-bookings', document.querySelectorAll('.nav-item')[2])">Ver mis reservas y disponibilidad</button>
            <p class="service-meta" style="margin-top:10px;">Los pagos y retiros reales todavía no están activados durante la beta.</p>
        </div>'''

old_notifications = '''            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px;">
                <div class="card" style="margin:0; padding:10px;">📅 Nueva solicitud de reserva para mañana.</div>
                <div class="card" style="margin:0; padding:10px;">💬 Tienes un nuevo mensaje del cliente.</div>
                <div class="card" style="margin:0; padding:10px;">💳 Pago realizado con éxito y mantenido en custodia.</div>
            </div>'''

new_notifications = '''            <div style="margin-top:12px;">
                <p class="service-meta">Todavía no tienes notificaciones reales. Esta sección se conectará al backend durante la beta.</p>
            </div>'''

if old_provider not in text:
    raise SystemExit('Provider demo block not found')
if old_notifications not in text:
    raise SystemExit('Notification demo block not found')

text = text.replace(old_provider, new_provider).replace(old_notifications, new_notifications)
text = text.replace('🔔 <span id="notif-count">3</span>', '🔔 <span id="notif-count">0</span>')

for demo in ('$420.00', '$85.00', '<strong>18</strong>', 'Pago realizado con éxito y mantenido en custodia'):
    if demo in text:
        raise SystemExit(f'Demo value remains: {demo}')

path.write_text(text, encoding='utf-8')
