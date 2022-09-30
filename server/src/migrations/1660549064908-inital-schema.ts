import { MigrationInterface, QueryRunner } from "typeorm";

export class initalSchema1660549064908 implements MigrationInterface {
    name = 'initalSchema1660549064908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" ADD "slug" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "slug"`);
    }

}
