# 🔧 Especificaciones Técnicas - Dashboard V4.0

## 📋 **ESPECIFICACIONES PARA IMPLEMENTACIÓN VISUAL**

**Objetivo**: Crear dashboard funcional que refleje el flujo real de contratos progresivos de 3D Pixel Perfection

---

## 🎯 **ESTRUCTURA HTML REQUERIDA**

### **1. DASHBOARD PRINCIPAL**

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <title>3D Pixel Perfection | Legal OS v4.0</title>
    <!-- Mismo stack: Tailwind + Phosphor + Inter -->
</head>

<body>
    <!-- Sidebar igual que actual -->
    <aside id="sidebar">...</aside>
    
    <main>
        <!-- Header igual que actual -->
        <header id="header">...</header>
        
        <!-- Dashboard Content -->
        <div id="dashboard-content">
            
            <!-- MÉTRICAS CORREGIDAS -->
            <div class="metrics-grid">
                <div class="metric-card">
                    <h3>Clientes en Proceso</h3>
                    <span id="metric-clients-processing">0</span>
                </div>
                <div class="metric-card">
                    <h3>Contratos Generados Hoy</h3>
                    <span id="metric-contracts-today">0</span>
                </div>
                <div class="metric-card">
                    <h3>Clientes Completados</h3>
                    <span id="metric-clients-completed">0</span>
                </div>
                <div class="metric-card">
                    <h3>Total de Operaciones</h3>
                    <span id="metric-total-operations">0</span>
                </div>
            </div>
            
            <!-- TABLA DE CLIENTES CORREGIDA -->
            <div class="clients-overview">
                <h2>Mis Clientes</h2>
                <table id="clients-overview-table">
                    <thead>
                        <tr>
                            <th>Cliente / Empresa</th>
                            <th>Último Contrato Generado</th>
                            <th>Estado</th>
                            <th>Progreso</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="clients-overview-body">
                        <!-- Populated by JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- FICHA INDIVIDUAL (Hidden by default) -->
        <div id="client-profile-view" class="hidden">
            <!-- Header de ficha -->
            <div id="profile-header">
                <button onclick="goBackToDashboard()">← Volver</button>
                <div class="client-info">
                    <h1 id="profile-client-name">--</h1>
                    <span id="profile-client-rfc">--</span>
                </div>
                <div class="progress-visual" id="profile-progress">
                    <!-- Progress steps -->
                </div>
            </div>
            
            <!-- Tabs de contratos -->
            <div class="contract-tabs" id="contract-tabs">
                <button class="tab" data-contract="contrato_base">Contrato Base</button>
                <button class="tab" data-contract="anexo_b">Anexo B</button>
                <button class="tab" data-contract="anexo_c">Anexo C</button>
                <button class="tab" data-contract="anexo_d">Anexo D</button>
            </div>
            
            <!-- Contenido del tab activo -->
            <div class="fields-container">
                <form id="contract-fields-form">
                    <!-- Campos dinámicos por tipo de contrato -->
                </form>
            </div>
            
            <!-- Acciones -->
            <div class="actions-bar">
                <button id="btn-save-fields">💾 Guardar Cambios</button>
                <button id="btn-generate-pdf">📄 Generar PDF</button>
                <button id="btn-download-pdf">📥 Descargar PDF</button>
            </div>
        </div>
    </main>
</body>
</html>
```

---

## 🎨 **ESTILOS CSS ESPECÍFICOS REQUERIDOS**

### **Estados de Progreso:**
```css
.progress-visual {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.progress-step {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.progress-step.completed {
    background-color: #10B981;
    color: white;
    border: 1px solid #059669;
}

.progress-step.current {
    background-color: #F59E0B;
    color: white;
    border: 1px solid #D97706;
    animation: pulse 2s infinite;
}

.progress-step.pending {
    background-color: #E5E7EB;
    color: #6B7280;
    border: 1px solid #D1D5DB;
    opacity: 0.6;
}

.progress-step.disabled {
    background-color: #F3F4F6;
    color: #9CA3AF;
    border: 1px solid #E5E7EB;
    opacity: 0.4;
}
```

### **Tabs de Contratos:**
```css
.contract-tabs {
    display: flex;
    border-bottom: 1px solid #E5E7EB;
    margin-bottom: 2rem;
}

.contract-tabs .tab {
    padding: 1rem 1.5rem;
    border: none;
    background: transparent;
    font-weight: 500;
    color: #6B7280;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 200ms;
}

.contract-tabs .tab:hover {
    color: #374151;
    background-color: #F9FAFB;
}

.contract-tabs .tab.active {
    color: #1D4ED8;
    border-bottom-color: #1D4ED8;
    background-color: #EFF6FF;
}

.contract-tabs .tab.completed {
    color: #059669;
    position: relative;
}

.contract-tabs .tab.completed::after {
    content: "✅";
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    font-size: 0.75rem;
}

.contract-tabs .tab.disabled {
    color: #9CA3AF;
    cursor: not-allowed;
    opacity: 0.5;
}
```

### **Badges por Tipo de Contrato:**
```css
.contract-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.contract-badge.base {
    background-color: #1E40AF;
    color: white;
}

.contract-badge.anexo-b {
    background-color: #7C3AED;
    color: white;
}

.contract-badge.anexo-c {
    background-color: #DC2626;
    color: white;
}

.contract-badge.anexo-d {
    background-color: #059669;
    color: white;
}
```

---

## ⚙️ **JAVASCRIPT PLACEHOLDER REQUERIDO**

### **Funciones Principales:**
```javascript
// === NAVEGACIÓN ===
function goBackToDashboard() {
    document.getElementById('dashboard-content').classList.remove('hidden');
    document.getElementById('client-profile-view').classList.add('hidden');
}

function openClientProfile(clientId) {
    // Ocultar dashboard
    document.getElementById('dashboard-content').classList.add('hidden');
    // Mostrar ficha
    document.getElementById('client-profile-view').classList.remove('hidden');
    
    // Cargar datos del cliente (placeholder)
    console.log('Loading client profile:', clientId);
    loadClientProfile(clientId);
}

// === GESTIÓN DE TABS ===
function switchContractTab(contractType) {
    // Actualizar tabs activos
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelector(`[data-contract="${contractType}"]`).classList.add('active');
    
    // Cargar campos específicos
    loadContractFields(contractType);
}

// === PLACEHOLDERS PARA BACKEND ===
async function loadClientProfile(clientId) {
    console.log('TODO: Cargar perfil completo del cliente', clientId);
    // Placeholder: Aquí se conectará a la API real
}

async function loadContractFields(contractType) {
    console.log('TODO: Cargar campos para contrato tipo', contractType);
    // Placeholder: Aquí se mostrarán los campos específicos
}

async function saveContractFields() {
    console.log('TODO: Guardar cambios en campos');
    // Placeholder: Aquí se guardará en Notion
}

async function generateContractPDF() {
    console.log('TODO: Generar PDF del contrato activo');
    // Placeholder: Aquí se generará el PDF específico
}

async function downloadContractPDF() {
    console.log('TODO: Descargar PDF generado');
    // Placeholder: Aquí se descargará el archivo
}

// === EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', function() {
    // Setup tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const contractType = this.dataset.contract;
            switchContractTab(contractType);
        });
    });
    
    // Setup action buttons
    document.getElementById('btn-save-fields').addEventListener('click', saveContractFields);
    document.getElementById('btn-generate-pdf').addEventListener('click', generateContractPDF);
    document.getElementById('btn-download-pdf').addEventListener('click', downloadContractPDF);
});
```

---

## 📊 **ESTRUCTURA DE DATOS REQUERIDA**

### **Cliente Overview (Para tabla principal):**
```javascript
const clientOverview = {
    id: 'client-123',
    name: 'Carlos Rivera',
    company: 'Rivera Productions',
    lastContract: 'anexo_b',      // último contrato generado
    status: 'en_proceso',         // estado general
    progress: 50,                 // porcentaje 0-100
    nextAction: 'Generar Anexo C' // acción sugerida
}
```

### **Cliente Profile (Para ficha individual):**
```javascript
const clientProfile = {
    id: 'client-123',
    basicInfo: {
        name: 'Carlos Rivera',
        company: 'Rivera Productions', 
        rfc: 'RIVA901010XYZ',
        email: 'carlos@rivera.com'
    },
    contracts: {
        contrato_base: {
            status: 'generated',
            generatedDate: '2024-12-01',
            pdfUrl: '/downloads/client-123-base.pdf'
        },
        anexo_b: {
            status: 'generated', 
            generatedDate: '2024-12-05',
            pdfUrl: '/downloads/client-123-anexo-b.pdf'
        },
        anexo_c: {
            status: 'pending',
            generatedDate: null,
            pdfUrl: null
        },
        anexo_d: {
            status: 'locked',
            generatedDate: null,
            pdfUrl: null
        }
    },
    fields: {
        // Los 95 campos de Notion
        NOMBRE_CLIENTE: 'Carlos Rivera',
        EMPRESA_CLIENTE: 'Rivera Productions',
        // ... resto de campos
    }
}
```

---

## 🔧 **IDs Y CLASES ESPECÍFICAS PARA BACKEND**

### **Dashboard Principal:**
```html
<!-- Métricas -->
<span id="metric-clients-processing">0</span>
<span id="metric-contracts-today">0</span>
<span id="metric-clients-completed">0</span>
<span id="metric-total-operations">0</span>

<!-- Tabla -->
<tbody id="clients-overview-body">
    <!-- Filas con onclick="openClientProfile('client-id')" -->
</tbody>
```

### **Ficha Individual:**
```html
<!-- Header -->
<h1 id="profile-client-name">--</h1>
<span id="profile-client-rfc">--</span>
<div id="profile-progress"><!-- Progress visual --></div>

<!-- Tabs -->
<div class="contract-tabs" id="contract-tabs">
    <button data-contract="contrato_base">Contrato Base</button>
    <!-- ... más tabs -->
</div>

<!-- Fields Container -->
<form id="contract-fields-form">
    <!-- Campos dinámicos por contrato -->
</form>

<!-- Actions -->
<button id="btn-save-fields">Guardar</button>
<button id="btn-generate-pdf">Generar PDF</button>
<button id="btn-download-pdf">Descargar</button>
```

---

## 📱 **RESPONSIVE REQUIREMENTS**

### **Mobile (< 768px):**
```css
@media (max-width: 767px) {
    .metrics-grid {
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .contract-tabs {
        flex-direction: column;
    }
    
    .contract-tabs .tab {
        text-align: left;
        border-bottom: 1px solid #E5E7EB;
        border-right: none;
    }
    
    .fields-container {
        padding: 1rem;
    }
    
    .actions-bar {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .actions-bar button {
        width: 100%;
    }
}
```

### **Desktop (>= 768px):**
```css
@media (min-width: 768px) {
    .metrics-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
    }
    
    .contract-tabs {
        justify-content: flex-start;
    }
    
    .fields-container {
        max-width: none;
        padding: 2rem;
    }
    
    .actions-bar {
        justify-content: flex-end;
        gap: 1rem;
    }
}
```

---

## ✅ **CHECKLIST DE ENTREGABLES**

### **HTML:**
- [ ] Dashboard principal con métricas corregidas
- [ ] Tabla de clientes con "último contrato generado"
- [ ] Ficha individual con header informativo
- [ ] Tabs funcionales por tipo de contrato
- [ ] Contenedor de campos dinámicos
- [ ] Botones de acción principales

### **CSS:**
- [ ] Estados de progreso visual (completed, current, pending)
- [ ] Styling para tabs de contratos
- [ ] Badges por tipo de contrato
- [ ] Responsive design completo
- [ ] Animaciones y transiciones

### **JavaScript:**
- [ ] Navegación entre dashboard y ficha
- [ ] Gestión de tabs activos
- [ ] Event listeners configurados
- [ ] Placeholders para funciones backend
- [ ] Estructura de datos definida

### **IDs y Classes:**
- [ ] Todos los elementos tienen IDs únicos
- [ ] Classes consistentes para styling
- [ ] Data attributes para funcionalidad
- [ ] Naming convention clara

---

## 🎯 **PRÓXIMOS PASOS POST-ENTREGA**

Una vez que reciba el código visual, yo implementaré:

1. **Conexión real a APIs** existentes y nuevas
2. **Lógica de campos por contrato** según mapeo definido
3. **Generación y descarga** de PDFs específicos
4. **Actualización de métricas** en tiempo real
5. **Validaciones y error handling** completos
6. **Testing y deployment** a producción

---

*Especificaciones técnicas V4.0 - Listas para implementación visual*