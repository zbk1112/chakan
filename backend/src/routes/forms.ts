import express from 'express';
import db, { getNextId } from '../database/connection';

const router = express.Router();

router.get('/', async (req, res) => {
  await db.read();
  let forms = db.data?.forms || [];
  
  if (req.query.type) {
    forms = forms.filter(f => f.type === req.query.type);
  }
  if (req.query.supplier_id) {
    forms = forms.filter(f => f.supplier_id === parseInt(req.query.supplier_id as string));
  }
  if (req.query.status) {
    forms = forms.filter(f => f.status === req.query.status);
  }
  
  res.json(forms);
});

router.get('/:id', async (req, res) => {
  await db.read();
  const form = db.data?.forms.find(f => f.id === parseInt(req.params.id));
  if (!form) {
    res.status(404).json({ error: '表单不存在' });
    return;
  }
  res.json(form);
});

router.post('/', async (req, res) => {
  await db.read();
  const newForm = {
    id: getNextId('forms'),
    type: req.body.type,
    supplier_id: req.body.supplier_id,
    data: req.body.data,
    submitted_at: req.body.submitted_at,
    status: req.body.status || 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.data?.forms.push(newForm);
  await db.write();
  res.status(201).json(newForm);
});

router.put('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.forms.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '表单不存在' });
    return;
  }
  db.data!.forms[index] = {
    ...db.data!.forms[index],
    ...req.body,
    updated_at: new Date().toISOString()
  };
  await db.write();
  res.json(db.data!.forms[index]);
});

router.delete('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.forms.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '表单不存在' });
    return;
  }
  db.data?.forms.splice(index, 1);
  await db.write();
  res.json({ message: '表单删除成功' });
});

export default router;
