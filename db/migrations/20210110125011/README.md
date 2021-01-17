# Migration `20210110125011`

This migration has been generated by Andreas Asprou at 1/10/2021, 12:50:11 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE UNIQUE INDEX "GlucoseReading.timestamp_unique" ON "GlucoseReading"("timestamp")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210110122323..20210110125011
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource postgresql {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -35,7 +35,7 @@
 }
 model GlucoseReading {
   id                 Int       @default(autoincrement()) @id
-  timestamp          DateTime
+  timestamp          DateTime  @unique
   reading            Float
 }
```

