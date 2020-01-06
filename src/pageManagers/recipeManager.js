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


/* ---- Update Database and Display ---- */

  // Create new recipe
  async createRecipe(e){    
    console.log("Creating new recipe...")
  
    /*
    // Set params based on input
    const name = e.target.querySelector('input[name="name"]').value.toLowerCase()
    const cost = Number(e.target.querySelector('input[name="cost"]').value)
    const cost_size = Number(e.target.querySelector('input[name="cost_size"]').value)
    let selectUnit = e.target.querySelector('select')
    const cost_unit = selectUnit.options[selectUnit.selectedIndex].value

    // Take action if cost and cost size are numbers
    if (!isNaN(cost) && !isNaN(cost_size)){ 
      // const cost_unit = e.target.querySelector('input[name="cost_unit"]').value
      const params = { name, cost, cost_size, cost_unit }

      // Alert user submitting
      this.handleAlert({
        type: "info",
        msg: "Submitting ingredient to server..."
      }) 

      // Try creating resource
      try{
        const resp = await this.adapter.createIngredient(params)

        // Make Ingredient from response JSON
        const newIng = new Ingredient(resp.ingredient)

        // Add Ingredient to this.ingredients and sort alphabetically
        this.ingredients.push(newIng)
        this.ingredients.sort((a, b) => {
          if (a.name < b.name) //sort string ascending
              return -1 
          if (b.name > a.name)
              return 1
          return 0 //default return value (no sorting)
        })

        // Render new list
        this.renderIngredients()
        
        // Alert user of success
        this.handleAlert({
          type: "success",
          msg: "Ingredient created!"
        }) 
      }catch(err){
        // If failure, leave form and give error alert
        this.handleError(err)
      }
    }else{
      // Display error and highlight field if cost and size aren't numbers
      this.handleError({
        type: "danger",
        msg: "Ensure Cost and Size are numbers"
      })      
      isNaN(cost) ? this.form.querySelector('input#cost').classList.add("is-invalid") :  this.form.querySelector('input#cost_unit').classList.add("is-invalid")
    }
    */
  }


/* ---- Helpers ---- */
  // Grab recipe object from id
  getRecipeById(id){
    return this.recipes.find(r => r.id == id)
  }

}