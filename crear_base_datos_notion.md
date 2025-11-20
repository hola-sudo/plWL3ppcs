# 🗄️ CREAR BASE DE DATOS NOTION - SISTEMA PARALEGAL

## 📋 INSTRUCCIONES COMPLETAS PARA CREAR LA BASE DE DATOS

**Nombre de la Base de Datos:** `CLIENTES_CONTRATOS_PROGRESIVOS`

---

## 🔹 SECCIÓN 1: CAMPOS DE IDENTIFICACIÓN DEL CLIENTE (1-6)

### Campo 1: ID_UNICO
- **Tipo:** `Title` (Título principal)
- **Nombre:** `ID_UNICO`
- **Descripción:** Identificador único del cliente/proyecto

### Campo 2: NOMBRE_CLIENTE
- **Tipo:** `Rich Text` (Texto enriquecido)
- **Nombre:** `NOMBRE_CLIENTE`
- **Descripción:** Nombre completo del cliente final

### Campo 3: RFC_CLIENTE
- **Tipo:** `Rich Text`
- **Nombre:** `RFC_CLIENTE`
- **Descripción:** RFC del cliente

### Campo 4: EMPRESA_CLIENTE
- **Tipo:** `Rich Text`
- **Nombre:** `EMPRESA_CLIENTE`
- **Descripción:** Empresa del cliente

### Campo 5: EMAIL_CLIENTE
- **Tipo:** `Email`
- **Nombre:** `EMAIL_CLIENTE`
- **Descripción:** Email de contacto del cliente

### Campo 6: TELEFONO_CLIENTE
- **Tipo:** `Phone Number`
- **Nombre:** `TELEFONO_CLIENTE`
- **Descripción:** Teléfono del cliente

---

## 🔹 SECCIÓN 2: CONTROL GENERAL DEL CONTRATO BASE (7-15)

### Campo 7: CONTRATO_BASE_ESTADO
- **Tipo:** `Select` (Selección única)
- **Nombre:** `CONTRATO_BASE_ESTADO`
- **Opciones:**
  - `Borrador` (Color: Gris)
  - `Enviado` (Color: Amarillo)
  - `Firmado` (Color: Verde)
  - `Activo` (Color: Azul)

### Campo 8: CONTRATO_BASE_PDF_URL
- **Tipo:** `URL`
- **Nombre:** `CONTRATO_BASE_PDF_URL`
- **Descripción:** Link al PDF del contrato base generado

### Campo 9: CONTRATO_BASE_FECHA_GENERACION
- **Tipo:** `Date`
- **Nombre:** `CONTRATO_BASE_FECHA_GENERACION`
- **Descripción:** Fecha y hora de generación del contrato base

### Campo 10: CB_FECHA_CONTRATO
- **Tipo:** `Date`
- **Nombre:** `CB_FECHA_CONTRATO`
- **Descripción:** Variable {{DD/MM/AAAA}} - Fecha del contrato

### Campo 11: CB_EVENTO
- **Tipo:** `Rich Text`
- **Nombre:** `CB_EVENTO`
- **Descripción:** Variable {{EVENTO}} - Nombre corto del evento

### Campo 12: CB_FECHA_EVENTO
- **Tipo:** `Date`
- **Nombre:** `CB_FECHA_EVENTO`
- **Descripción:** Variable {{FECHA_EVENTO}} - Fecha del evento

### Campo 13: CB_HORA_EVENTO
- **Tipo:** `Rich Text`
- **Nombre:** `CB_HORA_EVENTO`
- **Descripción:** Variable {{HH:MM}} - Hora del evento

### Campo 14: CB_NOMBRE_EVENTO
- **Tipo:** `Rich Text`
- **Nombre:** `CB_NOMBRE_EVENTO`
- **Descripción:** Variable {{NOMBRE_EVENTO}} - Nombre completo del evento

### Campo 15: CB_UBICACION
- **Tipo:** `Rich Text`
- **Nombre:** `CB_UBICACION`
- **Descripción:** Variable {{UBICACIÓN}} - Ubicación del evento

---

## 🔹 SECCIÓN 3: CONTROL DE ANEXOS (16-18)

### Campo 16: ANEXOS_GENERADOS
- **Tipo:** `Multi-select` (Selección múltiple)
- **Nombre:** `ANEXOS_GENERADOS`
- **Opciones:**
  - `Anexo_B` (Color: Naranja)
  - `Anexo_C` (Color: Púrpura)
  - `Anexo_D` (Color: Verde)

### Campo 17: ULTIMO_ANEXO_GENERADO
- **Tipo:** `Select`
- **Nombre:** `ULTIMO_ANEXO_GENERADO`
- **Opciones:**
  - `Contrato_Base` (Color: Azul)
  - `Anexo_B` (Color: Naranja)
  - `Anexo_C` (Color: Púrpura)
  - `Anexo_D` (Color: Verde)

### Campo 18: PROXIMOS_ANEXOS_DISPONIBLES
- **Tipo:** `Formula`
- **Nombre:** `PROXIMOS_ANEXOS_DISPONIBLES`
- **Fórmula:**
```
if(prop("ULTIMO_ANEXO_GENERADO") == "Contrato_Base", "Anexo B disponible", if(prop("ULTIMO_ANEXO_GENERADO") == "Anexo_B", "Anexo C disponible", if(prop("ULTIMO_ANEXO_GENERADO") == "Anexo_C", "Anexo D disponible", "Proyecto completo")))
```

---

## 🔹 SECCIÓN 4: DATOS ANEXO B - MODIFICACIONES (19-32)

### Campo 19: ANEXO_B_ESTADO
- **Tipo:** `Select`
- **Nombre:** `ANEXO_B_ESTADO`
- **Opciones:**
  - `No_Requerido` (Color: Gris)
  - `Pendiente` (Color: Amarillo)
  - `Completado` (Color: Verde)

### Campo 20: ANEXO_B_PDF_URL
- **Tipo:** `URL`
- **Nombre:** `ANEXO_B_PDF_URL`
- **Descripción:** Link al PDF del Anexo B generado

### Campo 21: ANEXO_B_FECHA_GENERACION
- **Tipo:** `Date`
- **Nombre:** `ANEXO_B_FECHA_GENERACION`
- **Descripción:** Fecha de generación del Anexo B

### Campo 22: AB_CLIENTE
- **Tipo:** `Rich Text`
- **Nombre:** `AB_CLIENTE`
- **Descripción:** Variable {{CLIENTE}} - Referencia al cliente

### Campo 23: AB_CONFIRMADO_1
- **Tipo:** `Rich Text`
- **Nombre:** `AB_CONFIRMADO_1`
- **Descripción:** Variable {{CONFIRMADO_1}} - Estado de confirmación 1

### Campo 24: AB_CONFIRMADO_2
- **Tipo:** `Rich Text`
- **Nombre:** `AB_CONFIRMADO_2`
- **Descripción:** Variable {{CONFIRMADO_2}} - Estado de confirmación 2

### Campo 25: AB_EN_RENDERS_1
- **Tipo:** `Rich Text`
- **Nombre:** `AB_EN_RENDERS_1`
- **Descripción:** Variable {{EN_RENDERS_1}} - Estado de renders 1

### Campo 26: AB_EN_RENDERS_2
- **Tipo:** `Rich Text`
- **Nombre:** `AB_EN_RENDERS_2`
- **Descripción:** Variable {{EN_RENDERS_2}} - Estado de renders 2

### Campo 27: AB_FECHA_CLIENTE
- **Tipo:** `Date`
- **Nombre:** `AB_FECHA_CLIENTE`
- **Descripción:** Variable {{FECHA_CLIENTE}} - Fecha de respuesta del cliente

### Campo 28: AB_FECHA_PIXEL
- **Tipo:** `Date`
- **Nombre:** `AB_FECHA_PIXEL`
- **Descripción:** Variable {{FECHA_PIXEL}} - Fecha de respuesta de 3D Pixel

### Campo 29: AB_PIXEL_REPRESENTANTE
- **Tipo:** `Rich Text`
- **Nombre:** `AB_PIXEL_REPRESENTANTE`
- **Descripción:** Variable {{PIXEL_REPRESENTANTE}} - Representante de la empresa

### Campo 30: AB_TEMA_1
- **Tipo:** `Rich Text`
- **Nombre:** `AB_TEMA_1`
- **Descripción:** Variable {{TEMA_1}} - Tema de modificación 1

### Campo 31: AB_TEMA_2
- **Tipo:** `Rich Text`
- **Nombre:** `AB_TEMA_2`
- **Descripción:** Variable {{TEMA_2}} - Tema de modificación 2

### Campo 32: AB_AGREGAR_MAS
- **Tipo:** `Rich Text`
- **Nombre:** `AB_AGREGAR_MAS`
- **Descripción:** Variable {{Agregar más si necesario}} - Campo dinámico

---

## 🔹 SECCIÓN 5: DATOS ANEXO C - ENTREGAS/HITOS (33-67)

### Campo 33: ANEXO_C_ESTADO
- **Tipo:** `Select`
- **Nombre:** `ANEXO_C_ESTADO`
- **Opciones:**
  - `No_Requerido` (Color: Gris)
  - `Pendiente` (Color: Amarillo)
  - `Completado` (Color: Verde)

### Campo 34: ANEXO_C_PDF_URL
- **Tipo:** `URL`
- **Nombre:** `ANEXO_C_PDF_URL`
- **Descripción:** Link al PDF del Anexo C generado

### Campo 35: ANEXO_C_FECHA_GENERACION
- **Tipo:** `Date`
- **Nombre:** `ANEXO_C_FECHA_GENERACION`
- **Descripción:** Fecha de generación del Anexo C

### Campos 36-42: CAMBIOS (AC_CAMBIO_1 a AC_CAMBIO_7)
**Para cada campo del 36 al 42:**
- **Tipo:** `Rich Text`
- **Nombres:** `AC_CAMBIO_1`, `AC_CAMBIO_2`, `AC_CAMBIO_3`, `AC_CAMBIO_4`, `AC_CAMBIO_5`, `AC_CAMBIO_6`, `AC_CAMBIO_7`
- **Descripción:** Variables {{CAMBIO_1}} hasta {{CAMBIO_7}} - Cambios solicitados

### Campos 43-49: EJECUTADOS (AC_EJECUTADO_1 a AC_EJECUTADO_7)
**Para cada campo del 43 al 49:**
- **Tipo:** `Checkbox`
- **Nombres:** `AC_EJECUTADO_1`, `AC_EJECUTADO_2`, `AC_EJECUTADO_3`, `AC_EJECUTADO_4`, `AC_EJECUTADO_5`, `AC_EJECUTADO_6`, `AC_EJECUTADO_7`
- **Descripción:** Variables {{EJECUTADO_1}} hasta {{EJECUTADO_7}} - Estados de ejecución

### Campos 50-56: ESTADO_ACTUAL (AC_ESTADO_ACTUAL_1 a AC_ESTADO_ACTUAL_7)
**Para cada campo del 50 al 56:**
- **Tipo:** `Rich Text`
- **Nombres:** `AC_ESTADO_ACTUAL_1`, `AC_ESTADO_ACTUAL_2`, `AC_ESTADO_ACTUAL_3`, `AC_ESTADO_ACTUAL_4`, `AC_ESTADO_ACTUAL_5`, `AC_ESTADO_ACTUAL_6`, `AC_ESTADO_ACTUAL_7`
- **Descripción:** Variables {{ESTADO_ACTUAL_1}} hasta {{ESTADO_ACTUAL_7}} - Estados actuales

### Campos 57-63: ESTADO_SOLICITADO (AC_ESTADO_SOLICITADO_1 a AC_ESTADO_SOLICITADO_7)
**Para cada campo del 57 al 63:**
- **Tipo:** `Rich Text`
- **Nombres:** `AC_ESTADO_SOLICITADO_1`, `AC_ESTADO_SOLICITADO_2`, `AC_ESTADO_SOLICITADO_3`, `AC_ESTADO_SOLICITADO_4`, `AC_ESTADO_SOLICITADO_5`, `AC_ESTADO_SOLICITADO_6`, `AC_ESTADO_SOLICITADO_7`
- **Descripción:** Variables {{ESTADO_SOLICITADO_1}} hasta {{ESTADO_SOLICITADO_7}} - Estados solicitados

### Campo 64: AC_CLIENTE_ACEPTA_RONDA
- **Tipo:** `Checkbox`
- **Nombre:** `AC_CLIENTE_ACEPTA_RONDA`
- **Descripción:** Variable {{CLIENTE_ACEPTA_RONDA}} - Aceptación del cliente

### Campo 65: AC_RONDA
- **Tipo:** `Number`
- **Nombre:** `AC_RONDA`
- **Descripción:** Variable {{RONDA}} - Número de ronda

### Campo 66: AC_TOTAL_CAMBIOS_RONDA
- **Tipo:** `Number`
- **Nombre:** `AC_TOTAL_CAMBIOS_RONDA`
- **Descripción:** Variable {{TOTAL_CAMBIOS_RONDA}} - Total de cambios en la ronda

### Campo 67: AC_NOMBRE_EVENTO_HERENCIA
- **Tipo:** `Formula`
- **Nombre:** `AC_NOMBRE_EVENTO_HERENCIA`
- **Fórmula:** `prop("CB_NOMBRE_EVENTO")`
- **Descripción:** Herencia automática del nombre del evento

---

## 🔹 SECCIÓN 6: DATOS ANEXO D - FINALIZACIÓN (68-89)

### Campo 68: ANEXO_D_ESTADO
- **Tipo:** `Select`
- **Nombre:** `ANEXO_D_ESTADO`
- **Opciones:**
  - `No_Requerido` (Color: Gris)
  - `Pendiente` (Color: Amarillo)
  - `Completado` (Color: Verde)

### Campo 69: ANEXO_D_PDF_URL
- **Tipo:** `URL`
- **Nombre:** `ANEXO_D_PDF_URL`
- **Descripción:** Link al PDF del Anexo D generado

### Campo 70: ANEXO_D_FECHA_GENERACION
- **Tipo:** `Date`
- **Nombre:** `ANEXO_D_FECHA_GENERACION`
- **Descripción:** Fecha de generación del Anexo D

### Campo 71: AD_AUTORIZA_PAGO
- **Tipo:** `Checkbox`
- **Nombre:** `AD_AUTORIZA_PAGO`
- **Descripción:** Variable {{AUTORIZA_PAGO}} - Autorización de pago

### Campo 72: AD_CAMBIOS_EJECUTADOS
- **Tipo:** `Rich Text`
- **Nombre:** `AD_CAMBIOS_EJECUTADOS`
- **Descripción:** Variable {{CAMBIOS_EJECUTADOS}} - Cambios completados

### Campo 73: AD_CANTIDAD_RENDERS
- **Tipo:** `Number`
- **Nombre:** `AD_CANTIDAD_RENDERS`
- **Descripción:** Variable {{CANTIDAD_RENDERS_ENTREGADOS}} - Cantidad final de renders

### Campo 74: AD_COSTO_TOTAL
- **Tipo:** `Number`
- **Nombre:** `AD_COSTO_TOTAL`
- **Descripción:** Variable {{COSTO}} - Costo total del proyecto

### Campo 75: AD_DEFECTOS_VISUALES
- **Tipo:** `Rich Text`
- **Nombre:** `AD_DEFECTOS_VISUALES`
- **Descripción:** Variable {{DEFECTOS_VISUALES}} - Control de calidad

### Campo 76: AD_FECHA_ENTREGA
- **Tipo:** `Date`
- **Nombre:** `AD_FECHA_ENTREGA`
- **Descripción:** Variable {{FECHA_ENTREGA}} - Fecha de entrega final

### Campo 77: AD_FIRMA_CLIENTE
- **Tipo:** `Rich Text`
- **Nombre:** `AD_FIRMA_CLIENTE`
- **Descripción:** Variable {{FIRMA_CLIENTE}} - Firma de aceptación

### Campo 78: AD_NOMBRE_EVENTO_HERENCIA
- **Tipo:** `Formula`
- **Nombre:** `AD_NOMBRE_EVENTO_HERENCIA`
- **Fórmula:** `prop("CB_NOMBRE_EVENTO")`
- **Descripción:** Herencia automática del nombre del evento

### Campos 79-89: VARIABLES ADICIONALES ANEXO D
**Campo 79: AD_ENTREGA_SATISFACTORIA**
- **Tipo:** `Checkbox`
- **Nombre:** `AD_ENTREGA_SATISFACTORIA`
- **Descripción:** Variable {{ENTREGA_SATISFACTORIA}}

**Campo 80: AD_OBSERVACIONES_FINALES**
- **Tipo:** `Rich Text`
- **Nombre:** `AD_OBSERVACIONES_FINALES`
- **Descripción:** Variable {{OBSERVACIONES_FINALES}}

**Campo 81: AD_CUMPLE_ESPECIFICACIONES**
- **Tipo:** `Checkbox`
- **Nombre:** `AD_CUMPLE_ESPECIFICACIONES`
- **Descripción:** Variable {{CUMPLE_ESPECIFICACIONES}}

**Campo 82: AD_FECHA_FIRMA**
- **Tipo:** `Date`
- **Nombre:** `AD_FECHA_FIRMA`
- **Descripción:** Variable {{FECHA_FIRMA}}

**Campo 83: AD_NOMBRE_FIRMANTE**
- **Tipo:** `Rich Text`
- **Nombre:** `AD_NOMBRE_FIRMANTE`
- **Descripción:** Variable {{NOMBRE_FIRMANTE}}

**Campo 84: AD_CARGO_FIRMANTE**
- **Tipo:** `Rich Text`
- **Nombre:** `AD_CARGO_FIRMANTE`
- **Descripción:** Variable {{CARGO_FIRMANTE}}

**Campo 85: AD_RENDERS_ACEPTADOS**
- **Tipo:** `Number`
- **Nombre:** `AD_RENDERS_ACEPTADOS`
- **Descripción:** Variable {{RENDERS_ACEPTADOS}}

**Campo 86: AD_RENDERS_RECHAZADOS**
- **Tipo:** `Number`
- **Nombre:** `AD_RENDERS_RECHAZADOS`
- **Descripción:** Variable {{RENDERS_RECHAZADOS}}

**Campo 87: AD_MOTIVO_RECHAZO**
- **Tipo:** `Rich Text`
- **Nombre:** `AD_MOTIVO_RECHAZO`
- **Descripción:** Variable {{MOTIVO_RECHAZO}}

**Campo 88: AD_REQUIERE_REVISION**
- **Tipo:** `Checkbox`
- **Nombre:** `AD_REQUIERE_REVISION`
- **Descripción:** Variable {{REQUIERE_REVISION}}

**Campo 89: AD_PROYECTO_FINALIZADO**
- **Tipo:** `Checkbox`
- **Nombre:** `AD_PROYECTO_FINALIZADO`
- **Descripción:** Variable {{PROYECTO_FINALIZADO}}

---

## 🔹 SECCIÓN 7: CAMPOS DE CONTROL DEL SISTEMA (90-95)

### Campo 90: FECHA_CREACION
- **Tipo:** `Created time`
- **Nombre:** `FECHA_CREACION`
- **Descripción:** Fecha y hora de creación del registro

### Campo 91: ULTIMA_MODIFICACION
- **Tipo:** `Last edited time`
- **Nombre:** `ULTIMA_MODIFICACION`
- **Descripción:** Fecha y hora de última modificación

### Campo 92: CREADO_POR
- **Tipo:** `Created by`
- **Nombre:** `CREADO_POR`
- **Descripción:** Usuario que creó el registro

### Campo 93: ESTADO_GENERAL
- **Tipo:** `Formula`
- **Nombre:** `ESTADO_GENERAL`
- **Fórmula:**
```
if(prop("ANEXO_D_ESTADO") == "Completado", "🎯 PROYECTO COMPLETADO", if(prop("ANEXO_C_ESTADO") == "Completado", "📋 En finalización", if(prop("ANEXO_B_ESTADO") == "Completado", "🔄 En entregas", if(prop("CONTRATO_BASE_ESTADO") == "Firmado", "✅ Contrato activo", "📝 En configuración inicial"))))
```

### Campo 94: DOCUMENTOS_PENDIENTES
- **Tipo:** `Formula`
- **Nombre:** `DOCUMENTOS_PENDIENTES`
- **Fórmula:**
```
if(prop("CONTRATO_BASE_ESTADO") != "Firmado", "Contrato Base", if(prop("ANEXO_B_ESTADO") == "Pendiente", "Anexo B", if(prop("ANEXO_C_ESTADO") == "Pendiente", "Anexo C", if(prop("ANEXO_D_ESTADO") == "Pendiente", "Anexo D", "Ninguno"))))
```

### Campo 95: PORCENTAJE_COMPLETADO
- **Tipo:** `Formula`
- **Nombre:** `PORCENTAJE_COMPLETADO`
- **Fórmula:**
```
format((if(prop("CONTRATO_BASE_ESTADO") == "Firmado", 25, 0) + if(prop("ANEXO_B_ESTADO") == "Completado", 25, 0) + if(prop("ANEXO_C_ESTADO") == "Completado", 25, 0) + if(prop("ANEXO_D_ESTADO") == "Completado", 25, 0)) / 100)
```

---

## 🚨 INSTRUCCIONES IMPORTANTES DE CONFIGURACIÓN

### 1. **Configuración de Vistas:**
Después de crear todos los campos, crea estas vistas:

**Vista 1: "Todos los Clientes"**
- Mostrar todos los registros
- Agrupar por: `ESTADO_GENERAL`
- Ordenar por: `ULTIMA_MODIFICACION` (más reciente primero)

**Vista 2: "Proyectos Activos"**
- Filtro: `ESTADO_GENERAL` no contiene "COMPLETADO"
- Mostrar: Campos principales + campos de control

**Vista 3: "Pendientes de Anexos"**
- Filtro: `DOCUMENTOS_PENDIENTES` no es igual a "Ninguno"
- Mostrar: Cliente + documento pendiente

### 2. **Permisos de la Base de Datos:**
- **Compartir con:** El usuario que usarás para la integración API
- **Permisos:** Full access (read/write/create/delete)

### 3. **Obtener la Database ID:**
- Copiar la URL de la base de datos
- La Database ID es la parte entre la última `/` y el `?` en la URL
- Ejemplo: si la URL es `https://notion.so/workspace/abc123def456?v=...`
- La Database ID es: `abc123def456`

### 4. **Crear la Integración API:**
1. Ve a https://www.notion.so/my-integrations
2. Crear nueva integración
3. Nombre: "Sistema Paralegal Contratos"
4. Capacidades: Read content, Update content, Insert content
5. Copiar el "Internal Integration Token"

### 5. **Conectar la Integración:**
1. En tu base de datos, clic en "..." (más opciones)
2. "Add connections"
3. Seleccionar "Sistema Paralegal Contratos"

---

## ✅ CHECKLIST FINAL

Antes de confirmar que la base de datos está lista, verifica:

- [ ] 95 campos creados exactamente como se especifica
- [ ] Todos los tipos de campo correctos
- [ ] Fórmulas copiadas exactamente (respetan mayúsculas/minúsculas)
- [ ] Opciones de Select con los colores especificados
- [ ] 3 vistas creadas
- [ ] Integración API conectada
- [ ] Database ID copiada
- [ ] Integration Token copiada

---

## 📧 INFORMACIÓN PARA ENVIAR AL DESARROLLADOR

Una vez completada la base de datos, envía:

1. **Database ID:** `[tu_database_id_aquí]`
2. **Integration Token:** `[tu_integration_token_aquí]`
3. **URL de la Base de Datos:** `[url_completa_aquí]`
4. **Confirmación:** "Base de datos creada con 95 campos según especificaciones"

---

**¡IMPORTANTE!** No modifiques los nombres de los campos después de crearlos. El sistema depende de estos nombres exactos para funcionar correctamente.