class IngredientPage extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = new IngredientAdapter(adapter)
    this.ingredient = null
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
    this.form = this.container.querySelector('form')
    const cancelButton = this.container.querySelector('#cancel')

    // Set listener based on form id
    if (this.form.id === "new-ingredient-form") {   
      this.form.addEventListener('submit', this.handleNewSubmitClick.bind(this))
    }else{ 
      this.form.addEventListener('submit', this.handleUpdateSubmitClick.bind(this))
    }

    // this.form.addEventListener('submit', this.handleNewSubmitClick.bind(this))
    cancelButton.addEventListener('click', this.handleCancelClick.bind(this))
  }


/* ---- Link/Click Handlers ---- */

  // Handle new click
  handleNewClick(e){
    e.preventDefault()
    // console.log('new clicked!');
    this.renderNewForm()
  }

  // Handle show, edit, and delete within recipe table
  handleTableClick(e){
    e.preventDefault()

    // If click is on href, take action
    if(e.target.tagName === "A"){

      // Get ingredient id and object
      // const ingId = e.target.dataset.id
      
      // Take action based on link id
      switch (e.target.id) {
        case 'edit':
          console.log('edit clicked!');
          // this.updateIng(e)
          this.renderEditForm(e)
          break;
        case 'delete':
          // console.log('delete clicked!')
          this.deleteIng(e)
          break;
        default:
          console.log('Invalid link');
          break;
      }
    }
  }

  // Clear ingredient form and load original bindings and event listeners
  handleCancelClick(e){
    e.preventDefault()
    this.newContainer.innerHTML = this.renderNewBtn()
    this.indexBindingsAndEventListeners()
  }

  // Handle form submit
  handleNewSubmitClick(e){
    e.preventDefault()
    this.createIng(e)
  }

  // Handle form update submit
  handleUpdateSubmitClick(e){
    e.preventDefault()
    console.log("Submitting update.")
    this.updateIng(e)
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
      // console.log(this.units)

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
    const ingredient = new Ingredient({id:'', name:'', cost:'', cost_size:'', cost_unit:''})
    this.newContainer.innerHTML = ingredient.ingForm(this.units)
    this.formBindingsAndEventListeners()
  }

  // Render edit form
  renderEditForm(e){
    // Find existing ingredient by id
    const foundObj = this.getIngById(e.target.dataset.id)

    // If found, take action
    if (foundObj) {
      // Set this.ingredient
      this.ingredient = foundObj
      this.newContainer.innerHTML = foundObj.ingForm(this.units)
      this.formBindingsAndEventListeners()
    }else{
      this.handleError({
        type: "danger",
        msg: "Ingredient was not found"
      })
    }  
  }


  // Render initial html
  get staticHTML(){
    return (`
      <div class="loader">
      </div>
    `)
  }

  // If ingredient found, delete it
  async deleteIng(e){      

    // Find existing recipe by id
    const foundObj = this.getIngById(e.target.dataset.id)

    if (foundObj) {
      // console.log("Ingredient found. Rendering Delete.")

      // Find index of recipe to remove
      const index = this.ingredients.findIndex(obj => obj.id === foundObj.id)

      // Remove recipe and save it, in case error later
      const savedResource = this.ingredients.splice(index, 1)
      // console.log("Saved Ingredient")
      // console.log(savedResource)

      // Remove recipe from this.recipes
      // this.recipes = this.recipes.filter(r => r.id !== foundRecipe.id)
      // console.log("New Ingredients")
      // console.log(this.ingredients)
      
      // Optimistically render new list
      this.renderIngredients()
    
      // Try updating server recipe
      try{
        const resp = await this.adapter.deleteIngredient(foundObj.id)

        // Alert user of success
        this.handleAlert({
          type: "success",
          msg: "Ingredient deleted"
        }) 
      }catch(err){
        // If failure, rerender list without db call, keeping resource in same array location
        this.ingredients[index] = savedResource
        this.ingredients = this.ingredients.flat()        
        // console.log("Old ingredient pushed back")
        // console.log(this.ingredients)

        this.renderIngredients()
        this.handleError(err)
      }
    }else{
      this.handleError({
        type: "danger",
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
    let selectUnit = e.target.querySelector('select')
    const cost_unit = selectUnit.options[selectUnit.selectedIndex].value

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
  }

  // Update ingredient
  async updateIng(e){      
    // console.log(this.ingredient)
    console.log(e.target)

    // If submitted ingredient id matches existing ingredient, take action
    if (this.ingredient.id == parseInt(e.target.querySelector('input[name="ingredient-id"]').value)){

      // Save existing ingredient, in case error later
      const savedResource = new Ingredient({id: this.ingredient.id, name: this.ingredient.name, cost: this.ingredient.cost, cost_size: this.ingredient.costSize, cost_unit: this.ingredient.costUnit})
      // console.log("Saved Ingredient")
      // console.log(savedResource)

      // Set params based on input
      const id = this.ingredient.id
      const name = e.target.querySelector('input[name="name"]').value.toLowerCase()
      const cost = Number(e.target.querySelector('input[name="cost"]').value)
      const cost_size = Number(e.target.querySelector('input[name="cost_size"]').value)
      let selectUnit = e.target.querySelector('select')
      const cost_unit = selectUnit.options[selectUnit.selectedIndex].value

      // Take action if cost and cost size are numbers
      if (!isNaN(cost) && !isNaN(cost_size)) { 
        const params = { name, cost, cost_size, cost_unit, id }
        this.ingredient.name = name
        this.ingredient.cost = cost
        this.ingredient.costSize = cost_size
        this.ingredient.costUnit = cost_unit
        // console.log("Updated Ingredient")
        // console.log(this.ingredient)

        // Optimistically render new list
        this.renderIngredients()

        // Try updating resource
        try{
          const resp = await this.adapter.updateIngredient(params)

          // Update JS ingredient and re-render if response JSON is different from this.ingredient
          if ((this.ingredient.name !== resp.ingredient.name) || (this.ingredient.cost !== resp.ingredient.cost) || (this.ingredient.costSize !== resp.ingredient.cost_size) || (this.ingredient.costUnit !== resp.ingredient.cost_unit)) {
            this.ingredient.name = resp.ingredient.name
            this.ingredient.cost = resp.ingredient.cost
            this.ingredient.costSize = resp.ingredient.cost_size
            this.ingredient.costUnit = resp.ingredient.cost_unit
            this.renderIngredients()
          }
          
          // Alert user of success
          this.handleAlert({
            type: "success",
            msg: `${this.ingredient.name} updated!`
          }) 

        }catch(err){
          // If failure, give error alert 
          this.handleError(err)

          // Reset this.ingredient to saved values
          this.ingredient.name = savedResource.name
          this.ingredient.cost = savedResource.cost
          this.ingredient.costSize = savedResource.costSize
          this.ingredient.costUnit = savedResource.costUnit

          // Re-render list with saved ingredient
          this.renderIngredients()
        }
      }else{
        // Display error and highlight field if cost and size aren't numbers
        this.handleError({
          type: "danger",
          msg: "Ensure Cost and Size are numbers"
        })      
        isNaN(cost) ? this.form.querySelector('input#cost').classList.add("is-invalid") :  this.form.querySelector('input#cost_unit').classList.add("is-invalid")
      }
    }else{
      this.handleError({
        type: "danger",
        msg: "Ingredient was not found"
      })
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