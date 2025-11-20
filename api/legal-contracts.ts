import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createLegalNotionClient } from '../src/legal-notion-client';
import { TipoDocumento } from '../src/legal-schemas';
import { generateLegalPDF } from '../src/legal-pdf-generator';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = createLegalNotionClient();

    switch (req.method) {
      case 'GET':
        return await handleGetAvailableClients(req, res, client);
      case 'POST':
        return await handleGenerateContract(req, res, client);
      case 'PUT':
        return await handleMarkCompleted(req, res, client);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error: any) {
    console.error('❌ Error en API legal-contracts:', error);
    return res.status(500).json({ 
      error: 'Error del servidor',
      details: error.message 
    });
  }
}

/**
 * GET /api/legal-contracts?tipo=anexo_b
 * Obtener clientes disponibles para generar un tipo específico de documento
 */
async function handleGetAvailableClients(req: VercelRequest, res: VercelResponse, client: any) {
  const { tipo } = req.query;

  try {
    if (!tipo) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro "tipo" es requerido',
        validTypes: ['contrato_base', 'anexo_b', 'anexo_c', 'anexo_d']
      });
    }

    console.log('🔍 Buscando clientes disponibles para:', tipo);

    let tipoDocumento: TipoDocumento;
    switch (tipo) {
      case 'anexo_b':
        tipoDocumento = TipoDocumento.ANEXO_B;
        break;
      case 'anexo_c':
        tipoDocumento = TipoDocumento.ANEXO_C;
        break;
      case 'anexo_d':
        tipoDocumento = TipoDocumento.ANEXO_D;
        break;
      case 'contrato_base':
        tipoDocumento = TipoDocumento.CONTRATO_BASE;
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Tipo de documento no válido'
        });
    }

    const clientesDisponibles = await client.getClientesDisponiblesParaAnexo(tipoDocumento);
    
    return res.status(200).json({
      success: true,
      data: clientesDisponibles,
      count: clientesDisponibles.length,
      tipoDocumento: tipo,
      message: `${clientesDisponibles.length} clientes pueden generar ${tipo}`
    });

  } catch (error: any) {
    console.error('❌ Error obteniendo clientes disponibles:', error);
    return res.status(500).json({
      success: false,
      error: 'Error obteniendo clientes disponibles',
      details: error.message
    });
  }
}

/**
 * POST /api/legal-contracts
 * Generar PDF de contrato/anexo
 */
async function handleGenerateContract(req: VercelRequest, res: VercelResponse, client: any) {
  const { clienteId, tipoDocumento, datosDocumento } = req.body;

  try {
    if (!clienteId || !tipoDocumento) {
      return res.status(400).json({
        success: false,
        error: 'clienteId y tipoDocumento son requeridos'
      });
    }

    console.log('📄 Generando contrato:', { clienteId, tipoDocumento });

    // Obtener datos completos del cliente
    const clienteCompleto = await client.getClienteCompleto(clienteId);
    
    // Generar PDF real usando el generador
    console.log('🔄 Generando PDF real con LegalPDFGenerator...');
    const pdfResult = await generateLegalPDF({
      tipoDocumento: tipoDocumento as TipoDocumento,
      clienteData: clienteCompleto,
      includeMetadata: true
    });

    if (!pdfResult.success || !pdfResult.pdfBuffer) {
      throw new Error(`Error generando PDF: ${pdfResult.error}`);
    }

    // En producción, aquí subirías el PDF a un storage (AWS S3, Cloudinary, etc.)
    // Por ahora, creamos una URL simulada pero el PDF está realmente generado
    const pdfUrl = `https://storage.example.com/pdfs/${pdfResult.fileName}`;
    
    console.log('✅ PDF generado exitosamente:', {
      fileName: pdfResult.fileName,
      size: pdfResult.pdfBuffer.length,
      metadata: pdfResult.metadata
    });

    // Marcar como completado en Notion
    await client.marcarDocumentoCompletado(
      clienteId, 
      tipoDocumento as TipoDocumento, 
      pdfUrl
    );

    return res.status(200).json({
      success: true,
      data: {
        pdfUrl,
        clienteNombre: clienteCompleto.NOMBRE_CLIENTE,
        tipoDocumento,
        fechaGeneracion: new Date().toISOString()
      },
      message: 'Contrato generado exitosamente'
    });

  } catch (error: any) {
    console.error('❌ Error generando contrato:', error);
    return res.status(500).json({
      success: false,
      error: 'Error generando contrato',
      details: error.message
    });
  }
}

/**
 * PUT /api/legal-contracts
 * Marcar documento como completado manualmente
 */
async function handleMarkCompleted(req: VercelRequest, res: VercelResponse, client: any) {
  const { clienteId, tipoDocumento, pdfUrl } = req.body;

  try {
    if (!clienteId || !tipoDocumento || !pdfUrl) {
      return res.status(400).json({
        success: false,
        error: 'clienteId, tipoDocumento y pdfUrl son requeridos'
      });
    }

    console.log('✅ Marcando documento como completado:', { clienteId, tipoDocumento });

    const success = await client.marcarDocumentoCompletado(
      clienteId, 
      tipoDocumento as TipoDocumento, 
      pdfUrl
    );

    if (success) {
      return res.status(200).json({
        success: true,
        message: 'Documento marcado como completado'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Error marcando documento como completado'
      });
    }

  } catch (error: any) {
    console.error('❌ Error marcando como completado:', error);
    return res.status(500).json({
      success: false,
      error: 'Error marcando documento como completado',
      details: error.message
    });
  }
}