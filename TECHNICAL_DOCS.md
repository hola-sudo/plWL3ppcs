# 🔧 Documentación Técnica - Sistema Legal 3D Pixel Perfection

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Dashboard     │───▶│  API Endpoints   │───▶│  Notion API     │
│   (Frontend)    │    │  (Serverless)    │    │  (Database)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌──────────────────┐
                       │  PDF Generator   │
                       │   (PDFMake)      │
                       └──────────────────┘
```

## 📦 Stack Tecnológico

### **Backend**
- **Runtime**: Node.js 18+
- **Framework**: Vercel Serverless Functions
- **Language**: TypeScript (strict mode)
- **Validation**: Zod schemas

### **APIs Integradas**
- **Database**: Notion API v2024.1
- **PDF Generation**: PDFMake 0.2.9 (nativo)
- **AI**: OpenAI GPT-4o (moderación)

### **Frontend**
- **Framework**: Vanilla HTML5/CSS3/JS
- **Styling**: Tailwind CSS 3.x
- **Responsive**: Mobile-first design

## 🔌 Endpoints API

### **GET /api/health**
```typescript
Response: {
  status: "ok" | "error",
  service: "Sistema Legal Paralegal API",
  version: "1.0.0-legal",
  configuration: {
    all_env_vars_configured: boolean,
    details: {
      NOTION_TOKEN: boolean,
      NOTION_DATABASE_ID: boolean
    }
  },
  integrations: {
    notion: { configured: boolean },
    pdf_generator: { engine: "pdfmake" }
  }
}
```

### **POST /api/legal-clients**
```typescript
Request: {
  message: string,  // Nombre o RFC del cliente
  conversationId?: string
}

Response: {
  success: boolean,
  cliente?: NotionClient,
  error?: string
}
```

### **POST /api/legal-contracts**
```typescript
Request: {
  clienteId: string,
  tipoDocumento: "contrato_base" | "anexo_b" | "anexo_c" | "anexo_d"
}

Response: {
  success: boolean,
  cliente?: NotionClient,
  totalFields?: number,
  error?: string
}
```

## 🗄️ Esquema de Base de Datos (Notion)

### **Campos Principales (95 total)**

#### **1. Información del Cliente**
```typescript
interface ClienteInfo {
  NOMBRE_CLIENTE: string;      // Nombre completo
  RFC: string;                 // Registro Federal
  EMAIL: string;               // Correo principal
  TELEFONO: string;            // Teléfono de contacto
  DIRECCION: string;           // Dirección completa
  CONTACTO_SECUNDARIO?: string; // Contacto alternativo
}
```

#### **2. Proyecto de Renderizado**
```typescript
interface ProyectoRenderizado {
  CB_NOMBRE_EVENTO: string;    // Nombre del proyecto
  TIPO_RENDERIZADO: string;    // 2D, 3D, Arquitectónico, etc.
  DESCRIPCION_PROYECTO: string; // Descripción detallada
  COMPLEJIDAD_ESCENA: "Baja" | "Media" | "Alta" | "Ultra";
  DURACION_ESTIMADA: number;   // Días de trabajo
  RESOLUCION_FINAL: string;    // 4K, 8K, etc.
  FORMATO_ENTREGA: string;     // MP4, MOV, PNG sequence
}
```

#### **3. Especificaciones Técnicas**
```typescript
interface EspecificacionesTecnicas {
  SOFTWARE_PRINCIPAL: string;  // Maya, 3ds Max, Blender
  ENGINE_RENDER: string;       // Arnold, V-Ray, Cycles
  PLUGINS_NECESARIOS: string[];// Plugins específicos
  RECURSOS_HARDWARE: {
    CPU_CORES: number;
    RAM_GB: number;
    GPU_MODELO: string;
    STORAGE_TB: number;
  };
  CONFIGURACION_RENDER: {
    SAMPLES: number;
    QUALITY_PRESET: string;
    DENOISING: boolean;
  };
}
```

#### **4. Cronograma y Entregas**
```typescript
interface Cronograma {
  FECHA_PIXEL: Date;           // Fecha de inicio
  FECHA_ENTREGA: Date;         // Fecha final comprometida
  HITOS_INTERMEDIOS: {
    PREPRODUCCION: Date;
    MODELADO: Date;
    TEXTURING: Date;
    LIGHTING: Date;
    RENDER: Date;
    POSTPRODUCCION: Date;
  };
  REVISIONES_CLIENTE: number;  // Número de revisiones incluidas
}
```

#### **5. Aspectos Comerciales**
```typescript
interface Comercial {
  COSTO_TOTAL: number;
  ESTRUCTURA_PAGOS: {
    ANTICIPO_PORCENTAJE: number;
    PAGOS_INTERMEDIOS: number[];
    PAGO_FINAL_PORCENTAJE: number;
  };
  MONEDA: "MXN" | "USD" | "EUR";
  INCLUYE_IMPUESTOS: boolean;
  DESCUENTOS_APLICADOS?: number;
  PENALIZACIONES: {
    RETRASO_DIA: number;
    CAMBIOS_SCOPE: number;
  };
}
```

#### **6. Legal y Contractual**
```typescript
interface LegalContractual {
  PIXEL_REPRESENTANTE: string;  // Representante legal de 3D Pixel
  TITULO_REPRESENTANTE: string; // CEO, Director, etc.
  PROPIEDAD_INTELECTUAL: {
    DERECHOS_CLIENTE: string[];
    DERECHOS_PIXEL: string[];
    LICENCIAS_SOFTWARE: string[];
  };
  CONFIDENCIALIDAD: boolean;
  GARANTIAS: {
    CALIDAD_TRABAJO: string;
    TIEMPO_RESPUESTA: string;
    CORRECCION_ERRORES: string;
  };
  CLAUSULAS_ESPECIALES?: string[];
}
```

## 🔄 Flujo de Datos

### **1. Búsqueda de Cliente**
```typescript
1. Usuario → Dashboard → /api/legal-clients
2. API → Notion.databases.query()
3. Notion → Datos cliente filtrados
4. API → Validación con Zod schemas
5. Dashboard ← Datos formateados
```

### **2. Generación de Contrato**
```typescript
1. Usuario → Selecciona tipo documento + clienteId
2. API → Notion.pages.retrieve()
3. API → legal-pdf-generator.ts
4. PDFMake → Genera PDF nativo
5. Notion ← Actualiza estado (COMPLETADO)
6. Usuario ← PDF generado
```

### **3. Herencia Progresiva**
```typescript
Contrato Base → Campos 1-30
     ↓
Anexo B → Hereda + Campos 31-50
     ↓  
Anexo C → Hereda + Campos 51-75
     ↓
Anexo D → Hereda + Campos 76-95
```

## 🔒 Seguridad

### **Variables de Entorno**
```bash
NOTION_TOKEN=secret_*************************
NOTION_DATABASE_ID=********************************
```

### **Validaciones de Entrada**
- RFC mexicano válido (13 caracteres)
- Email formato RFC 5322
- Fechas futuras para entregas
- Montos dentro de rangos predefinidos

### **Protección de Datos**
- Detección automática de PII
- Logs sin información sensible
- HTTPS obligatorio en producción
- Rate limiting en APIs

## 🧪 Testing

### **Ejecutar Tests**
```bash
npm test
```

### **Tests Incluidos**
1. ✅ Estructura de archivos críticos
2. ✅ Configuración package.json
3. ✅ Schemas de validación
4. ✅ TypeScript strict mode
5. ✅ No tokens hardcodeados
6. ✅ Variables de entorno
7. ✅ Documentación consistente
8. ✅ Interfaces HTML
9. ✅ Health API correcto
10. ✅ Archivo test-env.ts removido

## 🚀 Deployment

### **Vercel Serverless**
```bash
# Desarrollo
npm run dev

# Build
npm run build

# Deploy
vercel --prod
```

### **Variables de Entorno Producción**
```bash
vercel env add NOTION_TOKEN
vercel env add NOTION_DATABASE_ID
```

## 📊 Monitoreo

### **Health Check**
- **URL**: `/api/health`
- **Frecuencia**: Cada 30 segundos en dashboard
- **Métricas**: Uptime, configuración, integraciones

### **Performance**
- Búsqueda cliente: 2-5 segundos promedio
- Generación PDF: 3-8 segundos promedio
- Timeout máximo: 30 segundos

### **Logs**
```typescript
interface LogEntry {
  timestamp: ISO8601;
  endpoint: string;
  clienteId?: string;
  tipoDocumento?: string;
  duration_ms: number;
  success: boolean;
  error?: string;
}
```

## 🔧 Troubleshooting

### **Error Común: "Notion API Error"**
```bash
Causa: Token inválido o base de datos incorrecta
Solución: Verificar NOTION_TOKEN y NOTION_DATABASE_ID
```

### **Error: "PDF Generation Failed"**
```bash
Causa: Campos obligatorios faltantes
Solución: Completar información en Notion
```

### **Error: "TypeScript Compilation"**
```bash
Causa: strict: true requiere tipos explícitos
Solución: Agregar tipos a variables sin definir
```

## 📚 Referencias

- **Notion API**: https://developers.notion.com/
- **PDFMake**: http://pdfmake.org/
- **Vercel**: https://vercel.com/docs
- **TypeScript**: https://www.typescriptlang.org/

---

*Documentación técnica v4.0.0 - 3D Pixel Perfection*