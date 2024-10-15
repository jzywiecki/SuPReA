import { isComponentIdCorrect } from "../src/model";
import { getComponentById } from "../src/model";
import { ComponentIsNotExist } from "../src/exceptions";


test('isComponentIdCorrect should return true for existing correct component id', () => {
    for (let i = 1; i <= 12; i++) {
        expect(isComponentIdCorrect(i)).toBe(true);
    }
});


test('isComponentIdCorrect should return false for non-existing component id', () => {
    expect(isComponentIdCorrect(-1)).toBe(false);
    expect(isComponentIdCorrect(13)).toBe(false);
    expect(isComponentIdCorrect(100)).toBe(false);
    expect(isComponentIdCorrect(0)).toBe(false);
});


test('getComponentById should return correct component for existing id', () => {
    expect(getComponentById(1)).toEqual({id: 1, name: "actors"});
    expect(getComponentById(2)).toEqual({id: 2, name: "business_scenarios"});
    expect(getComponentById(3)).toEqual({id: 3, name: "elevator_speech"});
    expect(getComponentById(4)).toEqual({id: 4, name: "motto"});
    expect(getComponentById(5)).toEqual({id: 5, name: "project_schedule"});
    expect(getComponentById(6)).toEqual({id: 6, name: "requirements"});
    expect(getComponentById(7)).toEqual({id: 7, name: "risks"});
    expect(getComponentById(8)).toEqual({id: 8, name: "specifications"});
    expect(getComponentById(9)).toEqual({id: 9, name: "strategy"});
    expect(getComponentById(10)).toEqual({id: 10, name: "title"});
    expect(getComponentById(11)).toEqual({id: 11, name: "database_schema"});
    expect(getComponentById(12)).toEqual({id: 12, name: "logo"});
});


test('getComponentById should throw error for non-existing id', () => {
    expect(() => getComponentById(-1)).toThrow(ComponentIsNotExist);
    expect(() => getComponentById(0)).toThrow(ComponentIsNotExist);
    expect(() => getComponentById(100)).toThrow(ComponentIsNotExist);
    expect(() => getComponentById(1000)).toThrow(ComponentIsNotExist);
});
