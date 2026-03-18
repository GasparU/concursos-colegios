-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ExamType" ADD VALUE 'CLASE';
ALTER TYPE "ExamType" ADD VALUE 'TAREA';
ALTER TYPE "ExamType" ADD VALUE 'SIMULACRO';
ALTER TYPE "ExamType" ADD VALUE 'REFUERZO';

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "grade" TEXT,
ADD COLUMN     "questionsCount" INTEGER,
ADD COLUMN     "stage" TEXT;

-- AlterTable
ALTER TABLE "ExamResult" ADD COLUMN     "details" JSONB;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "hint" TEXT;
