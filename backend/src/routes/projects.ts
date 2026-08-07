import express from 'express';
import db, { getNextId } from '../database/connection';

const router = express.Router();

router.get('/', async (req, res) => {
  await db.read();
  const projects = db.data?.projects || [];
  res.json(projects);
});

router.get('/:id', async (req, res) => {
  await db.read();
  const project = db.data?.projects.find(p => p.id === parseInt(req.params.id));
  if (!project) {
    res.status(404).json({ error: '项目不存在' });
    return;
  }
  res.json(project);
});

router.post('/', async (req, res) => {
  await db.read();
  const newProject = {
    id: getNextId('projects'),
    name: req.body.name,
    code: req.body.code,
    description: req.body.description,
    type: req.body.type,
    equipment_required: req.body.equipment_required,
    status: req.body.status || 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.data?.projects.push(newProject);
  await db.write();
  res.status(201).json(newProject);
});

router.put('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.projects.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '项目不存在' });
    return;
  }
  db.data!.projects[index] = {
    ...db.data!.projects[index],
    ...req.body,
    updated_at: new Date().toISOString()
  };
  await db.write();
  res.json(db.data!.projects[index]);
});

router.delete('/:id', async (req, res) => {
  await db.read();
  const index = db.data?.projects.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: '项目不存在' });
    return;
  }
  db.data?.projects.splice(index, 1);
  await db.write();
  res.json({ message: '项目删除成功' });
});

export default router;
