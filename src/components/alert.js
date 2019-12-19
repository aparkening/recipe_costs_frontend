class Alert{

  constructor(container){
      this.container = container
  }

  // Clear alert after timeout
  stopAlert(){
      clearTimeout(this.timeout)
      this.container.innerHTML = ''
  }

    // Render alert in bootstrap styling
    render(alertObj = null, timeout){
      // If no explicit object, set general error
      if (alertObj){
        const { type, msg } = alertObj
      }else{
        const type = "danger"
        const msg = "Internal Error"
      }
      const html = `
      <div class="alert alert-${type}" role="alert">
          ${msg}
      </div>
      `
      this.container.innerHTML = html
      
      // Display alert for time set in timeout
      this.timeout = setTimeout(() => {
          this.container.innerHTML = ''
        }, timeout)
    }

}