-- CreateTable
CREATE TABLE "iso"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iso"."OrderService" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "OrderService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iso"."ChecklistItem" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iso"."Photo" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "iso"."User"("email");

-- AddForeignKey
ALTER TABLE "iso"."OrderService" ADD CONSTRAINT "OrderService_userId_fkey" FOREIGN KEY ("userId") REFERENCES "iso"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iso"."ChecklistItem" ADD CONSTRAINT "ChecklistItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "iso"."OrderService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iso"."Photo" ADD CONSTRAINT "Photo_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "iso"."OrderService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
