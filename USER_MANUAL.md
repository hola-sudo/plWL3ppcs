# 📖 Manual de Usuario - Sistema Legal 3D Pixel Perfection v4.0.0

## 🎯 Introducción

El Sistema Legal de 3D Pixel Perfection es una plataforma automatizada para la gestión y generación de contratos progresivos de renderizado y visualización 3D. Diseñado específicamente para paralegales y personal administrativo.

## 🚀 Acceso al Sistema

### Dashboard Principal (Recomendado)
- **URL**: `/public/dashboard-nuevo.html`
- **Características**: Interface moderna, responsive, métricas en tiempo real
- **Ideal para**: Uso diario y producción

### Panel de Pruebas (Legacy)
- **URL**: `/public/test.html`
- **Características**: Interface básica para testing
- **Ideal para**: Depuración y pruebas técnicas

## 📋 Workflow de Trabajo

### 1. **Búsqueda de Cliente**
```
Paralegal → Ingresa nombre o RFC → Sistema busca en Notion → Muestra resultados
```

**Ejemplos de búsqueda válidos:**
- `Juan Pérez`
- `PERJ800101ABC`
- `Pixel Studios Inc`

### 2. **Generación de Contratos Progresivos**

El sistema maneja 4 tipos de documentos en secuencia:

#### 📋 **Contrato Base**
- **Propósito**: Contrato inicial de servicios de renderizado
- **Campos**: 95 campos especializados para 3D
- **Incluye**: Términos base, especificaciones técnicas, cronograma

#### 📎 **Anexo B**
- **Propósito**: Especificaciones técnicas detalladas
- **Hereda**: Datos del Contrato Base
- **Incluye**: Resoluciones, formatos, entregables 3D

#### 📎 **Anexo C**
- **Propósito**: Condiciones comerciales y pagos
- **Hereda**: Datos anteriores
- **Incluye**: Estructura de pagos, penalizaciones, bonificaciones

#### 📎 **Anexo D**
- **Propósito**: Términos finales y modificaciones
- **Hereda**: Todos los datos anteriores
- **Incluye**: Modificaciones específicas, términos especiales

## 🔍 Campos Específicos de 3D Pixel Perfection

### **Información del Cliente**
- `NOMBRE_CLIENTE`: Nombre completo del cliente
- `RFC`: Registro Federal de Contribuyentes
- `EMAIL`: Correo electrónico principal
- `DIRECCION`: Dirección física completa

### **Especificaciones del Proyecto**
- `CB_NOMBRE_EVENTO`: Nombre del proyecto de renderizado
- `TIPO_RENDERIZADO`: 2D, 3D, Arquitectónico, Producto, etc.
- `RESOLUCION_FINAL`: Resolución de entrega (4K, 8K, etc.)
- `FORMATO_ENTREGA`: MP4, MOV, Secuencia de imágenes, etc.

### **Fechas y Cronograma**
- `FECHA_PIXEL`: Fecha de inicio del proyecto
- `FECHA_ENTREGA`: Fecha comprometida de entrega
- `DURACION_PROYECTO`: Duración estimada en días
- `HITOS_INTERMEDIOS`: Fechas de revisiones

### **Aspectos Técnicos**
- `SOFTWARE_PRINCIPAL`: Maya, 3ds Max, Blender, etc.
- `ENGINE_RENDER`: Arnold, V-Ray, Cycles, etc.
- `COMPLEJIDAD_ESCENA`: Baja, Media, Alta, Ultra
- `RECURSOS_NECESARIOS`: CPU, GPU, Memoria requerida

### **Comercial y Legal**
- `PIXEL_REPRESENTANTE`: Responsable de 3D Pixel Perfection
- `COSTO_TOTAL`: Costo total del proyecto
- `ESTRUCTURA_PAGOS`: Esquema de pagos acordado
- `GARANTIAS`: Garantías específicas del trabajo

## ⚠️ Casos Especiales

### **Cliente No Encontrado**
```
Error: No se encontró el cliente "XXX"
Solución: Verificar ortografía o crear nuevo registro en Notion
```

### **Datos Incompletos**
```
Error: Faltan campos obligatorios
Solución: Completar información en Notion antes de generar contrato
```

### **Proyecto en Progreso**
```
Warning: El proyecto ya tiene contratos generados
Solución: Verificar en Notion el estado antes de generar nuevo documento
```

## 🔒 Seguridad y Validaciones

### **Datos Personales (PII)**
- El sistema detecta automáticamente información sensible
- Aplica moderación de contenido
- Registra accesos para auditoría

### **Validaciones Legales**
- RFC válido y existente
- Email con formato correcto
- Fechas lógicas y consistentes
- Montos dentro de rangos establecidos

## 📊 Métricas y Monitoreo

### **Dashboard en Tiempo Real**
- Estado del sistema cada 30 segundos
- Última actividad registrada
- Configuración de APIs
- Tiempo de respuesta promedio

### **Logs de Actividad**
- Búsquedas realizadas
- Contratos generados
- Errores y excepciones
- Tiempo de procesamiento

## 🆘 Solución de Problemas Comunes

### **Error de Conexión**
```bash
❌ Error de conexión
```
**Solución**: Verificar variables de entorno `NOTION_TOKEN` y `NOTION_DATABASE_ID`

### **Timeout en Notion**
```bash
⏱️ Timeout en búsqueda
```
**Solución**: La base de datos Notion puede estar lenta. Reintentar en 30 segundos.

### **PDF No Genera**
```bash
❌ Error generando PDF
```
**Solución**: Verificar que todos los campos obligatorios estén completos.

### **Variables Faltantes**
```bash
🔧 Configuración incompleta
```
**Solución**: Revisar `/api/health` para identificar variables faltantes.

## 📞 Contacto y Soporte

Para soporte técnico:
- **Sistema**: Revisar `/api/health` para diagnósticos
- **Documentación**: Este manual y archivos técnicos
- **Testing**: Usar `/public/test.html` para pruebas

---

*Manual actualizado para 3D Pixel Perfection Legal System v4.0.0*