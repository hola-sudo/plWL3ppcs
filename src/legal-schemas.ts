import { z } from 'zod';

// ===== SCHEMAS PARA SISTEMA LEGAL =====

// Schema para Cliente Base
export const ClienteBaseSchema = z.object({
  ID_UNICO: z.string(),
  NOMBRE_CLIENTE: z.string(),
  RFC_CLIENTE: z.string(),
  EMPRESA_CLIENTE: z.string(),
  EMAIL_CLIENTE: z.string().email(),
  TELEFONO_CLIENTE: z.string(),
});

// Schema para Contrato Base (8 variables principales)
export const ContratoBaseSchema = z.object({
  // Variables del contrato base
  CB_FECHA_CONTRATO: z.string(), // {{DD/MM/AAAA}}
  CB_EVENTO: z.string(), // {{EVENTO}}
  CB_FECHA_EVENTO: z.string(), // {{FECHA_EVENTO}}
  CB_HORA_EVENTO: z.string(), // {{HH:MM}}
  CB_NOMBRE_EVENTO: z.string(), // {{NOMBRE_EVENTO}}
  CB_UBICACION: z.string(), // {{UBICACIÓN}}
  
  // Control de estado
  CONTRATO_BASE_ESTADO: z.enum(['Borrador', 'Enviado', 'Firmado', 'Activo']),
  CONTRATO_BASE_PDF_URL: z.string().optional(),
  CONTRATO_BASE_FECHA_GENERACION: z.string().optional(),
});

// Schema para Anexo B - Modificaciones (13 variables)
export const AnexoBSchema = z.object({
  // Variables específicas del Anexo B
  AB_CLIENTE: z.string(), // {{CLIENTE}}
  AB_CONFIRMADO_1: z.string(), // {{CONFIRMADO_1}}
  AB_CONFIRMADO_2: z.string(), // {{CONFIRMADO_2}}
  AB_EN_RENDERS_1: z.string(), // {{EN_RENDERS_1}}
  AB_EN_RENDERS_2: z.string(), // {{EN_RENDERS_2}}
  AB_FECHA_CLIENTE: z.string(), // {{FECHA_CLIENTE}}
  AB_FECHA_PIXEL: z.string(), // {{FECHA_PIXEL}}
  AB_PIXEL_REPRESENTANTE: z.string(), // {{PIXEL_REPRESENTANTE}}
  AB_TEMA_1: z.string(), // {{TEMA_1}}
  AB_TEMA_2: z.string(), // {{TEMA_2}}
  AB_AGREGAR_MAS: z.string().optional(), // {{Agregar más si necesario}}
  
  // Variables heredadas
  CB_FECHA_EVENTO: z.string(), // Heredada del contrato base
  CB_NOMBRE_EVENTO: z.string(), // Heredada del contrato base
  
  // Control de estado
  ANEXO_B_ESTADO: z.enum(['No_Requerido', 'Pendiente', 'Completado']),
  ANEXO_B_PDF_URL: z.string().optional(),
  ANEXO_B_FECHA_GENERACION: z.string().optional(),
});

// Schema para Anexo C - Entregas/Hitos (32 variables)
export const AnexoCSchema = z.object({
  // Arrays de cambios (7 elementos cada uno)
  AC_CAMBIO_1: z.string().optional(),
  AC_CAMBIO_2: z.string().optional(),
  AC_CAMBIO_3: z.string().optional(),
  AC_CAMBIO_4: z.string().optional(),
  AC_CAMBIO_5: z.string().optional(),
  AC_CAMBIO_6: z.string().optional(),
  AC_CAMBIO_7: z.string().optional(),
  
  AC_EJECUTADO_1: z.boolean().optional(),
  AC_EJECUTADO_2: z.boolean().optional(),
  AC_EJECUTADO_3: z.boolean().optional(),
  AC_EJECUTADO_4: z.boolean().optional(),
  AC_EJECUTADO_5: z.boolean().optional(),
  AC_EJECUTADO_6: z.boolean().optional(),
  AC_EJECUTADO_7: z.boolean().optional(),
  
  AC_ESTADO_ACTUAL_1: z.string().optional(),
  AC_ESTADO_ACTUAL_2: z.string().optional(),
  AC_ESTADO_ACTUAL_3: z.string().optional(),
  AC_ESTADO_ACTUAL_4: z.string().optional(),
  AC_ESTADO_ACTUAL_5: z.string().optional(),
  AC_ESTADO_ACTUAL_6: z.string().optional(),
  AC_ESTADO_ACTUAL_7: z.string().optional(),
  
  AC_ESTADO_SOLICITADO_1: z.string().optional(),
  AC_ESTADO_SOLICITADO_2: z.string().optional(),
  AC_ESTADO_SOLICITADO_3: z.string().optional(),
  AC_ESTADO_SOLICITADO_4: z.string().optional(),
  AC_ESTADO_SOLICITADO_5: z.string().optional(),
  AC_ESTADO_SOLICITADO_6: z.string().optional(),
  AC_ESTADO_SOLICITADO_7: z.string().optional(),
  
  // Variables de control
  AC_CLIENTE_ACEPTA_RONDA: z.boolean(),
  AC_RONDA: z.number(),
  AC_TOTAL_CAMBIOS_RONDA: z.number(),
  
  // Variable heredada
  CB_NOMBRE_EVENTO: z.string(), // Heredada del contrato base
  
  // Control de estado
  ANEXO_C_ESTADO: z.enum(['No_Requerido', 'Pendiente', 'Completado']),
  ANEXO_C_PDF_URL: z.string().optional(),
  ANEXO_C_FECHA_GENERACION: z.string().optional(),
});

// Schema para Anexo D - Finalización (21+ variables)
export const AnexoDSchema = z.object({
  // Variables principales de finalización
  AD_AUTORIZA_PAGO: z.boolean(),
  AD_CAMBIOS_EJECUTADOS: z.string(),
  AD_CANTIDAD_RENDERS: z.number(),
  AD_COSTO_TOTAL: z.number(),
  AD_DEFECTOS_VISUALES: z.string(),
  AD_FECHA_ENTREGA: z.string(),
  AD_FIRMA_CLIENTE: z.string(),
  AD_ENTREGA_SATISFACTORIA: z.boolean(),
  AD_OBSERVACIONES_FINALES: z.string(),
  AD_CUMPLE_ESPECIFICACIONES: z.boolean(),
  AD_FECHA_FIRMA: z.string(),
  AD_NOMBRE_FIRMANTE: z.string(),
  AD_CARGO_FIRMANTE: z.string(),
  AD_RENDERS_ACEPTADOS: z.number(),
  AD_RENDERS_RECHAZADOS: z.number(),
  AD_MOTIVO_RECHAZO: z.string().optional(),
  AD_REQUIERE_REVISION: z.boolean(),
  AD_PROYECTO_FINALIZADO: z.boolean(),
  
  // Variable heredada
  CB_NOMBRE_EVENTO: z.string(), // Heredada del contrato base
  
  // Control de estado
  ANEXO_D_ESTADO: z.enum(['No_Requerido', 'Pendiente', 'Completado']),
  ANEXO_D_PDF_URL: z.string().optional(),
  ANEXO_D_FECHA_GENERACION: z.string().optional(),
});

// Schema completo del cliente con todos los documentos
export const ClienteCompletoSchema = z.object({
  // Información base del cliente
  ...ClienteBaseSchema.shape,
  
  // Contrato base
  ...ContratoBaseSchema.shape,
  
  // Control de anexos
  ANEXOS_GENERADOS: z.array(z.enum(['Anexo_B', 'Anexo_C', 'Anexo_D'])),
  ULTIMO_ANEXO_GENERADO: z.enum(['Contrato_Base', 'Anexo_B', 'Anexo_C', 'Anexo_D']),
  
  // Anexos opcionales
  anexoB: AnexoBSchema.partial().optional(),
  anexoC: AnexoCSchema.partial().optional(),
  anexoD: AnexoDSchema.partial().optional(),
  
  // Campos del sistema
  FECHA_CREACION: z.string(),
  ULTIMA_MODIFICACION: z.string(),
  CREADO_POR: z.string(),
});

// Tipos TypeScript exportados
export type ClienteBase = z.infer<typeof ClienteBaseSchema>;
export type ContratoBase = z.infer<typeof ContratoBaseSchema>;
export type AnexoB = z.infer<typeof AnexoBSchema>;
export type AnexoC = z.infer<typeof AnexoCSchema>;
export type AnexoD = z.infer<typeof AnexoDSchema>;
export type ClienteCompleto = z.infer<typeof ClienteCompletoSchema>;

// Enums para tipos de documentos
export enum TipoDocumento {
  CONTRATO_BASE = 'contrato_base',
  ANEXO_B = 'anexo_b',
  ANEXO_C = 'anexo_c',
  ANEXO_D = 'anexo_d'
}

// Estados de documentos
export enum EstadoDocumento {
  BORRADOR = 'Borrador',
  ENVIADO = 'Enviado',
  FIRMADO = 'Firmado',
  ACTIVO = 'Activo',
  COMPLETADO = 'Completado'
}