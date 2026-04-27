import { pgTable, uuid, varchar, boolean, timestamp, customType } from 'drizzle-orm/pg-core'

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea'
  },
})

export const adminProfiles = pgTable('admin_profiles', {
  id: uuid('id').primaryKey(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('admin'),
  faceDescriptorEncrypted: bytea('face_descriptor_encrypted'),
  faceRegistered: boolean('face_registered').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
