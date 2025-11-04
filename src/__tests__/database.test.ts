import { Database } from '@/lib/database';

describe('Database', () => {
  let db: Database<{ id: number; name: string; createdAt: string; updatedAt: string; version: number }>;

  beforeEach(() => {
    // Create a temporary database for testing
    db = new Database<{ id: number; name: string; createdAt: string; updatedAt: string; version: number }>('test');
  });

  afterEach(() => {
    // Clean up the temporary database file
    try {
      require('fs').unlinkSync(`./data/test.json`);
    } catch (e) {
      // File might not exist, that's okay
    }
  });

  test('should create a new item', () => {
    const item = { name: 'Test Item' };
    const created = db.create(item);
    
    expect(created.id).toBe(1);
    expect(created.name).toBe('Test Item');
    expect(created.createdAt).toBeDefined();
    expect(created.updatedAt).toBeDefined();
    expect(created.version).toBe(1);
  });

  test('should find an item by id', () => {
    const item = { name: 'Test Item' };
    const created = db.create(item);
    
    const found = db.findById(created.id);
    
    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe('Test Item');
  });

  test('should return all items', () => {
    const item1 = { name: 'Test Item 1' };
    const item2 = { name: 'Test Item 2' };
    db.create(item1);
    db.create(item2);
    
    const allItems = db.findAll();
    
    expect(allItems).toHaveLength(2);
    expect(allItems[0].name).toBe('Test Item 1');
    expect(allItems[1].name).toBe('Test Item 2');
  });

  test('should update an item', () => {
    const item = { name: 'Original Name' };
    const created = db.create(item);
    
    const updated = db.update(created.id, { name: 'Updated Name' });
    
    expect(updated).toBeDefined();
    expect(updated?.name).toBe('Updated Name');
    expect(updated?.version).toBe(2); // Version should increment
    
    // Verify the update is persisted
    const found = db.findById(created.id);
    expect(found?.name).toBe('Updated Name');
    expect(found?.version).toBe(2);
  });

  test('should delete an item', () => {
    const item = { name: 'Test Item' };
    const created = db.create(item);
    
    const deleted = db.delete(created.id);
    
    expect(deleted).toBe(true);
    expect(db.findById(created.id)).toBeUndefined();
  });

  test('should return false when trying to delete a non-existent item', () => {
    const deleted = db.delete(999);
    
    expect(deleted).toBe(false);
  });

  test('should return null when trying to update a non-existent item', () => {
    const updated = db.update(999, { name: 'New Name' });
    
    expect(updated).toBeNull();
  });
});