class IngredientAdapter{

  constructor(baseAdapter){
    this.baseAdapter = baseAdapter
    this.baseURL = this.baseAdapter.baseURL
  }

  get headers(){
    return this.baseAdapter.headers
  }

  // Get all records
  async getIngredients(){
    const res = await fetch(`${this.baseURL}/ingredients`, {
      headers: this.headers
    })
    await this.baseAdapter.checkStatus(res)
    return await res.json()
  }

  // Get single record
  async getIngredient(id){
    const res = await fetch(`${this.baseURL}/ingredients/${id}`, {
      headers: this.headers
    })
    await this.baseAdapter.checkStatus(res)
    return await res.json()
  }

  // Create record
  async createIngredient(params){
    const { name, cost, cost_size, cost_unit } = params
    const url = `${this.baseURL}/ingredients`
    const body = {
        ingredient: {
          name, 
          cost,
          cost_size,
          cost_unit
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
  async updateIngredient(params){
    const { name, cost, cost_size, cost_unit, id} = params
    const url = `${this.baseURL}/ingredients/${id}`
    const body = {
        ingredient: {
          name, 
          cost,
          cost_size,
          cost_unit
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

  // Delete record
  async deleteIngredient(id){
    const url = `${this.baseURL}/ingredients/${id}`
    const res = await fetch(url, {
        method: 'DELETE',
        headers: this.headers
    })
    await this.baseAdapter.checkStatus(res)
    return await res.json()
  }

}