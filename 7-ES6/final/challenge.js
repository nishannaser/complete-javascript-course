// Class definitions
class Parent {
    constructor(name, buildYear, length) {
        this.name = name;
        this.buildYear = buildYear;
        this.length = length;
    }

    getAge() {
        return new Date().getFullYear() - this.buildYear;
    }

    static printLine() {
        console.log('-----------------------------');
    }
}

class Park extends Parent {
    constructor(name, buildYear, length, breadth, numberOfTrees) {
        super(name, buildYear, length);
        this.breadth = breadth;
        this.numberOfTrees = numberOfTrees;
    }

    getTreeDensity() {
        return this.numberOfTrees / (this.length * this.breadth);
    }
}

class Street extends Parent {
    constructor(name, buildYear, length, size = 'normal') {
        super(name, buildYear, length);
        this.size = size;
    }
}

// Objects
const park1 = new Park('Green Park', 1990, 3.5, 2, 1800);
const park2 = new Park('National Park', 1984, 6.2, 4.3, 1350);
const park3 = new Park('Oak Park', 2002, 2, 0.8, 640);
const allParks = [park1, park2, park3];

const street1 = new Street('Salam Street', 1991, 46, 'huge');
const street2 = new Street('Najda Street', 1995, 8, 'small');
const street3 = new Street('Electra Street', 1985, 15);
const street4 = new Street('Airport Road', 1993, 28, 'big');
const allStreets = [street1, street2, street3, street4];

// Other functions
function computeArray(arr) {
    const sum = arr.reduce((prev, cur, index) => prev + cur, 0);
    return [sum, sum / arr.length];
}

// Reports
function reportParks() {
    console.log('--------------- PARKS REPORT ---------------');

    for (const park of allParks) {
        console.log(`${park.name} has a tree density of ${park.getTreeDensity()} per square km`);
    }
    Parent.printLine();

    const ages = allParks.map(el => el.getAge());
    const [totalAge, avgAge] = computeArray(ages);
    console.log(`Our ${allParks.length} parks have an average age of ${avgAge}`);
    Parent.printLine();

    allParks.forEach(park => {
        if (park.numberOfTrees > 1000) {
            console.log(`${park.name} has more than 1000 trees`);
        }
    });

}

function reportStreets() {
    console.log('\n--------------- STREETS REPORT ---------------');

    const lengthArr = allStreets.map(str => str.length);
    const [totalLength, avgLength] = computeArray(lengthArr);
    console.log(`Our streets have a total length of ${totalLength} kms and an average length of ${avgLength} kms`);
    Parent.printLine();

    allStreets.forEach(street =>
        console.log(`${street.name}, built in ${street.buildYear}, is a ${street.size} street`)
    );
}

reportParks();
reportStreets();