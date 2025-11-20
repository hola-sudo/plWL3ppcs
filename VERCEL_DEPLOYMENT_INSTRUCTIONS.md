# ⚡ INSTRUCCIONES DE DEPLOYMENT EN VERCEL

## 🎯 SISTEMA LISTO PARA PRODUCCIÓN

**Branch para deployment:** `production-clean`  
**Repository:** `https://github.com/hola-sudo/plWL3ppcs`

## 📝 PASOS PARA DEPLOYMENT

### 1. Acceder a Vercel
1. Ir a [vercel.com](https://vercel.com)
2. Hacer login con GitHub
3. Click en "New Project"

### 2. Importar Repositorio
1. Seleccionar "Import Git Repository"
2. Conectar: `hola-sudo/plWL3ppcs`
3. **IMPORTANTE:** Seleccionar branch `production-clean`

### 3. Configurar Variables de Entorno
En el dashboard de Vercel, agregar:

```
NOTION_TOKEN=tu_notion_integration_token_aqui
NOTION_DATABASE_ID=tu_database_id_aqui
NODE_ENV=production
```

### 4. Deploy Automático
- Vercel detectará automáticamente la configuración
- Build automático con TypeScript
- Deploy en menos de 2 minutos

## 🔧 CONFIGURACIÓN INCLUIDA

### ✅ vercel.json (Ya configurado)
- Functions con timeouts optimizados
- Headers CORS configurados  
- Rewrites para dashboard
- Memory allocation por endpoint

### ✅ package.json (Ya configurado)
- Dependencies correctas
- Build scripts listos
- Node.js 18+ requirement

### ✅ TypeScript (Ya configurado)
- tsconfig.json optimizado
- Tipos para Vercel
- Build target ES2020

## 🌐 URLS DEL SISTEMA

Después del deployment tendrás:

```
https://tu-app.vercel.app/          → Landing page
https://tu-app.vercel.app/dashboard → Dashboard legal
https://tu-app.vercel.app/api/health → Health check
```

## 🧪 TESTING POST-DEPLOYMENT

### 1. Health Check
```bash
curl https://tu-app.vercel.app/api/health
```

Debe retornar:
```json
{
  "status": "ok",
  "service": "Sistema Legal Paralegal API",
  "configuration": {
    "all_env_vars_configured": true
  }
}
```

### 2. Dashboard Test
Abrir: `https://tu-app.vercel.app/dashboard`
- Debe cargar interface moderna
- Botones funcionales
- Conexión a APIs

### 3. API Test Completo
```bash
# Test cliente search
curl "https://tu-app.vercel.app/api/legal-clients?query=test"

# Test crear cliente
curl -X POST "https://tu-app.vercel.app/api/legal-clients" \
  -H "Content-Type: application/json" \
  -d '{"NOMBRE_CLIENTE":"Test User","CB_NOMBRE_EVENTO":"Test Event"}'
```

## 📊 MÉTRICAS ESPERADAS

- **Cold start**: < 2 segundos
- **API Response**: < 3 segundos  
- **PDF Generation**: < 5 segundos
- **Memory usage**: 256-1024MB según endpoint

## 🚨 TROUBLESHOOTING

### Error 500 en APIs
- Verificar variables NOTION_* en Vercel
- Comprobar permisos de integración Notion

### Dashboard no carga
- Verificar rewrites en vercel.json
- Comprobar archivos en /public

### CORS Errors
- Headers ya configurados en vercel.json
- Verificar domain en browser

## ✅ SISTEMA COMPLETAMENTE FUNCIONAL

- 🎯 **4 tipos de contratos progresivos**
- 📊 **95 campos especializados**  
- ⚡ **Generación PDF nativa**
- 🔄 **Workflow inteligente**
- 📱 **Dashboard responsive**
- 🔐 **APIs seguras y validadas**

---

**¡Sistema listo para producción!** 🚀