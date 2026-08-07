import express from 'express';
import db, { getNextId } from '../database/connection';

const router = express.Router();

router.get('/', async (req, res) => {
  await db.read();
  let records = db.data?.training_records || [];
  
  if (req.query.supplier_id) {
    records = records.filter(r => r.supplier_id === parseInt(req.query.supplier_id as string));
  }
  if (req.query.project_id) {
    records = records.filter(r => r.project_id === parseInt(req.query.project_id as string));
  }
  if (req.query.completed !== undefined) {
    records = records.filter(r => r.completed === (req.query.completed === 'true'));
  }
  
  res.json(records);
});

router.get('/:id', async (req, res) => {
  await db.read();
  const record = db.data?.training_records.find(r => r.id === parseInt(req.params.id));
  if (!record) {
    res.status(404).json({ error: '培训记录不存在' });
    return;
  }
  res.json(record);
});

router.post('/', async (req, res) => {
  await db.read();
  const newRecord = {
    id: getNextId('training_records'),
    supplier_id: req.body.supplier_id,
    project_id: req.body.project_id,
    training_date: req.body.training_date || new Date().toISOString(),
    trainer: req.body.trainer,
    completed: req.body.completed || false,
    score: req.body.score,
    notes: req.body.notes,
    created_at: new Date().toISOString()
  };
  db.data?.training_records.push(newRecord);
  await db.write();
  res.status(201).json(newRecord);
});

router.put('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.training_records.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '培训记录不存在' });
    return;
  }
  db.data!.training_records[index] = {
    ...db.data!.training_records[index],
    ...req.body
  };
  await db.write();
  res.json(db.data!.training_records[index]);
});

router.delete('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.training_records.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '培训记录不存在' });
    return;
  }
  db.data?.training_records.splice(index, 1);
  await db.write();
  res.json({ message: '培训记录删除成功' });
});

export default router;
