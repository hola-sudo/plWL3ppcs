#!/usr/bin/env node

/**
 * Sistema de Tests Básicos para 3D Pixel Perfection Legal System
 * Valida configuración, APIs y funcionalidad crítica
 */

const fs = require('fs');
const path = require('path');

// ANSI Colors para output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    log(message, color = 'reset') {
        console.log(`${colors[color]}${message}${colors.reset}`);
    }

    test(description, testFn) {
        this.tests.push({ description, testFn });
    }

    async run() {
        this.log('\n🧪 3D PIXEL PERFECTION - LEGAL SYSTEM TESTS', 'cyan');
        this.log('='.repeat(50), 'cyan');
        
        for (const { description, testFn } of this.tests) {
            try {
                await testFn();
                this.log(`✅ ${description}`, 'green');
                this.passed++;
            } catch (error) {
                this.log(`❌ ${description}`, 'red');
                this.log(`   Error: ${error.message}`, 'red');
                this.failed++;
            }
        }

        this.log('\n📊 RESUMEN DE TESTS:', 'cyan');
        this.log(`   ✅ Pasaron: ${this.passed}`, 'green');
        this.log(`   ❌ Fallaron: ${this.failed}`, this.failed > 0 ? 'red' : 'green');
        this.log(`   📈 Total: ${this.tests.length}`, 'blue');
        
        if (this.failed > 0) {
            this.log('\n🚨 ALGUNOS TESTS FALLARON', 'red');
            process.exit(1);
        } else {
            this.log('\n🎉 TODOS LOS TESTS PASARON', 'green');
            process.exit(0);
        }
    }
}

// Inicializar test runner
const runner = new TestRunner();

// TEST 1: Validar estructura de archivos
runner.test('Estructura de archivos críticos', () => {
    const requiredFiles = [
        'src/legal-notion-client.ts',
        'src/legal-pdf-generator.ts',
        'src/legal-schemas.ts',
        'api/legal-contracts.ts',
        'api/legal-clients.ts',
        'api/health.ts',
        'public/index.html',
        'public/legal-dashboard.html',
        'public/dashboard-nuevo.html',
        'public/test.html',
        'package.json',
        'tsconfig.json'
    ];

    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
        throw new Error(`Archivos faltantes: ${missingFiles.join(', ')}`);
    }
});

// TEST 2: Validar package.json
runner.test('Configuración de package.json', () => {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (!packageJson.dependencies['@notionhq/client']) {
        throw new Error('Falta dependencia: @notionhq/client');
    }
    
    if (!packageJson.dependencies['pdfmake']) {
        throw new Error('Falta dependencia: pdfmake');
    }
    
    if (!packageJson.scripts.build) {
        throw new Error('Falta script de build');
    }
});

// TEST 3: Validar schemas de Zod
runner.test('Schemas de validación', () => {
    const schemaContent = fs.readFileSync('src/legal-schemas.ts', 'utf8');
    
    const requiredFields = [
        'NOMBRE_CLIENTE',
        'CB_NOMBRE_EVENTO', 
        'RFC',
        'EMAIL',
        'FECHA_PIXEL',
        'PIXEL_REPRESENTANTE'
    ];
    
    const missingFields = requiredFields.filter(field => 
        !schemaContent.includes(field)
    );
    
    if (missingFields.length > 0) {
        throw new Error(`Campos faltantes en schema: ${missingFields.join(', ')}`);
    }
});

// TEST 4: Validar configuración de TypeScript
runner.test('Configuración de TypeScript', () => {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    
    if (!tsconfig.compilerOptions) {
        throw new Error('Falta configuración compilerOptions');
    }
    
    if (tsconfig.compilerOptions.strict === false) {
        throw new Error('TypeScript strict mode está deshabilitado (inseguro para producción)');
    }
});

// TEST 5: Validar que no hay tokens hardcodeados
runner.test('Seguridad - No tokens hardcodeados', () => {
    const sensitiveFiles = ['src/legal-notion-client.ts', 'api/health.ts'];
    
    for (const file of sensitiveFiles) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Buscar patrones de tokens hardcodeados
        const tokenPatterns = [
            /secret_[a-zA-Z0-9]{32,}/g,
            /ntn_[a-zA-Z0-9]{32,}/g,
            /Bearer [a-zA-Z0-9]{20,}/g
        ];
        
        for (const pattern of tokenPatterns) {
            if (pattern.test(content)) {
                throw new Error(`Token hardcodeado detectado en ${file}`);
            }
        }
    }
});

// TEST 6: Validar variables de entorno
runner.test('Variables de entorno requeridas', () => {
    const envExample = fs.readFileSync('.env.example', 'utf8');
    
    if (!envExample.includes('NOTION_TOKEN')) {
        throw new Error('NOTION_TOKEN no está en .env.example');
    }
    
    if (!envExample.includes('NOTION_DATABASE_ID')) {
        throw new Error('NOTION_DATABASE_ID no está en .env.example');
    }
    
    // Verificar que no use la variable incorrecta
    if (envExample.includes('NOTION_API_KEY')) {
        throw new Error('Usar NOTION_TOKEN en lugar de NOTION_API_KEY');
    }
});

// TEST 7: Validar consistencia en README
runner.test('Documentación consistente', () => {
    const readme = fs.readFileSync('README.md', 'utf8');
    
    if (!readme.includes('3D Pixel Perfection')) {
        throw new Error('README debe mencionar 3D Pixel Perfection');
    }
    
    if (readme.includes('NOTION_API_KEY')) {
        throw new Error('README usa variable obsoleta NOTION_API_KEY');
    }
    
    if (!readme.includes('NOTION_TOKEN')) {
        throw new Error('README debe usar NOTION_TOKEN');
    }
});

// TEST 8: Validar archivos HTML creados
runner.test('Interfaces HTML creadas', () => {
    const dashboardNuevo = fs.readFileSync('public/dashboard-nuevo.html', 'utf8');
    const testHtml = fs.readFileSync('public/test.html', 'utf8');
    
    if (!dashboardNuevo.includes('3D Pixel Perfection')) {
        throw new Error('dashboard-nuevo.html debe mencionar 3D Pixel Perfection');
    }
    
    if (!testHtml.includes('Panel de Pruebas')) {
        throw new Error('test.html debe ser un panel de pruebas válido');
    }
});

// TEST 9: Validar APIs health check
runner.test('Health API usa variables correctas', () => {
    const healthContent = fs.readFileSync('api/health.ts', 'utf8');
    
    if (healthContent.includes('NOTION_API_KEY')) {
        throw new Error('health.ts aún usa NOTION_API_KEY obsoleto');
    }
    
    if (!healthContent.includes('NOTION_TOKEN')) {
        throw new Error('health.ts debe usar NOTION_TOKEN');
    }
});

// TEST 10: Validar que no existe test-env.ts
runner.test('Archivo test-env.ts removido', () => {
    if (fs.existsSync('api/test-env.ts')) {
        throw new Error('api/test-env.ts debe ser removido por seguridad');
    }
});

// Ejecutar tests
runner.run().catch(console.error);