import { MigrationInterface, QueryRunner } from "typeorm";

export class initalSchema1657882041511 implements MigrationInterface {
    name = 'initalSchema1657882041511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friendship" ("id" SERIAL NOT NULL, "sender_id" integer NOT NULL, "receiver_id" integer NOT NULL, CONSTRAINT "PK_dbd6fb568cd912c5140307075cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "like" ("id" SERIAL NOT NULL, "post_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "post_id" integer NOT NULL, "user_id" integer NOT NULL, "text" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "image" text, "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."profile_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" SERIAL NOT NULL, "dob" date NOT NULL, "height_feet" integer NOT NULL, "height_inches" integer NOT NULL, "weight" double precision NOT NULL, "weight_unit" character varying NOT NULL, "gender" "public"."profile_gender_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "REL_d752442f45f258a8bdefeebb2f" UNIQUE ("user_id"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "topic" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "queries" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "user_id" integer NOT NULL, "topic_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e212c03c614452a1d1f8699d2ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "feature_image" text, "text" character varying NOT NULL, "is_featured" boolean NOT NULL, "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "calorie" ("id" SERIAL NOT NULL, "mealType" character varying NOT NULL, "calorie" double precision NOT NULL, "carb" double precision NOT NULL, "protein" double precision NOT NULL, "fat" double precision NOT NULL, "sugar" double precision NOT NULL, "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f14f04d86252db9cfca7d0d1f30" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "user_name" character varying(25) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL, "profile_setup" boolean NOT NULL DEFAULT false, "is_verified" boolean NOT NULL DEFAULT false, "image" text, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d34106f8ec1ebaf66f4f8609dd" ON "user" ("user_name") `);
        await queryRunner.query(`CREATE TABLE "answer" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "user_id" integer NOT NULL, "queries_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "seen" boolean NOT NULL DEFAULT false, "sender_id" integer NOT NULL, "conversation_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conversation" ("id" SERIAL NOT NULL, "sender_id" integer NOT NULL, "receiver_id" integer NOT NULL, "latest_message" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notification_status_enum" AS ENUM('like', 'comment', 'follow')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "sender_id" integer NOT NULL, "receiver_id" integer NOT NULL, "status" "public"."notification_status_enum" NOT NULL, "seen" boolean NOT NULL DEFAULT false, "post_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_86463167c10dc37dbf9d39728bd" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_8cced01afb7c006b9643aed97bf" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_d41caa70371e578e2a4791a88ae" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_4356ac2f9519c7404a2869f1691" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_52378a74ae3724bcab44036645b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_d752442f45f258a8bdefeebb2f2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queries" ADD CONSTRAINT "FK_e07347afec83f3bdfdc406f2a59" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queries" ADD CONSTRAINT "FK_4c0b1ac57aac29fb601683132c8" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog" ADD CONSTRAINT "FK_08dfe0c802192ba0c499d4cdb9c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calorie" ADD CONSTRAINT "FK_842f2b31ce92d176de532ff1268" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_add8ab72aec4ce5eb87fdc2740d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_c3ebb08f68fdace3de1f5d51d2a" FOREIGN KEY ("queries_id") REFERENCES "queries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7fe3e887d78498d9c9813375ce2" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_ea74d4cc98918a8d8fa20fc2fae" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_fd317a9ea4334687bd85af18636" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_56023c91b76b36125acd4dcd9c5" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_90543bacf107cdd564e9b62cd20" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_90543bacf107cdd564e9b62cd20"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_56023c91b76b36125acd4dcd9c5"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_fd317a9ea4334687bd85af18636"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_ea74d4cc98918a8d8fa20fc2fae"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7fe3e887d78498d9c9813375ce2"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_c3ebb08f68fdace3de1f5d51d2a"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_add8ab72aec4ce5eb87fdc2740d"`);
        await queryRunner.query(`ALTER TABLE "calorie" DROP CONSTRAINT "FK_842f2b31ce92d176de532ff1268"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_08dfe0c802192ba0c499d4cdb9c"`);
        await queryRunner.query(`ALTER TABLE "queries" DROP CONSTRAINT "FK_4c0b1ac57aac29fb601683132c8"`);
        await queryRunner.query(`ALTER TABLE "queries" DROP CONSTRAINT "FK_e07347afec83f3bdfdc406f2a59"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_d752442f45f258a8bdefeebb2f2"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_52378a74ae3724bcab44036645b"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_4356ac2f9519c7404a2869f1691"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_d41caa70371e578e2a4791a88ae"`);
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_8cced01afb7c006b9643aed97bf"`);
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_86463167c10dc37dbf9d39728bd"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_status_enum"`);
        await queryRunner.query(`DROP TABLE "conversation"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d34106f8ec1ebaf66f4f8609dd"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "calorie"`);
        await queryRunner.query(`DROP TABLE "blog"`);
        await queryRunner.query(`DROP TABLE "queries"`);
        await queryRunner.query(`DROP TABLE "topic"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TYPE "public"."profile_gender_enum"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "like"`);
        await queryRunner.query(`DROP TABLE "friendship"`);
    }

}
