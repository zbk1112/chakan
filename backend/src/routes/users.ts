import express from 'express';
import db, { getNextId } from '../database/connection';

const router = express.Router();

router.get('/', async (req, res) => {
  await db.read();
  const users = (db.data?.users || []).map(u => ({
    id: u.id,
    username: u.username,
    role: u.role,
    supplier_id: u.supplier_id,
    created_at: u.created_at
  }));
  res.json(users);
});

router.get('/:id', async (req, res) => {
  await db.read();
  const user = db.data?.users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    res.status(404).json({ error: '用户不存在' });
    return;
  }
  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    supplier_id: user.supplier_id,
    created_at: user.created_at
  });
});

router.post('/register', async (req, res) => {
  await db.read();
  const { username, password, role, supplier_id } = req.body;
  
  if (!username || !password) {
    res.status(400).json({ error: '用户名和密码不能为空' });
    return;
  }
  
  const existing = db.data?.users.find(u => u.username === username);
  if (existing) {
    res.status(400).json({ error: '用户名已存在' });
    return;
  }
  
  const newUser = {
    id: getNextId('users'),
    username,
    password,
    role: role || 'user',
    supplier_id,
    created_at: new Date().toISOString()
  };
  
  db.data?.users.push(newUser);
  await db.write();
  
  res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    role: newUser.role,
    supplier_id: newUser.supplier_id,
    created_at: newUser.created_at
  });
});

router.post('/login', async (req, res) => {
  await db.read();
  const { username, password } = req.body;
  
  const user = db.data?.users.find(u => u.username === username);
  if (!user) {
    res.status(401).json({ error: '用户名或密码错误' });
    return;
  }
  
  if (user.password !== password) {
    res.status(401).json({ error: '用户名或密码错误' });
    return;
  }
  
  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    supplier_id: user.supplier_id
  });
});

router.put('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '用户不存在' });
    return;
  }
  
  const { username, role, supplier_id } = req.body;
  db.data!.users[index] = {
    ...db.data!.users[index],
    username,
    role,
    supplier_id
  };
  
  await db.write();
  
  res.json({
    id: db.data!.users[index].id,
    username: db.data!.users[index].username,
    role: db.data!.users[index].role,
    supplier_id: db.data!.users[index].supplier_id,
    created_at: db.data!.users[index].created_at
  });
});

router.delete('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '用户不存在' });
    return;
  }
  
  db.data?.users.splice(index, 1);
  await db.write();
  
  res.json({ message: '用户删除成功' });
});

export default router;
