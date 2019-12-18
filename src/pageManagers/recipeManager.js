class RecipePage extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = new RecipeAdapter(adapter)
    // this.recipe = null
  }

  // Set links and actions
  initBindingsAndEventListeners(){
    this.alertLink = this.container.querySelector('a#alert')

    this.alertLink.addEventListener('click', this.handleRecipesClick.bind(this))


    // this.recipesLink.addEventListener('click', this.handleRecipesClick.bind(this))
    // this.ingredientsLink.addEventListener('click', this.handleIngredientsClick.bind(this))
    // return null
  }

  // // Go to recipes screen
  handleRecipesClick(e){
    e.preventDefault()

    this.handleAlert({
      type: "danger",
      msg: "Recipe not found"
    }) 
    // this.handleAlert("404 Not Found", "Recipe not found") 
  }

  async fetchAndRenderPageResources(){
    try{


      // Single recipe
        // console.log("fetching recipe")
        const recipeObj = await this.adapter.getRecipe()
        // console.log(recipeObj)
        this.recipe = new Recipe(recipeObj)
        // console.log(this.recipe)
        this.renderRecipe()


    }catch(err){
        // this.handleError(err)
        console.log(err)
    }
  }

  // Render add recipe button
  renderAddRecipe(){
    return (`
      <div class="mt-3 mb-3"><a class="btn btn-primary" href="#" role="button" id="new-button">Add new recipe</a></div>
    `)
  }

  renderRecipe(){
    this.container.innerHTML = this.recipe.showRecipe
  }

  // // Go to ingredients screen
  // handleIngredientsClick(e){
  //     e.preventDefault()
  //     this.redirect('ingredients')
  // }

  // Render initial html
  get staticHTML(){
    return (`
      <div>
        this is the recipes page
        <p><a href="#" id="alert">alert</a></p>
      </div>
    `)
  }
}