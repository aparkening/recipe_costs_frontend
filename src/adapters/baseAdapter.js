class BaseAdapter{

  constructor(baseURL = 'http://localhost:3000'){
      this.baseURL = baseURL
  }

  // Fetch headers
  get headers(){
      let baseHeaders = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
      return baseHeaders
  }

  // Return errors if status not in the 200s
  async checkStatus(res){
    if (res.status < 200 || res.status > 299){
      const msg = await res.json()
      let errorMsg = msg.error.detail
      if(!errorMsg){ errorMsg = msg.error }
      throw {
          type: "Fetch Error",
          msg: errorMsg
      }
    }
  }

}