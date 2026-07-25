import express from 'express';
import db, { getNextId } from '../database/connection';

const router = express.Router();

router.get('/', async (req, res) => {
  await db.read();
  const suppliers = db.data?.suppliers || [];
  res.json(suppliers);
});

router.get('/:id', async (req, res) => {
  await db.read();
  const supplier = db.data?.suppliers.find(s => s.id === parseInt(req.params.id));
  if (!supplier) {
    res.status(404).json({ error: '供应商不存在' });
    return;
  }
  res.json(supplier);
});

router.post('/', async (req, res) => {
  await db.read();
  const newSupplier = {
    id: getNextId('suppliers'),
    name: req.body.name,
    contact_person: req.body.contact_person,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    status: req.body.status || 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.data?.suppliers.push(newSupplier);
  await db.write();
  res.status(201).json(newSupplier);
});

router.put('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.suppliers.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '供应商不存在' });
    return;
  }
  db.data!.suppliers[index] = {
    ...db.data!.suppliers[index],
    ...req.body,
    updated_at: new Date().toISOString()
  };
  await db.write();
  res.json(db.data!.suppliers[index]);
});

router.delete('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.suppliers.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '供应商不存在' });
    return;
  }
  db.data?.suppliers.splice(index, 1);
  await db.write();
  res.json({ message: '供应商删除成功' });
});

export default router;
