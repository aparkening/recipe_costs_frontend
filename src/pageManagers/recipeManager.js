class RecipePage extends PageManager{

// This page handles individual recipe 
// - Reading
// - Creating
// - Updating

  constructor(container, adapter){
    super(container)
    this.adapter = new RecipeAdapter(adapter)
    this.recipe = null
  }


/* ---- Bindings and Event Listeners ---- */
  // Don't need initial bindings and listeners
  initBindingsAndEventListeners(){
    return null
  }

  // Bind and listen after single recipe load
  readBindingsAndEventListeners(){
    // this.recipeEditLink = this.container.querySelector('a#edit')
    // this.recipeDeleteLink = this.container.querySelector('a#delete')

    // this.recipeEditLink.addEventListener('click', this.handleRecipeEditClick.bind(this))
    // this.recipeDeleteLink.addEventListener('click', this.handleRecipeDeleteClick.bind(this))
  }

  // Bind and listen after form load
  formBindingsAndEventListeners(){
    this.form = this.container.querySelector('form')
    const cancelButton = this.container.querySelector('#cancel')

    // Set listener based on form id
    if (this.form.id === "new-recipe-form") {   
      this.form.addEventListener('submit', this.handleNewSubmitClick.bind(this))
    }else{ 
      this.form.addEventListener('submit', this.handleUpdateSubmitClick.bind(this))
    }

    // this.form.addEventListener('submit', this.handleNewSubmitClick.bind(this))
    cancelButton.addEventListener('click', this.handleCancelClick.bind(this))
  }


/* ---- Link/Click Handlers ---- */
  // Navigate back to recipes list on cancel
  handleCancelClick(e){
    e.preventDefault()
    // this.newContainer.innerHTML = this.renderNewBtn()
    this.redirect('recipes')
  }

  // Handle form submit
  handleNewSubmitClick(e){
    e.preventDefault()
    this.createRecipe(e)
  }

  // Handle form update submit
  handleUpdateSubmitClick(e){
    e.preventDefault()
    console.log("Submitting update.")
    // this.updateIng(e)
  }


/* ---- Fetchers and Renderers ---- */
  async fetchAndRenderPageResources(){
    try{

      console.log(this)

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

/* ---- Renderers ---- */
  // Render single recipe
  renderRecipe(recipe = this.recipe){
    if(recipe){
        // console.log(this.recipe)
        this.recipe = recipe
        this.container.innerHTML = this.recipe.showRecipe
        this.readBindingsAndEventListeners()
    }else{
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

/* ---- Helpers ---- */
  // Grab recipe object from id
  getRecipeById(id){
    return this.recipes.find(r => r.id == id)
  }

}