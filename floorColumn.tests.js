/* global _ Brackets TIU  */
/* eslint-env mocha */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { shallow, mount, simulate } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import BracketItem from 'meteor/tiu-components';
import TestData from './testData.js';

chai.use(chaiEnzyme());

if (Meteor.isClient) {

    describe('Floor Column Component', function () {

        let unassignedBracket1;
        let unassignedBracket2;
        let mockBrackets;
        let ring;
        let comps;
        let callback;
        let columnClickStub;
        let sandbox;
        let bracketClickStub;

        beforeEach(function (){

            sandbox = sinon.sandbox.create();

            unassignedBracket1 = TestData.mockBracket({
                gender: 'Male',
                ring: 0,
                bracketType: 'Sparring',
                rankFrom: 'Green',
                rankTo: 'Blue'
            });
            unassignedBracket2 = TestData.mockBracket({
                gender: 'Male',
                ring: 0,
                bracketType: 'Pattern',
                rankFrom: 'Green',
                rankTo: 'Blue'
            });

            mockBrackets = [];
            mockBrackets.push(unassignedBracket1);
            mockBrackets.push(unassignedBracket2);

            ring = 0;

            comps = TestData.mockCompetitorArray();

            callback = sandbox.stub();
            columnClickStub = sandbox.stub();
            bracketClickStub = sandbox.stub();

            callback.withArgs(unassignedBracket1._id).returns(comps);
            callback.withArgs(unassignedBracket2._id).returns(comps);

        });

        afterEach(function (){
            sandbox.restore();
        });

        it('renders unassigned column correctly', function () {

            const wrapper = mount(<TIU.Components.FloorColumn
                ringNum={ring}
                brackets={mockBrackets}
                bracketCompetitors={callback}
                columnClick={columnClickStub}
                bracketClick={bracketClickStub}
            />);

            expect(wrapper.find('div.lightGrayBackground')).to.be.present();
            expect(wrapper.find('div.floorColumnHeader')).to.be.present();
            expect(wrapper.find('div.bracketWrapper')).to.be.present();
            expect(wrapper.find('div.bracketWrapper')).to.have.exactly(2).descendants('div.bracketItem');

        });

        it('renders other ring column correctly', function () {

            const wrapper = mount(<TIU.Components.FloorColumn
                ringNum={1}
                brackets={mockBrackets}
                bracketCompetitors={callback}
                columnClick={columnClickStub}
                bracketClick={bracketClickStub}
            />);

            expect(wrapper.find('div.lightGrayBackground')).to.not.be.present();
            expect(wrapper.find('div.floorColumnHeader')).to.be.present();
            expect(wrapper.find('div.bracketWrapper')).to.be.present();
            expect(wrapper.find('div.bracketWrapper')).to.have.exactly(2).descendants('div.bracketItem');

        });

        it('Component should highlight/unhighlight based on selected prop value', function (){

            // const spy = sinon.spy(Component.prototype, "componentWillReceiveProps");
            const wrapper = shallow(<TIU.Components.FloorColumn
                ringNum={ring}
                brackets={mockBrackets}
                bracketCompetitors={callback}
                columnClick={columnClickStub}
                bracketClick={bracketClickStub}
                selected={false}
            />);

            expect(wrapper.find('div.floorColumnSelected')).to.have.length(0);
            wrapper.setProps({ selected: true });
            expect(wrapper.find('div.floorColumnSelected')).to.have.length(1);
            wrapper.setProps({ selected: false });
            expect(wrapper.find('div.floorColumnSelected')).to.have.length(0);

        });

    });
}
