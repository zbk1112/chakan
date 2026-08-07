import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initDatabase } from './database/connection';
import suppliersRouter from './routes/suppliers';
import equipmentRouter from './routes/equipment';
import projectsRouter from './routes/projects';
import trainingRouter from './routes/training';
import formsRouter from './routes/forms';
import settlementsRouter from './routes/settlements';
import faultsRouter from './routes/faults';
import usersRouter from './routes/users';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/suppliers', suppliersRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/training', trainingRouter);
app.use('/api/forms', formsRouter);
app.use('/api/settlements', settlementsRouter);
app.use('/api/faults', faultsRouter);
app.use('/api/users', usersRouter);

app.use(express.static(path.join(__dirname, '../../dist')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
});

async function startServer() {
  await initDatabase();
  
  const os = require('os');
  const interfaces = os.networkInterfaces();
  const localIps = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIps.push(iface.address);
      }
    }
  }
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n========================================`);
    console.log(`供应商培训平台后端服务已启动`);
    console.log(`========================================`);
    console.log(`\n服务端口: ${PORT}`);
    console.log(`\n局域网访问地址:`);
    localIps.forEach(ip => {
      console.log(`  http://${ip}:${PORT}`);
    });
    console.log(`  http://localhost:${PORT} (本机访问)`);
    console.log(`\nAPI接口:`);
    console.log(`  GET   /api/suppliers      - 供应商列表`);
    console.log(`  GET   /api/equipment      - 设备列表`);
    console.log(`  GET   /api/projects       - 项目列表`);
    console.log(`  GET   /api/training       - 培训记录`);
    console.log(`  GET   /api/forms          - 表单列表`);
    console.log(`  GET   /api/settlements    - 结算记录`);
    console.log(`  GET   /api/faults         - 故障记录`);
    console.log(`  GET   /api/users          - 用户列表`);
    console.log(`  POST  /api/users/register - 用户注册`);
    console.log(`  POST  /api/users/login    - 用户登录`);
    console.log(`  GET   /api/health         - 健康检查`);
    console.log(`\n前端页面: http://localhost:${PORT}`);
    console.log(`========================================`);
  });
}

startServer().catch(console.error);
