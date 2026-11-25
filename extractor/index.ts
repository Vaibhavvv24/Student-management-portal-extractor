import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, ChildProcess } from 'child_process';
import { BrowserExtractor, RouteTarget } from './browser/browser';
import { DesignIrAssembler } from './design-ir/assembler';
import { DesignIrValidator } from './validation/validate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;

const ROUTES: RouteTarget[] = [
  {
    id: '101:0',
    name: 'Dashboard',
    path: '/dashboard',
    screenPrefix: 101
  },
  {
    id: '102:0',
    name: 'Student Management',
    path: '/students',
    screenPrefix: 102
  },
  {
    id: '103:0',
    name: 'Student Details',
    path: '/students/STU-001',
    screenPrefix: 103
  }
];

async function isPortOpen(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    import('http').then(http => {
      const req = http.get(`http://localhost:${port}/`, () => {
        resolve(true);
      });
      req.on('error', () => {
        resolve(false);
      });
      req.setTimeout(1000, () => {
        req.destroy();
        resolve(false);
      });
    });
  });
}

async function startViteServer(): Promise<ChildProcess | null> {
  const alreadyRunning = await isPortOpen(PORT);
  if (alreadyRunning) {
    console.log(`[Main] Application is already running at ${BASE_URL}`);
    return null;
  }

  const testAppDir = path.resolve(__dirname, '../test-app');
  console.log(`[Main] Starting preview server in ${testAppDir}...`);

  const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: testAppDir,
    stdio: 'pipe'
  });

  proc.stdout?.on('data', d => console.log(`[Vite stdout] ${d.toString().trim()}`));
  proc.stderr?.on('data', d => console.error(`[Vite stderr] ${d.toString().trim()}`));

  // Wait for server to come online
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 250));
    if (await isPortOpen(PORT)) {
      console.log(`[Main] Server is online at ${BASE_URL}`);
      return proc;
    }
  }

  throw new Error(`Timeout waiting for Vite server to start on port ${PORT}`);
}

async function main() {
  console.log('====================================================');
  console.log('   B.2 Browser-Based Design IR Extractor (Playwright) ');
  console.log('====================================================\n');

  let serverProcess: ChildProcess | null = null;
  const extractor = new BrowserExtractor(BASE_URL);

  try {
    serverProcess = await startViteServer();

    console.log('[Main] Initializing Playwright browser...');
    await extractor.init();

    const screensData = [];
    for (const route of ROUTES) {
      console.log(`[Main] Extracting screen: ${route.name} (${route.path})...`);
      const screenResult = await extractor.extractScreen(route);
      screensData.push(screenResult);
      console.log(`[Main] Successfully captured ${route.name}`);
    }

    console.log('\n[Main] Assembling Design IR from browser-extracted DOM hierarchies...');
    const assembler = new DesignIrAssembler();
    const designIR = assembler.assemble(screensData);

    // Save to output
    const outputDir = path.resolve(__dirname, '../output');
    fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, 'design-ir.json');
    fs.writeFileSync(outputPath, JSON.stringify(designIR, null, 2), 'utf-8');
    console.log(`[Main] Successfully generated Design IR at: ${outputPath}`);

    // Validate
    console.log('\n[Main] Running schema validation...');
    const validator = new DesignIrValidator();
    const report = validator.validate(designIR);

    const reportPath = path.join(outputDir, 'validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`[Main] Validation report saved to: ${reportPath}`);

    console.log('\n================ EXTRACTION SUMMARY ================');
    console.log(`Result:         ${report.valid ? 'SUCCESS (VALID DESIGN IR)' : 'COMPLETED WITH ISSUES'}`);
    console.log(`Screens:        ${report.summary.totalScreens}`);
    console.log(`Total Nodes:    ${report.summary.totalNodes}`);
    console.log(`Tokens:         ${report.summary.totalTokens}`);
    console.log(`Components:     ${report.summary.totalComponents}`);
    console.log(`Icons:          ${report.summary.totalIcons}`);
    console.log(`Validation:     ${report.summary.errorsCount} errors, ${report.summary.warningsCount} warnings`);
    console.log('====================================================\n');

  } catch (err) {
    console.error('[Main] Fatal error during extraction:', err);
    process.exit(1);
  } finally {
    console.log('[Main] Cleaning up browser...');
    await extractor.close();

    if (serverProcess) {
      console.log('[Main] Shutting down preview server...');
      serverProcess.kill('SIGTERM');
    }
  }
}

main();
