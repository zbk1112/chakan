import { initDatabase } from '../database/connection';

async function main() {
  await initDatabase();
  console.log('数据库初始化完成');
  process.exit(0);
}

main().catch(console.error);
