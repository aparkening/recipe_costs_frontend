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
      <h1>${this.name} (<small class="helper_links" data-id="${this.id}"><a href="#" id="edit">Edit </a> | <a data-confirm="Are you sure?" rel="nofollow" href="#" id="delete">Delete</a></small>)</h1>
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
        &nbsp;</td><td><small><a class="text-muted" href="#" id="edit" data-id="${this.id}">Edit</a> | <a class="text-muted" data-confirm="Are you sure?" rel="nofollow" data-method="delete" href="#" id="delete" data-id="${this.id}">Delete</a></small></td>
      </tr>
    `
    return html
  }

  // Show new and edit recipe form (class method)
  static recipeForm(recipe = null){
    return (`
    <h1>${recipe ? 'Edit' : 'New'} Recipe</h1>
    <form id="${recipe ? 'edit' : 'new'}-recipe-form">
        ${recipe ? '<input type="hidden" value="' + recipe.id + '">' : '' }

        <div class="form-group">
          <label for="recipe_name">Name*</label>
          <input class="form-control" required="required" type="text" value=${recipe ? recipe.name : ''} name="recipe[name]" id="recipe_name">
        </div>
        <div class="form-group">
          <label for="recipe_servings">Servings</label>
          <input class="form-control" type="text" value=${recipe ? recipe.servings : ''} name="recipe[servings]" id="recipe_servings">
        </div>
      
        <div class="form-group">
          <h3>Ingredients</h3>
          <div class="form-group">
              
            <select name="recipe[recipe_ingredients_attributes][0][ingredient_id]" id="recipe_recipe_ingredients_attributes_0_ingredient_id"><option value=""></option>
      <option value="1">seaweed</option>
      <option value="2">all-purpose flour</option>
      <option value="3">bread flour</option>
      <option value="4">whole wheat flour</option>
      <option value="5">instant yeast</option>
      <option value="6">unsalted butter</option>
      <option selected="selected" value="7">butter</option>
      <option value="8">milk</option>
      <option value="9">cream</option>
      <option value="10">baking soda</option>
      <option value="11">baking powder</option>
      <option value="12">sugar</option>
      <option value="13">brown sugar</option>
      <option value="14">powdered sugar</option>
      <option value="15">honey</option>
      <option value="16">molasses</option>
      <option value="17">vegetable oil</option>
      <option value="18">canola oil</option>
      <option value="19">olive oil</option>
      <option value="20">cornstarch</option>
      <option value="21">coconut flakes</option>
      <option value="22">vanilla extract</option>
      <option value="23">bittersweet chocolate</option>
      <option value="24">unsweetened chocolate</option>
      <option value="25">chocolate chips</option>
      <option value="26">walnuts</option>
      <option value="27">almonds</option>
      <option value="28">raisins</option>
      <option value="29">pumpkin</option>
      <option value="30">apples</option>
      <option value="31">ginger</option>
      <option value="32">chicken</option>
      <option value="33">egg</option>
      <option value="34">soy sauce</option>
      <option value="35">teriyaki sauce</option>
      <option value="36">dashi</option>
      <option value="37">sushi rice</option>
      <option value="38">nori</option>
      <option value="39">salt</option>
      <option value="40">thyme</option>
      <option value="41">ground cinnamon</option>
      <option value="42">ground cloves</option>
      <option value="43">ground black pepper</option>
      <option value="44">ground cardamom</option></select>
      
            <label for="recipe_recipe_ingredients_attributes_0_ingredient_amount">Size</label>
            <input placeholder="example: 5" type="text" value="2.0" name="recipe[recipe_ingredients_attributes][0][ingredient_amount]" id="recipe_recipe_ingredients_attributes_0_ingredient_amount">
            
            <label for="recipe_recipe_ingredients_attributes_0_ingredient_unit">Unit</label>
            <input placeholder="example: lb" type="text" value="lb" name="recipe[recipe_ingredients_attributes][0][ingredient_unit]" id="recipe_recipe_ingredients_attributes_0_ingredient_unit">
          </div>
        </div>

        <div class="form-group">
          <button type="submit" name="commit" class="btn btn-lg btn-primary btn-block">${recipe ? 'Update' : 'Create'} Recipe</button>
        </div>
      </form>
    `)
  }

  // Set instance of recipeForm
  get showFormHTML(){
    return Recipe.recipeForm(this)
  }


}