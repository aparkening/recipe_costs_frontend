class BaseAdapter{

  // Heroku baseURL
  // constructor(baseURL = 'https://recipe-costs-api.herokuapp.com/api/v1'){
  constructor(baseURL = 'http://localhost:3000/api/v1'){
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
      // Show rails error detail
      let errorMsg = msg.error.detail
      if(!errorMsg){ errorMsg = msg.error }
      throw {
          type: "danger",
          msg: errorMsg
      }
    }
    // console.log(res.status)
  }

}