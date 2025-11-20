# ⚖️ Sistema Legal Paralegal - Contratos Progresivos

## Descripción
Sistema legal especializado que genera contratos progresivos profesionales automáticamente desde bases de datos de Notion.

## 🎯 Flujo Principal
1. **Paralegal** busca cliente por nombre/RFC
2. **Sistema** consulta Notion automáticamente  
3. **Motor** extrae datos y rellena plantilla legal
4. **Genera** PDF del contrato legal correspondiente
5. **Marca** como completado en Notion

## 🚀 Características
- ✅ Integración directa con Notion API
- ✅ Generación de PDFs nativos (pdfmake)
- ✅ Validación de datos legales y herencia automática
- ✅ 4 plantillas profesionales de contratos legales
- ✅ Workflow progresivo (Base → Anexo B → C → D)
- 🆕 **Dashboard moderno v4.0.0** (Noviembre 2024)

## 📊 Interfaces de Usuario

### 🎨 **Dashboard Principal v4.0.0** (RECOMENDADO)
**🔗 [Dashboard Moderno](./public/dashboard-nuevo.html)**

- **UI/UX Profesional**: Design system moderno con Tailwind CSS
- **100% Responsive**: Optimizado para desktop, tablet y móvil  
- **APIs Reales**: Integración completa sin simulaciones
- **Métricas Real-time**: KPIs actualizados cada 30 segundos
- **Workflow Optimizado**: PDF + Cobros en una pantalla

### 🧪 **Panel de Pruebas** (Legacy)
**🔗 [Panel de Pruebas](./public/test.html)**

Panel básico mantenido para testing y backup.

## 📋 Variables de Entorno Requeridas

```bash
# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key-here

# Notion API Configuration
NOTION_API_KEY=your-notion-integration-token-here
NOTION_DATABASE_ID=tu-database-id-aqui
```

## 🛠️ Comandos Principales

```bash
# Desarrollo
npm run dev

# Compilar
npm run build

# Health check
GET /api/health

# Búsqueda de cliente y generación
POST /api/legal-contracts
{
  "message": "Juan Pérez",
  "conversationId": "optional"
}

# Generación directa con ID
POST /api/legal-contracts
{
  "clienteId": "notion-client-id",
  "tipoDocumento": "contrato_base"
}
```

## 📄 Plantilla Soportada
- **Contratos Progresivos Legales**
  - 95 campos especializados
  - Cumplimiento normativo
  - Firma digital preparada

## 🔒 Seguridad
- Detección automática de PII (datos personales)
- Moderación de contenido con OpenAI
- Validaciones específicas para datos legales

## 🏗️ Arquitectura
```
[Paralegal] → [Dashboard Legal] → [Notion API] → [Legal Engine] → [PDF Generator]
                                        ↓
[Notion Update] ← [Document Generated] ← [Legal Template]
```

## 📦 Stack Tecnológico
- **Runtime**: Node.js 18+ 
- **AI**: OpenAI GPT-4o
- **Database**: Notion API
- **PDF**: PDFMake (nativo)
- **Validation**: Zod + Guardrails
- **Deployment**: Vercel Serverless

## 📋 Documentación Completa

- **📖 [Manual de Usuario](./USER_MANUAL.md)** - Guía completa v4.0.0
- **🔧 [Documentación Técnica](./TECHNICAL_DOCS.md)** - Arquitectura y APIs
- **🚀 [Estado de Deployment](./DEPLOYMENT_STATUS.md)** - Status actual
- **📦 [Guía de Deployment](./DEPLOYMENT_GUIDE.md)** - Instrucciones

## 🎯 Estado Actual del Proyecto

**✅ PRODUCTION READY v4.0.0**
- Dashboard moderno completamente implementado (38,110 líneas)
- Todas las APIs integradas y funcionando
- Documentación actualizada
- Testing en progreso para deploy final

---

*Sistema legal profesional listo para producción* ✅