import {MigrationInterface, QueryRunner} from "typeorm";

export class Database1565364645482 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "author" ("id" uuid NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "lastPinIssued" TIMESTAMP, "secret" character varying, "token" character varying, "school" character varying NOT NULL, "biography" character varying NOT NULL, "country" character varying NOT NULL, "teacher" character varying NOT NULL, "profile" character varying NOT NULL, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "editor_position_enum" AS ENUM('Editor', 'Production')`);
        await queryRunner.query(`CREATE TYPE "editor_level_enum" AS ENUM('Junior', 'Senior', 'Admin')`);
        await queryRunner.query(`CREATE TABLE "editor" ("id" uuid NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "lastPinIssued" TIMESTAMP, "secret" character varying, "token" character varying, "position" "editor_position_enum" NOT NULL DEFAULT 'Editor', "level" "editor_level_enum" NOT NULL DEFAULT 'Junior', "subjects" character varying array NOT NULL, CONSTRAINT "PK_354bcbcb0b7526a79230987d6e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "article_type_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "article_status_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9')`);
        await queryRunner.query(`CREATE TYPE "article_subject_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9')`);
        await queryRunner.query(`CREATE TABLE "article" ("id" uuid NOT NULL, "date" TIMESTAMP NOT NULL, "title" character varying NOT NULL, "type" "article_type_enum" NOT NULL DEFAULT '0', "status" "article_status_enum" NOT NULL DEFAULT '7', "subject" "article_subject_enum" NOT NULL, "docId" character varying NOT NULL, "deadline" TIMESTAMP NOT NULL, "notes" character varying NOT NULL, "folderId" character varying NOT NULL, "markingGridId" character varying NOT NULL, "copyright" character varying NOT NULL, "trashed" boolean NOT NULL DEFAULT false, "summary" character varying NOT NULL, "reason" character varying NOT NULL, "modified" TIMESTAMP NOT NULL, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article_editors_editor" ("articleId" uuid NOT NULL, "editorId" uuid NOT NULL, CONSTRAINT "PK_eae91e4b65ee823255b9921ade7" PRIMARY KEY ("articleId", "editorId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_54de9a5a39adcaea10985516d7" ON "article_editors_editor" ("articleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16c0441729ee4c78f994016237" ON "article_editors_editor" ("editorId") `);
        await queryRunner.query(`CREATE TABLE "article_authors_author" ("articleId" uuid NOT NULL, "authorId" uuid NOT NULL, CONSTRAINT "PK_2460e7757c57080e6de0bd128b5" PRIMARY KEY ("articleId", "authorId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d6fe54533ce83f5ca4e4c7be79" ON "article_authors_author" ("articleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_945f91d355b16e783417b6e1f0" ON "article_authors_author" ("authorId") `);
        await queryRunner.query(`ALTER TABLE "article_editors_editor" ADD CONSTRAINT "FK_54de9a5a39adcaea10985516d7a" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_editors_editor" ADD CONSTRAINT "FK_16c0441729ee4c78f994016237d" FOREIGN KEY ("editorId") REFERENCES "editor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_authors_author" ADD CONSTRAINT "FK_d6fe54533ce83f5ca4e4c7be797" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_authors_author" ADD CONSTRAINT "FK_945f91d355b16e783417b6e1f0b" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "article_authors_author" DROP CONSTRAINT "FK_945f91d355b16e783417b6e1f0b"`);
        await queryRunner.query(`ALTER TABLE "article_authors_author" DROP CONSTRAINT "FK_d6fe54533ce83f5ca4e4c7be797"`);
        await queryRunner.query(`ALTER TABLE "article_editors_editor" DROP CONSTRAINT "FK_16c0441729ee4c78f994016237d"`);
        await queryRunner.query(`ALTER TABLE "article_editors_editor" DROP CONSTRAINT "FK_54de9a5a39adcaea10985516d7a"`);
        await queryRunner.query(`DROP INDEX "IDX_945f91d355b16e783417b6e1f0"`);
        await queryRunner.query(`DROP INDEX "IDX_d6fe54533ce83f5ca4e4c7be79"`);
        await queryRunner.query(`DROP TABLE "article_authors_author"`);
        await queryRunner.query(`DROP INDEX "IDX_16c0441729ee4c78f994016237"`);
        await queryRunner.query(`DROP INDEX "IDX_54de9a5a39adcaea10985516d7"`);
        await queryRunner.query(`DROP TABLE "article_editors_editor"`);
        await queryRunner.query(`DROP TABLE "article"`);
        await queryRunner.query(`DROP TYPE "article_subject_enum"`);
        await queryRunner.query(`DROP TYPE "article_status_enum"`);
        await queryRunner.query(`DROP TYPE "article_type_enum"`);
        await queryRunner.query(`DROP TABLE "editor"`);
        await queryRunner.query(`DROP TYPE "editor_level_enum"`);
        await queryRunner.query(`DROP TYPE "editor_position_enum"`);
        await queryRunner.query(`DROP TABLE "author"`);
    }

}
