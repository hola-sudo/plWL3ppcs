/**
 * CLIENTE NOTION API - Sistema Legal Paralegal
 * 
 * Maneja la conexión con Notion para el workflow de contratos progresivos:
 * 1. Gestión de clientes y sus contratos
 * 2. Control de workflow de anexos (Base → B → C → D)
 * 3. Herencia de datos entre documentos
 * 4. Estados y seguimiento de documentos
 */

import { Client } from '@notionhq/client';
import { 
  ClienteCompleto, 
  ContratoBase, 
  AnexoB, 
  AnexoC, 
  AnexoD,
  TipoDocumento,
  EstadoDocumento
} from './legal-schemas';

export interface LegalClienteBasico {
  id: string;
  nombre: string;
  empresa?: string;
  rfc?: string;
  email?: string;
  telefono?: string;
  estadoGeneral?: string;
  ultimoAnexo?: string;
  documentosPendientes?: string;
  porcentajeCompletado?: number;
}

export interface LegalNotionConfig {
  apiKey: string;
  databaseId: string;
}

/**
 * Cliente especializado para sistema legal de contratos progresivos
 */
export class LegalNotionClient {
  private notion: Client;
  private databaseId: string;

  constructor(config: LegalNotionConfig) {
    this.notion = new Client({
      auth: config.apiKey,
    });
    this.databaseId = config.databaseId;
  }

  /**
   * Busca clientes por nombre, empresa o RFC
   */
  async searchClientes(query: string): Promise<LegalClienteBasico[]> {
    try {
      console.log('🔍 Buscando clientes legales en Notion:', query);
      console.log('🔧 Using database ID:', this.databaseId);
      
      // Intentar diferentes formatos del database ID
      let finalDatabaseId = this.databaseId;
      
      // Si tiene guiones, intentar sin guiones primero
      if (this.databaseId.includes('-')) {
        finalDatabaseId = this.databaseId.replace(/-/g, '');
      } 
      // Si no tiene guiones pero tiene 32 caracteres, agregar guiones
      else if (this.databaseId.length === 32) {
        finalDatabaseId = this.databaseId.replace(
          /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
          '$1-$2-$3-$4-$5'
        );
      }
      
      console.log('🔧 Final database ID:', finalDatabaseId);
      
      const response = await this.notion.databases.query({
        database_id: finalDatabaseId,
        filter: query ? {
          or: [
            {
              property: 'NOMBRE_CLIENTE',
              rich_text: {
                contains: query
              }
            },
            {
              property: 'EMPRESA_CLIENTE',
              rich_text: {
                contains: query
              }
            },
            {
              property: 'RFC_CLIENTE',
              rich_text: {
                contains: query
              }
            }
          ]
        } : undefined,
        page_size: 20
      });

      const clientes: LegalClienteBasico[] = response.results.map((page: any) => {
        const props = page.properties;
        
        return {
          id: page.id,
          nombre: this.extractTextProperty(props.NOMBRE_CLIENTE) || '',
          empresa: this.extractTextProperty(props.EMPRESA_CLIENTE) || '',
          rfc: this.extractTextProperty(props.RFC_CLIENTE) || '',
          email: this.extractTextProperty(props.EMAIL_CLIENTE) || '',
          telefono: this.extractTextProperty(props.TELEFONO_CLIENTE) || '',
          estadoGeneral: this.extractFormulaProperty(props.ESTADO_GENERAL) || '',
          ultimoAnexo: this.extractSelectProperty(props.ULTIMO_ANEXO_GENERADO) || '',
          documentosPendientes: this.extractFormulaProperty(props.DOCUMENTOS_PENDIENTES) || '',
          porcentajeCompletado: this.extractFormulaProperty(props.PORCENTAJE_COMPLETADO) || 0
        };
      });

      console.log(`✅ Encontrados ${clientes.length} clientes`);
      return clientes;
      
    } catch (error: any) {
      console.error('❌ Error buscando clientes:', error);
      throw new Error(`Error conectando con Notion: ${error.message}`);
    }
  }

  /**
   * Obtiene datos completos de un cliente incluyendo todos los contratos/anexos
   */
  async getClienteCompleto(clienteId: string): Promise<ClienteCompleto> {
    try {
      console.log('📋 Obteniendo cliente completo:', clienteId);
      
      const response = await this.notion.pages.retrieve({ page_id: clienteId });
      const props = (response as any).properties;
      
      // Construir objeto ClienteCompleto con todos los campos de la BD
      const clienteCompleto: ClienteCompleto = {
        // === IDENTIFICACIÓN ===
        ID_UNICO: this.extractTitleProperty(props.ID_UNICO) || '',
        NOMBRE_CLIENTE: this.extractTextProperty(props.NOMBRE_CLIENTE) || '',
        RFC_CLIENTE: this.extractTextProperty(props.RFC_CLIENTE) || '',
        EMPRESA_CLIENTE: this.extractTextProperty(props.EMPRESA_CLIENTE) || '',
        EMAIL_CLIENTE: this.extractTextProperty(props.EMAIL_CLIENTE) || '',
        TELEFONO_CLIENTE: this.extractTextProperty(props.TELEFONO_CLIENTE) || '',

        // === CONTRATO BASE ===
        CONTRATO_BASE_ESTADO: this.extractSelectProperty(props.CONTRATO_BASE_ESTADO) as any || 'Borrador',
        CONTRATO_BASE_PDF_URL: this.extractURLProperty(props.CONTRATO_BASE_PDF_URL) || '',
        CONTRATO_BASE_FECHA_GENERACION: this.extractDateProperty(props.CONTRATO_BASE_FECHA_GENERACION) || '',
        
        // Variables del contrato base
        CB_FECHA_CONTRATO: this.extractDateProperty(props.CB_FECHA_CONTRATO) || '',
        CB_EVENTO: this.extractTextProperty(props.CB_EVENTO) || '',
        CB_FECHA_EVENTO: this.extractDateProperty(props.CB_FECHA_EVENTO) || '',
        CB_HORA_EVENTO: this.extractTextProperty(props.CB_HORA_EVENTO) || '',
        CB_NOMBRE_EVENTO: this.extractTextProperty(props.CB_NOMBRE_EVENTO) || '',
        CB_UBICACION: this.extractTextProperty(props.CB_UBICACION) || '',

        // === CONTROL DE ANEXOS ===
        ANEXOS_GENERADOS: this.extractMultiSelectProperty(props.ANEXOS_GENERADOS) as any[] || [],
        ULTIMO_ANEXO_GENERADO: this.extractSelectProperty(props.ULTIMO_ANEXO_GENERADO) as any || 'Contrato_Base',

        // === ANEXO B (Opcional) ===
        anexoB: this.buildAnexoB(props),

        // === ANEXO C (Opcional) ===
        anexoC: this.buildAnexoC(props),

        // === ANEXO D (Opcional) ===
        anexoD: this.buildAnexoD(props),

        // === CAMPOS DEL SISTEMA ===
        FECHA_CREACION: this.extractDateProperty(props.FECHA_CREACION) || '',
        ULTIMA_MODIFICACION: this.extractDateProperty(props.ULTIMA_MODIFICACION) || '',
        CREADO_POR: this.extractTextProperty(props.CREADO_POR) || ''
      };
      
      console.log('✅ Cliente completo obtenido:', clienteCompleto.NOMBRE_CLIENTE);
      return clienteCompleto;

    } catch (error: any) {
      console.error('❌ Error obteniendo cliente completo:', error);
      throw new Error(`Error obteniendo datos del cliente: ${error.message}`);
    }
  }

  /**
   * Crea un nuevo cliente con contrato base
   */
  async crearClienteConContratoBase(
    datosCliente: Partial<ClienteCompleto>
  ): Promise<string> {
    try {
      console.log('🆕 Creando cliente con contrato base:', datosCliente.NOMBRE_CLIENTE);
      
      const response = await this.notion.pages.create({
        parent: {
          database_id: this.databaseId
        },
        properties: {
          // Identificación
          ID_UNICO: {
            title: [
              {
                text: {
                  content: datosCliente.ID_UNICO || `${datosCliente.NOMBRE_CLIENTE?.toUpperCase()}_${Date.now()}`
                }
              }
            ]
          },
          NOMBRE_CLIENTE: {
            rich_text: [
              {
                text: {
                  content: datosCliente.NOMBRE_CLIENTE || ''
                }
              }
            ]
          },
          RFC_CLIENTE: {
            rich_text: [
              {
                text: {
                  content: datosCliente.RFC_CLIENTE || ''
                }
              }
            ]
          },
          EMPRESA_CLIENTE: {
            rich_text: [
              {
                text: {
                  content: datosCliente.EMPRESA_CLIENTE || ''
                }
              }
            ]
          },
          EMAIL_CLIENTE: {
            email: datosCliente.EMAIL_CLIENTE || null
          },
          TELEFONO_CLIENTE: {
            phone_number: datosCliente.TELEFONO_CLIENTE || null
          },

          // Contrato Base
          CONTRATO_BASE_ESTADO: {
            select: {
              name: 'Borrador'
            }
          },
          CB_FECHA_CONTRATO: {
            date: {
              start: datosCliente.CB_FECHA_CONTRATO || new Date().toISOString().split('T')[0]
            }
          },
          CB_EVENTO: {
            rich_text: [
              {
                text: {
                  content: datosCliente.CB_EVENTO || ''
                }
              }
            ]
          },
          CB_FECHA_EVENTO: {
            date: {
              start: datosCliente.CB_FECHA_EVENTO || ''
            }
          },
          CB_HORA_EVENTO: {
            rich_text: [
              {
                text: {
                  content: datosCliente.CB_HORA_EVENTO || ''
                }
              }
            ]
          },
          CB_NOMBRE_EVENTO: {
            rich_text: [
              {
                text: {
                  content: datosCliente.CB_NOMBRE_EVENTO || ''
                }
              }
            ]
          },
          CB_UBICACION: {
            rich_text: [
              {
                text: {
                  content: datosCliente.CB_UBICACION || ''
                }
              }
            ]
          },

          // Control inicial
          ULTIMO_ANEXO_GENERADO: {
            select: {
              name: 'Contrato_Base'
            }
          }
        }
      });

      const clienteId = response.id;
      console.log('✅ Cliente creado exitosamente:', clienteId);
      return clienteId;

    } catch (error: any) {
      console.error('❌ Error creando cliente:', error);
      throw new Error(`Error creando cliente: ${error.message}`);
    }
  }

  /**
   * Actualiza los datos de un cliente (incluyendo anexos)
   */
  async actualizarCliente(
    clienteId: string, 
    datosActualizados: Partial<ClienteCompleto>
  ): Promise<boolean> {
    try {
      console.log('🔄 Actualizando cliente:', clienteId);
      
      const updateData: any = {
        page_id: clienteId,
        properties: {}
      };

      // Construir objeto de actualización dinámicamente
      this.buildUpdateProperties(updateData.properties, datosActualizados);

      await this.notion.pages.update(updateData);
      
      console.log('✅ Cliente actualizado exitosamente');
      return true;

    } catch (error: any) {
      console.error('❌ Error actualizando cliente:', error);
      throw new Error(`Error actualizando cliente: ${error.message}`);
    }
  }

  /**
   * Marca un documento como completado y actualiza el workflow
   */
  async marcarDocumentoCompletado(
    clienteId: string,
    tipoDocumento: TipoDocumento,
    pdfUrl: string
  ): Promise<boolean> {
    try {
      console.log('✅ Marcando documento como completado:', { clienteId, tipoDocumento, pdfUrl });
      
      const updateProperties: any = {};

      switch (tipoDocumento) {
        case TipoDocumento.CONTRATO_BASE:
          updateProperties.CONTRATO_BASE_ESTADO = { select: { name: 'Firmado' } };
          updateProperties.CONTRATO_BASE_PDF_URL = { url: pdfUrl };
          updateProperties.CONTRATO_BASE_FECHA_GENERACION = { 
            date: { start: new Date().toISOString() } 
          };
          break;

        case TipoDocumento.ANEXO_B:
          updateProperties.ANEXO_B_ESTADO = { select: { name: 'Completado' } };
          updateProperties.ANEXO_B_PDF_URL = { url: pdfUrl };
          updateProperties.ANEXO_B_FECHA_GENERACION = { 
            date: { start: new Date().toISOString() } 
          };
          updateProperties.ULTIMO_ANEXO_GENERADO = { select: { name: 'Anexo_B' } };
          updateProperties.ANEXOS_GENERADOS = { 
            multi_select: [{ name: 'Anexo_B' }] 
          };
          break;

        case TipoDocumento.ANEXO_C:
          updateProperties.ANEXO_C_ESTADO = { select: { name: 'Completado' } };
          updateProperties.ANEXO_C_PDF_URL = { url: pdfUrl };
          updateProperties.ANEXO_C_FECHA_GENERACION = { 
            date: { start: new Date().toISOString() } 
          };
          updateProperties.ULTIMO_ANEXO_GENERADO = { select: { name: 'Anexo_C' } };
          updateProperties.ANEXOS_GENERADOS = { 
            multi_select: [{ name: 'Anexo_B' }, { name: 'Anexo_C' }] 
          };
          break;

        case TipoDocumento.ANEXO_D:
          updateProperties.ANEXO_D_ESTADO = { select: { name: 'Completado' } };
          updateProperties.ANEXO_D_PDF_URL = { url: pdfUrl };
          updateProperties.ANEXO_D_FECHA_GENERACION = { 
            date: { start: new Date().toISOString() } 
          };
          updateProperties.ULTIMO_ANEXO_GENERADO = { select: { name: 'Anexo_D' } };
          updateProperties.ANEXOS_GENERADOS = { 
            multi_select: [
              { name: 'Anexo_B' }, 
              { name: 'Anexo_C' }, 
              { name: 'Anexo_D' }
            ] 
          };
          break;
      }

      await this.notion.pages.update({
        page_id: clienteId,
        properties: updateProperties
      });

      console.log('✅ Documento marcado como completado exitosamente');
      return true;

    } catch (error: any) {
      console.error('❌ Error marcando documento como completado:', error);
      return false;
    }
  }

  /**
   * Obtiene clientes que pueden generar el siguiente anexo
   */
  async getClientesDisponiblesParaAnexo(tipoAnexo: TipoDocumento): Promise<LegalClienteBasico[]> {
    try {
      console.log('🔍 Buscando clientes disponibles para:', tipoAnexo);
      
      let filter: any = {};

      switch (tipoAnexo) {
        case TipoDocumento.ANEXO_B:
          filter = {
            and: [
              {
                property: 'CONTRATO_BASE_ESTADO',
                select: {
                  equals: 'Firmado'
                }
              },
              {
                property: 'ANEXO_B_ESTADO',
                select: {
                  does_not_equal: 'Completado'
                }
              }
            ]
          };
          break;

        case TipoDocumento.ANEXO_C:
          filter = {
            and: [
              {
                property: 'ANEXO_B_ESTADO',
                select: {
                  equals: 'Completado'
                }
              },
              {
                property: 'ANEXO_C_ESTADO',
                select: {
                  does_not_equal: 'Completado'
                }
              }
            ]
          };
          break;

        case TipoDocumento.ANEXO_D:
          filter = {
            and: [
              {
                property: 'ANEXO_C_ESTADO',
                select: {
                  equals: 'Completado'
                }
              },
              {
                property: 'ANEXO_D_ESTADO',
                select: {
                  does_not_equal: 'Completado'
                }
              }
            ]
          };
          break;

        default:
          return [];
      }

      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter,
        page_size: 50
      });

      return this.mapToLegalClienteBasico(response.results);

    } catch (error: any) {
      console.error('❌ Error obteniendo clientes disponibles:', error);
      throw new Error(`Error obteniendo clientes: ${error.message}`);
    }
  }

  // === MÉTODOS HELPER PRIVADOS ===

  private buildAnexoB(props: any): Partial<AnexoB> | undefined {
    const estado = this.extractSelectProperty(props.ANEXO_B_ESTADO);
    if (!estado || estado === 'No_Requerido') return undefined;

    return {
      AB_CLIENTE: this.extractTextProperty(props.AB_CLIENTE) || '',
      AB_CONFIRMADO_1: this.extractTextProperty(props.AB_CONFIRMADO_1) || '',
      AB_CONFIRMADO_2: this.extractTextProperty(props.AB_CONFIRMADO_2) || '',
      AB_EN_RENDERS_1: this.extractTextProperty(props.AB_EN_RENDERS_1) || '',
      AB_EN_RENDERS_2: this.extractTextProperty(props.AB_EN_RENDERS_2) || '',
      AB_FECHA_CLIENTE: this.extractDateProperty(props.AB_FECHA_CLIENTE) || '',
      AB_FECHA_PIXEL: this.extractDateProperty(props.AB_FECHA_PIXEL) || '',
      AB_PIXEL_REPRESENTANTE: this.extractTextProperty(props.AB_PIXEL_REPRESENTANTE) || '',
      AB_TEMA_1: this.extractTextProperty(props.AB_TEMA_1) || '',
      AB_TEMA_2: this.extractTextProperty(props.AB_TEMA_2) || '',
      AB_AGREGAR_MAS: this.extractTextProperty(props.AB_AGREGAR_MAS) || '',
      CB_FECHA_EVENTO: this.extractDateProperty(props.CB_FECHA_EVENTO) || '',
      CB_NOMBRE_EVENTO: this.extractTextProperty(props.CB_NOMBRE_EVENTO) || '',
      ANEXO_B_ESTADO: estado as any,
      ANEXO_B_PDF_URL: this.extractURLProperty(props.ANEXO_B_PDF_URL),
      ANEXO_B_FECHA_GENERACION: this.extractDateProperty(props.ANEXO_B_FECHA_GENERACION)
    };
  }

  private buildAnexoC(props: any): Partial<AnexoC> | undefined {
    const estado = this.extractSelectProperty(props.ANEXO_C_ESTADO);
    if (!estado || estado === 'No_Requerido') return undefined;

    return {
      // Arrays de cambios (1-7)
      AC_CAMBIO_1: this.extractTextProperty(props.AC_CAMBIO_1),
      AC_CAMBIO_2: this.extractTextProperty(props.AC_CAMBIO_2),
      AC_CAMBIO_3: this.extractTextProperty(props.AC_CAMBIO_3),
      AC_CAMBIO_4: this.extractTextProperty(props.AC_CAMBIO_4),
      AC_CAMBIO_5: this.extractTextProperty(props.AC_CAMBIO_5),
      AC_CAMBIO_6: this.extractTextProperty(props.AC_CAMBIO_6),
      AC_CAMBIO_7: this.extractTextProperty(props.AC_CAMBIO_7),

      // Estados de ejecución
      AC_EJECUTADO_1: this.extractCheckboxProperty(props.AC_EJECUTADO_1),
      AC_EJECUTADO_2: this.extractCheckboxProperty(props.AC_EJECUTADO_2),
      AC_EJECUTADO_3: this.extractCheckboxProperty(props.AC_EJECUTADO_3),
      AC_EJECUTADO_4: this.extractCheckboxProperty(props.AC_EJECUTADO_4),
      AC_EJECUTADO_5: this.extractCheckboxProperty(props.AC_EJECUTADO_5),
      AC_EJECUTADO_6: this.extractCheckboxProperty(props.AC_EJECUTADO_6),
      AC_EJECUTADO_7: this.extractCheckboxProperty(props.AC_EJECUTADO_7),

      // Estados actuales y solicitados (similar pattern)
      AC_CLIENTE_ACEPTA_RONDA: this.extractCheckboxProperty(props.AC_CLIENTE_ACEPTA_RONDA) || false,
      AC_RONDA: this.extractNumberProperty(props.AC_RONDA) || 1,
      AC_TOTAL_CAMBIOS_RONDA: this.extractNumberProperty(props.AC_TOTAL_CAMBIOS_RONDA) || 0,

      CB_NOMBRE_EVENTO: this.extractTextProperty(props.CB_NOMBRE_EVENTO) || '',
      ANEXO_C_ESTADO: estado as any,
      ANEXO_C_PDF_URL: this.extractURLProperty(props.ANEXO_C_PDF_URL),
      ANEXO_C_FECHA_GENERACION: this.extractDateProperty(props.ANEXO_C_FECHA_GENERACION)
    };
  }

  private buildAnexoD(props: any): Partial<AnexoD> | undefined {
    const estado = this.extractSelectProperty(props.ANEXO_D_ESTADO);
    if (!estado || estado === 'No_Requerido') return undefined;

    return {
      AD_AUTORIZA_PAGO: this.extractCheckboxProperty(props.AD_AUTORIZA_PAGO) || false,
      AD_CAMBIOS_EJECUTADOS: this.extractTextProperty(props.AD_CAMBIOS_EJECUTADOS) || '',
      AD_CANTIDAD_RENDERS: this.extractNumberProperty(props.AD_CANTIDAD_RENDERS) || 0,
      AD_COSTO_TOTAL: this.extractNumberProperty(props.AD_COSTO_TOTAL) || 0,
      AD_DEFECTOS_VISUALES: this.extractTextProperty(props.AD_DEFECTOS_VISUALES) || '',
      AD_FECHA_ENTREGA: this.extractDateProperty(props.AD_FECHA_ENTREGA) || '',
      AD_FIRMA_CLIENTE: this.extractTextProperty(props.AD_FIRMA_CLIENTE) || '',
      AD_ENTREGA_SATISFACTORIA: this.extractCheckboxProperty(props.AD_ENTREGA_SATISFACTORIA) || false,
      AD_OBSERVACIONES_FINALES: this.extractTextProperty(props.AD_OBSERVACIONES_FINALES) || '',
      AD_CUMPLE_ESPECIFICACIONES: this.extractCheckboxProperty(props.AD_CUMPLE_ESPECIFICACIONES) || false,
      AD_FECHA_FIRMA: this.extractDateProperty(props.AD_FECHA_FIRMA) || '',
      AD_NOMBRE_FIRMANTE: this.extractTextProperty(props.AD_NOMBRE_FIRMANTE) || '',
      AD_CARGO_FIRMANTE: this.extractTextProperty(props.AD_CARGO_FIRMANTE) || '',
      AD_RENDERS_ACEPTADOS: this.extractNumberProperty(props.AD_RENDERS_ACEPTADOS) || 0,
      AD_RENDERS_RECHAZADOS: this.extractNumberProperty(props.AD_RENDERS_RECHAZADOS) || 0,
      AD_MOTIVO_RECHAZO: this.extractTextProperty(props.AD_MOTIVO_RECHAZO),
      AD_REQUIERE_REVISION: this.extractCheckboxProperty(props.AD_REQUIERE_REVISION) || false,
      AD_PROYECTO_FINALIZADO: this.extractCheckboxProperty(props.AD_PROYECTO_FINALIZADO) || false,

      CB_NOMBRE_EVENTO: this.extractTextProperty(props.CB_NOMBRE_EVENTO) || '',
      ANEXO_D_ESTADO: estado as any,
      ANEXO_D_PDF_URL: this.extractURLProperty(props.ANEXO_D_PDF_URL),
      ANEXO_D_FECHA_GENERACION: this.extractDateProperty(props.ANEXO_D_FECHA_GENERACION)
    };
  }

  private buildUpdateProperties(properties: any, datos: Partial<ClienteCompleto>) {
    // Implementar construcción dinámica de propiedades para actualización
    // (por brevedad, implementar según necesidades específicas)
  }

  private mapToLegalClienteBasico(results: any[]): LegalClienteBasico[] {
    return results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        nombre: this.extractTextProperty(props.NOMBRE_CLIENTE) || '',
        empresa: this.extractTextProperty(props.EMPRESA_CLIENTE) || '',
        rfc: this.extractTextProperty(props.RFC_CLIENTE) || '',
        email: this.extractTextProperty(props.EMAIL_CLIENTE) || '',
        telefono: this.extractTextProperty(props.TELEFONO_CLIENTE) || '',
        estadoGeneral: this.extractFormulaProperty(props.ESTADO_GENERAL) || '',
        ultimoAnexo: this.extractSelectProperty(props.ULTIMO_ANEXO_GENERADO) || '',
        documentosPendientes: this.extractFormulaProperty(props.DOCUMENTOS_PENDIENTES) || '',
        porcentajeCompletado: this.extractFormulaProperty(props.PORCENTAJE_COMPLETADO) || 0
      };
    });
  }

  // === EXTRACTORES DE PROPIEDADES NOTION ===

  private extractTitleProperty(property: any): string {
    if (!property || property.type !== 'title' || !property.title) return '';
    return property.title.map((t: any) => t.plain_text).join('');
  }

  private extractTextProperty(property: any): string {
    if (!property) return '';
    if (property.type === 'rich_text' && property.rich_text) {
      return property.rich_text.map((t: any) => t.plain_text).join('');
    }
    return '';
  }

  private extractDateProperty(property: any): string {
    if (!property || property.type !== 'date' || !property.date) return '';
    return property.date.start || '';
  }

  private extractSelectProperty(property: any): string {
    if (!property || property.type !== 'select' || !property.select) return '';
    return property.select.name || '';
  }

  private extractMultiSelectProperty(property: any): string[] {
    if (!property || property.type !== 'multi_select' || !property.multi_select) return [];
    return property.multi_select.map((option: any) => option.name);
  }

  private extractURLProperty(property: any): string {
    if (!property || property.type !== 'url') return '';
    return property.url || '';
  }

  private extractNumberProperty(property: any): number {
    if (!property || property.type !== 'number' || property.number === null) return 0;
    return property.number || 0;
  }

  private extractCheckboxProperty(property: any): boolean {
    if (!property || property.type !== 'checkbox') return false;
    return property.checkbox || false;
  }

  private extractFormulaProperty(property: any): any {
    if (!property || property.type !== 'formula' || !property.formula) return null;
    
    // Manejar diferentes tipos de resultado de fórmulas
    const result = property.formula;
    
    if (result.type === 'string') return result.string;
    if (result.type === 'number') return result.number;
    if (result.type === 'boolean') return result.boolean;
    
    return null;
  }
}

/**
 * Factory function para crear el cliente legal
 */
export function createLegalNotionClient(): LegalNotionClient {
  const apiKey = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    throw new Error('NOTION_TOKEN y NOTION_DATABASE_ID son requeridos en .env');
  }

  // Validar formato del database ID
  if (!databaseId.match(/^[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}$/i)) {
    throw new Error(`NOTION_DATABASE_ID formato inválido. Debe ser un UUID válido. Recibido: ${databaseId}`);
  }

  console.log('🔧 Configurando Notion client con:', {
    apiKey: apiKey.substring(0, 10) + '...',
    databaseId: databaseId
  });

  return new LegalNotionClient({
    apiKey,
    databaseId
  });
}