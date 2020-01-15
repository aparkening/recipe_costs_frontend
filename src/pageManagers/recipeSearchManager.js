class RecipeSearchPage extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = new RecipeAdapter(adapter)
    this.currentObj = null
  }

/* ---- Bindings and Event Listeners ---- */
  // Don't need initial bindings and listeners
  initBindingsAndEventListeners(){
    return null
  }

  // Bind and listen after all recipes load
  indexRecipesBindingsAndEventListeners(){
    const newButton = this.container.querySelector('#new-button')
    const table = this.container.querySelector('table')

    newButton.addEventListener('click', this.handleNewClick.bind(this))
    table.addEventListener('click', this.handleTableClick.bind(this))
  }


/* ---- Link/Click Handlers ---- */
  // Handle new click
  handleNewClick(e){
    e.preventDefault()
    this.redirect('recipe-new', this.recipe)
  }

  // Handle show, edit, and delete within recipe table
  handleTableClick(e){
    e.preventDefault()

    // If click is on href, take action
    if(e.target.tagName === "A"){
      // Get recipe id and recipe object
      const recipeId = e.target.dataset.id

      // If recipe, take action
      if (this.recipe = this.getRecipeById(recipeId)){
        switch (e.target.id) {
          case 'show':
            this.redirect('recipe', this.recipe)
            break;
          case 'edit':
            this.redirect('recipe-edit', this.recipe)
            break;
          case 'delete':
            this.deleteRecipe(recipeId)
            break;
          default:
            console.log('Invalid link');
            break;
        }
      }else{
        // else throw error
        this.handleError({
          type: "danger",
          msg: "Recipe was not found"
        })
      }
    }
  }


/* ---- Fetchers and Renderers ---- */
  // Fetch recipes and render main recipes page
  async fetchAndRenderPageResources(){

    if (this.currentObj){
      // Set recipe from redirect obj  
      this.query = this.currentObj
      try{
        const recipeObj = await this.adapter.searchRecipes(this.query)

        // If no results, send to recipes list
        if (recipeObj.recipes.length == 0){
          this.handleError({
            type: "danger",
            msg: `No recipes match '${this.query}'`
          })
          this.redirect('recipes')
        }else{
          // const recipeObj = await this.adapter.getRecipes()
          this.recipes = recipeObj.recipes.map(recipe => new Recipe(recipe))
          this.renderRecipes()
        }

      }catch(err){
        console.log(err)
        this.handleError(err)
      }
    }else{
      // else throw error
      this.handleError({
        type: "danger",
        msg: "No search query entered"
      })
    }


  }

  // Render multiple recipes
  renderRecipes(){
    const title = "<h1>Recipes</h1>"

    const addButton = `<div class="mt-3 mb-3" id="new-resource"><a class="btn btn-primary" href="#" role="button" id="new-button">Add new recipe</a></div>`

    const tableTop = `
    <table class="table table-striped">
    <thead class="thead-dark">
      <tr>
        <th>Name</th>
        <th>Cost</th>
        <th>Links</th>
      </tr>
    </thead>
    <tbody>`

    const tableBottom = `
      </tbody>
    </table>
    `
    let recipeRows = this.recipes.map(recipe => recipe.showRecipeTr).join('')

    // Stitch together title, button, table, rows
    // this.container.innerHTML = title + addButton + tableTop + recipeRows + tableBottom
    this.container.innerHTML = title + addButton + tableTop + recipeRows + tableBottom

    // Bind and listen to new html
    this.indexRecipesBindingsAndEventListeners()
  }

  // Render initial html. Use "loader" to display loading spinner.
  get staticHTML(){
    return (`
      <div class="loader">
      </div>
    `)
  }


/* ---- Update Database and Display ---- */
  // If real recipe, delete from this.recipes
  async deleteRecipe(id){
    // Find existing recipe by id
    const foundRecipe = this.getRecipeById(id)

    // If recipe from id exists, render form and call new bindings and event listeners
    if (foundRecipe) {
      // Find index of recipe to remove
      const recipeIndex = this.recipes.findIndex(recipe => recipe.id === foundRecipe.id)

      // Remove recipe and save it, in case error later
      const savedRecipe = this.recipes.splice(recipeIndex, 1)
      
      // Optimistically render new recipe list
      this.renderRecipes()
    
      try{
        const resp = await this.adapter.deleteRecipe(id)

        // Alert success message
        this.handleAlert({
          type: "success",
          msg: `${savedRecipe[0].name} deleted`
        }) 
      }catch(err){
        // If failure, rerender list without db call, keeping recipe in same array location
        this.recipes[recipeIndex] = savedRecipe
        this.recipes = this.recipes.flat()
        this.renderRecipes()
        this.handleError(err)
      }
    }else{
      // Else show recipt not found
      this.handleError({
        type: "danger",
        msg: "Recipe was not found"
      })
    }
  }


/* ---- Helpers ---- */
  // Grab recipe object from id
  getRecipeById(id){
    return this.recipes.find(r => r.id == id)
  }

}