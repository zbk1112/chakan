import express from 'express';
import db, { getNextId } from '../database/connection';

const router = express.Router();

router.get('/', async (req, res) => {
  await db.read();
  let records = db.data?.fault_records || [];
  
  if (req.query.equipment_id) {
    records = records.filter(r => r.equipment_id === parseInt(req.query.equipment_id as string));
  }
  if (req.query.supplier_id) {
    records = records.filter(r => r.supplier_id === parseInt(req.query.supplier_id as string));
  }
  if (req.query.status) {
    records = records.filter(r => r.status === req.query.status);
  }
  
  res.json(records);
});

router.get('/:id', async (req, res) => {
  await db.read();
  const record = db.data?.fault_records.find(r => r.id === parseInt(req.params.id));
  if (!record) {
    res.status(404).json({ error: '故障记录不存在' });
    return;
  }
  res.json(record);
});

router.post('/', async (req, res) => {
  await db.read();
  const newRecord = {
    id: getNextId('fault_records'),
    equipment_id: req.body.equipment_id,
    supplier_id: req.body.supplier_id,
    fault_type: req.body.fault_type,
    description: req.body.description,
    status: req.body.status || 'reported',
    resolved_at: req.body.resolved_at,
    resolution: req.body.resolution,
    created_at: new Date().toISOString()
  };
  db.data?.fault_records.push(newRecord);
  await db.write();
  res.status(201).json(newRecord);
});

router.put('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.fault_records.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '故障记录不存在' });
    return;
  }
  db.data!.fault_records[index] = {
    ...db.data!.fault_records[index],
    ...req.body
  };
  await db.write();
  res.json(db.data!.fault_records[index]);
});

router.delete('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.fault_records.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '故障记录不存在' });
    return;
  }
  db.data?.fault_records.splice(index, 1);
  await db.write();
  res.json({ message: '故障记录删除成功' });
});

router.post('/:id/resolve', async (req, res) => {
  await db.read();
  const index = db.data?.fault_records.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '故障记录不存在' });
    return;
  }
  db.data!.fault_records[index] = {
    ...db.data!.fault_records[index],
    status: 'resolved',
    resolved_at: new Date().toISOString(),
    resolution: req.body.resolution
  };
  await db.write();
  res.json(db.data!.fault_records[index]);
});

export default router;
