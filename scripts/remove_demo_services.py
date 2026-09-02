from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')

old_data = '''        let servicesData = [
            { id: 1, name: "Desarrollo de Software Fullstack", desc: "Creación de plataformas web a medida.", cat: "Desarrollo", price: 80, hourly: 25, rating: 5.0, area: "Remoto" },
            { id: 2, name: "Reparación y Mantenimiento de Equipos", desc: "Diagnóstico y formateo de laptops/PC.", cat: "Hogar", price: 35, hourly: 15, rating: 4.8, area: "Presencial / Local" }
        ];'''

new_data = '''        let servicesData = [];'''

old_fetch = '''        async function fetchServicesFromAPI() {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                if (res.ok) {
                    const data = await res.json();
                    if(data.length > 0) servicesData = data;
                }
            } catch (err) {
                console.log("Servidor backend usando datos locales de respaldo.");
            }
            renderServices(servicesData);
        }'''

new_fetch = '''        async function fetchServicesFromAPI() {
            const grid = document.getElementById('servicesGrid');
            grid.innerHTML = '<div class="chat-empty">Cargando servicios…</div>';
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const data = await res.json().catch(() => []);
                if (!res.ok) throw new Error('No se pudieron cargar los servicios');
                servicesData = Array.isArray(data) ? data : [];
                renderServices(servicesData);
                if (!servicesData.length) {
                    grid.innerHTML = '<div class="chat-empty">Todavía no hay servicios publicados.</div>';
                }
            } catch (err) {
                servicesData = [];
                grid.innerHTML = '<div class="chat-empty">No se pudieron cargar los servicios. Intenta nuevamente en unos minutos.</div>';
                console.error(err);
            }
        }'''

if old_data not in text:
    raise SystemExit('Demo services block not found')
if old_fetch not in text:
    raise SystemExit('Legacy service fetch block not found')

text = text.replace(old_data, new_data).replace(old_fetch, new_fetch)

for demo in ('Desarrollo de Software Fullstack', 'Reparación y Mantenimiento de Equipos', 'datos locales de respaldo'):
    if demo in text:
        raise SystemExit(f'Demo service content remains: {demo}')

path.write_text(text, encoding='utf-8')
