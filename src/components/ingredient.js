class Ingredient{
  constructor(ingredientObj){
    const { id, name, cost, cost_size, cost_unit } = ingredientObj
    this.id = id
    this.name = name
    this.cost = cost
    this.costSize = cost_size
    this.costUnit = cost_unit
    // this.recipes = recipes.map(r => new Recipe(r))
  }

  // Render tr for each ingredient
  renderTr(){
    return (`
    <tr>
      <th><small><a class="text-muted" href="#">Edit</a> | <a class="text-muted" data-confirm="Are you sure?" rel="nofollow" data-method="delete" href="#">Delete</a></small></th>
      <th scope="row">${this.name}</th>
      <td>$ ${this.cost}</td>
      <td>${this.costSize}</td>
      <td>${this.costUnit}</td>
    </tr> 
    `)
  } 

  // Show full table of ingredients
  showTable(){
    const tHead = `
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
      <tbody>
    `
    const tFoot = `
      </tbody>  
    </table>`
  }
    
  get showIngredients(){
    let html = 'ingredients'
    // let html = `
    // <p>${this.name}, </p>
    // <h2>Total Cost: $${this.totalCost}</h2>
    // `

    // if (this.servings !== null){
    //     html = html + `<h4>Serves ${this.servings} | Cost per serving: $${this.servings}</h4>`
    // }

    return html
  }


  // Render ingredients as select list
  renderIngOptions(){
    return (`
    <option value=""></option>
    <option value="1">seaweed</option>
    <option value="2">all-purpose flour</option>
    <option value="3">bread flour</option>
    `)
  }

}