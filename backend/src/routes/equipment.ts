import express from 'express';
import db, { getNextId } from '../database/connection';

const router = express.Router();

router.get('/', async (req, res) => {
  await db.read();
  let equipment = db.data?.equipment || [];
  
  if (req.query.status) {
    equipment = equipment.filter(e => e.status === req.query.status);
  }
  if (req.query.type) {
    equipment = equipment.filter(e => e.type === req.query.type);
  }
  
  res.json(equipment);
});

router.get('/:id', async (req, res) => {
  await db.read();
  const equipment = db.data?.equipment.find(e => e.id === parseInt(req.params.id));
  if (!equipment) {
    res.status(404).json({ error: '设备不存在' });
    return;
  }
  res.json(equipment);
});

router.post('/', async (req, res) => {
  await db.read();
  const newEquipment = {
    id: getNextId('equipment'),
    type: req.body.type,
    model: req.body.model,
    serial_number: req.body.serial_number,
    status: req.body.status || 'available',
    supplier_id: req.body.supplier_id,
    assigned_at: req.body.assigned_at,
    returned_at: req.body.returned_at,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.data?.equipment.push(newEquipment);
  await db.write();
  res.status(201).json(newEquipment);
});

router.put('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.equipment.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '设备不存在' });
    return;
  }
  db.data!.equipment[index] = {
    ...db.data!.equipment[index],
    ...req.body,
    updated_at: new Date().toISOString()
  };
  await db.write();
  res.json(db.data!.equipment[index]);
});

router.delete('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.equipment.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '设备不存在' });
    return;
  }
  db.data?.equipment.splice(index, 1);
  await db.write();
  res.json({ message: '设备删除成功' });
});

router.post('/:id/assign', async (req, res) => {
  await db.read();
  const index = db.data?.equipment.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '设备不存在' });
    return;
  }
  db.data!.equipment[index] = {
    ...db.data!.equipment[index],
    status: 'assigned',
    supplier_id: req.body.supplier_id,
    assigned_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  await db.write();
  res.json(db.data!.equipment[index]);
});

router.post('/:id/return', async (req, res) => {
  await db.read();
  const index = db.data?.equipment.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '设备不存在' });
    return;
  }
  db.data!.equipment[index] = {
    ...db.data!.equipment[index],
    status: 'available',
    supplier_id: undefined,
    returned_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  await db.write();
  res.json(db.data!.equipment[index]);
});

export default router;
