/**
 * GENERADOR DE PDFs LEGAL - Sistema de Contratos Progresivos
 * 
 * Genera PDFs usando PDFMake para:
 * - Contrato Base
 * - Anexo B (Modificaciones)
 * - Anexo C (Entregas/Hitos)
 * - Anexo D (Finalización)
 * 
 * Con herencia automática de datos entre documentos
 */

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { 
  ClienteCompleto, 
  TipoDocumento, 
  ContratoBase, 
  AnexoB, 
  AnexoC, 
  AnexoD 
} from './legal-schemas';

// Configurar fuentes para PDFMake - CORRECCIÓN WOZ
(pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;

export interface LegalPDFOptions {
  tipoDocumento: TipoDocumento;
  clienteData: ClienteCompleto;
  includeMetadata?: boolean;
}

export interface LegalPDFResult {
  success: boolean;
  pdfBuffer?: Buffer;
  fileName?: string;
  error?: string;
  metadata?: {
    timestamp: string;
    documentType: string;
    clienteName: string;
    fieldsUsed: number;
  };
}

/**
 * Generador principal de PDFs legales
 */
export class LegalPDFGenerator {
  
  /**
   * Genera PDF según el tipo de documento
   */
  static async generatePDF(options: LegalPDFOptions): Promise<LegalPDFResult> {
    try {
      const { tipoDocumento, clienteData, includeMetadata = true } = options;
      
      console.log('📄 Generando PDF legal:', {
        tipo: tipoDocumento,
        cliente: clienteData.NOMBRE_CLIENTE
      });

      let documentDefinition: any;
      let fieldsUsed = 0;

      switch (tipoDocumento) {
        case TipoDocumento.CONTRATO_BASE:
          documentDefinition = this.generateContratoBase(clienteData);
          fieldsUsed = 8; // Variables del contrato base
          break;

        case TipoDocumento.ANEXO_B:
          if (!clienteData.anexoB) {
            throw new Error('Datos del Anexo B no disponibles');
          }
          documentDefinition = this.generateAnexoB(clienteData, clienteData.anexoB);
          fieldsUsed = 13; // Variables específicas del anexo B
          break;

        case TipoDocumento.ANEXO_C:
          if (!clienteData.anexoC) {
            throw new Error('Datos del Anexo C no disponibles');
          }
          documentDefinition = this.generateAnexoC(clienteData, clienteData.anexoC);
          fieldsUsed = 32; // Variables del anexo C
          break;

        case TipoDocumento.ANEXO_D:
          if (!clienteData.anexoD) {
            throw new Error('Datos del Anexo D no disponibles');
          }
          documentDefinition = this.generateAnexoD(clienteData, clienteData.anexoD);
          fieldsUsed = 21; // Variables del anexo D
          break;

        default:
          throw new Error(`Tipo de documento no soportado: ${tipoDocumento}`);
      }

      // Generar PDF
      const pdfDoc = pdfMake.createPdf(documentDefinition);
      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        pdfDoc.getBuffer((buffer: Buffer) => {
          resolve(buffer);
        });
      });

      const fileName = this.generateFileName(tipoDocumento, clienteData);

      // Metadata
      let metadata;
      if (includeMetadata) {
        metadata = {
          timestamp: new Date().toISOString(),
          documentType: tipoDocumento,
          clienteName: clienteData.NOMBRE_CLIENTE,
          fieldsUsed
        };
      }

      console.log('✅ PDF generado exitosamente:', {
        size: pdfBuffer.length,
        fileName
      });

      return {
        success: true,
        pdfBuffer,
        fileName,
        metadata
      };

    } catch (error: any) {
      console.error('❌ Error generando PDF legal:', error);
      return {
        success: false,
        error: error.message || 'Error desconocido generando PDF'
      };
    }
  }

  /**
   * Genera PDF del Contrato Base
   */
  private static generateContratoBase(cliente: ClienteCompleto): any {
    return {
      pageSize: 'LETTER',
      pageMargins: [60, 60, 60, 60],
      
      content: [
        // Header
        {
          text: 'CONTRATO DE SERVICIOS PROFESIONALES',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 30]
        },
        
        // Información del contrato
        {
          columns: [
            {
              text: [
                { text: 'FECHA DEL CONTRATO: ', bold: true },
                cliente.CB_FECHA_CONTRATO || new Date().toLocaleDateString('es-MX')
              ]
            },
            {
              text: [
                { text: 'ID ÚNICO: ', bold: true },
                cliente.ID_UNICO || 'N/A'
              ]
            }
          ],
          margin: [0, 0, 0, 20]
        },

        // Información del cliente
        {
          text: 'INFORMACIÓN DEL CLIENTE',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        {
          table: {
            widths: ['30%', '70%'],
            body: [
              ['Nombre:', cliente.NOMBRE_CLIENTE || ''],
              ['RFC:', cliente.RFC_CLIENTE || ''],
              ['Empresa:', cliente.EMPRESA_CLIENTE || ''],
              ['Email:', cliente.EMAIL_CLIENTE || ''],
              ['Teléfono:', cliente.TELEFONO_CLIENTE || '']
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20]
        },

        // Información del evento/servicio
        {
          text: 'INFORMACIÓN DEL SERVICIO',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        {
          table: {
            widths: ['30%', '70%'],
            body: [
              ['Evento:', cliente.CB_EVENTO || ''],
              ['Nombre Completo del Evento:', cliente.CB_NOMBRE_EVENTO || ''],
              ['Fecha del Evento:', cliente.CB_FECHA_EVENTO || ''],
              ['Hora del Evento:', cliente.CB_HORA_EVENTO || ''],
              ['Ubicación:', cliente.CB_UBICACION || '']
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 30]
        },

        // Términos y condiciones
        {
          text: 'TÉRMINOS Y CONDICIONES',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        {
          text: [
            'Por medio del presente contrato, las partes acuerdan los términos y condiciones para la prestación de servicios profesionales relacionados con ',
            { text: cliente.CB_NOMBRE_EVENTO || '[EVENTO]', bold: true },
            ', que se llevará a cabo el ',
            { text: cliente.CB_FECHA_EVENTO || '[FECHA]', bold: true },
            ' en ',
            { text: cliente.CB_UBICACION || '[UBICACIÓN]', bold: true },
            '.'
          ],
          alignment: 'justify',
          margin: [0, 0, 0, 15]
        },

        {
          text: 'El presente contrato establece las bases para la relación comercial y puede ser modificado mediante anexos posteriores según las necesidades del proyecto.',
          alignment: 'justify',
          margin: [0, 0, 0, 30]
        },

        // Firmas
        {
          columns: [
            {
              text: [
                '\n\n',
                '_'.repeat(30),
                '\nFIRMA DEL CLIENTE\n',
                cliente.NOMBRE_CLIENTE || ''
              ],
              alignment: 'center'
            },
            {
              text: [
                '\n\n',
                '_'.repeat(30),
                '\nFIRMA DEL PROVEEDOR\n',
                '3D Pixel Perfection'
              ],
              alignment: 'center'
            }
          ],
          margin: [0, 50, 0, 0]
        },

        // Footer
        {
          text: `Documento generado el ${new Date().toLocaleDateString('es-MX')} a las ${new Date().toLocaleTimeString('es-MX')}`,
          style: 'footer',
          margin: [0, 30, 0, 0]
        }
      ],

      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: '#2c3e50'
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#34495e',
          margin: [0, 15, 0, 8]
        },
        footer: {
          fontSize: 9,
          italics: true,
          color: '#7f8c8d',
          alignment: 'center'
        }
      }
    };
  }

  /**
   * Genera PDF del Anexo B (Modificaciones)
   */
  private static generateAnexoB(cliente: ClienteCompleto, anexoB: Partial<AnexoB>): any {
    return {
      pageSize: 'LETTER',
      pageMargins: [60, 60, 60, 60],
      
      content: [
        // Header
        {
          text: 'ANEXO B - MODIFICACIONES AL CONTRATO',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 30]
        },

        // Referencia al contrato base
        {
          text: [
            { text: 'REFERENCIA: ', bold: true },
            'Contrato Base para ',
            { text: cliente.CB_NOMBRE_EVENTO || '[EVENTO]', bold: true },
            ' del cliente ',
            { text: cliente.NOMBRE_CLIENTE || '[CLIENTE]', bold: true }
          ],
          margin: [0, 0, 0, 20]
        },

        // Información de fechas
        {
          columns: [
            {
              text: [
                { text: 'FECHA DEL CLIENTE: ', bold: true },
                anexoB.AB_FECHA_CLIENTE || 'N/A'
              ]
            },
            {
              text: [
                { text: 'FECHA PIXEL: ', bold: true },
                anexoB.AB_FECHA_PIXEL || 'N/A'
              ]
            }
          ],
          margin: [0, 0, 0, 20]
        },

        // Estados de confirmación
        {
          text: 'ESTADOS DE CONFIRMACIÓN Y RENDERS',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        {
          table: {
            widths: ['50%', '50%'],
            body: [
              ['Confirmado 1:', anexoB.AB_CONFIRMADO_1 || ''],
              ['Confirmado 2:', anexoB.AB_CONFIRMADO_2 || ''],
              ['En Renders 1:', anexoB.AB_EN_RENDERS_1 || ''],
              ['En Renders 2:', anexoB.AB_EN_RENDERS_2 || '']
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20]
        },

        // Temas de modificación
        {
          text: 'TEMAS DE MODIFICACIÓN',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        {
          text: [
            { text: 'Tema 1: ', bold: true },
            anexoB.AB_TEMA_1 || 'N/A'
          ],
          margin: [0, 0, 0, 10]
        },
        {
          text: [
            { text: 'Tema 2: ', bold: true },
            anexoB.AB_TEMA_2 || 'N/A'
          ],
          margin: [0, 0, 0, 10]
        },
        {
          text: [
            { text: 'Información Adicional: ', bold: true },
            anexoB.AB_AGREGAR_MAS || 'Ninguna'
          ],
          margin: [0, 0, 0, 20]
        },

        // Representante
        {
          text: [
            { text: 'REPRESENTANTE ASIGNADO: ', bold: true },
            anexoB.AB_PIXEL_REPRESENTANTE || 'Por asignar'
          ],
          margin: [0, 20, 0, 30]
        },

        // Footer
        {
          text: `Anexo B generado el ${new Date().toLocaleDateString('es-MX')} a las ${new Date().toLocaleTimeString('es-MX')}`,
          style: 'footer',
          margin: [0, 30, 0, 0]
        }
      ],

      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: '#2c3e50'
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#e67e22',
          margin: [0, 15, 0, 8]
        },
        footer: {
          fontSize: 9,
          italics: true,
          color: '#7f8c8d',
          alignment: 'center'
        }
      }
    };
  }

  /**
   * Genera PDF del Anexo C (Entregas/Hitos)
   */
  private static generateAnexoC(cliente: ClienteCompleto, anexoC: Partial<AnexoC>): any {
    // Construir array de cambios
    const cambios = [];
    for (let i = 1; i <= 7; i++) {
      const cambio = (anexoC as any)[`AC_CAMBIO_${i}`];
      const ejecutado = (anexoC as any)[`AC_EJECUTADO_${i}`];
      const estadoActual = (anexoC as any)[`AC_ESTADO_ACTUAL_${i}`];
      const estadoSolicitado = (anexoC as any)[`AC_ESTADO_SOLICITADO_${i}`];
      
      if (cambio) {
        cambios.push([
          `Cambio ${i}`,
          cambio,
          ejecutado ? 'Sí' : 'No',
          estadoActual || '',
          estadoSolicitado || ''
        ]);
      }
    }

    return {
      pageSize: 'LETTER',
      pageMargins: [40, 60, 40, 60],
      
      content: [
        // Header
        {
          text: 'ANEXO C - ENTREGAS Y CONTROL DE HITOS',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 30]
        },

        // Información de la ronda
        {
          columns: [
            {
              text: [
                { text: 'RONDA: ', bold: true },
                anexoC.AC_RONDA?.toString() || '1'
              ]
            },
            {
              text: [
                { text: 'TOTAL CAMBIOS: ', bold: true },
                anexoC.AC_TOTAL_CAMBIOS_RONDA?.toString() || '0'
              ]
            },
            {
              text: [
                { text: 'CLIENTE ACEPTA: ', bold: true },
                anexoC.AC_CLIENTE_ACEPTA_RONDA ? 'SÍ' : 'PENDIENTE'
              ]
            }
          ],
          margin: [0, 0, 0, 20]
        },

        // Tabla de cambios
        {
          text: 'CONTROL DE CAMBIOS Y ESTADOS',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        cambios.length > 0 ? {
          table: {
            headerRows: 1,
            widths: ['15%', '35%', '12%', '19%', '19%'],
            body: [
              [
                { text: 'ID', style: 'tableHeader' },
                { text: 'Descripción del Cambio', style: 'tableHeader' },
                { text: 'Ejecutado', style: 'tableHeader' },
                { text: 'Estado Actual', style: 'tableHeader' },
                { text: 'Estado Solicitado', style: 'tableHeader' }
              ],
              ...cambios
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 30]
        } : {
          text: 'No hay cambios registrados en esta ronda.',
          italics: true,
          color: '#7f8c8d',
          margin: [0, 0, 0, 30]
        },

        // Footer
        {
          text: `Anexo C generado el ${new Date().toLocaleDateString('es-MX')} a las ${new Date().toLocaleTimeString('es-MX')}`,
          style: 'footer',
          margin: [0, 30, 0, 0]
        }
      ],

      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: '#2c3e50'
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#9b59b6',
          margin: [0, 15, 0, 8]
        },
        tableHeader: {
          bold: true,
          fillColor: '#ecf0f1',
          color: '#2c3e50'
        },
        footer: {
          fontSize: 9,
          italics: true,
          color: '#7f8c8d',
          alignment: 'center'
        }
      }
    };
  }

  /**
   * Genera PDF del Anexo D (Finalización)
   */
  private static generateAnexoD(cliente: ClienteCompleto, anexoD: Partial<AnexoD>): any {
    return {
      pageSize: 'LETTER',
      pageMargins: [60, 60, 60, 60],
      
      content: [
        // Header
        {
          text: 'ANEXO D - FINALIZACIÓN DEL PROYECTO',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 30]
        },

        // Estado del proyecto
        {
          text: 'ESTADO DEL PROYECTO',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        {
          table: {
            widths: ['40%', '60%'],
            body: [
              ['Proyecto Finalizado:', anexoD.AD_PROYECTO_FINALIZADO ? 'SÍ' : 'NO'],
              ['Entrega Satisfactoria:', anexoD.AD_ENTREGA_SATISFACTORIA ? 'SÍ' : 'NO'],
              ['Cumple Especificaciones:', anexoD.AD_CUMPLE_ESPECIFICACIONES ? 'SÍ' : 'NO'],
              ['Fecha de Entrega:', anexoD.AD_FECHA_ENTREGA || 'Pendiente'],
              ['Requiere Revisión:', anexoD.AD_REQUIERE_REVISION ? 'SÍ' : 'NO']
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20]
        },

        // Información de renders
        {
          text: 'INFORMACIÓN DE RENDERS',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        {
          table: {
            widths: ['40%', '60%'],
            body: [
              ['Cantidad Total:', anexoD.AD_CANTIDAD_RENDERS?.toString() || '0'],
              ['Renders Aceptados:', anexoD.AD_RENDERS_ACEPTADOS?.toString() || '0'],
              ['Renders Rechazados:', anexoD.AD_RENDERS_RECHAZADOS?.toString() || '0'],
              ['Motivo de Rechazo:', anexoD.AD_MOTIVO_RECHAZO || 'N/A'],
              ['Defectos Visuales:', anexoD.AD_DEFECTOS_VISUALES || 'Ninguno']
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20]
        },

        // Información financiera
        {
          text: 'INFORMACIÓN FINANCIERA Y AUTORIZACIÓN',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        {
          table: {
            widths: ['40%', '60%'],
            body: [
              ['Costo Total:', `$${anexoD.AD_COSTO_TOTAL?.toLocaleString('es-MX') || '0.00'}`],
              ['Autoriza Pago:', anexoD.AD_AUTORIZA_PAGO ? 'SÍ' : 'NO'],
              ['Cambios Ejecutados:', anexoD.AD_CAMBIOS_EJECUTADOS || 'N/A']
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20]
        },

        // Observaciones finales
        {
          text: 'OBSERVACIONES FINALES',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        {
          text: anexoD.AD_OBSERVACIONES_FINALES || 'Sin observaciones adicionales.',
          alignment: 'justify',
          margin: [0, 0, 0, 30]
        },

        // Firma
        {
          text: 'FIRMA DE CONFORMIDAD',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
        },
        {
          table: {
            widths: ['40%', '60%'],
            body: [
              ['Nombre del Firmante:', anexoD.AD_NOMBRE_FIRMANTE || cliente.NOMBRE_CLIENTE],
              ['Cargo:', anexoD.AD_CARGO_FIRMANTE || 'Cliente'],
              ['Fecha de Firma:', anexoD.AD_FECHA_FIRMA || new Date().toLocaleDateString('es-MX')],
              ['Firma del Cliente:', anexoD.AD_FIRMA_CLIENTE || '_'.repeat(30)]
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 30]
        },

        // Footer
        {
          text: `Anexo D - Documento de Finalización generado el ${new Date().toLocaleDateString('es-MX')} a las ${new Date().toLocaleTimeString('es-MX')}`,
          style: 'footer',
          margin: [0, 30, 0, 0]
        }
      ],

      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: '#2c3e50'
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#27ae60',
          margin: [0, 15, 0, 8]
        },
        footer: {
          fontSize: 9,
          italics: true,
          color: '#7f8c8d',
          alignment: 'center'
        }
      }
    };
  }

  /**
   * Genera nombre del archivo
   */
  private static generateFileName(tipo: TipoDocumento, cliente: ClienteCompleto): string {
    const clienteName = cliente.NOMBRE_CLIENTE?.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'Cliente';
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    return `${tipo}_${clienteName}_${timestamp}.pdf`;
  }
}

/**
 * Función de conveniencia para generar PDFs
 */
export async function generateLegalPDF(options: LegalPDFOptions): Promise<LegalPDFResult> {
  return LegalPDFGenerator.generatePDF(options);
}