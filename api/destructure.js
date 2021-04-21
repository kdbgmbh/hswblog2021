const obj = { firstName: 'Hans', lastName: 'Paul', age: 12, child: { name: 'someChild' } };

// const firstName = obj["firstName"];
// const firstName = obj.firstName;
// const lastName = obj.lastName;

let { someNonExistingProp } = obj;
console.log('prop', someNonExistingProp);

// let firstName = obj.firstName;

// console.log('First name is', firstName, obj.firstName);

// // firstName = 'Karl';

// obj.firstName = 'Karl';

// console.log('First name is', firstName, obj.firstName);

const arr = [1, 2, 3, 4];

console.log('first entry', arr[0]);
console.log('second entry', arr[1]);

const [first, , third, fourth, fifth] = arr;

console.log('first', first);
// console.log('second', second);
console.log('third', third);
console.log('fourth', fourth);
console.log('fifth', fifth);
