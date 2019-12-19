class IngredientPage extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = new IngredientAdapter(adapter)
    // this.recipe = null
  }

/* ---- Bindings and Event Listeners ---- */
  // Don't need initial bindings and listeners
  initBindingsAndEventListeners(){
    return null
  }

  // Bind and listen after all resources load
  allIngBindingsAndEventListeners(){
    const table = this.container.querySelector('table')
    table.addEventListener('click', this.handleTableClick.bind(this))
  }


/* ---- Link/Click Handlers ---- */
  // Handle show, edit, and delete within recipe table
  handleTableClick(e){
    e.preventDefault()

    // Get ingredient id and object
    const ingId = e.target.dataset.id
    // this.recipe = this.recipes.find(r => r.id == recipeId)
    // const foundIng = this.getIngById(ingId)
    
    // Take action based on link id
    switch (e.target.id) {
      case 'edit':
        console.log('edit clicked!');
        this.handleUpdate(ingId)
        break;
      case 'delete':
        console.log('delete clicked!')
        // console.log(e.target.parentNode.parentNode.parentNode);
        // e.target.parentNode.parentNode.parentNode.remove();
        this.handleDelete(ingId)
        break;
      default:
        console.log('Invalid link');
        break;
    }
  }

  // If ingredient found, allow update
  async handleUpdate(id){      
    // Find existing recipe by id
    const foundIng = this.getIngById(id)

    if (foundIng) {
      console.log("Ingredient found. Rendering Update.")
    }else{
      this.handleError({
        type: "404 Not Found",
        msg: "Ingredient was not found"
      })
    }
  }

  // If ingredient found, delete it
  async handleDelete(id){      
    // Find existing recipe by id
    const foundObj = this.getIngById(id)

    if (foundObj) {
      console.log("Ingredient found. Rendering Delete.")

      // Find index of recipe to remove
      const index = this.ingredients.findIndex(obj => obj.id === foundObj.id)

      // Remove recipe and save it, in case error later
      const savedResource = this.ingredients.splice(index, 1)
      // console.log(savedRecipe)

      // Remove recipe from this.recipes
      // this.recipes = this.recipes.filter(r => r.id !== foundRecipe.id)
      console.log("New Ingredients")
      console.log(this.ingredients)
      // set this.recipes

      // console.log("Saved Recipe")
      // console.log(savedRecipe)
      
      // Optimistically render new list
      this.renderIngredients()
    
      // Try updating server recipe
      try{
        const resp = await this.adapter.deleteIngredient(id)

        // Alert user of success
        this.handleAlert({
          type: "success",
          msg: "Ingredient deleted"
        }) 
      }catch(err){
        // If failure, rerender list without db call, keeping resource in same array location
        this.ingredients[index] = savedResource
        this.ingredients = this.ingredients.flat()
        
        console.log("Old ingredient pushed back")
        console.log(this.ingredients)

        this.renderIngredients()
        this.handleError(err)
      }
    }else{
      this.handleError({
        type: "404 Not Found",
        msg: "Ingredient was not found"
      })
    }
  }


/* ---- Fetchers and Renderers ---- */
  async fetchAndRenderPageResources(){
    try{
      const ingObj = await this.adapter.getIngredients()

      // ingContainer contains ingredients and units
      const ingContainer = ingObj.ingredients

      // Map ingredients and units
      this.ingredients = ingContainer.map(ing => new Ingredient(ing))
      this.units = ingObj.units
      
      // Render table
      this.renderIngredients()
    }catch(err){
      this.handleError(err)
      // console.log(err)
    }
  }

  // Render all ingredients table
  renderIngredients(){
    const title = "<h1>Ingredients</h1>"

    const addButton = `<div class="mt-3 mb-3"><a class="btn btn-primary" href="#" role="button" id="new-resource">Add new ingredient</a></div>`

    const tableTop = `
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th>Links</th>
            <th>Name</th>
            <th>Cost</th>
            <th>Cost Size</th>
            <th>Cost Unit</th>
          </tr>
        </thead>
        <tbody>`

    const tableBottom = `
        </tbody>
      </table>
    `
    let ingRows = this.ingredients.map(ing => ing.showIngTr).join('')

    // Stitch together title, button, table, rows
    this.container.innerHTML = title + addButton + tableTop + ingRows + tableBottom

    // Bind and listen to new html
    this.allIngBindingsAndEventListeners()
  }

  // Render initial html
  get staticHTML(){
    return (`
      <div class="loader">
      </div>
    `)
  }


/* ---- Helpers ---- */
  // Grab recipe object from id
  getIngById(id){
    return this.ingredients.find(obj => obj.id == id)
  }

}