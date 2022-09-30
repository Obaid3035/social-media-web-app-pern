import { MigrationInterface, QueryRunner } from "typeorm";

export class initalSchema1658216195470 implements MigrationInterface {
    name = 'initalSchema1658216195470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "like_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "like_count"`);
    }

}
