import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DesignIrValidator } from './validate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runValidation() {
  const filePath = process.argv[2] || path.resolve(__dirname, '../../output/design-ir.json');
  console.log(`[Validator] Validating Design IR at ${filePath}...`);

  if (!fs.existsSync(filePath)) {
    console.error(`[Validator] File not found: ${filePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const ir = JSON.parse(raw);

  const validator = new DesignIrValidator();
  const report = validator.validate(ir);

  console.log('\n================ VALIDATION REPORT ================');
  console.log(`Status:         ${report.valid ? 'PASSED (VALID)' : 'FAILED (INVALID)'}`);
  console.log(`Schema:         ${report.schema}`);
  console.log(`Screens:        ${report.summary.totalScreens}`);
  console.log(`Total Nodes:    ${report.summary.totalNodes}`);
  console.log(`Design Tokens:  ${report.summary.totalTokens}`);
  console.log(`Components:     ${report.summary.totalComponents}`);
  console.log(`Extracted Icons:${report.summary.totalIcons}`);
  console.log(`Errors:         ${report.summary.errorsCount}`);
  console.log(`Warnings:       ${report.summary.warningsCount}`);
  console.log('===================================================\n');

  if (report.issues.length > 0) {
    console.log('Issues encountered:');
    report.issues.forEach(i => {
      console.log(` - [${i.severity.toUpperCase()}] ${i.path}: ${i.message}`);
    });
  }

  const reportPath = path.resolve(path.dirname(filePath), 'validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`[Validator] Detailed report written to ${reportPath}`);

  if (!report.valid) {
    process.exit(1);
  }
}

runValidation().catch(err => {
  console.error('[Validator] Fatal error during validation:', err);
  process.exit(1);
});
