class RecipeNewPage extends PageManager{

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

/* ---- Link/Click Handlers ---- */

  // Handle form cancel button
  handleCancelClick(e){
    e.preventDefault()
    this.redirect('recipes')
  }

  // Handle form submit
  handleNewSubmitClick(e){
    e.preventDefault()
    this.createRecipe(e)
  }

  // Handle delete ingredients within recipe form
  handleDeleteIngFieldsClick(e){
    e.preventDefault()

    // Only activate on href click
    if(e.target.tagName === "A"){ 
      Ingredient.deleteField(e)
    }
  }

  // Handle add ingredients within recipe form
  handleAddIngFieldsClick(e){
    e.preventDefault()

    // Only activate on href click
    if(e.target.tagName === "A"){

      // Build new ingredient div and append to ingredient fields container
      let newRow = document.createElement('div')
      newRow.innerHTML = this.recipe.renderIngRow(this.ingredients, this.units)
      this.ingFields.appendChild(newRow)
    }
  }



/* ---- Update Database and Display ---- */
  // Handle form submit
  async createRecipe(e){

    // Set recipe variables for inputs
    const name = e.target.querySelector('input[name="name"]').value
    const servings = e.target.querySelector('input[name="servings"]').value

    // Set recipeIngredientsAttributes from each ingredient input
    let recipeIngredientsAttributes = Array.from(e.target.querySelectorAll('div.form-ingredient')).map(el => {
      
      // Get values from inputs and select lists
      let sId = el.querySelector('select[name="ingredient_id"]')
      let ingAmount = el.querySelector('input.ingredient_amount').value
      let sUnit = el.querySelector('select[name="ingredient_unit"]')

      // Set and return new object
      return {
        ingredient_id: sId.options[sId.selectedIndex].value,
        ingredient_amount: ingAmount,
        ingredient_unit: sUnit.options[sUnit.selectedIndex].value
      }
    })
    // console.log("Recipe Ingredients Attributes")
    // console.log(recipeIngredientsAttributes)

    // Set params for submission
    const params = { name, servings, recipeIngredientsAttributes }

    // Pessimistic render. Alert user to submission
    this.handleAlert({
      type: "info",
      msg: "Submitting recipe to server..."
    }) 

    // Send fetch. If error, display old this.recipe.
    try{
      const resp = await this.adapter.createRecipe(params)
      
      // Update this.recipe
      this.recipe = new Recipe(resp)
      console.log(this.recipe)

      // Alert user of success
      this.handleAlert({
        type: "success",
        msg: "Recipe created!"
      }) 

      this.redirect('recipe', this.recipe)
      // this.redirect('recipes')

    }catch(err){
      this.handleError(err)
      this.redirect('recipe', this.recipe)
      // this.redirect('recipes')
    }  
  }


/* ---- Fetchers and Renderers ---- */  
  async fetchAndRenderPageResources(){

    console.log("New page")


    this.recipe = new Recipe({'recipe': {id:'', name:'', servings:'', total_cost:'', cost_per_serving:''}, 'ingredients':[]})

    // Get all ingredients and ingredient units for form fields
    const ingAdapter = new IngredientAdapter(new BaseAdapter())
    const ingObj = await ingAdapter.getIngredients()
    
    // Fill this.ingredients with ingredient objects
    this.ingredients = ingObj.ingredients.map(ing => new Ingredient(ing))
    this.units = ingObj.units

    // Render form with ingredients
    this.container.innerHTML = this.recipe.recipeForm(this.ingredients, this.units)
    this.newFormBindingsAndEventListeners()
  }

  // Render initial html. Use "loader" to display loading spinner.
  get staticHTML(){
    return (`
      <div class="loader">
      </div>
    `)
  }

}