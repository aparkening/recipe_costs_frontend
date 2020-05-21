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

  // Get search records
  async searchRecipes(query){
    const res = await fetch(`${this.baseURL}/recipes?search=${query}`, {
      headers: this.headers
    })
    await this.baseAdapter.checkStatus(res)
    return await res.json()
  }

  // Create record
  async createRecipe(params){
    // Could pass in recipe obj and make params
    const { name, servings, recipeIngredientsAttributes } = params
    const url = `${this.baseURL}/recipes`
    const body = {
      recipe: {
        name, 
        servings,
        recipe_ingredients_attributes: recipeIngredientsAttributes
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

  // Update record
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