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
  indexBindingsAndEventListeners(){
    this.newContainer = document.querySelector('#new-resource')
    const newButton = this.container.querySelector('#new-button')
    const table = this.container.querySelector('table')

    newButton.addEventListener('click', this.handleNewClick.bind(this))
    table.addEventListener('click', this.handleTableClick.bind(this))
  }

  // Bind and listen after form load
  formBindingsAndEventListeners(){
    const cancelButton = this.container.querySelector('#cancel')
    const form = this.container.querySelector('form')

    cancelButton.addEventListener('click', this.handleCancelClick.bind(this))
    form.addEventListener('submit', this.handleSubmitClick.bind(this))
  }


/* ---- Link/Click Handlers ---- */

  // Handle new click
  handleNewClick(e){
    e.preventDefault()
    console.log('new clicked!');
    this.renderNewForm()
  }

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
        this.deleteIng(ingId)
        break;
      default:
        console.log('Invalid link');
        break;
    }
  }

  // Handel form cancel click
  handleCancelClick(e){
    e.preventDefault()
    this.newContainer.innerHTML = this.renderNewBtn()
    this.indexBindingsAndEventListeners()
  }

  // Handle form submit
  async handleSubmitClick(e){
    e.preventDefault()
    console.log("Submitting form")
    this.createIng(e)
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

    const addButton = `<div class="mt-3 mb-3" id="new-resource">${this.renderNewBtn()}</div>`

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
    this.indexBindingsAndEventListeners()
  }

  // Render new form
  renderNewForm(){
    this.newContainer.innerHTML = Ingredient.ingForm()
    this.formBindingsAndEventListeners()
  }

  // Render initial html
  get staticHTML(){
    return (`
      <div class="loader">
      </div>
    `)
  }

  // If ingredient found, delete it
  async deleteIng(id){      
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

  // Create new ingredient
  async createIng(e){      
    // Set params based on input
    const name = e.target.querySelector('input[name="name"]').value.toLowerCase()
    const cost = e.target.querySelector('input[name="cost"]').value
    const cost_size = e.target.querySelector('input[name="cost_size"]').value
    const cost_unit = e.target.querySelector('input[name="cost_unit"]').value
    const params = { name, cost, cost_size, cost_unit }
    console.log(params)

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

      // console.log("New Ingredients List")
      // console.log(this.ingredients)

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
  }



/* ---- Helpers ---- */
  // Grab recipe object from id
  getIngById(id){
    return this.ingredients.find(obj => obj.id == id)
  }

  // Button HTML
  renderNewBtn(){
    return (`
      <a class="btn btn-primary" href="#" role="button" id="new-button">Add new ingredient</a>
    `)
  }

}