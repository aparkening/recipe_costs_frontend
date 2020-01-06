class RecipeAdapter{

  constructor(baseAdapter){
      this.baseAdapter = baseAdapter
      this.baseURL = this.baseAdapter.baseURL
  }

  get headers(){
      return this.baseAdapter.headers
  }

  // Get all records
  async getRecipes(){
    const res = await fetch(`${this.baseURL}/recipes`, {
      headers: this.headers
    })
    await this.baseAdapter.checkStatus(res)
    return await res.json()
  }

  // Get single record
  async getRecipe(id){
    const res = await fetch(`${this.baseURL}/recipes/${id}`, {
      headers: this.headers
    })
    await this.baseAdapter.checkStatus(res)
    return await res.json()
  }

  // Create record
  async createRecipe(params){
    // Could pass in recipe obj and make params
    const { name, servings, recipe_ingredients_attributes } = params
    const url = `${this.baseURL}/recipes`
    const body = {
        recipe: {
            name, 
            servings,
            recipe_ingredients_attributes
        }
    }
    const res = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body)
    })
    await this.baseAdapter.checkStatus(res)
    return await res.json()
  }

// Current parameters
//  {"recipe"=>{"name"=>"White Bread", "servings"=>"8", "recipe_ingredients_attributes"=>[{"ingredient_id"=>"", "ingredient_amount"=>"2.0", "ingredient_unit"=>"lb", "_destroy"=>0}, {"ingredient_id"=>"", "ingredient_amount"=>"2.0", "ingredient_unit"=>"lb", "_destroy"=>0}]}, "controller"=>"api/v1/recipes", "action"=>"update", "id"=>"19"} permitted: false>

// Working parameters



  // Update recipe
  /* Stringify this format:
    name: 'Green Bread',
    servings: 6,
    recipe_ingredients_attributes: {
      0: {ingredient_id: 13, ingredient_amount:5, ingredient_unit:"lb", _destroy: 1, id: 11}, 
      1: {ingredient_id: 21, ingredient_amount:1, ingredient_unit:"oz", _destroy: 0, id: 12}, 
      2: {ingredient_id: 16, ingredient_amount:1, ingredient_unit:"lb", _destroy: 0, id: 13}, 
      3: {ingredient_id: 18, ingredient_amount:12, ingredient_unit:"oz", _destroy: 0, id: 14},
    }
  */

  /* Current update error
 @details={:"recipe_ingredients.ingredient"=>[{:error=>:blank}]},
 @messages={:"recipe_ingredients.ingredient"=>["must exist"]}>
  */
  async updateRecipe(params){
      const { name, servings, recipeIngredientsAttributes, id} = params
      const url = `${this.baseURL}/recipes/${id}`
      const body = {
          recipe: {
              name, 
              servings,
              recipe_ingredients_attributes: recipeIngredientsAttributes
          }
      }
      const res = await fetch(url, {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify(body)
      })
      await this.baseAdapter.checkStatus(res)
      return await res.json()
  }

  // Delete recipe
  async deleteRecipe(id){
    const url = `${this.baseURL}/recipes/${id}`
    const res = await fetch(url, {
        method: 'DELETE',
        headers: this.headers
    })
    await this.baseAdapter.checkStatus(res)
    return await res.json()
  }

}