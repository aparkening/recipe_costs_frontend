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

}