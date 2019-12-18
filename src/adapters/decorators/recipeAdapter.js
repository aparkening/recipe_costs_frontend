class RecipeAdapter{

  constructor(baseAdapter){
      this.baseAdapter = baseAdapter
      this.baseURL = this.baseAdapter.baseURL
  }

  get headers(){
      return this.baseAdapter.headers
  }

  // Create recipe
  async createRecipe(params){
    // Could pass in recipe obj and make params
    const { name, servings, recipe_ingredients_attributes, id} = params
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
  async updateRecipe(params){
      const { name, servings, recipe_ingredients_attributes, id} = params
      const url = `${this.baseURL}/recipes/${id}`
      const body = {
          recipe: {
              name, 
              servings,
              recipe_ingredients_attributes
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

  // Fetch all recipes
  async getRecipes(){
    const res = await fetch(`${this.baseURL}/recipes`, {
      headers: this.headers
    })
    await this.baseAdapter.checkStatus(res)
    return await res.json()
  }

  // Fetch single recipe
  async getRecipe(){
    const res = await fetch(`${this.baseURL}/recipes/31`, {
      headers: this.headers
    })
    await this.baseAdapter.checkStatus(res)
    return await res.json()
  }

}