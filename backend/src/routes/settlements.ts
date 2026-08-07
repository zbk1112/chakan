import express from 'express';
import db, { getNextId } from '../database/connection';

const router = express.Router();

router.get('/', async (req, res) => {
  await db.read();
  let records = db.data?.settlement_records || [];
  
  if (req.query.supplier_id) {
    records = records.filter(r => r.supplier_id === parseInt(req.query.supplier_id as string));
  }
  if (req.query.project_id) {
    records = records.filter(r => r.project_id === parseInt(req.query.project_id as string));
  }
  if (req.query.status) {
    records = records.filter(r => r.status === req.query.status);
  }
  if (req.query.period) {
    records = records.filter(r => r.period === req.query.period);
  }
  
  res.json(records);
});

router.get('/:id', async (req, res) => {
  await db.read();
  const record = db.data?.settlement_records.find(r => r.id === parseInt(req.params.id));
  if (!record) {
    res.status(404).json({ error: '结算记录不存在' });
    return;
  }
  res.json(record);
});

router.post('/', async (req, res) => {
  await db.read();
  const newRecord = {
    id: getNextId('settlement_records'),
    supplier_id: req.body.supplier_id,
    project_id: req.body.project_id,
    amount: req.body.amount,
    status: req.body.status || 'pending',
    period: req.body.period,
    notes: req.body.notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.data?.settlement_records.push(newRecord);
  await db.write();
  res.status(201).json(newRecord);
});

router.put('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.settlement_records.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '结算记录不存在' });
    return;
  }
  db.data!.settlement_records[index] = {
    ...db.data!.settlement_records[index],
    ...req.body,
    updated_at: new Date().toISOString()
  };
  await db.write();
  res.json(db.data!.settlement_records[index]);
});

router.delete('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.settlement_records.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '结算记录不存在' });
    return;
  }
  db.data?.settlement_records.splice(index, 1);
  await db.write();
  res.json({ message: '结算记录删除成功' });
});

export default router;
