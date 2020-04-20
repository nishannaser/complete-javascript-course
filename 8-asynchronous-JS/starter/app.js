const first = () => {
    console.log('First begin....');
    second();
    console.log('First end....');
}

const second = () => {
    setTimeout(() => {
        console.log('Second..');
    }, 2000);
}

// first();

/////////////////////////////////////////////////////////////

// function getRecipe() {
//     setTimeout(() => {
//         const recipeIds = [523, 883, 432, 974];
//         console.log(recipeIds);
//
//         setTimeout(id => {
//             const recipe = {title: 'Fresh tomato pasta', publisher: 'Jonas'};
//             console.log(`${id}: ${recipe.title}`);
//
//             setTimeout(publisher => {
//                 const recipe2 = {title: 'Italian Pizza', publisher: 'Jonas'};
//                 console.log(recipe);
//             }, 1500, recipe.publisher);
//
//         }, 1500, recipeIds[2]);
//
//     }, 1500);
// }

// getRecipe();

/* ~~~~~~~~~~~~~~~~~~~~
       PROMISES
~~~~~~~~~~~~~~~~~~~~ */

const idsPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve([523, 883, 432, 974]);
    }, 2000);
});

const getRecipe = recipeId => {
    return new Promise((resolve, reject) => {
        setTimeout(ID => {
            const recipe = {title: 'Fresh tomato pasta', publisher: 'Jonas'};
            resolve(`${ID}: ${recipe.title}`);
        }, 1500, recipeId);
    });
};

const getRelated = publisher => {
    return new Promise((resolve, reject) => {
        setTimeout(pub => {
            const recipe = {title: 'Italian Pizza', publisher: 'Jonas'};
            resolve(`${pub}: ${recipe.title}`);
        }, 1500, publisher);
    });
};

// idsPromise
//     .then(recipeIds => {
//         console.log(recipeIds);
//         return getRecipe(recipeIds[2]);
//     })
//     .then(recipe => {
//         console.log(recipe);
//         return getRelated('Nishan Naser');
//     })
//     .then(recipe => {
//         console.log(recipe);
//     })
//     .catch(error => console.log(error));

/* ~~~~~~~~~~~~~~~~~~~~
      ASYNC WAITs
~~~~~~~~~~~~~~~~~~~~ */

async function getRecipeAW() {
    const recipeIds = await idsPromise;
    console.log(recipeIds);

    const recipe = await getRecipe(recipeIds[2]);
    console.log(recipe);

    const related = await getRelated('Nishan Naser');
    console.log(related);

    return recipe;
}

getRecipeAW()
    .then(result => console.log(`${result} is the best recipe!!`));