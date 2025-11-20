import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  // Verificar variables de entorno críticas
  const envVars = {
    NOTION_TOKEN: !!process.env.NOTION_TOKEN,
    NOTION_DATABASE_ID: !!process.env.NOTION_DATABASE_ID,
    NOTION_API_KEY: !!process.env.NOTION_API_KEY // Legacy support
  };

  const allConfigured = Object.values(envVars).every(Boolean);

  // PDF Generator nativo - no requiere configuración externa
  const pdfGeneratorReady = true;

  return res.status(200).json({
    status: 'ok',
    service: 'Sistema Legal Paralegal API',
    version: '1.0.0-legal',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    configuration: {
      all_env_vars_configured: allConfigured,
      details: envVars,
      architecture: "Native PDF generation (pdfmake)",
      pdf_generator: "Direct generation - no external storage"
    },
    endpoints: {
      health: {
        method: 'GET',
        path: '/api/health',
        description: 'Health check and configuration status'
      },
      'legal-clients': {
        method: 'GET, POST, PUT',
        path: '/api/legal-clients',
        description: 'Gestión de clientes legales y contratos',
        required_fields: ['NOMBRE_CLIENTE', 'CB_NOMBRE_EVENTO'],
        response_time_avg: '2-5 seconds'
      },
      'legal-contracts': {
        method: 'GET, POST, PUT',
        path: '/api/legal-contracts',
        description: 'Generación y gestión de contratos progresivos',
        required_fields: ['clienteId', 'tipoDocumento'],
        response_time_avg: '3-8 seconds'
      }
    },
    limits: {
      max_request_size: '1MB',
      max_response_time: '30 seconds',
      rate_limiting: 'None (configure in production)'
    },
    integrations: {
      pdf_generation: {
        engine: 'pdfmake',
        version: '0.2.7',
        purpose: 'Native PDF generation for legal contracts'
      },
      notion: {
        configured: !!process.env.NOTION_TOKEN && !!process.env.NOTION_DATABASE_ID,
        purpose: 'Legal client database and contract workflow tracking'
      },
      pdf_generator: {
        engine: 'pdfmake',
        version: '0.2.9',
        type: 'native_serverless',
        features: ['legal_templates', 'progressive_contracts', 'data_inheritance'],
        performance: 'Sub-5-second generation',
        templates: 4,
        total_fields: 95,
        document_types: ['contrato_base', 'anexo_b', 'anexo_c', 'anexo_d']
      }
    }
  });
}