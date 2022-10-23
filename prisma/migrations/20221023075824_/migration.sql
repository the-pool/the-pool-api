-- CreateTable
CREATE TABLE "MainSkill" (
    "id" SERIAL NOT NULL,
    "majorId" INTEGER NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT '2022-10-23 16:54:47.041118'::timestamp without time zone,

    CONSTRAINT "MainSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Major" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT '2022-10-23 16:54:43.92909'::timestamp without time zone,

    CONSTRAINT "Major_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "majorId" INTEGER NOT NULL,
    "account" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR(30),
    "status" SMALLINT NOT NULL DEFAULT 0,
    "loginType" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT '2022-10-23 16:54:45.167588'::timestamp without time zone,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT '2022-10-23 16:54:45.167588'::timestamp without time zone,
    "deletedAt" TIMESTAMP(6),

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberSkill" (
    "id" SERIAL NOT NULL,
    "majorId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT '2022-10-23 16:54:48.817408'::timestamp without time zone,

    CONSTRAINT "MemberSkill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MainSkill_name_key" ON "MainSkill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Major_name_key" ON "Major"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Member_account_key" ON "Member"("account");

-- CreateIndex
CREATE UNIQUE INDEX "Member_nickname_key" ON "Member"("nickname");

-- AddForeignKey
ALTER TABLE "MainSkill" ADD CONSTRAINT "MainSkill_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MemberSkill" ADD CONSTRAINT "MemberSkill_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MemberSkill" ADD CONSTRAINT "MemberSkill_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
