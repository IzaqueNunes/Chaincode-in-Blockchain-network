/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {
    Context,
    Contract,
    Info,
    Returns,
    Transaction,
} from "fabric-contract-api";
import { University } from "./university";

@Info({ title: "UniversityContract", description: "My Smart Contract" })
export class UniversityContract extends Contract {
    @Transaction(false)
    @Returns("boolean")
    public async universityExists(
        ctx: Context,
        cnpj: string
    ): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(cnpj);
        return !!data && data.length > 0;
    }

    @Transaction()
    public async createUniversity(
        ctx: Context,
        cnpj: string,
        universityName: string
    ): Promise<void> {
        const exists: boolean = await this.universityExists(ctx, cnpj);
        if (exists) {
            throw new Error(`The university ${cnpj} already exists`);
        }
        const university: University = new University();
        university.universityName = universityName;
        university.cnpj = cnpj;
        const buffer: Buffer = Buffer.from(JSON.stringify(university));
        await ctx.stub.putState(cnpj, buffer);
    }

    @Transaction(false)
    @Returns("University")
    public async readUniversity(
        ctx: Context,
        cnpj: string
    ): Promise<University> {
        const exists: boolean = await this.universityExists(ctx, cnpj);
        if (!exists) {
            throw new Error(`The university ${cnpj} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(cnpj);
        const university: University = JSON.parse(
            data.toString()
        ) as University;
        return university;
    }

    @Transaction()
    public async updateUniversity(
        ctx: Context,
        cnpj: string,
        universityName: string
    ): Promise<void> {
        const exists: boolean = await this.universityExists(ctx, cnpj);
        if (!exists) {
            throw new Error(`The university ${cnpj} does not exist`);
        }
        const university: University = new University();

        university.cnpj = cnpj;
        university.universityName = universityName;
        const buffer: Buffer = Buffer.from(JSON.stringify(university));
        await ctx.stub.putState(cnpj, buffer);
    }

    @Transaction()
    public async deleteUniversity(ctx: Context, cnpj: string): Promise<void> {
        const exists: boolean = await this.universityExists(ctx, cnpj);
        if (!exists) {
            throw new Error(`The university ${cnpj} does not exist`);
        }
        await ctx.stub.deleteState(cnpj);
    }
}
