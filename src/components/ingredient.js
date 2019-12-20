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
  get showIngTr(){
    return (`
    <tr data-id="${this.id}">
      <th><small><a class="text-muted" href="#" id="edit" data-id="${this.id}">Edit</a> | <a class="text-muted" data-confirm="Are you sure?" rel="nofollow" data-method="delete" href="#" id="delete" data-id="${this.id}">Delete</a></small></th>
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

  // Show new and edit ingredient form (class method)
  static ingForm(ing = null){
    return (`
    <fieldset class="border border-muted rounded px-3 pt-2">
    <h3>${ing ? 'Edit' : 'New'} Ingredient</h3>
    <form id="${ing ? 'edit' : 'new'}-ingredient-form">
        ${ing ? '<input type="hidden" value="' + ing.id + '" name="ingredient-id">' : '' }

      <div class="form-group">
        <label for="ingredient_name">Name*</label>
        <input class="form-control" required="required" type="text" value="${ing ? ing.name : ''}" name="name" id="ingredient_name">
      </div>

      <div class="form-group">
        <label for="ingredient_cost">Cost</label>
        <input class="form-control" placeholder="0.00" required="required" type="text" value="${ing ? ing.cost : ''}" name="cost" id="ingredient_cost">
        <small id="costHelp" class="form-text text-muted">No need to include $</small>
      </div>

      <div class="form-group">
        <label for="ingredient_cost_unit">Unit</label>
        
        <!-- make select list --> 

        <input placeholder="example: lb" class="form-control" required="required" type="text" value="${ing ? ing.costUnit : ''}" name="cost_unit" id="ingredient_cost_unit">
      </div>    

      <div class="form-group">
        <label for="ingredient_cost_size">Size</label>
        <input class="form-control" placeholder="12.2" required="required" type="text" value="${ing ? ing.costSize : ''}" name="cost_size" id="ingredient_cost_size">
      </div>

      <div class="form-group">
        <button type="submit" name="commit" class="btn btn-lg btn-primary">${ing ? 'Update' : 'Create'} Ingredient</button>
        &nbsp;&nbsp; 
        <button type="button" name="cancel" class="btn btn-secondary btn-lg" id="cancel">Cancel</button>
      </div>
    </form>
    </fieldset>
    `)

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