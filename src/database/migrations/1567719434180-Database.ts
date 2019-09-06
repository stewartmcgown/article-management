import {MigrationInterface, QueryRunner} from "typeorm";

export class Database1567719434180 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "author_level_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "lastPinIssued" TIMESTAMP, "secret" character varying, "level" "author_level_enum" NOT NULL DEFAULT '0', "school" character varying NOT NULL, "biography" character varying NOT NULL, "country" character varying NOT NULL, "teacher" character varying, "profile" character varying, CONSTRAINT "UQ_384deada87eb62ab31c5d5afae5" UNIQUE ("email"), CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "editor_level_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "editor_position_enum" AS ENUM('Editor', 'Production')`);
        await queryRunner.query(`CREATE TABLE "editor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "lastPinIssued" TIMESTAMP, "secret" character varying, "level" "editor_level_enum" NOT NULL DEFAULT '0', "position" "editor_position_enum" NOT NULL DEFAULT 'Editor', "subjects" character varying NOT NULL, CONSTRAINT "UQ_a2311562cf1ee2d7e5919170e2d" UNIQUE ("email"), CONSTRAINT "PK_354bcbcb0b7526a79230987d6e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subject" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_d011c391e37d9a5e63e8b04c977" UNIQUE ("name"), CONSTRAINT "PK_12eee115462e38d62e5455fc054" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "article_type_enum" AS ENUM('Review Article', 'Blog', 'Original Research', 'Magazine Article')`);
        await queryRunner.query(`CREATE TYPE "article_status_enum" AS ENUM('In Review', 'Failed Data Check', 'Passed Data Check', 'Technical Review', 'Revisions Requested', 'Ready to Publish', 'Published', 'Submitted', 'Rejected', 'Final Review', '2nd Editor Required', 'Ethical Question')`);
        await queryRunner.query(`CREATE TABLE "article" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "type" "article_type_enum" NOT NULL, "status" "article_status_enum" NOT NULL DEFAULT 'Submitted', "docId" character varying NOT NULL, "deadline" TIMESTAMP, "notes" character varying, "folderId" character varying NOT NULL, "markingGridId" character varying NOT NULL, "copyright" json, "trashed" boolean NOT NULL DEFAULT false, "summary" character varying, "reason" character varying, "modified" TIMESTAMP NOT NULL DEFAULT now(), "wordpress_id" integer, "hasPlagiarism" boolean NOT NULL DEFAULT false, "subjectId" uuid, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "message" character varying NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article_editors_editor" ("articleId" uuid NOT NULL, "editorId" uuid NOT NULL, CONSTRAINT "PK_eae91e4b65ee823255b9921ade7" PRIMARY KEY ("articleId", "editorId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_54de9a5a39adcaea10985516d7" ON "article_editors_editor" ("articleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16c0441729ee4c78f994016237" ON "article_editors_editor" ("editorId") `);
        await queryRunner.query(`CREATE TABLE "article_authors_author" ("articleId" uuid NOT NULL, "authorId" uuid NOT NULL, CONSTRAINT "PK_2460e7757c57080e6de0bd128b5" PRIMARY KEY ("articleId", "authorId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d6fe54533ce83f5ca4e4c7be79" ON "article_authors_author" ("articleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_945f91d355b16e783417b6e1f0" ON "article_authors_author" ("authorId") `);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_c702c45ea533a0b888cb230b9e6" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_editors_editor" ADD CONSTRAINT "FK_54de9a5a39adcaea10985516d7a" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_editors_editor" ADD CONSTRAINT "FK_16c0441729ee4c78f994016237d" FOREIGN KEY ("editorId") REFERENCES "editor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_authors_author" ADD CONSTRAINT "FK_d6fe54533ce83f5ca4e4c7be797" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_authors_author" ADD CONSTRAINT "FK_945f91d355b16e783417b6e1f0b" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`ALTER TABLE "article_authors_author" DROP CONSTRAINT "FK_945f91d355b16e783417b6e1f0b"`);
        await queryRunner.query(`ALTER TABLE "article_authors_author" DROP CONSTRAINT "FK_d6fe54533ce83f5ca4e4c7be797"`);
        await queryRunner.query(`ALTER TABLE "article_editors_editor" DROP CONSTRAINT "FK_16c0441729ee4c78f994016237d"`);
        await queryRunner.query(`ALTER TABLE "article_editors_editor" DROP CONSTRAINT "FK_54de9a5a39adcaea10985516d7a"`);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_c702c45ea533a0b888cb230b9e6"`);
        await queryRunner.query(`DROP INDEX "IDX_945f91d355b16e783417b6e1f0"`);
        await queryRunner.query(`DROP INDEX "IDX_d6fe54533ce83f5ca4e4c7be79"`);
        await queryRunner.query(`DROP TABLE "article_authors_author"`);
        await queryRunner.query(`DROP INDEX "IDX_16c0441729ee4c78f994016237"`);
        await queryRunner.query(`DROP INDEX "IDX_54de9a5a39adcaea10985516d7"`);
        await queryRunner.query(`DROP TABLE "article_editors_editor"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "article"`);
        await queryRunner.query(`DROP TYPE "article_status_enum"`);
        await queryRunner.query(`DROP TYPE "article_type_enum"`);
        await queryRunner.query(`DROP TABLE "subject"`);
        await queryRunner.query(`DROP TABLE "editor"`);
        await queryRunner.query(`DROP TYPE "editor_position_enum"`);
        await queryRunner.query(`DROP TYPE "editor_level_enum"`);
        await queryRunner.query(`DROP TABLE "author"`);
        await queryRunner.query(`DROP TYPE "author_level_enum"`);
    }

}
