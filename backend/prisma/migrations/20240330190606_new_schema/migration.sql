-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "countId" TEXT NOT NULL,
    "createtAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "ticketId" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageOption" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "MessageOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenanceServiceRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "maintenanceServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercialServiceRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "commercialServiceRequest_pkey" PRIMARY KEY ("id")
);
