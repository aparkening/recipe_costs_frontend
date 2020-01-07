class Recipe{
  constructor(recipeObj){
    const { recipe, ingredients } = recipeObj

    this.id = recipe.id
    this.name = recipe.name
    this.servings = recipe.servings
    this.totalCost = recipe.total_cost
    this.costPerServing = recipe.cost_per_serving

    this.ingredients = ingredients.map(ing => new RecipeIngredient(ing))
  }

  // Render single recipe page
  get showRecipe(){
    let html = `
      <h1>${this.name} (<small class="helper_links" data-id="${this.id}">
        <a href="#" id="edit">Edit </a> |
        <a data-confirm="Are you sure?" rel="nofollow" href="#" id="delete">Delete</a>
      </small>)</h1>
      <h2>Total Cost: $${this.totalCost}</h2>
    `
    // Display cost per serving if servings and cost per serving > than 0
    if (this.servings !== null && this.costPerServing !== 0){
      html = html + `<h4>Serves ${this.servings} | Cost per serving: $${this.costPerServing}</h4>`
    }

    const tableTop = `
      <h3 class="mt-3">Ingredients</h3>
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th>Cost</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Amount Unit</th>
          </tr>
        </thead>
        <tbody>
    `

    const tableBottom = `
        </tbody>  
      </table>
    `

    // Render recipe ingredient rows and join into string
    let ingRows = this.ingredients.map(ing => ing.showIngTr).join('')
    // let ingRows = this.ingredients.map(ing => console.log(ing))

    // Stitch together html, table, rows
    html = html + tableTop + ingRows + tableBottom

    return html
  }

  // // Render recipe ingredients row
  // showIngTr(ing){
  //   return (`
  //     <tr data-id="${ing.id}">
  //       <td>$${ing.totalCost}</td>
  //       <th scope="row">${ing.name}</th>
  //       <td>${ing.amount}</td>
  //       <td>${ing.amountUnit}</td>
  //     </tr>  
  //   `)
  // }

  // Render recipes table row
  // Get data-id with .dataset.id
  get showRecipeTr(){
    let html = `
      <tr data-id="${this.id}">
        <th scope="row"><a href="#" id="show" data-id="${this.id}">${this.name}</a></th>
        <td>
      `

    // Display total cost if > 0
    if (this.totalCost !== 0){
      html = html + `$${this.totalCost}`
    }

    // Display cost per serving if servings and cost per serving > than 0
    if (this.servings !== null && this.costPerServing !== 0){
      html = html + ` &nbsp;|&nbsp; per serving: $${this.costPerServing}`
    }

    html = html + `
        &nbsp;</td>
        <td>
          <small>
            <a class="text-muted" href="#" id="edit" data-id="${this.id}">Edit</a> |
            <a class="text-muted" data-confirm="Are you sure?" rel="nofollow" data-method="delete" href="#" id="delete" data-id="${this.id}">Delete</a>
          </small>
        </td>
      </tr>
    `
    return html
  }


  // Render ingredients as select list
  // renderIngSelect(){
  //   return (`
  //   <select name="recipe_ingredients_attributes[1][ingredient_id]" id="recipe_ingredients_attributes_01_ingredient_id"><option value=""></option>
  //   <option value="1">seaweed</option>
  //   <option value="2">all-purpose flour</option>
  //   <option value="3">bread flour</option>
  //         </select>
  //   `)
  // }


  // Show new and edit recipe form
  recipeForm(ingredients, units){

    return (`
    <h1>${this.id !== "" ? 'Edit' : 'New'} Recipe</h1>
    <form id="${this.id !== "" ? 'edit' : 'new'}-recipe-form">
        ${this.id !== ""  ? '<input type="hidden" value="' + this.id + '" name="recipe-id">' : '' }

        <div class="form-group">
          <label for="recipe_name">Name*</label>
          <input class="form-control" required="required" type="text" value="${this.id !== ""  ? this.name : ''}" name="name" id="recipe_name">
        </div>
        <div class="form-group">
          <label for="recipe_servings">Servings</label>
          <input class="form-control" type="text" value="${this.id !== ""  ? this.servings : ''}" name="servings" id="recipe_servings">
        </div>
      
        <div class="form-group" id="ingredients">
          <h3>Ingredients</h3>
          ${this.renderIngRow(ingredients, units)}
          ${this.renderIngRow(ingredients, units)}
        </div>

        <div class="form-group mx-1" id="add-ingredient">
          <a href="#" class="badge badge-primary">+ Add another ingredient</a>
        </div>

        <div class="form-group mt-4">
          <button type="submit" name="commit" class="btn btn-lg btn-primary">${this.id !== ""  ? 'Update' : 'Create'} Recipe</button>
          &nbsp;&nbsp; 
          <button type="button" name="cancel" class="btn btn-secondary btn-lg" id="cancel">Cancel</button>
        </div>
      </form>
    `)
  }

  // Set instance of recipeForm
  get showFormHTML(){
    return Recipe.recipeForm(this)
  }

  // Render ingredients as select list

  renderIngRow(ingredients, units){
    return (`
      <div class="form-row form-group form-ingredient">
      <div class="col-5">
        <select name="ingredient_id" class="ingredient_id custom-select">
        ${ingredients.map(ing => this.renderIngOptions(ing)).join('')}
        </select>
      </div>
      <div class="col-1">
        <input placeholder="1" type="text" name="ingredient_amount" class="ingredient_amount form-control" required="required">
      </div>
      <div class="col-2">
        <select name="ingredient_unit" class="ingredient_unit custom-select">${units.map(u => this.renderUnitOptions(u)).join('')}
        </select>
      </div>
      <div class="col pt-2 small">
        <a href="#" class="text-muted delete">Delete</a>
      </div>

      <!-- <label for="recipe_ingredients_attributes_0_ingredient_unit">Unit</label>
      <input placeholder="example: lb" type="text" value="lb" name="recipe_ingredients_attributes[0][ingredient_unit]" id="recipe_ingredients_attributes_0_ingredient_unit" class="ingredient_unit">

      <input type="hidden" value="11" name="recipe_ingredients_attributes[0][id]" id="recipe_recipe_ingredients_attributes_0_id" class="ingredient_id"> -->
    </div><!-- / form-ingredient -->
    `)
  }

  renderIngOptions(ingredient){
    // console.log(this)
    return (`
    <option value="${ingredient.id}">${ingredient.name}</option>
    `)
  }

  // Render ingredients as select list
  renderUnitOptions(unit){
    // console.log(this)
    return (`
    <option value="${unit}">${unit}</option>
    `)
  }


}