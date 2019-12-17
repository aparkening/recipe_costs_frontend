class IngredientPage extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = new IngredientAdapter(adapter)
    // this.recipe = null
  }

  // Set links and actions
  initBindingsAndEventListeners(){
    // this.recipesLink = this.container.querySelector('a#recipes')
    // this.ingredientsLink = this.container.querySelector('a#ingredients')

    // this.recipesLink.addEventListener('click', this.handleRecipesClick.bind(this))
    // this.ingredientsLink.addEventListener('click', this.handleIngredientsClick.bind(this))
    return null
  }

  // // Go to recipes screen
  // handleRecipesClick(e){
  //     e.preventDefault()
  //     this.redirect('recipes')
  // }

  // // Go to ingredients screen
  // handleIngredientsClick(e){
  //     e.preventDefault()
  //     this.redirect('ingredients')
  // }

  async fetchAndRenderPageResources(){
    try{
        // console.log("fetching recipe")
        const ingredientObj = await this.adapter.getIngredients()
        // console.log(ingredientObj)

        // this.ingredients = ingredientObj.map(ing => new Ingredient(ing))
        // console.log(this.recipe)
        console.log(ingredientObj.ingredients)
        
        // const newIngredients = ingredientObj.ingredients.forEach(ing => new Ingredient(ing))

        // console.log(ingredients)

        // this.renderIngredients()
    }catch(err){
        // this.handleError(err)
        console.log(err)
    }
  }

  renderIngredients(){
    this.container.innerHTML = this.ingredient.showIngredients
  }

  // Render initial html
  get staticHTML(){
    return (`
      <div>this is the ingredients page
      </div>
    `)
  }
}