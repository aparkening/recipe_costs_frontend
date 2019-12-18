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

  get showHTML(){
    let html = `
      <h1>${this.name}</h1>
      <h2>Total Cost: $${this.totalCost}</h2>
    `

    if (this.servings !== null){
      html = html + `<h4>Serves ${this.servings} | Cost per serving: $${this.costPerServing}</h4>`
    }

    const ingTableTop = `
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

    const ingTableBottom = `
      </tbody>  
    </table>
    `

    const ingHTML = this.ingredients.map(ing => {
      return (`
      <tr>
        <td>$${ing.totalCost}</td>
        <th scope="row">${ing.name}</th>
        <td>${ing.amount}</td>
        <td>${ing.amountUnit}</td>
      </tr>  
      `)
    }).join('')
    // const ingHTML = 'testing'

    // html = html + this.ingredients
    html = html + ingTableTop + ingHTML + ingTableBottom

    return html
  }

  // Render recipes table
  // Get data-id with .dataset.id
  get renderTr(){
    let html = `
      <tr data-id="${this.id}">
        <th scope="row"><a href="" id="show">${this.name}</a></th>
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
        &nbsp;</td><td><small><a class="text-muted" href="#" id="edit">Edit</a> | <a class="text-muted" data-confirm="Are you sure?" rel="nofollow" data-method="delete" href="#" id="delete">Delete</a></small></td>
      </tr>
    `
    return html
  }

}