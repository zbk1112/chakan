import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Equipment {
  id: number;
  type: string;
  model: string;
  serial_number: string;
  status: string;
  supplier_id?: number;
  assigned_at?: string;
  returned_at?: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: number;
  name: string;
  type: string;
  description: string;
  status: string;
  equipment_required: string[];
  created_at: string;
  updated_at: string;
}

interface TrainingRecord {
  id: number;
  supplier_id: number;
  project_id: number;
  training_date: string;
  trainer: string;
  completed: boolean;
  score: number;
  notes: string;
  created_at: string;
}

interface Form {
  id: number;
  type: string;
  supplier_id: number;
  data: object;
  submitted_at: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SettlementRecord {
  id: number;
  supplier_id: number;
  project_id: number;
  amount: number;
  status: string;
  period: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface FaultRecord {
  id: number;
  equipment_id: number;
  supplier_id: number;
  fault_type: string;
  description: string;
  status: string;
  resolved_at: string;
  resolution: string;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  supplier_id?: number;
  created_at: string;
}

interface Data {
  suppliers: Supplier[];
  equipment: Equipment[];
  projects: Project[];
  training_records: TrainingRecord[];
  forms: Form[];
  settlement_records: SettlementRecord[];
  fault_records: FaultRecord[];
  users: User[];
}

const dbPath = path.join(__dirname, '../data/db.json');
const adapter = new JSONFile<Data>(dbPath);
const db = new Low<Data>(adapter, {
  suppliers: [],
  equipment: [],
  projects: [],
  training_records: [],
  forms: [],
  settlement_records: [],
  fault_records: [],
  users: []
});

export async function initDatabase(): Promise<void> {
  await db.read();
  console.log('数据库初始化完成');
}

export function getNextId(collection: string): number {
  const items = db.data[collection as keyof Data] || [];
  if (items.length === 0) return 1;
  return Math.max(...(items as any[]).map((item: any) => item.id)) + 1;
}

export default db;
