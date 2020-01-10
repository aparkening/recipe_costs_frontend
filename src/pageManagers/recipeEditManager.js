class RecipeEditPage extends PageManager{

  constructor(container, adapter){
    super(container)
    this.adapter = new RecipeAdapter(adapter)
    this.recipe = null
    this.ingredients = null
    this.currentObj = null
  }

/* ---- Bindings and Event Listeners ---- */  
  // Don't need initial bindings and listeners
  initBindingsAndEventListeners(){

    return null
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

  // Handle form cancel button
  handleCancelClick(e){
    e.preventDefault()
    // this.newContainer.innerHTML = this.renderNewBtn()
    // this.indexBindingsAndEventListeners()
    this.redirect('recipes')
  }

  // Handle form update submit
  handleUpdateSubmitClick(e){
    e.preventDefault()
    console.log("Submitting update.")
    this.updateRecipe(e)
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



/* ---- Update Database and Display ---- */
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

      // const updatedRecipe = this.getRecipeById(this.recipe.id)
      // // this.recipes.find(r => r.id == this.recipe.id)
      // updatedRecipe.name = this.recipe.name
      // updatedRecipe.servings = this.recipe.servings
      // updatedRecipe.totalCost = this.recipe.totalCost
      // updatedRecipe.costPerServing = this.recipe.costPerServing
      // updatedRecipe.recipeIngredients = this.recipe.recipeIngredients

      // const newRecipe = () => Object.assign({}, this.recipe, { [key]: value })
  
      // Display recipe
      // this.renderRecipe()

      // Send to recipe display when ready
      this.redirect('recipes')


    }catch(err){
      // this.renderRecipe()
      this.handleError(err)
      this.redirect('recipes')
    }  
  }


/* ---- Fetchers and Renderers ---- */  
  async fetchAndRenderPageResources(){
    
    console.log("New edit page")
    this.recipe = this.currentObj

    // Find existing recipe by id
    // const foundRecipe = this.getRecipeById(recipeId)

    // If recipe from id exists, render form and call new bindings and event listeners
    // if (foundRecipe) {
      // Send request for all ingredients
      const ingAdapter = new IngredientAdapter(new BaseAdapter())
      const ingObj = await ingAdapter.getIngredients()
      // Fill this.ingredients with ingredient objects
      this.ingredients = ingObj.ingredients.map(ing => new Ingredient(ing))
      this.units = ingObj.units

      // Render form with ingredients
      // this.recipe = foundRecipe
      this.container.innerHTML = this.recipe.editRecipeForm(this.ingredients, this.units)
      this.editFormBindingsAndEventListeners()
    // }else{
    //   // else throw error
    //   this.handleError({
    //     type: "danger",
    //     msg: "Recipe was not found"
    //   })
    // }
  }


  // Render initial html. Use "loader" to display loading spinner.
  get staticHTML(){
    return (`
      <div class="loader">
      </div>
    `)
  }


}