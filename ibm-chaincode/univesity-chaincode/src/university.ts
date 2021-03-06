/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from "fabric-contract-api";

@Object()
export class University {
    @Property()
    public cnpj: string;

    @Property()
    public universityName: string;
}
