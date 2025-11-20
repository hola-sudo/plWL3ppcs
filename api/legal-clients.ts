import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createLegalNotionClient } from '../src/legal-notion-client';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = createLegalNotionClient();

    switch (req.method) {
      case 'GET':
        return await handleGetClientes(req, res, client);
      case 'POST':
        return await handleCreateCliente(req, res, client);
      case 'PUT':
        return await handleUpdateCliente(req, res, client);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error: any) {
    console.error('❌ Error en API legal-clients:', error);
    return res.status(500).json({ 
      error: 'Error del servidor',
      details: error.message 
    });
  }
}

/**
 * GET /api/legal-clients
 * Buscar clientes o obtener cliente específico
 */
async function handleGetClientes(req: VercelRequest, res: VercelResponse, client: any) {
  const { query, clienteId } = req.query;

  try {
    // Obtener cliente específico por ID
    if (clienteId) {
      console.log('📋 Obteniendo cliente específico:', clienteId);
      const clienteCompleto = await client.getClienteCompleto(clienteId as string);
      
      return res.status(200).json({
        success: true,
        data: clienteCompleto,
        message: 'Cliente obtenido exitosamente'
      });
    }

    // Buscar clientes por query
    console.log('🔍 Buscando clientes:', query || 'todos');
    const clientes = await client.searchClientes((query as string) || '');
    
    return res.status(200).json({
      success: true,
      data: clientes,
      count: clientes.length,
      message: `${clientes.length} clientes encontrados`
    });

  } catch (error: any) {
    console.error('❌ Error obteniendo clientes:', error);
    return res.status(500).json({
      success: false,
      error: 'Error obteniendo clientes',
      details: error.message
    });
  }
}

/**
 * POST /api/legal-clients
 * Crear nuevo cliente con contrato base
 */
async function handleCreateCliente(req: VercelRequest, res: VercelResponse, client: any) {
  const datosCliente = req.body;

  try {
    console.log('🆕 Creando nuevo cliente:', datosCliente.NOMBRE_CLIENTE);

    // Validar datos mínimos requeridos
    if (!datosCliente.NOMBRE_CLIENTE || !datosCliente.CB_NOMBRE_EVENTO) {
      return res.status(400).json({
        success: false,
        error: 'Datos incompletos',
        message: 'NOMBRE_CLIENTE y CB_NOMBRE_EVENTO son requeridos'
      });
    }

    // Crear cliente
    const clienteId = await client.crearClienteConContratoBase(datosCliente);
    
    return res.status(201).json({
      success: true,
      data: {
        clienteId,
        mensaje: 'Cliente creado exitosamente'
      },
      message: `Cliente ${datosCliente.NOMBRE_CLIENTE} creado con ID: ${clienteId}`
    });

  } catch (error: any) {
    console.error('❌ Error creando cliente:', error);
    return res.status(500).json({
      success: false,
      error: 'Error creando cliente',
      details: error.message
    });
  }
}

/**
 * PUT /api/legal-clients
 * Actualizar datos de cliente existente
 */
async function handleUpdateCliente(req: VercelRequest, res: VercelResponse, client: any) {
  const { clienteId, ...datosActualizados } = req.body;

  try {
    if (!clienteId) {
      return res.status(400).json({
        success: false,
        error: 'clienteId es requerido'
      });
    }

    console.log('🔄 Actualizando cliente:', clienteId);

    const success = await client.actualizarCliente(clienteId, datosActualizados);
    
    if (success) {
      return res.status(200).json({
        success: true,
        message: 'Cliente actualizado exitosamente'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Error actualizando cliente'
      });
    }

  } catch (error: any) {
    console.error('❌ Error actualizando cliente:', error);
    return res.status(500).json({
      success: false,
      error: 'Error actualizando cliente',
      details: error.message
    });
  }
}