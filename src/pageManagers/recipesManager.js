class RecipesPage extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = new RecipeAdapter(adapter)
    this.recipe = null
    this.ingredients = null
  }

/* ---- Bindings and Event Listeners ---- */
  // Don't need initial bindings and listeners
  initBindingsAndEventListeners(){
    return null
  }

  // Bind and listen after all recipes load
  allRecipesBindingsAndEventListeners(){
    const newButton = this.container.querySelector('#new-button')
    const table = this.container.querySelector('table')

    newButton.addEventListener('click', this.handleNewClick.bind(this))
    table.addEventListener('click', this.handleTableClick.bind(this))
  }

  // Bind and listen after single recipe load
  recipeBindingsAndEventListeners(){
    this.recipeEditLink = this.container.querySelector('a#edit')
    this.recipeDeleteLink = this.container.querySelector('a#delete')

    this.recipeEditLink.addEventListener('click', this.handleRecipeEditClick.bind(this))
    this.recipeDeleteLink.addEventListener('click', this.handleRecipeDeleteClick.bind(this))
  }

  // Bind and listen after new form load
  newFormBindingsAndEventListeners(){
    this.form = this.container.querySelector('form')
    this.ingFields = this.form.querySelector('#ingredients')
    const cancelButton = this.form.querySelector('#cancel')
    const addBadge = this.form.querySelector('#add-ingredient')

    // Delete and add new ingredients
    this.ingFields.addEventListener('click', this.handleDeleteIngFieldsClick.bind(this))    
    addBadge.addEventListener('click', this.handleAddIngFieldsClick.bind(this))
    
    // Cancel and submit clicks
    cancelButton.addEventListener('click', this.handleCancelClick.bind(this))
    this.form.addEventListener('submit', this.handleNewSubmitClick.bind(this))   
  }

  // Bind and listen after edit form load
  editFormBindingsAndEventListeners(){
    this.form = this.container.querySelector('form')
    this.ingFields = this.form.querySelector('#ingredients')
    const cancelButton = this.form.querySelector('#cancel')
    const addBadge = this.form.querySelector('#add-ingredient')

    // Delete and add new ingredients follow existing pattern
    this.ingFields.addEventListener('click', this.handleDeleteIngFieldsClick.bind(this))
    addBadge.addEventListener('click', this.handleAddIngFieldsClick.bind(this))

    // Cancel and submit clicks
    cancelButton.addEventListener('click', this.handleCancelClick.bind(this))
    this.form.addEventListener('submit', this.handleUpdateSubmitClick.bind(this))
  }


/* ---- Link/Click Handlers ---- */
  // Handle new click
  handleNewClick(e){
    e.preventDefault()
    // this.renderNewForm()

    this.redirect('recipe-new', this.recipe)
  }

  // Handle show, edit, and delete within recipe table
  handleTableClick(e){
    e.preventDefault()

    // Get recipe id and recipe object
    const recipeId = e.target.dataset.id

    // this.recipe = this.recipes.find(r => r.id == recipeId)
    this.recipe = this.getRecipeById(recipeId)
    
    // console.log(recipeId)
    // console.log(this.recipe)

    switch (e.target.id) {
      case 'show':
        // this.renderRecipe()
        this.redirect('recipe', this.recipe)
        break;
      case 'edit':
        console.log('edit clicked!');
        // recipeId default set by this.recipe
        // this.renderEditForm()
        this.redirect('recipe-edit', this.recipe)
        break;
      case 'delete':
        this.deleteRecipe(recipeId)
        break;
      default:
        console.log('Invalid selection');
        break;
    }

    // console.log(e.target.parentNode.parentNode.parentNode)
  }

  // Handle detail recipe edit
  handleRecipeEditClick(e){
    e.preventDefault()
    
    // debugger
    
    // Get recipe id and recipe object
    // const recipeId = e.target.parentNode.dataset.id
    // const foundRecipe = this.getRecipeById(recipeId)

    // recipeId default set by this.recipe
    // this.renderEditForm()

    this.redirect('recipe-edit', this.recipe)
  }

  // Handle detail recipe delete
  handleRecipeDeleteClick(e){
    e.preventDefault()
    // Get recipe id and recipe object
    const recipeId = e.target.parentNode.dataset.id
    this.deleteRecipe(recipeId)
  }

  // Handle form submit
  handleNewSubmitClick(e){
    e.preventDefault()
    console.log("Submitting new recipe.")
    this.createRecipe(e)
  }

  // Handle form update submit
  handleUpdateSubmitClick(e){
    e.preventDefault()
    console.log("Submitting update.")
    this.updateRecipe(e)
  }

  // Handle form cancel button
  handleCancelClick(e){
    e.preventDefault()
    // this.newContainer.innerHTML = this.renderNewBtn()
    // this.indexBindingsAndEventListeners()
    this.redirect('recipes')
  }

  // Handle delete ingredients within recipe form
  handleDeleteIngFieldsClick(e){
    e.preventDefault()

    // If no recipe_ingredient id, simply remove
    if(e.target.tagName === "A"){ 
      // If delete on new ingredient, remove node
      if (e.target.classList.contains('delete')) { e.target.parentNode.parentNode.remove() }

      // If delete on existing ingredient, hide node and set hidden input
      if (e.target.classList.contains('delete-existing')){
        let deleteIng = document.createElement('input')
        deleteIng.type = "hidden"
        deleteIng.value = 1
        deleteIng.name = "destroy"
        e.target.parentNode.parentNode.appendChild(deleteIng)

        //e.target.parentNode.parentNode.remove()
        e.target.parentNode.parentNode.classList.add("hidden")

        console.log("Destroying existing ingredient")
      }
    }
  }

  // Handle add ingredients within recipe form
  handleAddIngFieldsClick(e){
    e.preventDefault()
    if(e.target.tagName === "A"){

      // Build new div
      let newRow = document.createElement('div')
      newRow.innerHTML = this.recipe.renderIngRow(this.ingredients, this.units)

      // Append div to ingredient fields container
      this.ingFields.appendChild(newRow)
    }
  }

/* ---- Fetchers and Renderers ---- */

  // Fetch recipes and render main recipes page
  async fetchAndRenderPageResources(){
    try{
      // if (this.recipe){
      //   // const recipeObj = await this.adapter.getRecipe()
      //   // // console.log(recipeObj)
      //   // this.recipe = new Recipe(recipeObj)
      //   // // console.log(this.recipe)
      //   this.renderRecipe()
      // } else {
      const recipeObj = await this.adapter.getRecipes()
      // console.log(recipeObj.recipes)

      this.recipes = recipeObj.recipes.map(recipe => new Recipe(recipe))
      // console.log(this.recipes)

      // Render table
      this.renderRecipes()

    }catch(err){
      console.log(err)
      this.handleError(err)
      // console.log(err)
    }
  }


  // Render new form
  async renderNewForm(){
    this.recipe = new Recipe({'recipe': {id:'', name:'', servings:'', total_cost:'', cost_per_serving:''}, 'ingredients':[]})

    // Get all ingredients for select list
    // Send request for all ingredients
    const ingAdapter = new IngredientAdapter(new BaseAdapter())
    const ingObj = await ingAdapter.getIngredients()
    // Fill this.ingredients with ingredient objects
    this.ingredients = ingObj.ingredients.map(ing => new Ingredient(ing))
    this.units = ingObj.units

    // Render form with ingredients
    this.container.innerHTML = this.recipe.recipeForm(this.ingredients, this.units)
    this.newFormBindingsAndEventListeners()
  }

  // Render edit form
  async renderEditForm(recipeId = this.recipe.id){
    // Find existing recipe by id
    const foundRecipe = this.getRecipeById(recipeId)

    // If recipe from id exists, render form and call new bindings and event listeners
    if (foundRecipe) {
      // Send request for all ingredients
      const ingAdapter = new IngredientAdapter(new BaseAdapter())
      const ingObj = await ingAdapter.getIngredients()
      // Fill this.ingredients with ingredient objects
      this.ingredients = ingObj.ingredients.map(ing => new Ingredient(ing))
      this.units = ingObj.units

      // Render form with ingredients
      this.recipe = foundRecipe
      this.container.innerHTML = foundRecipe.editRecipeForm(this.ingredients, this.units)
      this.editFormBindingsAndEventListeners()
    }else{
      // else throw error
      this.handleError({
        type: "danger",
        msg: "Recipe was not found"
      })
    }
  }

    // // Go to edit recipe screen
    // handleEditClick(e){
    //   e.preventDefault()
    //   this.redirect('edit-recipe')
    // }

// Render single recipe
renderRecipe(recipe = this.recipe){
  if(recipe){
      // console.log(this.recipe)
      this.recipe = recipe
      this.container.innerHTML = this.recipe.showRecipe
      this.recipeBindingsAndEventListeners()
  }else{
      this.handleError({
        type: "danger",
        msg: "Recipe was not found"
      })
  } 
}

// Render multiple recipes
renderRecipes(){
  const title = "<h1>Recipes</h1>"

  const addButton = `<div class="mt-3 mb-3" id="new-resource">${this.renderNewBtn()}</div>`

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
  this.allRecipesBindingsAndEventListeners()
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

        // Alert user of success
        this.handleAlert({
          type: "success",
          msg: `${savedRecipe[0].name} deleted`
        }) 
      }catch(err){
        // If failure, rerender list without db call, keeping recipe in same array location
        this.recipes[recipeIndex] = savedRecipe
        this.recipes = this.recipes.flat()
        // console.log("Old recipe pushed back")
        // console.log(this.recipes)

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

  // Handle form submit
  async updateRecipe(e){
    // e.preventDefault()

    // Set recipe variables for inputs
    const id = e.target.querySelector('input[name="recipe-id"]').value
    const name = e.target.querySelector('input[name="name"]').value
    const servings = e.target.querySelector('input[name="servings"]').value
    // console.log(id)
    // console.log(name)
    // console.log(servings)

    // Set recipeIngredientsAttributes from each ingredient input
    let recipeIngredientsAttributes = Array.from(e.target.querySelectorAll('div.form-ingredient')).map(el => {
      let ingObj = {}
      let ingId = ''
      
      // If new ingredient, get id from select list. Else get hidden inputs and set extra object properties.
      if(el.classList.contains("new-ingredient")){
        // Get id from select list value
        let sId = el.querySelector('select[name="ingredient_id"]')
        ingId = sId.options[sId.selectedIndex].value
      }else{
        // Get hidden inputs
        ingId = Number(el.querySelector('input[name="ingredient_id"]').value)
        let id = Number(el.querySelector('input[name="recipe_ingredient_id"]').value)

        // Set destroy to hidden input value if it exists (if ingredient should be removed from database)
        let destroy = el.querySelector('input[name="destroy"]') ? Number(el.querySelector('input[name="destroy"]').value) : 0
      
        // Set id and destroy
        ingObj.id = id
        ingObj['_destroy'] = destroy
      }
      
      let ingAmount = el.querySelector('input.ingredient_amount').value
      // Get ingredient unit value from select list
      let sUnit = el.querySelector('select[name="ingredient_unit"]')

      // Set and return object properties
      ingObj.ingredient_id = ingId
      ingObj.ingredient_amount = ingAmount
      ingObj.ingredient_unit = sUnit.options[sUnit.selectedIndex].value
      return ingObj
    })
    console.log("Recipe Ingredients Attributes")
    console.log(recipeIngredientsAttributes)

    // Set params
    const params = { name, servings, recipeIngredientsAttributes, id }
    console.log("Params")
    console.log(params)

    // Send fetch. If error, reset this.recipe to old 
    try{
      const resp = await this.adapter.updateRecipe(params)
      // const {name, servings, recipeIngredientsAttributes, id} = await this.adapter.updateRecipe(params)
      // console.log("Successful patch request!")
      
      // Update this.recipe and this.recipes
      this.recipe = new Recipe(resp)
      console.log(this.recipe)

      const updatedRecipe = this.getRecipeById(this.recipe.id)
      // this.recipes.find(r => r.id == this.recipe.id)
      updatedRecipe.name = this.recipe.name
      updatedRecipe.servings = this.recipe.servings
      updatedRecipe.totalCost = this.recipe.totalCost
      updatedRecipe.costPerServing = this.recipe.costPerServing
      updatedRecipe.recipeIngredients = this.recipe.recipeIngredients

      // const newRecipe = () => Object.assign({}, this.recipe, { [key]: value })
  
      // Display recipe
      this.renderRecipe()

    }catch(err){
      this.renderRecipe()
      this.handleError(err)
    }  
  }

  // Create new recipe
  async createRecipe(e){     
    e.preventDefault()

    // Set params based on input
    const name = e.target.querySelector('input[name="name"]').value
    // const servings = Number(e.target.querySelector('input[name="servings"]').value)
    const servings = e.target.querySelector('input[name="servings"]').value

    // Take action if servings is a number
    // if (!isNaN(servings)){ 

      // Get form ingredients and map to array
      const formIngArray = Array.from(e.target.querySelectorAll('div.form-ingredient'))
      
      let recipeIngredientsAttributes = formIngArray.map(el => {
        // Get ingredient id value from select list
        let sId = el.querySelector('select[name="ingredient_id"]')

        // Get ingredient amount from input
        let ingAmount = el.querySelector('input.ingredient_amount').value

        // Get ingredient unit value from select list
        let sUnit = el.querySelector('select[name="ingredient_unit"]')

        return {
          ingredient_id: sId.options[sId.selectedIndex].value,
          ingredient_amount: ingAmount,
          ingredient_unit: sUnit.options[sUnit.selectedIndex].value
        }
      })
      console.log(recipeIngredientsAttributes)

      // recipe_ingredients_attributes: {
      //   0: {ingredient_id: 13, ingredient_amount:5, ingredient_unit:"lb", _destroy: 1, id: 11}, 

      // Set params
      const params = { name, servings, recipeIngredientsAttributes }
      console.log(params)

      // Alert user submitting
      this.handleAlert({
        type: "info",
        msg: "Submitting recipe to server..."
      }) 

      // Try creating resource
      try{
        const resp = await this.adapter.createRecipe(params)

        // const {name, servings, recipeIngredientsAttributes, id} = await this.adapter.updateRecipe(params)
        
        console.log("Successful recipe creation!")
        console.log(resp)
        this.recipe = new Recipe(resp)
        console.log(this.recipe)

        // Add Recipe to this.recipes and sort alphabetically
        this.recipes.push(this.recipe)
        // this.recipes.sort((a, b) => {
        //   if (a.name < b.name) //sort string ascending
        //       return -1 
        //   if (b.name > a.name)
        //       return 1
        //   return 0 //default return value (no sorting)
        // })

        this.renderRecipe()

        // Alert user of success
        this.handleAlert({
          type: "success",
          msg: "Recipe created!"
        }) 

      }catch(err){
        console.log(err)
        // If failure, leave form and give error alert
        this.handleError(err)
      }
    // }else{
    //   // Display error and highlight field if servings isn't a number
    //   this.handleError({
    //     type: "danger",
    //     msg: "Ensure Servings is a number"
    //   })      
    //   this.form.querySelector('input#servings').classList.add("is-invalid")
    // }
  }



/* ---- Helpers ---- */
  // Grab recipe object from id
  getRecipeById(id){
    return this.recipes.find(r => r.id == id)
  }

  // Button HTML
  renderNewBtn(){
    return (`
      <a class="btn btn-primary" href="#" role="button" id="new-button">Add new recipe</a>
    `)
  }    

}