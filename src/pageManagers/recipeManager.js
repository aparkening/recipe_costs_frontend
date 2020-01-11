class RecipePage extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = new RecipeAdapter(adapter)
    this.recipe = null
    this.currentObj = null
  }

/* ---- Bindings and Event Listeners ---- */  
  // Don't need initial bindings and listeners
  initBindingsAndEventListeners(){
    return null
  }

  // Bind and listen after single recipe load
  recipeBindingsAndEventListeners(){
    this.recipeEditLink = this.container.querySelector('a#edit')
    this.recipeDeleteLink = this.container.querySelector('a#delete')

    this.recipeEditLink.addEventListener('click', this.handleRecipeEditClick.bind(this))
    this.recipeDeleteLink.addEventListener('click', this.handleRecipeDeleteClick.bind(this))
  }


/* ---- Link/Click Handlers ---- */
  // Handle detail recipe edit
  handleRecipeEditClick(e){
    e.preventDefault()
    this.redirect('recipe-edit', this.recipe)
  }

  // Handle detail recipe delete
  handleRecipeDeleteClick(e){
    e.preventDefault()
    // this.deleteRecipe(recipeId)
    // this.redirect('recipe-edit', this.recipe)
  }


/* ---- Fetchers and Renderers ---- */  
  fetchAndRenderPageResources(){
    // Display if object exists
    if (this.currentObj){
      // Set recipe from redirect obj  
      this.recipe = this.currentObj

      this.container.innerHTML = this.recipe.showRecipe
      this.recipeBindingsAndEventListeners()
    }else{
      // else throw error
      this.handleError({
        type: "danger",
        msg: "Recipe was not found"
      })
    }
  }

  // Render initial html. Use "loader" to display loading spinner.
  get staticHTML(){
    return (`
      <div class="loader">
      </div>
    `)
  }

}