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

  // Show tr for each ingredient
  get showIngTr(){
    return (`
    <tr data-id="${this.id}">
      <th>
        <small>
          <a class="text-muted" href="#" id="edit" data-id="${this.id}">Edit</a> &nbsp;|&nbsp;
          <a class="text-muted" data-confirm="Are you sure?" rel="nofollow" data-method="delete" href="#" id="delete" data-id="${this.id}">Delete</a>
        </small>
      </th>
      <th scope="row">${this.name}</th>
      <td>$ ${this.cost} / ${this.costSize} ${this.costUnit}</td>
    </tr> 
    `)
  } 

  // Show full table of ingredients
  static showIngTable(ingredients){
    return (`
    <h1>Ingredients</h1>
    <div class="mt-3 mb-3" id="new-resource">${this.showNewBtn()}</div>

    <table class="table table-striped">
      <thead class="thead-dark">
        <tr>
          <th>Links</th>
          <th>Name</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
        ${ingredients.map(ing => ing.showIngTr).join('')}
      </tbody>
    </table>
    `)
  }

  // Delete appropriate ingredient form field 
  static deleteField(e) {
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
    }
  }

  // Show new and edit ingredient form
  showIngForm(units){
    return (`
    <fieldset class="border border-muted rounded px-3 pt-2">
    <h3>${this.id !== "" ? 'Edit' : 'New'} Ingredient</h3>
    <form id="${this.id !== "" ? 'edit' : 'new'}-ingredient-form" method="POST">
        ${this.id !== "" ? '<input type="hidden" value="' + this.id + '" name="ingredient-id">' : '' }

        <div class="form-row mb-2">
          <div class="form-group col-5">
            <label for="name">Name*</label>
            <input class="form-control" required="required" type="text" value="${this.id !== "" ? this.name : ''}" name="name" id="name">
          </div>

        <div class="form-group col-2">
          <label for="cost">Cost*</label>
          <input class="form-control" placeholder="0.00" required="required" type="text" value="${this.id !== "" ? this.cost : ''}" name="cost" id="cost">
          <small id="costHelp" class="form-text text-muted">Don't include $</small>
        </div>

        <div class="form-group col-2">
          <label for="cost_size">Size*</label>
          <input class="form-control" placeholder="5" required="required" type="text" value="${this.id !== "" ? this.costSize : ''}" name="cost_size" id="cost_size">
        </div>        

        <div class="form-group col-2">
          <label for="cost_unit">Unit</label>
          <select name="cost_unit" id="cost_unit" class="custom-select">${units.map(u => this.showIngOptions(u)).join('')}
          </select>
        </div>    
      </div>

      <div class="form-group">
        <button type="submit" name="commit" class="btn btn-lg btn-primary">${this.id !== "" ? 'Update' : 'Create'} Ingredient</button>
        &nbsp;&nbsp; 
        <button type="button" name="cancel" class="btn btn-secondary btn-lg" id="cancel">Cancel</button>
      </div>
    </form>
    </fieldset>
    `)

  }

  // Show ingredients as select list
  showIngOptions(unit){
    // console.log(this)
    return (`
    <option value="${unit}" ${this.costUnit == unit ? 'selected = "selected"' : ''}>${unit}</option>
    `)
  }

  // Button HTML
  static showNewBtn(){
    return (`
      <a class="btn btn-primary" href="#" role="button" id="new-button">Add new ingredient</a>
    `)
  }

}