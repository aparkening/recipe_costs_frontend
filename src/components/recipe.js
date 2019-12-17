class Recipe{
  constructor(recipeObj){
    const { recipe, recipeIngredients } = recipeObj

    this.id = recipe.id
    this.name = recipe.name
    this.servings = recipe.servings

    // this.ingredients = recipeIngredients.map(ingredient => new Ingredient(ingredient))

  }

  get showHTML(){
    return (`
      <h2>${this.name}</h2>
      <h4>${this.servings}</h4>

    `)
  }
}

{/* <p>Ingredients: \n${this.recipeIngredients ? this.recipeIngredients : "None"}</p> */}
{/* <button data-id=${this.id}  id="edit-recipe">Edit</button> */}