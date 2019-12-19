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
      const foundIng = this.getIngById(id)

      if (foundIng) {
        console.log("Ingredient found. Rendering Delete.")

      //   // Find index of recipe to remove
      //   const recipeIndex = this.recipes.findIndex(recipe => recipe.id === foundRecipe.id)

      //   // Remove recipe and save it, in case error later
      //   const savedRecipe = this.recipes.splice(recipeIndex, 1)
      //   // console.log(savedRecipe)

      //   // Remove recipe from this.recipes
      //   // this.recipes = this.recipes.filter(r => r.id !== foundRecipe.id)
      //   console.log("New Recipes")
      //   console.log(this.recipes)
      //   // set this.recipes

      //   // console.log("Saved Recipe")
      //   // console.log(savedRecipe)
        
      //   // Optimistically render new recipe list
      //   this.renderRecipes()


      // // findByIndex to get index
      // // Use index to save to this.recipes
      // // const oldRecipe = 
      // // Use splice to remove from this.recipes
      
      //   try{
      //     const resp = await this.adapter.deleteRecipe(id)

      //     // Alert user of success
      //     this.handleAlert({
      //       type: "success",
      //       msg: "Recipe deleted"
      //     }) 
      //   }catch(err){
      //     // If failure, rerender list without db call, keeping recipe in same array location
      //     this.recipes[recipeIndex] = savedRecipe
      //     this.recipes = this.recipes.flat()
      //     console.log("Old recipe pushed back")
      //     console.log(this.recipes)

      //     this.renderRecipes()
      //     this.handleError(err)
      //   }
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
      const ingredientObj = await this.adapter.getIngredients()
      // console.log(ingredientObj)

      this.ingredients = ingredientObj.ingredients.map(ing => new Ingredient(ing))
      // console.log(this.ingredients)
        
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