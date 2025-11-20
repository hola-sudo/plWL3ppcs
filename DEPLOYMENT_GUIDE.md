# 🚀 GUÍA DE DEPLOYMENT - SISTEMA LEGAL PARALEGAL

## 📋 Pre-requisitos

### 1. Variables de Entorno Requeridas
```bash
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_database_id_here
```

### 2. Configuración de Notion
- Base de datos creada con 95 campos especializados
- Token de integración con permisos de lectura/escritura
- ID de la base de datos configurado

## 🔧 Pasos para Deployment en Vercel

### 1. Conectar Repositorio
```bash
git remote add origin https://github.com/hola-sudo/plWL3ppcs.git
git push origin clean-deployment
```

### 2. Configurar Proyecto en Vercel
1. Ir a [vercel.com](https://vercel.com)
2. Conectar GitHub repository: `hola-sudo/plWL3ppcs`
3. Seleccionar branch: `clean-deployment`
4. Configurar variables de entorno:
   - `NOTION_TOKEN`: Tu token de integración de Notion
   - `NOTION_DATABASE_ID`: ID de tu base de datos

### 3. Configuración Automática
- ✅ `vercel.json` ya configurado
- ✅ TypeScript build configurado
- ✅ APIs serverless listas
- ✅ Headers CORS configurados
- ✅ Rutas configuradas para dashboard

## 📊 Endpoints Disponibles

### Health Check
```bash
GET /api/health
```

### Gestión de Clientes
```bash
GET /api/legal-clients?query=nombre
POST /api/legal-clients
PUT /api/legal-clients
```

### Generación de Contratos
```bash
POST /api/legal-contracts
```

## 🎯 URLs del Sistema

### Interfaces de Usuario
- `/` - Landing page del sistema
- `/dashboard` - Dashboard legal principal
- `/legal` - Alias para dashboard
- `/contratos` - Gestión de contratos

### APIs
- `/api/health` - Health check y configuración
- `/api/legal-clients` - Gestión de clientes
- `/api/legal-contracts` - Generación de documentos

## ⚡ Características del Sistema

### 📄 4 Tipos de Documentos
1. **Contrato Base** - Documento inicial (8 variables)
2. **Anexo B** - Modificaciones (13 variables)
3. **Anexo C** - Entregas/Hitos (32 variables)
4. **Anexo D** - Finalización (21+ variables)

### 🔄 Workflow Progresivo
```
Cliente → Contrato Base → Anexo B → Anexo C → Anexo D
```

### 🏗️ Arquitectura
- **Runtime**: Node.js 18+ Serverless
- **Database**: Notion API
- **PDF**: PDFMake nativo
- **Validation**: Zod schemas
- **Frontend**: HTML + Tailwind CSS

## 📋 Testing del Deployment

### 1. Verificar Health Check
```bash
curl https://your-app.vercel.app/api/health
```

### 2. Probar Dashboard
```
https://your-app.vercel.app/dashboard
```

### 3. Verificar APIs
```bash
# Búsqueda de clientes
curl -X GET "https://your-app.vercel.app/api/legal-clients?query=test"

# Crear cliente
curl -X POST "https://your-app.vercel.app/api/legal-clients" \
  -H "Content-Type: application/json" \
  -d '{"NOMBRE_CLIENTE":"Test","CB_NOMBRE_EVENTO":"Test Event"}'
```

## 🚨 Troubleshooting

### Variables de Entorno
- Verificar que `NOTION_TOKEN` esté configurado
- Verificar que `NOTION_DATABASE_ID` sea correcto
- Comprobar permisos de la integración de Notion

### Errores Comunes
- **500 Error**: Revisar variables de entorno
- **404 Error**: Verificar rutas en `vercel.json`
- **CORS Error**: Headers ya configurados en `vercel.json`

## ✅ Estado del Sistema

**PRODUCTION READY v4.0.0**
- ✅ 95 campos especializados configurados
- ✅ 4 plantillas de contratos progresivos
- ✅ Dashboard moderno implementado
- ✅ APIs RESTful completas
- ✅ PDF generation nativo
- ✅ Validación de datos con Zod
- ✅ Configuración Vercel optimizada

---

*Sistema legal paralegal listo para producción* 🎯