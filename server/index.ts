import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import { db } from './database/connection.js';
import { saoGoncaloHealthUnits } from './data/seed-health-units.js';

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seed data endpoint
app.post('/api/seed-health-units', async (req, res) => {
  try {
    console.log('Seeding health units with São Gonçalo do Amarante data...');
    
    // Check if units already exist
    const existingUnits = await db.selectFrom('health_units').selectAll().execute();
    
    if (existingUnits.length > 0) {
      console.log('Health units already exist, skipping seed');
      res.json({ message: 'Health units already exist', count: existingUnits.length });
      return;
    }
    
    // Insert all health units
    const results = [];
    for (const unit of saoGoncaloHealthUnits) {
      const result = await db
        .insertInto('health_units')
        .values(unit)
        .returningAll()
        .executeTakeFirst();
      results.push(result);
    }
    
    console.log(`Successfully seeded ${results.length} health units`);
    res.json({ message: 'Health units seeded successfully', count: results.length, units: results });
  } catch (error) {
    console.error('Error seeding health units:', error);
    res.status(500).json({ error: 'Failed to seed health units' });
  }
});

// Health units endpoints
app.get('/api/health-units', async (req, res) => {
  try {
    console.log('Fetching health units...');
    const units = await db.selectFrom('health_units').selectAll().execute();
    console.log('Health units fetched:', units.length);
    res.json(units);
  } catch (error) {
    console.error('Error fetching health units:', error);
    res.status(500).json({ error: 'Failed to fetch health units' });
  }
});

app.post('/api/health-units', async (req, res) => {
  try {
    console.log('Creating health unit:', req.body);
    const result = await db
      .insertInto('health_units')
      .values({
        name: req.body.name,
        type: req.body.type,
        address: req.body.address,
        cnes_code: req.body.cnes_code,
        manager_name: req.body.manager_name,
        phone: req.body.phone,
        email: req.body.email,
      })
      .returningAll()
      .executeTakeFirst();
    
    console.log('Health unit created:', result);
    res.json(result);
  } catch (error) {
    console.error('Error creating health unit:', error);
    res.status(500).json({ error: 'Failed to create health unit' });
  }
});

// Audit categories endpoints
app.get('/api/audit-categories', async (req, res) => {
  try {
    console.log('Fetching audit categories...');
    const categories = await db.selectFrom('audit_categories').selectAll().execute();
    console.log('Audit categories fetched:', categories.length);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching audit categories:', error);
    res.status(500).json({ error: 'Failed to fetch audit categories' });
  }
});

// Audit items endpoints
app.get('/api/audit-items', async (req, res) => {
  try {
    console.log('Fetching audit items...');
    const items = await db
      .selectFrom('audit_items')
      .leftJoin('audit_categories', 'audit_items.category_id', 'audit_categories.id')
      .select([
        'audit_items.id',
        'audit_items.category_id',
        'audit_items.item_text',
        'audit_items.points',
        'audit_items.is_mandatory',
        'audit_categories.name as category_name',
      ])
      .execute();
    
    console.log('Audit items fetched:', items.length);
    res.json(items);
  } catch (error) {
    console.error('Error fetching audit items:', error);
    res.status(500).json({ error: 'Failed to fetch audit items' });
  }
});

// Audits endpoints
app.get('/api/audits', async (req, res) => {
  try {
    console.log('Fetching audits...');
    const audits = await db
      .selectFrom('audits')
      .leftJoin('health_units', 'audits.health_unit_id', 'health_units.id')
      .select([
        'audits.id',
        'audits.auditor_name',
        'audits.audit_date',
        'audits.status',
        'audits.total_score',
        'audits.max_score',
        'audits.percentage',
        'audits.observations',
        'audits.created_at',
        'health_units.name as health_unit_name',
      ])
      .orderBy('audits.created_at', 'desc')
      .execute();
    
    console.log('Audits fetched:', audits.length);
    res.json(audits);
  } catch (error) {
    console.error('Error fetching audits:', error);
    res.status(500).json({ error: 'Failed to fetch audits' });
  }
});

app.post('/api/audits', async (req, res) => {
  try {
    console.log('Creating audit:', req.body);
    const result = await db
      .insertInto('audits')
      .values({
        health_unit_id: req.body.health_unit_id,
        auditor_name: req.body.auditor_name,
        audit_date: req.body.audit_date,
        status: 'em_andamento',
      })
      .returningAll()
      .executeTakeFirst();
    
    console.log('Audit created:', result);
    res.json(result);
  } catch (error) {
    console.error('Error creating audit:', error);
    res.status(500).json({ error: 'Failed to create audit' });
  }
});

app.get('/api/audits/:id', async (req, res) => {
  try {
    const auditId = parseInt(req.params.id);
    console.log('Fetching audit details for ID:', auditId);
    
    const audit = await db
      .selectFrom('audits')
      .leftJoin('health_units', 'audits.health_unit_id', 'health_units.id')
      .select([
        'audits.id',
        'audits.health_unit_id',
        'audits.auditor_name',
        'audits.audit_date',
        'audits.status',
        'audits.total_score',
        'audits.max_score',
        'audits.percentage',
        'audits.observations',
        'health_units.name as health_unit_name',
      ])
      .where('audits.id', '=', auditId)
      .executeTakeFirst();
    
    if (!audit) {
      res.status(404).json({ error: 'Audit not found' });
      return;
    }
    
    const responses = await db
      .selectFrom('audit_responses')
      .leftJoin('audit_items', 'audit_responses.audit_item_id', 'audit_items.id')
      .leftJoin('audit_categories', 'audit_items.category_id', 'audit_categories.id')
      .select([
        'audit_responses.id',
        'audit_responses.audit_item_id',
        'audit_responses.status',
        'audit_responses.score',
        'audit_responses.observations',
        'audit_items.item_text',
        'audit_items.points',
        'audit_items.is_mandatory',
        'audit_categories.name as category_name',
      ])
      .where('audit_responses.audit_id', '=', auditId)
      .execute();
    
    console.log('Audit details fetched:', { audit, responses: responses.length });
    res.json({ audit, responses });
  } catch (error) {
    console.error('Error fetching audit details:', error);
    res.status(500).json({ error: 'Failed to fetch audit details' });
  }
});

app.delete('/api/audits/:id', async (req, res) => {
  try {
    const auditId = parseInt(req.params.id);
    console.log('Deleting audit ID:', auditId);
    
    // First, delete all responses for this audit
    await db
      .deleteFrom('audit_responses')
      .where('audit_id', '=', auditId)
      .execute();
    
    // Then delete the audit itself
    const result = await db
      .deleteFrom('audits')
      .where('id', '=', auditId)
      .execute();
    
    console.log('Audit deleted successfully:', result);
    res.json({ success: true, message: 'Audit deleted successfully' });
  } catch (error) {
    console.error('Error deleting audit:', error);
    res.status(500).json({ error: 'Failed to delete audit' });
  }
});

app.post('/api/audits/:id/responses', async (req, res) => {
  try {
    const auditId = parseInt(req.params.id);
    const { responses } = req.body;
    
    console.log('Saving audit responses for audit ID:', auditId, 'Responses count:', responses.length);
    
    // Clear existing responses for this audit
    await db
      .deleteFrom('audit_responses')
      .where('audit_id', '=', auditId)
      .execute();
    
    // Calculate total score
    let totalScore = 0;
    let maxScore = 0;
    
    // Insert all new responses
    for (const response of responses) {
      console.log('Inserting response:', {
        audit_id: auditId,
        audit_item_id: response.audit_item_id,
        status: response.status,
        score: response.score,
        observations: response.observations
      });
      
      await db
        .insertInto('audit_responses')
        .values({
          audit_id: auditId,
          audit_item_id: response.audit_item_id,
          status: response.status,
          score: response.score,
          observations: response.observations || null,
        })
        .execute();
      
      totalScore += response.score;
      maxScore += response.max_points;
    }
    
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    
    console.log('Calculated scores:', { totalScore, maxScore, percentage });
    
    // Update audit with final scores and completed status
    const updateResult = await db
      .updateTable('audits')
      .set({
        total_score: totalScore,
        max_score: maxScore,
        percentage: percentage,
        status: 'concluida',
        updated_at: new Date().toISOString(),
      })
      .where('id', '=', auditId)
      .execute();
    
    console.log('Audit update result:', updateResult);
    console.log('Audit responses saved successfully. Total score:', totalScore, 'Max score:', maxScore, 'Percentage:', percentage);
    
    res.json({ 
      success: true, 
      total_score: totalScore, 
      max_score: maxScore, 
      percentage: percentage,
      status: 'concluida'
    });
  } catch (error) {
    console.error('Error saving audit responses:', error);
    res.status(500).json({ error: 'Failed to save audit responses', details: error.message });
  }
});

// Export a function to start the server
export async function startServer(port) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`API Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting server...');
  startServer(process.env.PORT || 3001);
}
