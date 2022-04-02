/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { UniversityContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('UniversityContract', () => {

    let contract: UniversityContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new UniversityContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"university 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"university 1002 value"}'));
    });

    describe('#universityExists', () => {

        it('should return true for a university', async () => {
            await contract.universityExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a university that does not exist', async () => {
            await contract.universityExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createUniversity', () => {

        it('should create a university', async () => {
            await contract.createUniversity(ctx, '1003', 'university 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"university 1003 value"}'));
        });

        it('should throw an error for a university that already exists', async () => {
            await contract.createUniversity(ctx, '1001', 'myvalue').should.be.rejectedWith(/The university 1001 already exists/);
        });

    });

    describe('#readUniversity', () => {

        it('should return a university', async () => {
            await contract.readUniversity(ctx, '1001').should.eventually.deep.equal({ value: 'university 1001 value' });
        });

        it('should throw an error for a university that does not exist', async () => {
            await contract.readUniversity(ctx, '1003').should.be.rejectedWith(/The university 1003 does not exist/);
        });

    });

    describe('#updateUniversity', () => {

        it('should update a university', async () => {
            await contract.updateUniversity(ctx, '1001', 'university 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"university 1001 new value"}'));
        });

        it('should throw an error for a university that does not exist', async () => {
            await contract.updateUniversity(ctx, '1003', 'university 1003 new value').should.be.rejectedWith(/The university 1003 does not exist/);
        });

    });

    describe('#deleteUniversity', () => {

        it('should delete a university', async () => {
            await contract.deleteUniversity(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a university that does not exist', async () => {
            await contract.deleteUniversity(ctx, '1003').should.be.rejectedWith(/The university 1003 does not exist/);
        });

    });

});
