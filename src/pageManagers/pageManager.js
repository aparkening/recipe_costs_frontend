class PageManager{

  constructor(container){
      this.container = container    
  }

  fetchAndRenderPageResources(){
      return null
  }

  // Display errors
  handleError(err){
      // if(err.type === "Authorizaiton Error"){
      //     this.handleAlert(err.msg)
      //     this.redirect('welcome')
      // }else{
          this.handleAlert(err)
      // }
  }

  // Display initial static html, listen for changes, then fetch and render changes
  render(){
      this.container.innerHTML = this.staticHTML
      this.initBindingsAndEventListeners()
      this.fetchAndRenderPageResources()
  }

}